import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, isDatabaseReady } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';
import { sampleProducts } from '@/utils/sampleData';

export async function POST() {
  try {
    if (!(await isDatabaseReady())) {
      return NextResponse.json({ message: 'Preview mode: configure MONGODB_URI to seed real database.' }, { status: 400 });
    }

    await connectDB();
    await User.deleteMany({});
    await Product.deleteMany({});
    await User.create({
      name: 'Admin User',
      email: 'admin@smartkirana.store',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'admin'
    });
    await Product.insertMany(sampleProducts.map(({ _id, ...rest }) => rest));
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Seed failed', error }, { status: 500 });
  }
}
