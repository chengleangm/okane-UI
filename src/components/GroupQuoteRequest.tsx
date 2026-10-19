'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
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
    <aside className="quote-review"><Link className="market-back" href="/creators"><ArrowLeft size={16} aria-hidden="true" />Add or change creators</Link><h1>Your quote selection</h1><p role="status">{selected.length} {selected.length === 1 ? 'creator' : 'creators'} in one request</p>
      <ul>{selected.map(creator => <li key={creator.slug}><Image src={creator.image} alt="" width={48} height={58} /><div><Link href={'/creators/' + creator.slug}>{creator.name}</Link><span>{creator.category}</span></div><button type="button" onClick={() => removeCreator(creator.slug)} aria-label={'Remove ' + creator.name + ' from this request'}><X size={17} aria-hidden="true" /></button></li>)}</ul>
      <p className="micro muted">Send one project brief and total budget for your selected creators. Demo only.</p>
    </aside>
    <RequestFlow selectedCreators={selected} />
  </main>;
}
