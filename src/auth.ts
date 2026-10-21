import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { isAdminAuthConfigured, verifyAdminPassword } from '@/lib/admin-auth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === 'true' || process.env.NODE_ENV === 'development',
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email address', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!isAdminAuthConfigured()) return null;
        if (typeof credentials.email !== 'string' || typeof credentials.password !== 'string') return null;

        const adminEmail = process.env.ADMIN_EMAIL!.trim().toLowerCase();
        if (credentials.email.trim().toLowerCase() !== adminEmail) return null;
        if (!await verifyAdminPassword(credentials.password, process.env.ADMIN_PASSWORD_HASH!)) return null;

        return { id: adminEmail, email: adminEmail, name: 'OKANE Admin' };
      },
    }),
  ],
});
