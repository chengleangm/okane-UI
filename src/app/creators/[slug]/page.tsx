import { notFound } from 'next/navigation';
import Image from 'next/image';
import { creators,getCreator } from '@/data/creators';
import { CreatorProfile } from '@/components/CreatorProfile';
export function generateStaticParams(){return creators.map(c=>({slug:c.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return {title:getCreator(slug)?.name??'Creator not found'}}
export default async function Profile({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=getCreator(slug);if(!c)notFound();return <main id="main" className="shell inner-page profile-layout"><CreatorProfile creator={c}/><section className="portfolio"><h2>{c.name}’s Content</h2><div className="content-grid">{[{src:'mountains',title:'The scenic route'},{src:'nature',title:'A moment outdoors'},{src:'sunset',title:'Chasing the last light'},{src:'landscape',title:'A different perspective'}].map((item,i)=><figure key={item.src} className={i===3?'wide':''}><Image src={`/images/${item.src}.jpg`} alt={item.title} fill sizes="(max-width:600px) 45vw, 30vw"/><figcaption>{item.title}<span>Sample photography</span></figcaption></figure>)}</div><p className="micro muted">Illustrative portfolio imagery. Creator video assets are not yet supplied.</p></section></main>}
