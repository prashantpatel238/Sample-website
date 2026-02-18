import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import Product from '@/models/Product';

const products = [
  { name: 'Aashirvaad Atta 5kg', slug: 'aashirvaad-atta-5kg', description: 'Whole wheat flour for soft rotis.', price: 280, category: 'Atta & Rice', stock: 40, image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600', featured: true },
  { name: 'Sunflower Oil 1L', slug: 'sunflower-oil-1l', description: 'Refined sunflower oil for healthy cooking.', price: 145, category: 'Oil & Ghee', stock: 50, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600', featured: true }
];

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('Missing MONGODB_URI');
  await mongoose.connect(uri, { dbName: 'smart-kirana-store' });

  await User.deleteMany({});
  await Product.deleteMany({});
  await User.create({
    name: 'Admin User',
    email: 'admin@smartkirana.store',
    password: await bcrypt.hash('Admin@123', 10),
    role: 'admin'
  });
  await Product.insertMany(products);

  console.log('Seed completed');
  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
