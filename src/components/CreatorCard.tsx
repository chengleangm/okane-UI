import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Creator } from '@/types/creator';
export function CreatorCard({ creator }: { creator: Creator }) {
  return <article className="market-card"><Link className="market-card-photo" href={'/creators/' + creator.slug} aria-label={'View ' + creator.name + "'s profile"}><Image src={creator.image} alt={creator.name + ' — illustrative demo portrait'} fill sizes="(max-width:600px) 100px, 240px" /></Link><div className="market-card-body"><span className="market-card-category">{creator.category}</span><h3><Link href={'/creators/' + creator.slug}>{creator.name}</Link></h3><p>{creator.description}</p><span className="market-card-demo">Demo profile</span></div><div className="market-card-actions"><span>Pricing on request</span><Link className="market-profile-link" href={'/creators/' + creator.slug}>View profile <ArrowUpRight size={16} aria-hidden="true" /></Link><Link className="market-quote-link" href={'/request/' + creator.slug}>Request a quote</Link></div></article>;
}
