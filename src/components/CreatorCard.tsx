'use client';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuoteSelection } from './QuoteSelection';
import { CreatorRating } from './CreatorRating';
import type { Creator } from '@/types/creator';

export function CreatorCard({ creator }: { creator: Creator }) {
  const href = '/creators/' + creator.slug;
  const { selected, toggle, ready } = useQuoteSelection();
  const checked = selected.some(item => item.slug === creator.slug);
  return <article className="market-card product-creator-card" data-quote-selected={checked}>
    <Link className="market-card-photo" href={href} aria-label={'View ' + creator.name + "'s profile"}>
      <Image src={creator.image} alt={creator.name + ' — illustrative portrait'} fill sizes="(max-width:600px) 90vw, (max-width:1000px) 45vw, 25vw" />
      <span className="product-demo-tag">Demo</span>
    </Link>
    <label className="quote-select-card"><input type="checkbox" aria-label={'Select ' + creator.name + ' for a quote'} checked={checked} disabled={!ready} onChange={() => toggle(creator.slug)} /><span>{checked ? 'Selected' : 'Select'}</span></label>
    <div className="market-card-body">
      <h3 title={creator.name}><Link href={href}>{creator.name}</Link></h3>
      <p className="product-card-category" title={creator.category}><span>{creator.category}</span></p>
      <p className="product-card-description" title={creator.description}>{creator.description}</p>
    </div>
    <div className="product-card-footer">
      <CreatorRating rating={creator.rating} ratingCount={creator.ratingCount} />
      <Link className="product-profile-link" href={href}><span>View Profile</span><ArrowUpRight size={16} aria-hidden="true" focusable="false" /></Link>
    </div>
  </article>;
}
