import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB, isDatabaseReady } from '@/lib/db';
import User from '@/models/User';

function authorizeDemo(credentials: { email?: string; password?: string }) {
  if (credentials.email === 'admin@smartkirana.store' && credentials.password === 'Admin@123') {
    return { id: 'demo-admin', name: 'Demo Admin', email: credentials.email, role: 'admin' };
  }
  if (credentials.email === 'customer@smartkirana.store' && credentials.password === 'Customer@123') {
    return { id: 'demo-customer', name: 'Demo Customer', email: credentials.email, role: 'customer' };
  }
  throw new Error('Demo credentials: admin@smartkirana.store / Admin@123');
}

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Email and password are required');
        }

        const dbReady = await isDatabaseReady();
        if (!dbReady) {
          return authorizeDemo(credentials);
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+password');
        if (!user) throw new Error('Invalid email or password');

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error('Invalid email or password');

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.role = user.role;
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = (token.role as string) || 'customer';
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || 'dev-secret-for-local-preview'
};
