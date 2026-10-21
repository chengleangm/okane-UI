'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, ArrowUpRight, Users, Search } from 'lucide-react';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  return <header className="nav shell">
    <Link href="/" className="brand" aria-label="Okane Digital home" onClick={() => setOpen(false)}><Image src="/images/okane-logo.png" alt="OKANE - Local Stories, Greater Markets" width={4757} height={1676} sizes="(max-width: 600px) 110px, 145px" priority /></Link>
    <form className="nav-search" role="search" action="/creators" onSubmit={() => setOpen(false)}>
      <input type="search" name="q" aria-label="Search creators" placeholder="Search creators…" maxLength={120} />
      <button type="submit" aria-label="Find creators"><Search size={18} aria-hidden="true" focusable="false" /></button>
    </form>
    <button className="menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="navigation" onClick={() => setOpen(!open)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    <nav id="navigation" className={open ? 'nav-links open' : 'nav-links'}>
      <Link href="/creators" aria-current={path.startsWith('/creators') ? 'page' : undefined} onClick={() => setOpen(false)}><Users className="ui-icon" aria-hidden="true" /> Browse creators</Link>
      <Link href="/#how-it-works" onClick={() => setOpen(false)}>How it works <ArrowUpRight className="arrow-icon" aria-hidden="true" /></Link>
    </nav>
  </header>;
}
