import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();
  const products = await Product.find({}, { slug: 1 });
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';

  const urls = ['/', '/products', '/login', '/register', ...products.map((p) => `/products/${p.slug}`)]
    .map((path) => `<url><loc>${base}${path}</loc></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
