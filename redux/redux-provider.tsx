'use client';
import { Provider } from 'react-redux';
import { store } from './store';
import { persistStore } from 'redux-persist';

if (typeof window !== 'undefined') {
  persistStore(store);
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
