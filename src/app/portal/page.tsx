import { redirect } from 'next/navigation';
export const metadata = { title: 'Admin portal', robots: { index: false, follow: false } };
export default function PortalPage() {
  redirect('/admin');
}
