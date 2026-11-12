import Link from 'next/link';
import { ArrowLeft, Star } from 'lucide-react';
import { SocialProfiles } from './SocialProfiles';
import type { Creator } from '@/types/creator';

export function CreatorDetail({ creator, idPrefix = 'desktop' }: { creator: Creator; idPrefix?: string }) {
  const hasReferenceReviews = creator.slug === 'neary-na-nary';
  return <section className="v3-detail-info" aria-labelledby={`${idPrefix}-creator-name`}>
    <header className="v3-detail-heading"><Link href="/creators" aria-label="Back to Our Creators"><ArrowLeft size={24} aria-hidden="true" /></Link><h1 id={`${idPrefix}-creator-name`}>{creator.name}</h1></header>
    <SocialProfiles creatorId={creator.slug} links={creator.socialLinks} followers={creator.socialFollowers} variant="detail" />
    <div className="v3-detail-bio"><p className="v3-detail-category"><span><Star size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />{creator.rating?.toFixed(1) ?? 'Not rated yet'}</span><span>{creator.category} Content</span></p>{creator.totalViews !== undefined && <p className="v3-detail-views"><strong>{new Intl.NumberFormat('en',{notation:'compact'}).format(creator.totalViews)}</strong> Views total</p>}<h2>About {creator.name}</h2><p>{creator.description}</p><Link className="button" href={`/request/${creator.slug}`}>Request work</Link></div>
    <section className="v3-detail-reviews" aria-labelledby={`${idPrefix}-reviews-title`}><div className="v3-reviews-heading"><h2 id={`${idPrefix}-reviews-title`}>Reviews</h2>{hasReferenceReviews && <span>Sample reviews</span>}</div>
      {hasReferenceReviews ? [1,2,3].map(number => <article className="v3-review" key={number}><header><h3>Daplobe</h3><span aria-label="4 out of 5 stars"><Star size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />4</span></header><p>Had an amazing experience with Neary Na Nary, but it feels like she takes quite longer than i expected.</p></article>) : <p className="v3-reviews-empty">No reviews yet.</p>}
    </section>
  </section>;
}
