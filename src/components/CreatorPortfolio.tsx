'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ChevronUp, ChevronDown, ArrowLeft, Info, Star } from 'lucide-react';
import Link from 'next/link';
import type { Creator } from '@/types/creator';
import { LandingArtwork } from './LandingArtwork';

const portfolio = [
  { title: 'Hiking the mountain trail', image: null },
  { title: 'A moment outdoors', image: '/images/nature.jpg' },
  { title: 'Chasing the last light', image: '/images/sunset.jpg' },
  { title: 'A different perspective', image: '/images/landscape.jpg' },
];
export function CreatorPortfolio({ creator, onShowInfo, infoOpen }: { creator: Creator; onShowInfo: () => void; infoOpen: boolean }) {
  const [index,setIndex] = useState(0);
  const current = portfolio[index];
  function move(direction: number) { setIndex(value => (value+direction+portfolio.length)%portfolio.length); }
  return <section className="v3-portfolio" aria-label={`${creator.name}'s portfolio`} aria-roledescription="carousel" onKeyDown={event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {event.preventDefault();move(event.key === 'ArrowUp' ? -1 : 1);}
  }}>
    <div className="v3-portfolio-slide" role="group" aria-roledescription="slide" aria-label={`${index+1} of ${portfolio.length}: ${current.title}`}>
      {current.image ? <Image src={current.image} alt={current.title} fill sizes="(max-width:800px) 80vw, 32vw" /> : <LandingArtwork source="/images/creator-detail-reference.png" canvas={[1512,982]} crop={[792,138,447,794]} label={current.title} />}
    </div>
    <header className="v3-mobile-profile-header"><Link href="/creators" aria-label="Back to Our Creators"><ArrowLeft size={25} aria-hidden="true" /></Link><span>{creator.name}</span><button onClick={onShowInfo} aria-label={`About ${creator.name}`} aria-haspopup="dialog" aria-expanded={infoOpen} aria-controls="mobile-creator-info"><Info size={24} aria-hidden="true" /></button></header>
    <div className="v3-mobile-profile-caption"><p className="v3-mobile-rating"><Star size={19} fill="currentColor" strokeWidth={0} aria-hidden="true" />{creator.rating?.toFixed(1) ?? 'Not rated yet'}</p><p className="v3-mobile-category">{creator.category} Content</p>{creator.totalViews !== undefined && <p className="v3-mobile-views"><strong>{new Intl.NumberFormat('en',{notation:'compact'}).format(creator.totalViews)}</strong> Views total</p>}<Link className="button" href={`/request/${creator.slug}`}>Request work</Link></div>
    <div className="v3-portfolio-controls"><button onClick={() => move(-1)} aria-label="Previous portfolio image"><ChevronUp size={22} aria-hidden="true" /></button><button onClick={() => move(1)} aria-label="Next portfolio image"><ChevronDown size={22} aria-hidden="true" /></button></div>
    <p className="v3-sr-only" aria-live="polite">{current.title}, image {index+1} of {portfolio.length}</p>
  </section>;
}
