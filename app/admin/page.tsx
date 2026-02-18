'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CATEGORIES } from '@/utils/constants';

interface ProductForm {
  _id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  featured: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<ProductForm[]>([]);
  const [form, setForm] = useState<ProductForm>({
    name: '', slug: '', description: '', price: 0, category: CATEGORIES[0], stock: 0, image: '', featured: false
  });

  const load = async () => {
    const [s, o, p] = await Promise.all([fetch('/api/admin/stats'), fetch('/api/orders?all=true'), fetch('/api/products')]);
    if (!s.ok) return toast.error('Admin access required');
    setStats(await s.json());
    setOrders((await o.json()).orders || []);
    setProducts((await p.json()).products || []);
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = form._id ? 'PUT' : 'POST';
    const url = form._id ? `/api/admin/products/${form._id}` : '/api/products';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (!res.ok) return toast.error('Failed to save product');
    toast.success('Product saved');
    setForm({ name: '', slug: '', description: '', price: 0, category: CATEGORIES[0], stock: 0, image: '', featured: false });
    load();
  };

  const deleteProduct = async (id: string) => {
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!res.ok) return toast.error('Delete failed');
    toast.success('Product deleted');
    load();
  };

  const updateOrder = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status })
    });
    if (!res.ok) return toast.error('Order update failed');
    toast.success('Order updated');
    load();
  };

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-brand-700">Admin Dashboard</h1>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-4 shadow">Users: <b>{stats.totalUsers}</b></div>
        <div className="rounded-xl bg-white p-4 shadow">Orders: <b>{stats.totalOrders}</b></div>
        <div className="rounded-xl bg-white p-4 shadow">Revenue: <b>₹{stats.totalRevenue}</b></div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="space-y-2 rounded-xl bg-white p-5 shadow">
          <h2 className="text-xl font-semibold">{form._id ? 'Edit' : 'Add'} Product</h2>
          <input className="w-full rounded border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="w-full rounded border p-2" placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          <textarea className="w-full rounded border p-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid gap-2 md:grid-cols-2">
            <input className="rounded border p-2" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required />
            <input className="rounded border p-2" placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required />
          </div>
          <select className="w-full rounded border p-2" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <input className="w-full rounded border p-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />Featured product</label>
          <button className="w-full rounded bg-brand-600 py-2 text-white">Save Product</button>
        </form>

        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="text-xl font-semibold">Manage Products</h2>
          <div className="mt-3 max-h-96 space-y-2 overflow-auto pr-1">
            {products.map((p) => (
              <div key={p._id} className="flex items-center justify-between rounded border p-2">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">₹{p.price} | Stock {p.stock}</p>
                </div>
                <div className="space-x-2 text-sm">
                  <button className="text-blue-600" onClick={() => setForm(p)}>Edit</button>
                  <button className="text-red-600" onClick={() => p._id && deleteProduct(p._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-5 shadow">
        <h2 className="text-xl font-semibold">Manage Orders</h2>
        <div className="mt-4 space-y-3">
          {orders.map((o) => (
            <div key={o._id} className="flex flex-wrap items-center justify-between gap-3 rounded border p-3">
              <div>
                <p className="font-medium">Order #{o._id.slice(-6)} - ₹{o.total}</p>
                <p className="text-sm text-gray-600">Status: {o.status}</p>
              </div>
              <select className="rounded border p-2" value={o.status} onChange={(e) => updateOrder(o._id, e.target.value)}>
                {['Pending', 'Packed', 'Shipped', 'Delivered'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
