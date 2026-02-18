import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connectDB, isDatabaseReady } from '@/lib/db';
import Product from '@/models/Product';
import AddToCartButton from './productClient';
import { formatCurrency } from '@/utils/format';
import { sampleProducts } from '@/utils/sampleData';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  let product: any = sampleProducts.find((p) => p.slug === params.id);
  const dbReady = await isDatabaseReady();
  if (dbReady) {
    await connectDB();
    product = await Product.findOne({ slug: params.id }).lean();
  }

  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, images: [product.image] }
  };
}

export default async function ProductDetail({ params }: { params: { id: string } }) {
  let product: any = sampleProducts.find((p) => p.slug === params.id);

  const dbReady = await isDatabaseReady();
  if (dbReady) {
    await connectDB();
    const dbProduct = await Product.findOne({ slug: params.id }).lean();
    product = dbProduct ? { ...dbProduct, _id: dbProduct._id.toString() } : null;
  }

  if (!product) notFound();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    offers: { '@type': 'Offer', priceCurrency: 'INR', price: product.price }
  };

  return (
    <div className="container py-10">
      {!dbReady && <p className="mb-4 rounded bg-amber-100 p-2 text-sm text-amber-900">Preview mode: demo product details.</p>}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="grid gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
        <img src={product.image} alt={product.name} className="h-96 w-full rounded-xl object-cover" />
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.category}</p>
          <p className="mt-4 text-2xl font-bold text-brand-700">{formatCurrency(product.price)}</p>
          <p className="mt-4 leading-relaxed text-gray-700">{product.description}</p>
          <p className="mt-3 text-sm">Stock: <span className="font-semibold">{product.stock}</span></p>
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
