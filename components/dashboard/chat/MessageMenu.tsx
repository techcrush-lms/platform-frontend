import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MessageMenuProps {
  trigger: JSX.Element;
  list: Array<{
    title: string;
    link: string;
  }>;
}
export function MessageMenu({ trigger, list }: MessageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className='w-20 md:w-56 bg-white dark:bg-gray-800 dark:border-black-2 text-black-2 dark:text-white'>
        <DropdownMenuGroup>
          {list.map((item) => (
            <DropdownMenuItem key={item.link} onClick={() => {}}>
              {item.title}
              {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
