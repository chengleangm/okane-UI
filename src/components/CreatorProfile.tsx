import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SocialProfiles } from './SocialProfiles';
import { QuoteSelectButton } from './QuoteSelection';
import { CreatorRating } from './CreatorRating';
import type { Creator } from '@/types/creator';
export function CreatorProfile({ creator, request = false }: { creator: Creator; request?: boolean }) {
  return <aside className="profile marketplace-profile">
    <Link className="market-back" href={request ? '/creators/' + creator.slug : '/creators'}><ArrowLeft size={16} aria-hidden="true" />{request ? 'Back to profile' : 'Back to creators'}</Link>
    <div className="profile-info">
      <div className="profile-image"><Image src={creator.image} alt={creator.name + ' — illustrative portrait'} fill sizes="(max-width:600px) 110px, 300px" priority /></div>
      <div className="profile-details">
        <header className="profile-heading">
          <h1>{creator.name}</h1>
          <span className="market-card-category profile-category">{creator.category}</span>
          <CreatorRating rating={creator.rating} ratingCount={creator.ratingCount} />
        </header>
        <section className="profile-about">
          <h2>About this creator</h2>
          <p>{creator.description}</p>
          <p className="micro muted">Photography and profile details are illustrative. Audience and rates to be confirmed.</p>
        </section>
        <SocialProfiles creatorId={creator.slug} links={creator.socialLinks} followers={creator.socialFollowers} />
        <div className="profile-actions">
          <p className="profile-price">Pricing on request</p>
          {!request && <Link className="button profile-quote-button" href={'/request/' + creator.slug}>Request a Quote <ArrowUpRight size={16} aria-hidden="true" /></Link>}
          {!request && <QuoteSelectButton slug={creator.slug} />}
        </div>
      </div>
    </div>
  </aside>;
}
