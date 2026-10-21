import { notFound } from 'next/navigation';
import { getCreator,creators } from '@/data/creators';
import { CreatorProfile } from '@/components/CreatorProfile';
import { RequestFlow } from '@/components/RequestFlow';
export const metadata={title:'Request work'};
export function generateStaticParams(){return creators.map(c=>({slug:c.slug}))}
export default async function Request({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const c=getCreator(slug);if(!c)notFound();return <main id="main" className="shell inner-page profile-layout quote-request-layout"><CreatorProfile creator={c} request/><RequestFlow key={c.slug} creator={c}/></main>}
