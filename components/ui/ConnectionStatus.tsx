'use client';

import { useSocket } from '@/context/SocketProvider';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ConnectionStatusProps {
  showText?: boolean;
  className?: string;
}

export const ConnectionStatus = ({
  showText = true,
  className = '',
}: ConnectionStatusProps) => {
  const { isConnected } = useSocket();
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`}
        title={isConnected ? 'Connected' : 'Disconnected'}
      />
      {showText && (
        <span
          className={`text-xs ${
            isConnected ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isConnected ? 'Connected' : token ? 'Connecting...' : 'No Token'}
        </span>
      )}
    </div>
  );
};
