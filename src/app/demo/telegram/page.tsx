import { notFound } from 'next/navigation';
import { QuoteDemoConversation } from '@/components/QuoteDemoConversation';
import { quoteDemoEnabled } from '@/lib/quote-demo';

export const metadata = { title: 'Telegram Conversation Simulator' };

export default function QuoteDemoTelegramPage() {
  if (!quoteDemoEnabled) notFound();
  return <main id="main" className="shell inner-page"><QuoteDemoConversation /></main>;
}
