import type { Creator } from '@/types/creator';
import { QuoteDemoFlow } from './QuoteDemoFlow';

export function RequestFlow({ creator, selectedCreators }: { creator?: Creator; selectedCreators?: Creator[] }) {
  const creators = selectedCreators ?? (creator ? [creator] : []);
  return <QuoteDemoFlow creators={creators} variant={creator && !selectedCreators ? 'request' : undefined} />;
}
