import { Schema, model, models } from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  featured?: boolean;
  discount?: number;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      enum: ['Atta & Rice', 'Oil & Ghee', 'Pulses', 'Spices', 'Snacks', 'Beverages', 'Dairy', 'Personal Care'],
      required: true
    },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
    discount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Product = models.Product || model<IProduct>('Product', productSchema);
export default Product;
