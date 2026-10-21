import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Bot, MessageCircle, Users } from 'lucide-react';
import { quoteDemoEnabled } from '@/lib/quote-demo';

export const metadata = { title: 'Quote Workflow Demo' };

export default function QuoteDemoControlPanel() {
  if (!quoteDemoEnabled) notFound();
  return <main id="main" className="shell inner-page quote-demo-control">
    <div className="quote-demo-banner"><Bot size={18} aria-hidden="true" /><span>DEVELOPMENT DEMO · SIMULATED TELEGRAM ONLY</span></div>
    <h1>Demo Control Panel</h1>
    <p className="quote-demo-control-intro">Walk through the quotation workflow using fictional data stored only in this browser. No real Telegram messages are sent, and demo requests do not enter production systems.</p>
    <div className="quote-demo-flow-steps" aria-label="Demo workflow">
      <span>Select creator</span><ArrowRight aria-hidden="true" /><span>Connect Telegram (Demo)</span><ArrowRight aria-hidden="true" /><span>Submit request</span><ArrowRight aria-hidden="true" /><span>Admin response</span><ArrowRight aria-hidden="true" /><span>Client rating</span>
    </div>
    <div className="quote-demo-role-grid">
      <article className="quote-demo-role-card">
        <div className="quote-demo-role-icon"><Users size={22} aria-hidden="true" /></div>
        <span className="quote-demo-step">CLIENT DEMO</span>
        <h2>Experience the request flow</h2>
        <p>Browse creators, select one or more, simulate a Telegram connection, submit a fictional quote request, then receive an admin response and leave a rating.</p>
        <Link className="button quote-demo-primary" href="/creators">Browse creators <ArrowRight size={16} aria-hidden="true" /></Link>
        <p className="quote-demo-role-note">After submitting, the confirmation page opens your simulated Telegram conversation. Keep its private session link to reopen it later.</p>
      </article>
      <article className="quote-demo-role-card">
        <div className="quote-demo-role-icon"><MessageCircle size={22} aria-hidden="true" /></div>
        <span className="quote-demo-step">ADMIN DEMO</span>
        <h2>Simulate the admin bot</h2>
        <p>Review local demo requests, select one, view its details, send a simulated reply, and see client ratings.</p>
        <Link className="button quote-demo-primary" href="/demo/admin">Open Admin Demo Simulator <ArrowRight size={16} aria-hidden="true" /></Link>
      </article>
    </div>
    <p className="quote-demo-storage-note"><strong>Storage and privacy:</strong> demo data is saved in this browser’s local storage. It is not secure and cannot synchronize with another device or browser. Use fictional test details only. Clear demo data from the admin simulator.</p>
  </main>;
}
