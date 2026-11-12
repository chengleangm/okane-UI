'use client';
import { Check, Play, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuoteSelection } from './QuoteSelection';
import { LandingArtwork } from './LandingArtwork';
import type { Creator } from '@/types/creator';
const referenceSlugs = ['neary-na-nary','ambrel','kalucas','michie','gabriel'];

export function CreatorCard({ creator }: { creator: Creator }) {
  const href = '/creators/' + creator.slug;
  const { selected, toggle, ready } = useQuoteSelection();
  const checked = selected.some(item => item.slug === creator.slug);
  const referenceIndex = referenceSlugs.indexOf(creator.slug);
  const rated = typeof creator.rating === 'number' && Number.isFinite(creator.rating) && creator.rating >= 0 && creator.rating <= 5;
  return <article className="v3-creator-card">
    <Link className="v3-creator-image" href={href} aria-label={`View ${creator.name}'s profile and work`}>
      {referenceIndex >= 0 ? <LandingArtwork crop={[26+referenceIndex*130.5,880,121,146]} /> : <Image src={creator.image} alt="" fill sizes="(max-width:600px) 45vw, (max-width:800px) 30vw, (max-width:1100px) 23vw, 18vw" />}
      <span className="v3-creator-play"><Play size={20} fill="currentColor" strokeWidth={1} aria-hidden="true" /></span>
    </Link>
    <button className="v3-quote-select" aria-label={`${checked ? 'Remove' : 'Select'} ${creator.name} for a quote`} aria-pressed={checked} disabled={!ready} onClick={() => toggle(creator.slug)}><Check size={14} aria-hidden="true" />{checked ? 'Selected' : 'Select'}</button>
    <h2><Link href={href}>{creator.name}</Link></h2>
    <p className="v3-creator-rating" data-unrated={!rated} aria-label={rated ? `Rated ${creator.rating!.toFixed(1)} out of 5` : 'Not rated yet'}><Star size={19} fill={rated ? 'currentColor' : 'none'} strokeWidth={rated ? 0 : 1.5} aria-hidden="true" />{rated ? creator.rating!.toFixed(1) : 'Not rated yet'}</p>
  </article>;
}
