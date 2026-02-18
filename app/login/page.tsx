'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (result?.error) return toast.error(result.error);
    toast.success('Logged in successfully');
    router.push('/');
  };

  return (
    <div className="container py-12">
      <form onSubmit={submit} className="mx-auto max-w-md rounded-xl bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-brand-700">Login</h1>
        <input className="mt-4 w-full rounded border p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="mt-3 w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="mt-4 w-full rounded bg-brand-600 py-2 text-white" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
        <p className="mt-4 text-sm">New user? <Link className="text-brand-700" href="/register">Create account</Link></p>
      </form>
    </div>
  );
}
