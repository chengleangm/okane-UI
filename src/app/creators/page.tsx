import { CreatorDirectory } from '@/components/CreatorDirectory';
export const metadata = { title: 'Browse creators' };
export default async function Creators({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q.slice(0, 120) : '';
  return <main id="main" className="shell inner-page"><CreatorDirectory key={query} initialQuery={query} /></main>;
}
