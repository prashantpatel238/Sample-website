import { Schema, model, models } from 'mongoose';

interface OrderItem {
  productId: Schema.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder {
  _id: string;
  userId: Schema.Types.ObjectId;
  items: OrderItem[];
  address: {
    fullName: string;
    phone: string;
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'razorpay' | 'cod';
  paymentId?: string;
  total: number;
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered';
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true }
      }
    ],
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], required: true },
    paymentId: { type: String },
    total: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Packed', 'Shipped', 'Delivered'], default: 'Pending' }
  },
  { timestamps: true }
);

const Order = models.Order || model<IOrder>('Order', orderSchema);
export default Order;
