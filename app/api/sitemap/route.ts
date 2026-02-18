import { NextResponse } from 'next/server';
import { connectDB, isDatabaseReady } from '@/lib/db';
import Product from '@/models/Product';
import { sampleProducts } from '@/utils/sampleData';

export async function GET() {
  const base = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  let slugs = sampleProducts.map((p) => p.slug);

  if (await isDatabaseReady()) {
    await connectDB();
    const products = await Product.find({}, { slug: 1 });
    slugs = products.map((p) => p.slug);
  }

  const urls = ['/', '/products', '/login', '/register', ...slugs.map((slug) => `/products/${slug}`)]
    .map((path) => `<url><loc>${base}${path}</loc></url>`)
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/xml' } });
}
