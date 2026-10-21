import { creators } from '@/data/creators';
import { parseQuoteSlugs, resolveQuoteSelection } from '@/lib/quote-selection';
import { GroupQuoteRequest } from '@/components/GroupQuoteRequest';

export const metadata = { title: 'Request a group quote' };
export default async function GroupRequestPage({ searchParams }: { searchParams: Promise<{ creators?: string | string[] }> }) {
  const params = await searchParams;
  const selected = resolveQuoteSelection(parseQuoteSlugs(params.creators), creators);
  return <GroupQuoteRequest key={selected.map(creator => creator.slug).join(',')} initialCreators={selected} />;
}
