import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/utils/constants';

export const metadata: Metadata = {
  title: 'Shop Products',
  description: 'Browse grocery products across all categories.'
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { search?: string; category?: string; sort?: string };
}) {
  await connectDB();
  const query: Record<string, unknown> = {};

  if (searchParams.search) {
    query.name = { $regex: searchParams.search, $options: 'i' };
  }
  if (searchParams.category && CATEGORIES.includes(searchParams.category)) {
    query.category = searchParams.category;
  }

  const sort = searchParams.sort === 'price_asc' ? { price: 1 } : searchParams.sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };
  const products = await Product.find(query).sort(sort).lean();

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-brand-700">All Products</h1>
      <form className="mt-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
        <input name="search" placeholder="Search products" defaultValue={searchParams.search} className="rounded border p-2" />
        <select name="category" defaultValue={searchParams.category || ''} className="rounded border p-2">
          <option value="">All Categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select name="sort" defaultValue={searchParams.sort || ''} className="rounded border p-2">
          <option value="">Latest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
        <button className="rounded bg-brand-600 px-4 py-2 text-white">Apply</button>
      </form>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product._id.toString()} product={{ ...product, _id: product._id.toString() }} />
        ))}
      </div>
    </div>
  );
}
