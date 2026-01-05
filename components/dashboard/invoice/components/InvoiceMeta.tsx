import moment from 'moment';
import { Badge } from '@/components/ui/badge';
import { InvoiceStatus } from '@/lib/schema/invoice.schema';

interface InfoBlockProps {
  label: string;
  value?: string | null;
}

const InfoBlock = ({ label, value }: InfoBlockProps) => (
  <div>
    <p className='text-muted-foreground text-xs'>{label}</p>
    <p className='font-medium'>{value || 'N/A'}</p>
  </div>
);

interface InvoiceMetaProps {
  customerName?: string;
  issuedAt?: string;
  dueAt?: string;
  status?: InvoiceStatus;
}

const InvoiceMeta = ({
  customerName,
  issuedAt,
  dueAt,
  status,
}: InvoiceMetaProps) => {
  return (
    <div className='grid grid-cols-2 gap-4 text-sm'>
      <InfoBlock label='Customer' value={customerName} />
      <InfoBlock
        label='Issued Date'
        value={issuedAt ? moment(issuedAt).format('LL') : undefined}
      />
      <InfoBlock
        label='Due Date'
        value={dueAt ? moment(dueAt).format('LL') : undefined}
      />

      <div className='flex justify-end items-center'>
        {status === InvoiceStatus.DRAFT && (
          <Badge variant='secondary'>DRAFT</Badge>
        )}
        {status === InvoiceStatus.PUBLISHED && (
          <Badge variant='success'>PUBLISHED</Badge>
        )}
      </div>
    </div>
  );
};

export default InvoiceMeta;
