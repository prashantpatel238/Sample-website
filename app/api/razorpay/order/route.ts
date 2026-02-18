import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { requireAuth } from '@/lib/apiGuard';

const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_KEY_SECRET;

export async function POST(req: Request) {
  const auth = await requireAuth();
  if ('error' in auth) return auth.error;

  if (!keyId || !keySecret) {
    return NextResponse.json({ message: 'Razorpay keys not configured' }, { status: 500 });
  }

  try {
    const { amount } = await req.json();
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    });
    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create payment order', error }, { status: 500 });
  }
}
