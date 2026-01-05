'use client';

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
  useState,
} from 'react';
import { socketService } from '@/lib/services/socketService';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface SocketContextType {
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (token && !socketService.isConnected()) {
      socketService.connect(token);

      // Listen for connection status
      const handleConnect = () => setIsConnected(true);
      const handleDisconnect = () => setIsConnected(false);

      socketService.on('connect', handleConnect);
      socketService.on('disconnect', handleDisconnect);

      return () => {
        socketService.off('connect', handleConnect);
        socketService.off('disconnect', handleDisconnect);
      };
    }
  }, [token, isConnected]);

  return (
    <SocketContext.Provider value={{ isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
