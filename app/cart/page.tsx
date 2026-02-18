'use client';

import Link from 'next/link';
import { removeFromCart, updateQuantity } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { formatCurrency } from '@/utils/format';

export default function CartPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-brand-700">Your Cart</h1>
      {!items.length ? <p className="mt-4">Cart is empty.</p> : (
        <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.name} className="h-20 w-20 rounded object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm">{formatCurrency(item.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="rounded border px-2" onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}>-</button>
                    <span>{item.quantity}</span>
                    <button className="rounded border px-2" onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}>+</button>
                    <button className="ml-3 text-sm text-red-500" onClick={() => dispatch(removeFromCart(item.productId))}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <aside className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold">Summary</h2>
            <p className="mt-3">Subtotal: <span className="font-bold">{formatCurrency(subtotal)}</span></p>
            <Link href="/checkout" className="mt-4 inline-block w-full rounded bg-brand-600 py-2 text-center text-white">Proceed to Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
