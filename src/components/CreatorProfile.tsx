import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Creator } from '@/types/creator';
export function CreatorProfile({creator,request=false}:{creator:Creator;request?:boolean}){return <aside className="profile"><h1>{creator.name}</h1><div className="profile-info"><div className="profile-image"><Image src={creator.image} alt={`${creator.name} — demo portrait`} fill sizes="(max-width:600px) 35vw, 220px" priority/></div><div><h2>{creator.category} Content</h2><span className="micro">Demo profile</span><h3>About {creator.name}</h3><p>{creator.description}</p><p className="micro muted">Illustrative photo and sample details. Audience and rates to be confirmed.</p>{!request&&<Link className="button" href={`/request/${creator.slug}`}>Request work <span><ArrowUpRight className="arrow-icon" aria-hidden="true" focusable="false"/></span></Link>}</div></div></aside>}
