import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth } from '@/lib/apiGuard';

export async function GET(req: NextRequest) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  await connectDB();
  const all = req.nextUrl.searchParams.get('all') === 'true' && auth.session.user.role === 'admin';
  const orders = all ? await Order.find().sort({ createdAt: -1 }) : await Order.find({ userId: auth.session.user.id }).sort({ createdAt: -1 });
  return NextResponse.json({ orders });
}
