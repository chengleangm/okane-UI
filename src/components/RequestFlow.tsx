import Link from 'next/link';
import { ArrowUpRight, FileText } from 'lucide-react';
import type { Creator } from '@/types/creator';
import { quoteDemoEnabled } from '@/lib/quote-demo';
import { QuoteDemoFlow } from './QuoteDemoFlow';

export function RequestFlow({ creator, selectedCreators }: { creator?: Creator; selectedCreators?: Creator[] }) {
  const creators = selectedCreators ?? (creator ? [creator] : []);
  const creatorNames = creators.map(person => person.name).join(', ');

  if (quoteDemoEnabled) return <QuoteDemoFlow creators={creators} />;

  return <section className="request-panel request-status" aria-labelledby="request-status-title">
    <div className="request-status-icon"><FileText size={21} aria-hidden="true" /></div>
    <p className="request-status-label">Quote request status</p>
    <h2 id="request-status-title">Online quote requests aren’t available yet</h2>
    <p className="request-status-message">
      {creatorNames ? `Your selection: ${creatorNames}. ` : ''}
      This site can’t submit or save a quote request right now.
    </p>
    <p className="request-status-note">No project details are being collected or sent from this page.</p>
    <Link className="button request-status-action" href="/creators">Continue browsing creators <ArrowUpRight size={16} aria-hidden="true" /></Link>
  </section>;
}
