import { PortalLogin } from '@/components/portal/PortalLogin';
import { auth } from '@/auth';
import { isAdminAuthConfigured } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin login', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const configured = isAdminAuthConfigured();
  if (configured) {
    const session = await auth();
    if (session?.user) redirect('/admin');
  }
  const params = await searchParams;
  return <PortalLogin error={params.error} configured={configured} />;
}
