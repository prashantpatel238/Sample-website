if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = 'dev-secret-for-local-preview';
}

export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/checkout/:path*', '/orders/:path*', '/admin/:path*']
};
