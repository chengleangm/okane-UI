import { redirect } from 'next/navigation';
export const metadata = { title: 'Admin login', robots: { index: false, follow: false } };
export default function LoginPage() {
  redirect('/admin/login');
}
