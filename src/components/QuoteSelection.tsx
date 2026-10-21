'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Check, Users, X } from 'lucide-react';
import { creators } from '@/data/creators';
import type { Creator } from '@/types/creator';
import { QUOTE_SELECTION_KEY, parseQuoteSlugs, resolveQuoteSelection } from '@/lib/quote-selection';

type Selection = { selected: Creator[]; ready: boolean; toggle: (slug: string) => void; remove: (slug: string) => void; replace: (slugs: string[]) => void; clear: () => void };
const QuoteContext = createContext<Selection | null>(null);

export function useQuoteSelection() {
  const value = useContext(QuoteContext);
  if (!value) throw new Error('Quote selection requires its provider');
  return value;
}

export function QuoteSelectionProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const pathname = usePathname();
  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(sessionStorage.getItem(QUOTE_SELECTION_KEY) || '[]');
      if (Array.isArray(stored) && stored.every(item => typeof item === 'string')) setSlugs(resolveQuoteSelection(parseQuoteSlugs(stored), creators).map(creator => creator.slug));
    } catch { /* Selection works even when storage is unavailable. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { sessionStorage.setItem(QUOTE_SELECTION_KEY, JSON.stringify(slugs)); }
    catch { setNotice('Your selection is kept for this page visit only.'); }
  }, [slugs, ready]);
  const toggle = useCallback((slug: string) => {
    if (!creators.some(creator => creator.slug === slug)) return;
    setSlugs(current => current.includes(slug) ? current.filter(item => item !== slug) : [...current, slug]);
  }, []);
  const remove = useCallback((slug: string) => setSlugs(current => current.filter(item => item !== slug)), []);
  const replace = useCallback((next: string[]) => setSlugs(resolveQuoteSelection(next, creators).map(creator => creator.slug)), []);
  const clear = useCallback(() => setSlugs([]), []);
  const selected = resolveQuoteSelection(slugs, creators);
  const showTray = selected.length > 0 && !pathname.startsWith('/request');
  return <QuoteContext.Provider value={{ selected, ready, toggle, remove, replace, clear }}>
    <div className={showTray ? 'has-quote-tray' : undefined}>{children}</div>
    {showTray && <aside className="quote-tray" aria-label="Creators selected for a quote">
      <div className="quote-tray-top"><span role="status"><Users size={18} aria-hidden="true" />{selected.length} {selected.length === 1 ? 'creator' : 'creators'} selected</span><button type="button" onClick={clear}>Clear all</button></div>
      <div className="quote-tray-bottom"><div className="quote-selection-chips">{selected.map(creator => <button key={creator.slug} type="button" onClick={() => remove(creator.slug)} aria-label={'Remove ' + creator.name + ' from quote'}>{creator.name}<X size={14} aria-hidden="true" /></button>)}</div><Link className="button" href={'/request?creators=' + encodeURIComponent(selected.map(creator => creator.slug).join(','))}>Request quote <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
      {notice && <p className="micro" role="status">{notice}</p>}
    </aside>}
  </QuoteContext.Provider>;
}

export function QuoteSelectButton({ slug }: { slug: string }) {
  const { selected, toggle, ready } = useQuoteSelection();
  const checked = selected.some(creator => creator.slug === slug);
  return <button type="button" className="quote-select-profile" aria-pressed={checked} disabled={!ready} onClick={() => toggle(slug)}><Check size={16} aria-hidden="true" />{checked ? 'Selected for group quote' : 'Add to group quote'}</button>;
}
