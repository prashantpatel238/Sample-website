import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  }
  return { session };
}

export async function requireAdmin() {
  const auth = await requireAuth();
  if ('error' in auth) return auth;
  if (auth.session.user.role !== 'admin') {
    return { error: NextResponse.json({ message: 'Forbidden' }, { status: 403 }) };
  }
  return auth;
}
