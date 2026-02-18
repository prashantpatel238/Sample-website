import { NextResponse } from 'next/server';
import { connectDB, isDbConfigured } from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAuth } from '@/lib/apiGuard';

export async function POST(req: Request) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  try {
    const { items, address, total, paymentMethod, paymentId } = await req.json();

    if (!isDbConfigured) {
      return NextResponse.json({ orderId: `demo-order-${Date.now()}`, message: 'Preview mode: order simulated.' }, { status: 201 });
    }

    await connectDB();

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return NextResponse.json({ message: `Insufficient stock for ${item.name}` }, { status: 400 });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const order = await Order.create({
      userId: auth.session.user.id,
      items,
      address,
      total,
      paymentMethod,
      paymentId,
      status: 'Pending'
    });

    return NextResponse.json({ orderId: order._id.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Checkout failed', error }, { status: 500 });
  }
}
