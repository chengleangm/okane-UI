import { CreatorDirectory } from '@/components/CreatorDirectory';
import '../landing.css';
import './creators.css';
export const metadata = { title: 'Our Creators' };
export default async function Creators({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.slice(0, 120) : '';
  return <main id="main" className="landing-shell creators-page"><CreatorDirectory key={query} initialQuery={query} /></main>;
}
