import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import ThemeDiv from '@/components/ui/ThemeDiv';
import { formatMoney } from '@/lib/utils';

interface InvoiceItem {
  item: string;
  quantity: number;
  amount: number;
}

interface ItemsTableProps {
  items: InvoiceItem[];
}

const ItemsTable = ({ items }: ItemsTableProps) => {
  return (
    <div className='space-y-3'>
      <p className='text-sm font-medium'>Invoice Items</p>

      <ThemeDiv className='rounded-lg'>
        <Table>
          <TableHeader>
            <TableRow className='border-none'>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className='text-right'>Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.item}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className='text-right font-medium'>
                  {formatMoney(item.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ThemeDiv>
    </div>
  );
};

export default ItemsTable;
