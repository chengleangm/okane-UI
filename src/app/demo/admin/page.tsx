import { notFound } from 'next/navigation';
import { QuoteDemoAdmin } from '@/components/QuoteDemoAdmin';
import { quoteDemoEnabled } from '@/lib/quote-demo';

export const metadata = { title: 'Admin Quote Simulator' };

export default function QuoteDemoAdminPage() {
  if (!quoteDemoEnabled) notFound();
  return <QuoteDemoAdmin />;
}
