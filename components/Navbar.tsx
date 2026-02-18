'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useAppSelector } from '@/store/hooks';

export default function Navbar() {
  const { data } = useSession();
  const count = useAppSelector((state) => state.cart.items.reduce((acc, item) => acc + item.quantity, 0));

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-brand-700">Smart Kirana</Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/products">Products</Link>
          <Link href="/orders">Orders</Link>
          {data?.user?.role === 'admin' && <Link href="/admin">Admin</Link>}
          <Link href="/cart">Cart ({count})</Link>
          {data?.user ? (
            <button className="rounded bg-brand-600 px-3 py-1 text-white" onClick={() => signOut({ callbackUrl: '/' })}>Logout</button>
          ) : (
            <Link href="/login" className="rounded bg-brand-600 px-3 py-1 text-white">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
