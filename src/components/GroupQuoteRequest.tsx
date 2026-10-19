'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, FileText, Plus, Users, X } from 'lucide-react';
import type { Creator } from '@/types/creator';
import { RequestFlow } from './RequestFlow';
import { useQuoteSelection } from './QuoteSelection';

export function GroupQuoteRequest({ initialCreators }: { initialCreators: Creator[] }) {
  const [selected, setSelected] = useState(initialCreators);
  const { ready, replace, remove } = useQuoteSelection();
  useEffect(() => {
    if (ready) replace(initialCreators.map(creator => creator.slug));
  }, [ready, replace, initialCreators]);
  function removeCreator(slug: string) {
    const next = selected.filter(creator => creator.slug !== slug);
    setSelected(next);
    remove(slug);
    window.history.replaceState(null, '', next.length ? '/request?creators=' + encodeURIComponent(next.map(creator => creator.slug).join(',')) : '/request');
  }
  if (!selected.length) return <main id="main" className="shell inner-page quote-empty"><h1>Select creators for your quote</h1><p>Choose one or more creators, then request a quote for the whole group.</p><Link className="button" href="/creators">Browse creators</Link></main>;
  return <main id="main" className="shell inner-page profile-layout group-quote-layout">
    <aside className="quote-review" aria-labelledby="quote-selection-heading">
      <div className="quote-review-header">
        <Link className="market-back" href="/creators"><ArrowLeft size={15} aria-hidden="true" />Browse creators</Link>
        <div className="quote-review-eyebrow"><Users size={15} aria-hidden="true" />YOUR SHORTLIST</div>
        <div className="quote-review-heading"><h1 id="quote-selection-heading">Selected creators</h1><span className="quote-count-badge" role="status" aria-label={selected.length + ' creators selected'}>{selected.length}</span></div>
        <p>A great team for your next project.</p>
      </div>
      <ul className="quote-review-list" aria-label="Creators included in your quote">{selected.map(creator => <li key={creator.slug}>
        <Link className="quote-person-photo" href={'/creators/' + creator.slug} aria-label={'View ' + creator.name + ' profile'}><Image src={creator.image} alt="" width={64} height={72} /></Link>
        <div className="quote-person-copy"><Link href={'/creators/' + creator.slug} title={creator.name}>{creator.name}</Link><span className="quote-category-pill">{creator.category}</span></div>
        <button className="quote-remove-person" type="button" onClick={() => removeCreator(creator.slug)} aria-label={'Remove ' + creator.name + ' from this request'} title={'Remove ' + creator.name}><X size={16} aria-hidden="true" /></button>
      </li>)}</ul>
      <div className="quote-review-footer">
        <Link className="quote-add-more" href="/creators"><Plus size={17} aria-hidden="true" />Add more creators</Link>
        <div className="quote-brief-note"><FileText size={18} aria-hidden="true" /><div><strong>One brief for everyone</strong><p>Your project details and total budget apply to all selected creators.</p></div></div>
        <span className="quote-review-demo">Demo request ? nothing is sent</span>
      </div>
    </aside>
    <RequestFlow selectedCreators={selected} />
  </main>;
}
