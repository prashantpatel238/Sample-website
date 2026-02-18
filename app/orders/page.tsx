import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { connectDB, isDbConfigured } from '@/lib/db';
import Order from '@/models/Order';
import { formatCurrency } from '@/utils/format';
import { demoOrders } from '@/utils/mockData';

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  let orders: any[] = demoOrders;
  if (isDbConfigured) {
    await connectDB();
    orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
  }

  return (
    <div className="container py-10">
      {!isDbConfigured && <p className="mb-4 rounded bg-amber-100 p-2 text-sm text-amber-900">Showing demo orders in preview mode.</p>}
      <h1 className="text-3xl font-bold text-brand-700">My Orders</h1>
      <div className="mt-6 space-y-4">
        {orders.map((order) => (
          <div key={order._id.toString()} className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <p className="font-semibold">Order #{order._id.toString().slice(-6)}</p>
              <span className="rounded bg-brand-100 px-3 py-1 text-sm text-brand-700">{order.status}</span>
            </div>
            <p className="mt-2 text-sm">Total: {formatCurrency(order.total)}</p>
            <p className="text-sm">Payment: {order.paymentMethod.toUpperCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
