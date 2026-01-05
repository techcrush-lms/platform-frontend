import Icon from '@/components/ui/Icon';
import {
  formatMoney,
  getProductPath,
  ProductStatus,
  ProductType,
} from '@/lib/utils';
import {
  Course,
  DigitalProduct,
  PhysicalProduct,
  TicketProduct,
  TicketTier,
} from '@/types/product';
import Link from 'next/link';
import React from 'react';

type ProductGridItemType =
  | 'course'
  | 'ticket'
  | 'digital_product'
  | 'physical_product';

interface ProductGridItemProps {
  id: string;
  title: string;
  imageSrc: string;
  type: ProductType;
  data?: Course | TicketProduct | any;
}

const ProductGridItem = ({
  id,
  title,
  imageSrc,
  type,
  data,
}: ProductGridItemProps) => {
  let formattedPrice = '';

  const product_path = getProductPath(type);

  let href = `/products/${product_path}/${id}/edit`;

  if (data) {
    if (type === ProductType.TICKET) {
      const ticketData = data as TicketProduct;
      const tiers = ticketData.ticket?.ticket_tiers || [];

      // Find default tier or fallback to first tier
      const defaultTier: TicketTier | undefined =
        tiers.find((tier) => tier.default_view) || tiers[0];

      if (defaultTier) {
        formattedPrice = `<s>${formatMoney(
          +defaultTier.original_amount,
          defaultTier.currency
        )}+</s> ${formatMoney(+defaultTier.amount, defaultTier.currency)}+`;
      }
    } else if (type === ProductType.COURSE) {
      const courseData = data as Course;
      formattedPrice = formatMoney(+courseData.price, courseData.currency);
    } else if (type === ProductType.DIGITAL_PRODUCT) {
      const digitalProductData = data as DigitalProduct;
      formattedPrice = formatMoney(
        +digitalProductData.price,
        digitalProductData.currency
      );
    } else if (type === ProductType.PHYSICAL_PRODUCT) {
      const physicalProductData = data as PhysicalProduct;
      formattedPrice = formatMoney(
        +physicalProductData.price,
        physicalProductData.currency
      );
    }
  }

  return (
    <div className='shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden mb-4 min-h-[320px] flex flex-col justify-between rounded-xl'>
      <Link href={href}>
        <div className='relative'>
          <img
            className='w-full h-48 object-cover rounded-t-xl'
            src={imageSrc}
            alt={title}
          />
          {data?.status && (
            <span
              className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded bg-opacity-90 ${
                data?.status === ProductStatus.PUBLISHED
                  ? 'bg-green-600 text-white'
                  : data?.status === ProductStatus.DRAFT
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}
            >
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          )}
        </div>
      </Link>
      <div className='flex flex-col flex-grow justify-between px-4 py-3 space-y-2'>
        <div>
          <Link href={href}>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate'>
              {title}
            </h3>
          </Link>
          <p
            className='text-gray-600 dark:text-gray-300 text-sm min-h-[20px]'
            dangerouslySetInnerHTML={{ __html: formattedPrice }}
          />
        </div>
        <Link
          href={href}
          className='flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary-main rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 gap-2'
        >
          <Icon url='/icons/course/edit.svg' width={16} />
          Edit
        </Link>
      </div>
    </div>
  );
};

export default ProductGridItem;
