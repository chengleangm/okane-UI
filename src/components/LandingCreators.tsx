'use client';
import { useState } from 'react';
import Link from 'next/link';
import { creators } from '@/data/creators';
import { LandingArtwork } from './LandingArtwork';

// Reference metrics belong to this landing demo, not shared creator data.
const featured = creators.slice(0,5).map((creator,index) => ({
  ...creator, views:45_000_000, crop:[26 + index * 130.5,880,121,146] as [number,number,number,number],
}));
export function LandingCreators() {
  const [sort,setSort] = useState('views');
  const ordered = [...featured].sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : b.views-a.views);
  return <section id="our-creators" className="landing-shell landing-creators" aria-labelledby="creators-title">
    <div className="landing-creators-heading"><h2 id="creators-title">Our Creators</h2><label className="landing-sort">Sort by<select value={sort} onChange={event => setSort(event.target.value)} aria-label="Sort creators"><option value="views">Views</option><option value="name">Name</option></select></label></div>
    <div className="landing-creator-grid">{ordered.map(creator => <Link href={`/creators/${creator.slug}`} key={creator.slug} className="landing-creator"><LandingArtwork crop={creator.crop} /><h3>{creator.name}</h3><p>45M<span>Views total</span></p></Link>)}</div>
  </section>;
}
