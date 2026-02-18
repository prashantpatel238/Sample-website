import Link from 'next/link';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import { CATEGORIES } from '@/utils/constants';

export default async function HomePage() {
  await connectDB();
  const featured = await Product.find({ featured: true }).limit(8).lean();

  return (
    <div>
      <section className="bg-gradient-to-r from-brand-700 to-brand-500 py-16 text-white">
        <div className="container grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Fresh Groceries for Every Home</h1>
            <p className="mt-4 text-lg text-green-100">Order daily essentials from your trusted Kirana store and get lightning-fast delivery.</p>
            <Link href="/products" className="mt-6 inline-block rounded bg-white px-6 py-3 font-semibold text-brand-700">Shop Now</Link>
          </div>
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200" alt="Groceries" className="h-72 w-full rounded-2xl object-cover shadow-xl" />
        </div>
      </section>

      <section className="container py-14">
        <SectionTitle title="Featured Products" subtitle="Best picks for your kitchen" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product._id.toString()} product={{ ...product, _id: product._id.toString() }} />
          ))}
        </div>
      </section>

      <section className="container py-14">
        <SectionTitle title="Categories" />
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link key={category} href={`/products?category=${encodeURIComponent(category)}`} className="rounded-xl bg-white p-5 text-center font-medium shadow-sm ring-1 ring-green-100 transition hover:bg-brand-50">
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <SectionTitle title="Offers" />
        <div className="grid gap-4 md:grid-cols-3">
          {['10% OFF on first order', 'Free delivery above ₹499', 'Weekend mega discounts'].map((offer) => (
            <div key={offer} className="rounded-xl border border-green-100 bg-white p-6 text-center shadow-sm">
              <p className="text-lg font-semibold text-brand-700">{offer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-14">
        <SectionTitle title="Testimonials" />
        <div className="grid gap-4 md:grid-cols-3">
          {['Great quality products and very fast delivery!', 'Best Kirana app in our locality.', 'Super fresh vegetables and dairy every time.'].map((text, i) => (
            <blockquote key={text} className="rounded-xl bg-white p-6 shadow-sm">
              <p>“{text}”</p>
              <footer className="mt-3 text-sm text-gray-500">Customer {i + 1}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
