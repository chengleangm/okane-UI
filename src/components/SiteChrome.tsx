'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname === '/portal' || pathname.startsWith('/portal/');
  if (isPortal) return <div className="admin-layout">{children}</div>;
  return <><Navbar />{children}<Footer /></>;
}
