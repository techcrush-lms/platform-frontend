import Icon from '@/components/ui/Icon';

interface EmptyState {
  searchQuery?: string;
  title?: string;
  text?: JSX.Element | string;
}
export const EmptyState = ({
  searchQuery,
  title = 'No chats',
  text = 'You have not started any conversation',
}: EmptyState) => (
  <div className='max-h-[70vh] md:max-h-[60vh] lg:max-h-[66vh] flex-col h-[70vh] md:h-[60vh] lg:h-[82vh] flex justify-center items-center'>
    <div className='flex flex-col items-center justify-center text-center'>
      <Icon url='/icons/chat/chats.svg' width={40} height={40} />
      <p className='mb-1 font-bold'>
        {searchQuery ? 'No matching chats found' : title}
      </p>
      <p className='text-sm mb-6'>
        {searchQuery ? 'Try a different search term' : text}
      </p>
    </div>
  </div>
);
