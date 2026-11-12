import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star } from 'lucide-react';
import { LandingArtwork } from './LandingArtwork';
import { SocialProfiles } from './SocialProfiles';
import type { Creator } from '@/types/creator';
const referenceSlugs = ['neary-na-nary','ambrel','kalucas','michie','gabriel'];

export function RequestCreatorSummary({ creator }: { creator: Creator }) {
  const referenceIndex = referenceSlugs.indexOf(creator.slug);
  return <aside className="v3-request-summary" aria-labelledby="request-creator-title">
    <header className="v3-request-heading"><Link href={`/creators/${creator.slug}`} aria-label={`Back to ${creator.name}'s profile`}><ArrowLeft size={24} aria-hidden="true" /></Link><h1 id="request-creator-title">Request {creator.name}’s work</h1></header>
    <div className="v3-request-portrait">{referenceIndex >= 0 ? <LandingArtwork crop={[26+referenceIndex*130.5,880,121,146]} label={creator.name} /> : <Image src={creator.image} alt={creator.name} fill sizes="220px" />}</div>
    <SocialProfiles creatorId={creator.slug} links={creator.socialLinks} followers={creator.socialFollowers} variant="detail" />
    <div className="v3-detail-bio"><p className="v3-detail-category"><span><Star size={20} fill="currentColor" strokeWidth={0} aria-hidden="true" />{creator.rating?.toFixed(1) ?? 'Not rated yet'}</span><span>{creator.category} Content</span></p><h2>About {creator.name}</h2><p>{creator.description}</p></div>
  </aside>;
}
