import { PortalDashboard } from '@/components/portal/PortalDashboard';
import { auth } from '@/auth';
import { isAdminAuthConfigured } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Admin portal', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  if (!isAdminAuthConfigured()) redirect('/admin/login');
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
  return <PortalDashboard />;
}
