'use client';

import Pagination from '@/components/Pagination';
import TableEndRecord from '@/components/ui/TableEndRecord';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { useSearchParams } from 'next/navigation';
import Filter from '@/components/Filter';
import useCustomers from '@/hooks/page/useCustomers';
import CustomerItem from './CustomerItem';
import { Button } from '@/components/ui/Button';
import {
  Download,
  Upload,
  X,
  Eye,
  FileText,
  AlertCircle,
  Copy,
  Link,
  Import,
} from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  exportUsers,
  fetchCustomers,
  importUsers,
} from '@/redux/slices/orgSlice';
import { BusinessOwnerOrgRole } from '@/lib/utils';
import { DocFormat, ImportUsersProps } from '@/lib/schema/org.schema';
import { Customer } from '@/types/notification';
import toast from 'react-hot-toast';
import { IoIosDocument } from 'react-icons/io';
import LoadingIcon from '@/components/ui/icons/LoadingIcon';
import * as XLSX from 'xlsx';

const CustomersList = () => {
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { org } = useSelector((state: RootState) => state.org);
  const { exportUserLoading, importUserLoading } = useSelector(
    (state: RootState) => state.org
  );

  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<DocFormat>(
    DocFormat.csv
  );
  const [importFile, setImportFile] = useState<File | null>(null);
  const [exportData, setExportData] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [importError, setImportError] = useState<string>('');
  const [showTemplate, setShowTemplate] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    customers,
    customersLoading: loading,
    count,
    currentPage,
    onClickNext,
    onClickPrev,
    handleSearchSubmit,
    handleFilterByDateSubmit,
    handleRefresh,
  } = useCustomers();

  // Template data for import
  const importTemplate = [
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      role: 'user',
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+2349029876543',
      role: 'user',
    },
  ];

  const downloadTemplate = () => {
    const csvContent = [
      'name,email,phone,role',
      ...importTemplate.map(
        (row) => `${row.name},${row.email},${row.phone},${row.role}`
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers-import-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Template downloaded successfully');
  };

  // Generate onboarding link with business_id
  const generateOnboardingLink = () => {
    if (!org?.id) {
      toast.error('Organization not found');
      return '';
    }

    return `${process.env.NEXT_PUBLIC_WEBSITE_URL}/onboard/signup?business_id=${org.id}`;
  };

  // Copy onboarding link to clipboard
  const copyOnboardingLink = async () => {
    const link = generateOnboardingLink();
    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Onboarding link copied to clipboard!');

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link to clipboard');
    }
  };

  // Helper function to convert Excel scientific notation to phone number
  const convertExcelPhoneNumber = (value: any): string => {
    if (!value) return '';

    let stringValue = value.toString().trim();

    // If it's already a proper phone number format, return as is
    if (stringValue.startsWith('+') || stringValue.startsWith('0')) {
      return stringValue;
    }

    // Handle scientific notation (e.g., 2.34903E+12)
    if (stringValue.includes('E') || stringValue.includes('e')) {
      try {
        const number = parseFloat(stringValue);
        if (!isNaN(number)) {
          // Convert to string and remove decimal places
          const phoneString = number.toFixed(0);
          // Add + prefix
          stringValue = `+${phoneString}`;
          return stringValue;
        }
        // console.log(1234);

        // console.log(stringValue);
      } catch (error) {
        // If conversion fails, return original value
        return stringValue;
      }
    }

    // Handle regular numbers (e.g., 2349031234567)
    if (!isNaN(Number(stringValue))) {
      const phoneString = Number(stringValue).toFixed(0);
      return `+${phoneString}`;
    }

    // Return original value if no conversion needed
    return stringValue;
  };

  const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      throw new Error(
        'CSV file must have at least a header row and one data row'
      );
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'email'];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));

    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: any = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        // Convert phone numbers from Excel scientific notation
        if (header === 'phone') {
          row[header] = convertExcelPhoneNumber(value);
        } else {
          row[header] = value;
        }
      });

      // Validate required fields
      if (!row.name || !row.email) {
        throw new Error(
          `Row ${i + 1}: Missing required fields (name and email are required)`
        );
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.email)) {
        throw new Error(`Row ${i + 1}: Invalid email format`);
      }

      data.push(row);
    }

    return data;
  };

  const parseJSON = (jsonText: string): any[] => {
    try {
      const data = JSON.parse(jsonText);

      if (!Array.isArray(data)) {
        throw new Error('JSON file must contain an array of objects');
      }

      if (data.length === 0) {
        throw new Error('JSON file must contain at least one record');
      }

      const requiredFields = ['name', 'email'];

      data.forEach((item, index) => {
        if (typeof item !== 'object' || item === null) {
          throw new Error(`Record ${index + 1}: Must be an object`);
        }

        const missingFields = requiredFields.filter((field) => !item[field]);
        if (missingFields.length > 0) {
          throw new Error(
            `Record ${index + 1}: Missing required fields (${missingFields.join(
              ', '
            )})`
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(item.email)) {
          throw new Error(`Record ${index + 1}: Invalid email format`);
        }
      });

      return data;
    } catch (error: any) {
      if (error.message.includes('JSON')) {
        throw new Error('Invalid JSON format');
      }
      throw error;
    }
  };

  const parseXLSX = async (file: File): Promise<any[]> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Get the first worksheet
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error('No worksheet found in the XLSX file');
      }

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (jsonData.length < 2) {
        throw new Error(
          'XLSX file must have at least a header row and one data row'
        );
      }

      // Get headers from first row
      const headers = (jsonData[0] as string[]).map((h) =>
        h?.toString().trim().toLowerCase()
      );
      const requiredHeaders = ['name', 'email'];
      const missingHeaders = requiredHeaders.filter(
        (h) => !headers.includes(h)
      );

      if (missingHeaders.length > 0) {
        throw new Error(
          `Missing required columns: ${missingHeaders.join(', ')}`
        );
      }

      const data = [];
      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];
        if (!row || row.length === 0) continue; // Skip empty rows

        const rowData: any = {};
        headers.forEach((header, index) => {
          const value = row[index]?.toString().trim() || '';
          // Convert phone numbers from Excel scientific notation
          if (header === 'phone') {
            rowData[header] = convertExcelPhoneNumber(value);
          } else {
            rowData[header] = value;
          }
        });

        // Validate required fields
        if (!rowData.name || !rowData.email) {
          throw new Error(
            `Row ${
              i + 1
            }: Missing required fields (name and email are required)`
          );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(rowData.email)) {
          throw new Error(`Row ${i + 1}: Invalid email format`);
        }

        data.push(rowData);
      }

      if (data.length === 0) {
        throw new Error('No valid data rows found in the XLSX file');
      }

      return data;
    } catch (error: any) {
      if (error.message.includes('XLSX')) {
        throw new Error('Invalid XLSX file format');
      }
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFile(file);
    setImportError('');
    setParsedData([]);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let data: any[] = [];

      if (fileExtension === 'csv') {
        const text = await file.text();
        data = parseCSV(text);
      } else if (fileExtension === 'json') {
        const text = await file.text();
        data = parseJSON(text);
      } else if (fileExtension === 'xlsx') {
        data = await parseXLSX(file);
      } else {
        throw new Error(
          'Unsupported file format. Please use CSV, JSON, or XLSX files.'
        );
      }

      setParsedData(data);
      toast.success(`Successfully parsed ${data.length} records`);
    } catch (error: any) {
      setImportError(error.message);
      toast.error(`File parsing error: ${error.message}`);
    }
  };

  const handleExport = async () => {
    if (!org?.id) {
      toast.error('Organization not found');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await dispatch(
        exportUsers({
          format: selectedFormat,
          role: BusinessOwnerOrgRole.USER,
          business_id: org.id,
        })
      ).unwrap();

      // Store export data and download URL for preview
      setExportData(response.data);
      setDownloadUrl(response.data.download_url);
      setShowExportModal(false);
      setShowPreviewModal(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to export customers');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `customers.${selectedFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started successfully');
    }
  };

  const handleImport = async () => {
    if (!org?.id || parsedData.length === 0) {
      toast.error('Please select a valid file to import');
      return;
    }

    setIsProcessing(true);

    try {
      const importData: ImportUsersProps = {
        users: parsedData.map((user) => ({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          role: BusinessOwnerOrgRole.USER,
        })),
      };

      await dispatch(
        importUsers({
          credentials: importData,
          business_id: org.id,
        })
      );

      toast.success(`Successfully imported ${parsedData.length} customers`);
      setShowImportModal(false);
      setImportFile(null);
      setParsedData([]);
      setImportError('');

      dispatch(
        fetchCustomers({
          ...(org?.id && { business_id: org?.id as string }),
        })
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to import customers');
    } finally {
      setIsProcessing(false);
    }
  };

  const noFoundText =
    !searchParams.has('page') || searchParams.has('q')
      ? 'No record found.'
      : undefined;

  return (
    <>
      <section>
        <Filter
          searchPlaceholder='Search customers'
          showPeriod={false}
          showSearch={true}
          handleFilterByDateSubmit={handleFilterByDateSubmit}
          handleRefresh={handleRefresh}
          handleSearchSubmit={handleSearchSubmit}
          extra={
            <>
              <div className='flex items-center m-0 flex-shrink-0 self-start gap-2'>
                <Button
                  size='icon'
                  variant='primary'
                  className='text-md text-md flex p-2 px-2 gap-2'
                  title='Export Customers'
                  onClick={() => setShowExportModal(true)}
                >
                  <Upload size={18} />
                </Button>
                <Button
                  size='icon'
                  variant='primary'
                  className='text-md text-md flex p-2 gap-2'
                  title='Import Customers'
                  onClick={() => setShowImportModal(true)}
                >
                  <Download size={18} />
                </Button>
                <Button
                  size='icon'
                  variant='primary'
                  className='text-md text-md flex p-2 gap-2'
                  title='Get Onboarding Link'
                  onClick={() => setShowOnboardingModal(true)}
                >
                  <Link size={18} />
                </Button>
              </div>
            </>
          }
        />

        <div className='overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm text-left text-gray-700 dark:text-gray-200'>
            <thead className='text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'>
              <tr>
                {[
                  'ID',
                  'Name',
                  'Email',
                  'Phone Number',
                  'Total Expense(s)',
                  'Date Created',
                  'Date Updated',
                ].map((heading) => (
                  <th key={heading} className='px-6 py-3 whitespace-nowrap'>
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            {loading ? (
              <LoadingSkeleton length={12} columns={7} />
            ) : (
              <tbody className='text-sm'>
                {customers.map((customer: Customer) => (
                  <CustomerItem key={customer.id} customer={customer} />
                ))}

                {!customers.length && (
                  <TableEndRecord colspan={8} text={noFoundText} />
                )}
              </tbody>
            )}
          </table>
        </div>

        {/* Pagination */}
        {!loading && (
          <Pagination
            total={count}
            currentPage={currentPage}
            onClickNext={onClickNext}
            onClickPrev={onClickPrev}
            noMoreNextPage={customers.length === 0}
          />
        )}
      </section>

      {/* Export Modal */}
      {showExportModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-gray-200 dark:border-gray-700'>
            <div className='flex justify-between items-center mb-6'>
              <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                Export Customers
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
              >
                <X size={20} />
              </button>
            </div>
            <p className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
              Select the format for exporting customer data:
            </p>
            <div className='grid grid-cols-3 gap-4 mb-8'>
              {Object.values(DocFormat).map((format) => (
                <button
                  key={format}
                  onClick={() => setSelectedFormat(format)}
                  className={`p-4 border-2 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                    selectedFormat === format
                      ? 'border-primary-main bg-primary-main/10 text-primary-main shadow-lg'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-main/50 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <IoIosDocument className='text-3xl mx-auto mb-2' />
                  <span className='text-sm font-semibold uppercase tracking-wide'>
                    {format}
                  </span>
                </button>
              ))}
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                variant='outline'
                onClick={() => setShowExportModal(false)}
                className='px-6'
              >
                Cancel
              </Button>
              <Button
                variant='primary'
                onClick={handleExport}
                disabled={isProcessing && true}
                className='px-6'
              >
                {isProcessing ? (
                  <span className='flex items-center gap-2'>
                    <LoadingIcon />
                    Exporting...
                  </span>
                ) : (
                  'Export'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
            {/* Header */}
            <div className='flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary-main/10 rounded-lg'>
                  <Eye className='text-primary-main' size={24} />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Export Preview
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {selectedFormat.toUpperCase()} format •{' '}
                    {exportData?.total || 0} records
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-auto p-6'>
              {/* Stats Cards */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
                <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                        Total Records
                      </p>
                      <p className='text-2xl font-bold text-blue-900 dark:text-blue-100'>
                        {exportData?.total || 0}
                      </p>
                    </div>
                    <div className='p-2 bg-blue-100 dark:bg-blue-800 rounded-lg'>
                      <IoIosDocument
                        className='text-blue-600 dark:text-blue-400'
                        size={20}
                      />
                    </div>
                  </div>
                </div>

                <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-green-600 dark:text-green-400'>
                        Format
                      </p>
                      <p className='text-2xl font-bold text-green-900 dark:text-green-100'>
                        {selectedFormat.toUpperCase()}
                      </p>
                    </div>
                    <div className='p-2 bg-green-100 dark:bg-green-800 rounded-lg'>
                      <Download
                        className='text-green-600 dark:text-green-400'
                        size={20}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className='flex justify-center mb-6'>
                <Button
                  variant='primary'
                  onClick={handleDownload}
                  className='px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
                  disabled={isProcessing && true}
                >
                  {isProcessing ? (
                    <span className='flex items-center justify-center'>
                      <LoadingIcon />
                      Processing...
                    </span>
                  ) : (
                    <>
                      <Download size={20} className='mr-2' />
                      Download {selectedFormat.toUpperCase()} File
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
            {/* Header */}
            <div className='flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary-main/10 rounded-lg'>
                  <Download className='text-primary-main' size={24} />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Import Customers
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Upload customer data in CSV, JSON, or XLSX format
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setParsedData([]);
                  setImportError('');
                }}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className='flex-1 overflow-auto p-6'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Left Column - File Upload */}
                <div>
                  <div className='mb-6'>
                    <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                      Upload File
                    </h4>
                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                      Supported formats: CSV, JSON, XLSX
                    </p>

                    <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-primary-main/50 transition-colors'>
                      <input
                        type='file'
                        accept='.csv,.json,.xlsx'
                        onChange={handleFileChange}
                        className='hidden'
                        id='import-file'
                      />
                      <label
                        htmlFor='import-file'
                        className='cursor-pointer block'
                      >
                        <Upload className='text-4xl mx-auto mb-3 text-gray-400' />
                        <p className='text-sm text-gray-600 dark:text-gray-400 font-medium'>
                          {importFile
                            ? importFile.name
                            : 'Click to select file'}
                        </p>
                        <p className='text-xs text-gray-500 dark:text-gray-500 mt-2'>
                          CSV, JSON, or XLSX files only
                        </p>
                      </label>
                    </div>

                    {importError && (
                      <div className='mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                        <div className='flex items-center gap-2'>
                          <AlertCircle className='text-red-500' size={16} />
                          <p className='text-sm text-red-700 dark:text-red-400 font-medium'>
                            {importError}
                          </p>
                        </div>
                      </div>
                    )}

                    {parsedData.length > 0 && (
                      <div className='mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
                        <div className='flex items-center gap-2'>
                          <FileText className='text-green-500' size={16} />
                          <p className='text-sm text-green-700 dark:text-green-400 font-medium'>
                            Successfully parsed {parsedData.length} records
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Import Button */}
                  <div className='flex justify-end'>
                    <Button
                      variant='primary'
                      onClick={handleImport}
                      disabled={isProcessing && true}
                      className='px-8'
                    >
                      {isProcessing ? (
                        <span className='flex items-center justify-center'>
                          <LoadingIcon />
                          Importing...
                        </span>
                      ) : (
                        'Import Customers'
                      )}
                    </Button>
                  </div>
                </div>

                {/* Right Column - Template */}
                <div>
                  <div className='mb-6'>
                    <div className='flex items-center justify-between mb-4'>
                      <h4 className='text-lg font-semibold text-gray-900 dark:text-white'>
                        Import Template
                      </h4>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={downloadTemplate}
                        className='text-xs'
                      >
                        <Download size={14} className='mr-1' />
                        Download Template
                      </Button>
                    </div>

                    <div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
                      <div className='text-xs font-mono text-gray-600 dark:text-gray-300'>
                        <div className='mb-2 font-semibold text-gray-800 dark:text-gray-200'>
                          Required columns: name, email
                        </div>
                        <div className='mb-2 font-semibold text-gray-800 dark:text-gray-200'>
                          Optional columns: phone, role
                        </div>
                        <div className='space-y-1'>
                          <div>name,email,phone,role</div>
                          <div>
                            John Doe,john@example.com,+2348123456789,user
                          </div>
                          <div>
                            Jane Smith,jane@example.com,+2349098765432,user
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Preview */}
                  {parsedData.length > 0 && (
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
                        Data Preview ({parsedData.length} records)
                      </h4>
                      <div className='bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden'>
                        <div className='overflow-x-auto'>
                          <table className='w-full text-xs dark:text-white'>
                            <thead className='bg-gray-100 dark:bg-gray-600'>
                              <tr>
                                <th className='px-3 py-2 text-left'>Name</th>
                                <th className='px-3 py-2 text-left'>Email</th>
                                <th className='px-3 py-2 text-left'>Phone</th>
                                <th className='px-3 py-2 text-left'>Role</th>
                              </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200 dark:divide-gray-600'>
                              {parsedData.slice(0, 5).map((row, index) => (
                                <tr
                                  key={index}
                                  className='hover:bg-gray-100 dark:hover:bg-gray-600'
                                >
                                  <td className='px-3 py-2'>{row.name}</td>
                                  <td className='px-3 py-2'>{row.email}</td>
                                  <td className='px-3 py-2'>
                                    {row.phone || 'N/A'}
                                  </td>
                                  <td className='px-3 py-2'>
                                    {row.role || 'N/A'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {parsedData.length > 5 && (
                          <div className='px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600'>
                            Showing first 5 of {parsedData.length} records
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Link Modal */}
      {showOnboardingModal && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl'>
            {/* Header */}
            <div className='flex justify-between items-center p-6 border-b rounded-t-xl border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='p-2 bg-primary-main/10 rounded-lg'>
                  <Link className='text-primary-main' size={24} />
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 dark:text-white'>
                    Onboarding Link
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Share this link with customers to join your business
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowOnboardingModal(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg'
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className='p-6'>
              <div className='mb-6'>
                <h4 className='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                  Customer Onboarding Link
                </h4>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  Copy and share this link with your customers. When they click
                  the link, they'll be directed to sign up and automatically
                  join your business.
                </p>
              </div>

              {/* Link Display */}
              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Onboarding Link
                </label>
                <div className='flex items-center gap-2'>
                  <div className='flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-3'>
                    <input
                      type='text'
                      value={generateOnboardingLink()}
                      readOnly
                      className='w-full bg-transparent text-sm text-gray-900 dark:text-white outline-none'
                    />
                  </div>
                  <Button
                    variant='primary'
                    onClick={copyOnboardingLink}
                    className='px-4 py-3'
                    disabled={copied}
                  >
                    {copied ? (
                      <span className='flex items-center gap-2'>
                        <span className='text-green-500'>✓</span>
                        Copied!
                      </span>
                    ) : (
                      <span className='flex items-center gap-2'>
                        <Copy size={16} />
                        Copy
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4'>
                <h5 className='text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2'>
                  How it works:
                </h5>
                <ul className='text-sm text-blue-800 dark:text-blue-200 space-y-1'>
                  <li>
                    • Share this link with your customers via email, SMS, or any
                    communication channel
                  </li>
                  <li>
                    • When customers click the link, they'll be taken to the
                    signup page
                  </li>
                  <li>
                    • They'll automatically be associated with your business
                  </li>
                  <li>
                    • You'll see them appear in your customers list once they
                    complete registration
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomersList;
