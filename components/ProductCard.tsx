'use client';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { IProduct } from '@/models/Product';
import { addToCart } from '@/store/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { formatCurrency } from '@/utils/format';

export default function ProductCard({ product }: { product: IProduct }) {
  const dispatch = useAppDispatch();

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-lg">
      <img src={product.image} alt={product.name} className="h-44 w-full rounded-md object-cover" />
      <h3 className="mt-3 font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 text-lg font-bold text-brand-700">{formatCurrency(product.price)}</p>
      <div className="mt-3 flex gap-2">
        <Link href={`/products/${product.slug}`} className="flex-1 rounded border px-2 py-2 text-center text-sm">View</Link>
        <button
          onClick={() => {
            dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 }));
            toast.success('Added to cart');
          }}
          className="flex-1 rounded bg-brand-600 px-2 py-2 text-sm text-white"
        >
          Add
        </button>
      </div>
    </div>
  );
}
