import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Product from '@/models/Product';

const products = [
  { name: 'Aashirvaad Atta 5kg', slug: 'aashirvaad-atta-5kg', description: 'Whole wheat flour for soft rotis.', price: 280, category: 'Atta & Rice', stock: 40, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600', featured: true },
  { name: 'Basmati Rice 1kg', slug: 'basmati-rice-1kg', description: 'Premium long grain basmati rice.', price: 150, category: 'Atta & Rice', stock: 65, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', featured: true },
  { name: 'Sunflower Oil 1L', slug: 'sunflower-oil-1l', description: 'Refined sunflower oil for healthy cooking.', price: 145, category: 'Oil & Ghee', stock: 50, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', featured: true },
  { name: 'Toor Dal 1kg', slug: 'toor-dal-1kg', description: 'High protein toor dal.', price: 120, category: 'Pulses', stock: 55, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600', featured: false },
  { name: 'Turmeric Powder 200g', slug: 'turmeric-powder-200g', description: 'Pure organic haldi powder.', price: 65, category: 'Spices', stock: 90, image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600', featured: false },
  { name: 'Masala Chips', slug: 'masala-chips', description: 'Crunchy and spicy chips.', price: 30, category: 'Snacks', stock: 120, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600', featured: true },
  { name: 'Mango Juice 1L', slug: 'mango-juice-1l', description: 'Refreshing mango beverage.', price: 90, category: 'Beverages', stock: 75, image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600', featured: false },
  { name: 'Fresh Paneer 200g', slug: 'fresh-paneer-200g', description: 'Soft and fresh paneer cubes.', price: 80, category: 'Dairy', stock: 45, image: 'https://images.unsplash.com/photo-1627063377043-d09f4cf3bb6e?w=600', featured: false }
];

export async function POST() {
  try {
    await connectDB();
    await User.deleteMany({});
    await Product.deleteMany({});
    await User.create({
      name: 'Admin User',
      email: 'admin@smartkirana.store',
      password: await bcrypt.hash('Admin@123', 10),
      role: 'admin'
    });
    await Product.insertMany(products);
    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Seed failed', error }, { status: 500 });
  }
}
