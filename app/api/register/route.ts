import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, isDbConfigured } from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    if (!isDbConfigured) {
      return NextResponse.json({ message: 'Preview mode: registration simulated successfully.' }, { status: 201 });
    }

    await connectDB();
    const exists = await User.findOne({ email });
    if (exists) return NextResponse.json({ message: 'Email already in use' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role: 'customer' });
    return NextResponse.json({ message: 'Registered successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Registration failed', error }, { status: 500 });
  }
}
