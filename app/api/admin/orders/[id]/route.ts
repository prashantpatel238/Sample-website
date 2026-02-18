import { NextResponse } from 'next/server';
import { connectDB, isDbConfigured } from '@/lib/db';
import Order from '@/models/Order';
import { requireAdmin } from '@/lib/apiGuard';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const { status } = await req.json();

  if (!isDbConfigured) {
    return NextResponse.json({ order: { _id: params.id, status }, message: 'Preview mode: order update simulated.' });
  }

  await connectDB();
  const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
  return NextResponse.json({ order });
}
