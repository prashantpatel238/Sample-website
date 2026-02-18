import { NextRequest, NextResponse } from 'next/server';
import { connectDB, isDatabaseReady } from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/apiGuard';
import { sampleOrders } from '@/utils/sampleData';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  if (!(await isDatabaseReady())) {
    const all = req.nextUrl.searchParams.get('all') === 'true' && auth.session.user.role === 'admin';
    return NextResponse.json({ orders: all ? sampleOrders : sampleOrders.slice(0, 1) });
  }

  await connectDB();
  const all = req.nextUrl.searchParams.get('all') === 'true' && auth.session.user.role === 'admin';
  const orders = all ? await Order.find().sort({ createdAt: -1 }) : await Order.find({ userId: auth.session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}
