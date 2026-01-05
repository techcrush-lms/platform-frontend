import { Document, Page, pdfjs } from 'react-pdf';
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { FiDownload, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import LoadingIcon from './ui/icons/LoadingIcon';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  fileUrl: string;
  className?: string;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 2.5;
const SCALE_STEP = 0.2;

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl, className }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(600);
  const [scale, setScale] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive width observer
  const updateWidth = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  // Reset scale and error on new file
  useEffect(() => {
    setScale(1);
    setError(null);
    setLoading(true);
  }, [fileUrl]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function onDocumentError(err: Error) {
    setError('Failed to load PDF.');
    setLoading(false);
  }

  // Zoom controls
  const zoomIn = () => setScale((s) => Math.min(s + SCALE_STEP, MAX_SCALE));
  const zoomOut = () => setScale((s) => Math.max(s - SCALE_STEP, MIN_SCALE));
  const resetZoom = () => setScale(1);

  // Calculate page width responsively
  const pageWidth = Math.floor(Math.min(containerWidth - 16, 700) * scale);

  // Extract filename from URL for download
  const getFileName = (url: string) => {
    try {
      return decodeURIComponent(url.split('/').pop() || 'document.pdf');
    } catch {
      return 'document.pdf';
    }
  };

  // Retry handler
  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setRetryKey((k) => k + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`bg-neutral-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-2 ${
        className || ''
      }`}
      style={{
        minHeight: 200,
        maxHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Toolbar */}
      <div className='flex items-center gap-1 mb-2 w-full justify-end'>
        {/* Download button */}
        <a
          href={fileUrl}
          download={getFileName(fileUrl)}
          target='_blank'
          rel='noopener noreferrer'
          className='px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-primary-main hover:text-white dark:hover:bg-primary-main transition disabled:opacity-50 text-xs flex items-center gap-1'
          aria-label='Download PDF'
          title='Download PDF'
        >
          <FiDownload className='text-base' />
        </a>
        {/* Zoom controls */}
        <button
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE || !!error || loading}
          className='px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 text-xs'
          aria-label='Zoom out'
        >
          -
        </button>
        <span className='px-2 select-none text-xs'>
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE || !!error || loading}
          className='px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 text-xs'
          aria-label='Zoom in'
        >
          +
        </button>
        <button
          onClick={resetZoom}
          disabled={scale === 1 || !!error || loading}
          className='px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition disabled:opacity-50 text-xs'
          aria-label='Reset zoom'
        >
          100%
        </button>
      </div>
      <div className='flex-1 w-full overflow-y-auto' style={{ minHeight: 180 }}>
        {error ? (
          <div className='flex flex-col items-center justify-center h-full py-12'>
            <div className='bg-red-100 dark:bg-red-900 rounded-full p-4 mb-4'>
              <FiAlertTriangle className='text-red-600 dark:text-red-300 text-4xl' />
            </div>
            <div className='text-lg font-semibold text-red-700 dark:text-red-200 mb-2'>
              Failed to load PDF
            </div>
            <div className='text-sm text-gray-600 dark:text-gray-400 mb-4 text-center max-w-xs'>
              The PDF could not be loaded. This may be due to a network issue,
              an invalid file, or a permissions problem.
              <br />
              Please check your connection or try again.
            </div>
            <button
              onClick={handleRetry}
              className='inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-main text-white font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-main transition'
            >
              <FiRefreshCw className='text-base' /> Retry
            </button>
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentError}
            loading={
              <div className='flex justify-center items-center text-center text-sm text-gray-500'>
                <LoadingIcon />
                Loading PDF...
              </div>
            }
            error={
              <div className='text-center text-sm text-red-500'>
                Failed to load PDF.
              </div>
            }
            options={{
              cMapUrl: `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/cmaps/`,
              cMapPacked: true,
            }}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div
                key={`page_${index + 1}`}
                className='flex justify-center mb-4'
              >
                <Page
                  pageNumber={index + 1}
                  width={pageWidth}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                />
              </div>
            ))}
          </Document>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
