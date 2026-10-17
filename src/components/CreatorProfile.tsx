import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SocialProfiles } from './SocialProfiles';
import type { Creator } from '@/types/creator';
export function CreatorProfile({ creator, request = false }: { creator: Creator; request?: boolean }) {
  return <aside className="profile marketplace-profile">
    <Link className="market-back" href={request ? '/creators/' + creator.slug : '/creators'}><ArrowLeft size={16} aria-hidden="true" />{request ? 'Back to profile' : 'Back to creators'}</Link>
    <div className="profile-info">
      <div className="profile-image"><Image src={creator.image} alt={creator.name + ' — demo portrait'} fill sizes="(max-width:600px) 110px, 300px" priority /></div>
      <div><span className="market-card-category">{creator.category}</span><h1>{creator.name}</h1><span className="micro muted">Demo profile</span><h2>About this creator</h2><p>{creator.description}</p><p className="micro muted">Illustrative photo and sample details. Audience and rates to be confirmed.</p><SocialProfiles creatorId={creator.slug} links={creator.socialLinks} followers={creator.socialFollowers} /><p className="profile-price">Pricing on request</p>{!request && <Link className="button" href={'/request/' + creator.slug}>Request a quote <ArrowUpRight size={16} aria-hidden="true" /></Link>}</div>
    </div>
  </aside>;
}
