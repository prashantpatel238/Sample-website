'use client';

import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { store } from '@/store';
import { hydrateCart } from '@/store/cartSlice';

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const raw = localStorage.getItem('cart');
    if (raw) {
      store.dispatch(hydrateCart(JSON.parse(raw)));
    }
    const unsubscribe = store.subscribe(() => {
      localStorage.setItem('cart', JSON.stringify(store.getState().cart.items));
    });
    return () => unsubscribe();
  }, []);

  return (
    <SessionProvider>
      <Provider store={store}>
        {children}
        <Toaster position="top-right" />
      </Provider>
    </SessionProvider>
  );
}
