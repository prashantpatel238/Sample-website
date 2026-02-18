import { NextResponse } from 'next/server';
import { connectDB, isDatabaseReady } from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/apiGuard';
import { sampleProducts } from '@/utils/sampleData';

export async function GET() {
  if (!(await isDatabaseReady())) return NextResponse.json({ products: sampleProducts });

  await connectDB();
  const products = await Product.find().sort({ createdAt: -1 });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  if (!(await isDatabaseReady())) {
    const payload = await req.json();
    return NextResponse.json({ product: { ...payload, _id: `demo-${Date.now()}` }, message: 'Preview mode: product not persisted.' }, { status: 201 });
  }

  try {
    const payload = await req.json();
    await connectDB();
    const product = await Product.create(payload);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create product', error }, { status: 500 });
  }
}
