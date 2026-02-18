import { Metadata } from 'next';
import { connectDB, isDatabaseReady } from '@/lib/db';
import Product from '@/models/Product';
import ProductCard from '@/components/ProductCard';
import { CATEGORIES } from '@/utils/constants';
import { sampleProducts } from '@/utils/sampleData';

export const metadata: Metadata = {
  title: 'Shop Products',
  description: 'Browse grocery products across all categories.'
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { search?: string; category?: string; sort?: string };
}) {
  const dbReady = await isDatabaseReady();

  if (dbReady) {
    await connectDB();
    const query: Record<string, unknown> = {};

    if (searchParams.search) query.name = { $regex: searchParams.search, $options: 'i' };
    if (searchParams.category && CATEGORIES.includes(searchParams.category)) query.category = searchParams.category;

    const sort = searchParams.sort === 'price_asc' ? { price: 1 } : searchParams.sort === 'price_desc' ? { price: -1 } : { createdAt: -1 };
    const products = await Product.find(query).sort(sort).lean();

    return (
      <ProductListView
        products={products.map((product) => ({ ...product, _id: product._id.toString() }))}
        searchParams={searchParams}
        dbReady={dbReady}
      />
    );
  }

  let products = [...sampleProducts];
  if (searchParams.search) products = products.filter((p) => p.name.toLowerCase().includes(searchParams.search!.toLowerCase()));
  if (searchParams.category && CATEGORIES.includes(searchParams.category)) products = products.filter((p) => p.category === searchParams.category);
  if (searchParams.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
  if (searchParams.sort === 'price_desc') products.sort((a, b) => b.price - a.price);

  return <ProductListView products={products} searchParams={searchParams} dbReady={dbReady} />;
}

function ProductListView({ products, searchParams, dbReady }: { products: any[]; searchParams: { search?: string; category?: string; sort?: string }; dbReady: boolean }) {
  return (
    <div className="container py-10">
      {!dbReady && (
        <p className="mb-4 rounded bg-amber-100 p-2 text-sm text-amber-900">Showing demo catalog (database not configured).</p>
      )}
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
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
