import { IProduct } from '@/models/Product';
import products from '@/data/products.json';
import orders from '@/data/orders.json';
import offers from '@/data/offers.json';
import testimonials from '@/data/testimonials.json';

export interface DemoOrder {
  _id: string;
  total: number;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered';
  paymentMethod: 'cod' | 'razorpay';
}

export const sampleProducts = products as IProduct[];
export const sampleOrders = orders as DemoOrder[];
export const sampleOffers = offers as string[];
export const sampleTestimonials = testimonials as string[];
