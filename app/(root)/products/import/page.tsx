'use client';

import { Card } from '@/components/dashboard/Card';
import { Button } from '@/components/ui/Button';
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { toast } from 'react-hot-toast';
import { AppDispatch } from '@/redux/store';
import { importProducts } from '@/redux/slices/productImportSlice';
import { PurchaseItemType } from '@/lib/utils';
import PageHeading from '@/components/PageHeading';

interface ImportError {
  row: number;
  message: string;
}

interface ImportResult {
  success: boolean;
  errors: ImportError[];
  totalRows: number;
  validRows: number;
}

const ImportProducts = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { loading, error, success, importedCount } = useSelector(
    (state: RootState) => state.productImport
  );
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      setImportResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const validateData = (data: any[]): ImportError[] => {
    const errors: ImportError[] = [];
    const requiredFields = ['type', 'title', 'description', 'price'];

    data.forEach((row, index) => {
      // Check required fields
      requiredFields.forEach((field) => {
        if (!row[field]) {
          errors.push({
            row: index + 2, // +2 because Excel is 1-based and has header row
            message: `Missing required field: ${field}`,
          });
        }
      });

      // Validate type
      if (
        row.type &&
        !['COURSE', 'TICKET', 'SUBSCRIPTION'].includes(row.type.toUpperCase())
      ) {
        errors.push({
          row: index + 2,
          message: `Invalid type: ${row.type}. Must be one of: COURSE, TICKET, SUBSCRIPTION`,
        });
      }

      // Validate price
      if (row.price && isNaN(Number(row.price))) {
        errors.push({
          row: index + 2,
          message: `Invalid price: ${row.price}. Must be a number`,
        });
      }
    });

    return errors;
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const data = await readFile(file);
      const errors = validateData(data);

      setImportResult({
        success: errors.length === 0,
        errors,
        totalRows: data.length,
        validRows: data.length - errors.length,
      });

      if (errors.length === 0) {
        toast.success('File validation successful! Ready to import.');
      } else {
        toast.error('File validation failed. Please check the errors.');
      }
    } catch (error) {
      toast.error('Error processing file');
      console.error('Error processing file:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // console.log(jsonData);

          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);

      if (file.name.endsWith('.csv')) {
        reader.readAsText(file);
      } else {
        reader.readAsBinaryString(file);
      }
    });
  };

  const handleImport = async () => {
    if (!file || !importResult?.success || !org?.id) return;

    setIsProcessing(true);
    try {
      const data = await readFile(file);
      const formattedData = data.map((row) => ({
        type: row.type.toUpperCase() as PurchaseItemType,
        title: row.title,
        description: row.description,
        price: Number(row.price),
        // Add any additional fields specific to each product type
        ...(row.type.toUpperCase() === PurchaseItemType.COURSE && {
          category_id: row.category_id,
          category_name: row.category_name,
          duration: row.duration,
          multimedia_url: row.multimedia_url,
        }),
        ...(row.type.toUpperCase() === PurchaseItemType.TICKET && {
          event_date: row.event_date,
          venue: row.venue,
        }),
        ...(row.type.toUpperCase() === PurchaseItemType.SUBSCRIPTION && {
          billing_cycle: row.billing_cycle,
          features: row.features?.split(',').map((f: string) => f.trim()),
        }),
      }));

      await dispatch(
        importProducts({
          products: formattedData,
          business_id: org.id,
        })
      ).unwrap();

      toast.success('Products imported successfully!');
      router.push('/products');
    } catch (error) {
      toast.error('Error importing products');
      console.error('Error importing products:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className='section-container'>
      <div className='h-full'>
        <div className='flex-1 text-black-1 dark:text-white'>
          <div className='mb-4'>
            <PageHeading
              title='Import Products'
              brief='Import your products using a CSV or Excel file'
              enableBreadCrumb={true}
              layer2='Products'
              layer2Link='/products'
              layer3='Import'
              enableBackButton={true}
            />
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* File Upload Section */}
            <Card className='lg:col-span-2'>
              <div className='p-6'>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                    ${
                      isDragActive
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-300 dark:border-gray-700 hover:border-primary-500'
                    }`}
                >
                  <input {...getInputProps()} />
                  <Upload className='w-12 h-12 mx-auto mb-4 text-gray-400' />
                  {file ? (
                    <div className='flex items-center justify-center gap-2'>
                      <FileText className='w-5 h-5 text-primary-500' />
                      <span className='text-sm font-medium'>{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                          setImportResult(null);
                        }}
                        className='p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full'
                      >
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>
                        Drag and drop your file here, or click to select
                      </p>
                      <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        Supported formats: .xlsx, .xls, .csv
                      </p>
                    </div>
                  )}
                </div>

                {file && (
                  <div className='mt-6 flex justify-end'>
                    <Button
                      variant='primary'
                      onClick={processFile}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Validate File'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Instructions Card */}
            <Card>
              <div className='p-6'>
                <h3 className='text-lg font-semibold mb-4'>Instructions</h3>
                <div className='space-y-4'>
                  <div>
                    <h4 className='font-medium mb-2'>Required Fields</h4>
                    <ul className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                      <li>• type (COURSE, TICKET, or SUBSCRIPTION)</li>
                      <li>• title</li>
                      <li>• description</li>
                      <li>• price</li>
                      <li className='mt-2 font-medium'>
                        Course-specific fields:
                      </li>
                      <li>• category_id</li>
                      <li>• category_name</li>
                      <li>• duration</li>
                      <li>• multimedia_url</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className='font-medium mb-2'>File Format</h4>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      Download our template file to ensure correct formatting.
                    </p>
                    <Button
                      variant='outline'
                      className='mt-2 w-full'
                      onClick={() => {
                        // Create sample data
                        const sampleData = [
                          {
                            type: 'COURSE',
                            title: 'Sample Course',
                            description: 'This is a sample course description',
                            price: '99.99',
                            category_id: '1',
                            category_name: 'Programming',
                            duration: '10 hours',
                            multimedia_url: 'https://example.com/image.jpg',
                          },
                          {
                            type: 'TICKET',
                            title: 'Sample Event',
                            description: 'This is a sample event description',
                            price: '49.99',
                            event_date: '2024-12-31',
                            venue: 'Virtual Event',
                          },
                          {
                            type: 'SUBSCRIPTION',
                            title: 'Premium Plan',
                            description: 'This is a sample subscription plan',
                            price: '29.99',
                            billing_cycle: 'monthly',
                            features: 'Feature 1, Feature 2, Feature 3',
                          },
                        ];

                        // Create workbook and worksheet
                        const wb = XLSX.utils.book_new();
                        const ws = XLSX.utils.json_to_sheet(sampleData);

                        // Add worksheet to workbook
                        XLSX.utils.book_append_sheet(wb, ws, 'Products');

                        // Generate and download file
                        XLSX.writeFile(wb, 'products-import-template.xlsx');
                      }}
                    >
                      Download Template
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Validation Results */}
          {importResult && (
            <Card className='mt-6'>
              <div className='p-6'>
                <div className='flex items-center justify-between mb-4'>
                  <h3 className='text-lg font-semibold'>Validation Results</h3>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                      Total Rows: {importResult.totalRows}
                    </span>
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                      Valid Rows: {importResult.validRows}
                    </span>
                  </div>
                </div>

                {importResult.errors.length > 0 ? (
                  <div className='space-y-4'>
                    {importResult.errors.map((error, index) => (
                      <div
                        key={index}
                        className='flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg'
                      >
                        <AlertCircle className='w-5 h-5 text-red-500 flex-shrink-0 mt-0.5' />
                        <div>
                          <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                            Row {error.row}
                          </p>
                          <p className='text-sm text-red-700 dark:text-red-300'>
                            {error.message}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg'>
                    <CheckCircle2 className='w-5 h-5 text-green-500' />
                    <p className='text-sm text-green-800 dark:text-green-200'>
                      All rows are valid! Ready to import.
                    </p>
                  </div>
                )}

                {importResult.success && (
                  <div className='mt-6 flex justify-end'>
                    <Button
                      variant='primary'
                      onClick={handleImport}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Importing...' : 'Import Products'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};

export default ImportProducts;
