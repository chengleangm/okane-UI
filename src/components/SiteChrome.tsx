'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { QuoteSelectionProvider } from './QuoteSelection';
import Link from 'next/link';
import { LandingArtwork } from './LandingArtwork';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname === '/admin' || pathname.startsWith('/admin/') || pathname === '/portal' || pathname.startsWith('/portal/');
  if (isPortal) return <div className="admin-layout">{children}</div>;
  if (pathname === '/' || pathname === '/creators' || pathname.startsWith('/creators/') || pathname.startsWith('/request/')) return <QuoteSelectionProvider>
    <header className="landing-shell landing-nav"><Link href="/" aria-label="Okane home"><LandingArtwork crop={[26,16,24,25]} className="landing-logo" /></Link><nav aria-label="Main navigation"><Link href="/creators">Our Creators</Link><button popoverTarget="creator-application">Apply as Creator</button></nav></header>
    {children}
    <footer className="landing-footer">© {new Date().getFullYear()} Okane, Cambodia</footer>
    <section id="creator-application" popover="auto" className="landing-application" aria-labelledby="application-title"><div><button className="landing-application-close" popoverTarget="creator-application" popoverTargetAction="hide" aria-label="Close creator application information">Close</button><h2 id="application-title">Apply as Creator</h2><p>Creator applications are not open on this demo yet. Check back soon to join Okane.</p><Link href="/creators" className="button">Explore our creators</Link></div></section>
  </QuoteSelectionProvider>;
  return <QuoteSelectionProvider><Navbar />{children}<Footer /></QuoteSelectionProvider>;
}
