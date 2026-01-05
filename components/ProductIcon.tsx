import { ProductType } from '@/lib/utils';
import { BookOpen, Download, Calendar, Ticket } from 'lucide-react';

export const getProductIcon = (type: ProductType) => {
  switch (type) {
    case ProductType.COURSE:
      return <BookOpen size={10} />;
    case ProductType.TICKET:
      return <Ticket size={10} />;
    case ProductType.SUBSCRIPTION:
      return <Calendar size={10} />;
    case ProductType.DIGITAL_PRODUCT:
      return <Download size={10} />;
    default:
      return <BookOpen size={10} />; // fallback
  }
};
