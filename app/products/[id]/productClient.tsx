'use client';

import toast from 'react-hot-toast';
import { IProduct } from '@/models/Product';
import { addToCart } from '@/store/cartSlice';
import { useAppDispatch } from '@/store/hooks';

export default function AddToCartButton({ product }: { product: IProduct }) {
  const dispatch = useAppDispatch();
  return (
    <button
      className="mt-6 rounded bg-brand-600 px-5 py-3 font-medium text-white"
      onClick={() => {
        dispatch(addToCart({ productId: product._id, name: product.name, price: product.price, quantity: 1, image: product.image }));
        toast.success('Product added to cart');
      }}
    >
      Add to Cart
    </button>
  );
}
