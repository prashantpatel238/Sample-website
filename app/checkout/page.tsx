'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { clearCart } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CheckoutPage() {
  const items = useAppSelector((s) => s.cart.items);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [address, setAddress] = useState({ fullName: '', phone: '', line1: '', city: '', state: '', pincode: '' });
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [loading, setLoading] = useState(false);

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!items.length) return toast.error('Your cart is empty');
    setLoading(true);

    try {
      let paymentId = '';
      if (paymentMethod === 'razorpay') {
        const orderRes = await fetch('/api/razorpay/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: total })
        });
        const orderData = await orderRes.json();
        if (!orderRes.ok) throw new Error(orderData.message || 'Payment initialization failed');

        await new Promise<void>((resolve, reject) => {
          if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || typeof window.Razorpay === 'undefined') {
            paymentId = `demo_payment_${Date.now()}`;
            resolve();
            return;
          }

          const rzp = new window.Razorpay({
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.order.amount,
            currency: 'INR',
            name: 'Smart Kirana Store',
            order_id: orderData.order.id,
            handler: (response: { razorpay_payment_id: string }) => {
              paymentId = response.razorpay_payment_id;
              resolve();
            },
            prefill: { name: address.fullName, contact: address.phone }
          });
          rzp.open();
          setTimeout(() => reject(new Error('Payment was not completed')), 120000);
        });
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, address, total, paymentMethod, paymentId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order failed');

      dispatch(clearCart());
      toast.success('Order placed successfully');
      router.push(`/order-confirmation?orderId=${data.orderId}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-brand-700">Checkout</h1>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold">Delivery Address</h2>
          {Object.keys(address).map((key) => (
            <input key={key} className="w-full rounded border p-2" placeholder={key.replace(/([A-Z])/g, ' $1')} value={address[key as keyof typeof address]} onChange={(e) => setAddress({ ...address, [key]: e.target.value })} required />
          ))}
          <div className="space-y-2 pt-2 text-sm">
            <label className="flex items-center gap-2"><input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />Razorpay</label>
            <label className="flex items-center gap-2"><input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />Cash on Delivery</label>
          </div>
          <button onClick={placeOrder} disabled={loading} className="w-full rounded bg-brand-600 py-2 text-white">{loading ? 'Placing order...' : `Place Order (₹${total})`}</button>
        </div>
      </div>
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
    </div>
  );
}
