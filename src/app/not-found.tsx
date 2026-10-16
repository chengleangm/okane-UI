import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
export default function NotFound(){return <main id="main" className="shell empty-state"><p>404</p><h1>This page went off-script.</h1><Link className="button" href="/creators">Meet our creators <ArrowUpRight className="arrow-icon" aria-hidden="true" focusable="false"/></Link></main>}
