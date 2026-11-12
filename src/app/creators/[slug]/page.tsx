import { notFound } from 'next/navigation';
import { creators, getCreator } from '@/data/creators';
import { CreatorDetail } from '@/components/CreatorDetail';
import { CreatorExperience } from '@/components/CreatorExperience';
import '../../landing.css';
import '../creators.css';
import './detail.css';

export function generateStaticParams() { return creators.map(creator => ({slug:creator.slug})); }
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }) {
  const {slug} = await params;
  return {title:getCreator(slug)?.name ?? 'Creator not found'};
}
export default async function Profile({ params }: { params: Promise<{slug:string}> }) {
  const {slug} = await params;
  const creator = getCreator(slug);
  if (!creator) notFound();
  return <main id="main" className="landing-shell v3-detail-page"><CreatorExperience key={creator.slug} creator={creator} desktopDetails={<CreatorDetail creator={creator} />} mobileDetails={<CreatorDetail creator={creator} idPrefix="mobile" />} /></main>;
}
