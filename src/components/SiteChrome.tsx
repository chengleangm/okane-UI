'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuoteSelectionProvider } from './QuoteSelection';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/portal' || pathname.startsWith('/portal/');
  if (isPortal) return <div className="admin-layout">{children}</div>;
  return <QuoteSelectionProvider><Navbar />{children}<Footer /></QuoteSelectionProvider>;
}
