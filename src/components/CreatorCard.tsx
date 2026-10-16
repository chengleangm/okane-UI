import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Creator } from '@/types/creator';
export function CreatorCard({creator}:{creator:Creator}){return <Link className="creator-card" href={`/creators/${creator.slug}`}><div className="creator-photo"><Image src={creator.image} alt={`${creator.name} — illustrative demo portrait`} fill sizes="(max-width:600px) 45vw, (max-width:900px) 30vw, 20vw"/><span className="card-arrow" aria-hidden="true"><ArrowUpRight className="arrow-icon" aria-hidden="true" focusable="false"/></span></div><h2>{creator.name}</h2><p>{creator.category} <span>· Demo profile</span></p></Link>}
