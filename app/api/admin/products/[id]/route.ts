import { NextResponse } from 'next/server';
import { connectDB, isDbConfigured } from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/apiGuard';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const payload = await req.json();
  if (!isDbConfigured) {
    return NextResponse.json({ product: { ...payload, _id: params.id }, message: 'Preview mode: update simulated.' });
  }

  await connectDB();
  const product = await Product.findByIdAndUpdate(params.id, payload, { new: true });
  return NextResponse.json({ product });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  if (!isDbConfigured) {
    return NextResponse.json({ message: `Preview mode: deleted ${params.id} (simulated).` });
  }

  await connectDB();
  await Product.findByIdAndDelete(params.id);
  return NextResponse.json({ message: 'Deleted' });
}
