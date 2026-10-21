import { PortalDashboard } from '@/components/portal/PortalDashboard';
import { auth } from '@/auth';
import { isAdminAuthConfigured, isLocalDemoAdminEnabled } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin portal', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
const hello = 'world12';

export default async function AdminPage() {
  if (!isAdminAuthConfigured() && !isLocalDemoAdminEnabled()) redirect('/admin/login');
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <PortalDashboard />;
}
