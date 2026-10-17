import { ArrowUpRight, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Creator } from '@/types/creator';

export function CreatorCard({ creator, saved, onToggleSaved }: { creator: Creator; saved: boolean; onToggleSaved: () => void }) {
  const href = '/creators/' + creator.slug;
  return <article className="market-card product-creator-card">
    <Link className="market-card-photo" href={href} aria-label={'View ' + creator.name + "'s profile"}>
      <Image src={creator.image} alt={creator.name + ' — illustrative demo portrait'} fill sizes="(max-width:600px) 45vw, (max-width:1100px) 30vw, 260px" />
      <span className="product-demo-tag">Demo</span>
    </Link>
    <div className="market-card-body">
      <h3 title={creator.name}><Link href={href}>{creator.name}</Link></h3>
      <p className="product-card-category" title={creator.category}>{creator.category}</p>
      <p className="product-card-description" title={creator.description}>{creator.description}</p>
    </div>
    <div className="product-card-footer">
      <Link className="product-profile-link" href={href}>View profile <ArrowUpRight size={15} aria-hidden="true" focusable="false" /></Link>
      <button className="creator-favorite" type="button" aria-label={(saved ? 'Remove ' : 'Save ') + creator.name + (saved ? ' from favorites' : ' to favorites')} aria-pressed={saved} title={saved ? 'Remove from favorites' : 'Save to favorites'} onClick={onToggleSaved}><Heart size={22} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" focusable="false" /></button>
    </div>
  </article>;
}
