import Link from 'next/link';

export default function OrderConfirmation({ searchParams }: { searchParams: { orderId?: string } }) {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-bold text-brand-700">Order Confirmed 🎉</h1>
      <p className="mt-3 text-gray-700">Your order {searchParams.orderId ? `#${searchParams.orderId}` : ''} has been placed successfully.</p>
      <Link href="/orders" className="mt-6 inline-block rounded bg-brand-600 px-5 py-3 text-white">View Orders</Link>
    </div>
  );
}
