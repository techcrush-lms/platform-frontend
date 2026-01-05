import Icon from '@/components/ui/Icon';

interface CompanyHeaderProps {
  logoUrl?: string;
  businessName?: string;
  email?: string;
  location?: string;
}

const CompanyHeader = ({
  logoUrl,
  businessName,
  email,
  location,
}: CompanyHeaderProps) => {
  return (
    <div className='flex flex-col items-center text-center gap-3 p-10'>
      {logoUrl && <Icon url={logoUrl} width={60} />}

      <div className='text-sm'>
        <p className='font-semibold'>{businessName}</p>
        <p className='text-muted-foreground'>{email}</p>
        <p className='text-muted-foreground'>{location}</p>
      </div>
    </div>
  );
};

export default CompanyHeader;
