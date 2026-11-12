import { notFound } from 'next/navigation';
import { getCreator, creators } from '@/data/creators';
import { RequestCreatorSummary } from '@/components/RequestCreatorSummary';
import { RequestFlow } from '@/components/RequestFlow';
import '../../landing.css';
import '../../creators/[slug]/detail.css';
import './request.css';
export const metadata = {title:'Request work'};
export function generateStaticParams() { return creators.map(creator => ({slug:creator.slug})); }
export default async function Request({params}:{params:Promise<{slug:string}>}) {
  const {slug} = await params;
  const creator = getCreator(slug);
  if (!creator) notFound();
  return <main id="main" className="landing-shell v3-request-page"><RequestCreatorSummary creator={creator} /><RequestFlow key={creator.slug} creator={creator} /></main>;
}
