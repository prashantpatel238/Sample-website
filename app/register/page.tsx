'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setLoading(false);
    if (!res.ok) return toast.error((await res.json()).message || 'Registration failed');
    toast.success('Account created successfully');
    router.push('/login');
  };

  return (
    <div className="container py-12">
      <form onSubmit={submit} className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-brand-700">Register</h1>
        <input className="mt-4 w-full rounded border p-2" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input className="mt-3 w-full rounded border p-2" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="mt-3 w-full rounded border p-2" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
        <button className="mt-4 w-full rounded bg-brand-600 py-2 text-white" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
      </form>
    </div>
  );
}
