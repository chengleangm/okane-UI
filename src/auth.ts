import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { isAdminAuthConfigured, isDemoAdminCredential, verifyAdminPassword } from '@/lib/admin-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET || 'okane-public-demo-auth-secret-not-for-production',
  trustHost: process.env.AUTH_TRUST_HOST === 'true' || process.env.NODE_ENV === 'development' || process.env.VERCEL === '1',
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email address', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') return null;

        if (isDemoAdminCredential(credentials.email, credentials.password)) {
          return { id: 'demo-admin', email: 'demo@okane.local', name: 'OKANE Demo Admin' };
        }
        if (!isAdminAuthConfigured()) return null;

        const adminEmail = process.env.ADMIN_EMAIL!.trim().toLowerCase();
        if (credentials.email.trim().toLowerCase() !== adminEmail) return null;
        if (!await verifyAdminPassword(credentials.password, process.env.ADMIN_PASSWORD_HASH!)) return null;

        return { id: adminEmail, email: adminEmail, name: 'OKANE Admin' };
      },
    }),
  ],
});
