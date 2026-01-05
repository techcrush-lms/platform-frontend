import { SaveState } from '@/lib/utils';

interface Props {
  status: SaveState;
}

export default function AutosaveIndicator({ status }: Props) {
  return (
    <div className='absolute top-3 right-6 flex items-center gap-1 text-xs'>
      {status === SaveState.SAVING && (
        <div className='flex items-center gap-2 text-yellow-500'>
          <span className='animate-ping w-2 h-2 bg-yellow-400 rounded-full' />
          <span>Saving...</span>
        </div>
      )}

      {status === SaveState.SAVED && (
        <div className='flex items-center gap-2 text-green-500'>
          <span className='w-2 h-2 bg-green-500 rounded-full' />
          <span>Saved</span>
        </div>
      )}

      {status === SaveState.IDLE && (
        <div className='flex items-center gap-2 text-gray-400'>
          <span className='w-2 h-2 bg-gray-400 rounded-full' />
          <span>Idle</span>
        </div>
      )}
    </div>
  );
}
