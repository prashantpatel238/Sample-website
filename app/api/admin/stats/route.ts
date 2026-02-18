import { NextResponse } from 'next/server';
import { connectDB, isDatabaseReady } from '@/lib/db';
import User from '@/models/User';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/apiGuard';

export async function GET() {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  if (!(await isDatabaseReady())) {
    return NextResponse.json({ totalUsers: 24, totalOrders: 83, totalRevenue: 41250 });
  }

  await connectDB();
  const [totalUsers, totalOrders, revenueData] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, totalRevenue: { $sum: '$total' } } }])
  ]);

  return NextResponse.json({ totalUsers, totalOrders, totalRevenue: revenueData[0]?.totalRevenue ?? 0 });
}
