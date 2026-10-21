import { PortalLogin } from '@/components/portal/PortalLogin';
import { auth } from '@/auth';
import { isAdminAuthConfigured, isLocalDemoAdminEnabled } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin login', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const demoEnabled = isLocalDemoAdminEnabled();
  const configured = isAdminAuthConfigured() || demoEnabled;
  if (configured) {
    const session = await auth();
    if (session?.user) redirect('/admin');
  }
  const params = await searchParams;
  return <PortalLogin error={params.error} configured={configured} demoEnabled={demoEnabled} />;
}
