import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
export function Footer(){return <footer className="footer shell"><span>© {new Date().getFullYear()} Okane Digital</span><Link href="/portal/login">Demo portal <ArrowUpRight className="arrow-icon" aria-hidden="true"/></Link><Link href="/creators">Meet the creators <ArrowUpRight className="arrow-icon" aria-hidden="true" focusable="false"/></Link></footer>}
