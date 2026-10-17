"use client";
import { useRef, useState } from 'react';
import { LayoutGrid, List, RotateCcw, ArrowRight } from 'lucide-react';
import { creators } from '@/data/creators';
import { CreatorCard } from './CreatorCard';
import { Pagination } from './Pagination';
import { paginateItems } from '@/lib/pagination';

export function CreatorDirectory({ home = false, initialQuery = '' }: { home?: boolean; initialQuery?: string }) {
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState(initialQuery);
  const [view, setView] = useState<'grid' | 'list'>(home ? 'list' : 'grid');
  const categories = ['All', ...new Set(creators.map(c => c.category))];
  const filtered = creators.filter(c => (category === 'All' || c.category === category) && [c.name, c.category, c.description].join(' ').toLowerCase().includes(query.trim().toLowerCase())).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : 0);
  const pagination = paginateItems(filtered, page);
  function reset() { setCategory('All'); setQuery(''); setPage(1); }
  function changePage(next: number) {
    setPage(next);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: 'start' });
  }

  return <div className="market-directory">
    <section className="directory-heading">
      <span className="market-kicker">OKANE · CREATORS FOR SMALL BUSINESSES</span>
      {home ? <h2>Find the right creator for your business.</h2> : <h1>Browse creators</h1>}
      <p>Browse by category, check their work, and request a quote.</p>
      {query && <p className="directory-search-summary">Search results for <strong>“{query}”</strong></p>}
    </section>
    <div className="market-layout">
      <aside className="market-categories"><h2>Browse categories</h2><div className="market-category-options">{categories.map(c => <button key={c} aria-pressed={category === c} onClick={() => { setCategory(c); setPage(1); }}><span>{c === 'All' ? 'All creators' : c}</span><span className="category-count">{c === 'All' ? creators.length : creators.filter(person => person.category === c).length}</span></button>)}</div><div className="market-help"><h3>New to working with creators?</h3><p>Start with a profile. Check their sample work, then share what your business needs.</p><a href="#how-it-works">How it works <ArrowRight className="ui-icon" aria-hidden="true" focusable="false" /></a></div></aside>
      <section className="market-results" aria-label="Creator listings">
        <div className="market-results-bar"><div><h2 ref={resultsHeading} tabIndex={-1}>{category === 'All' ? 'All creators' : category}</h2><p role="status">{filtered.length} {filtered.length === 1 ? 'creator' : 'creators'} found</p></div><div className="market-view-tools"><label className="sort"><span>Sort</span><select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}><option value="featured">Featured</option><option value="name">Name A–Z</option></select></label><div className="view-switch" aria-label="Listing view"><button aria-label="List view" aria-pressed={view === 'list'} onClick={() => setView('list')}><List size={19} /></button><button aria-label="Grid view" aria-pressed={view === 'grid'} onClick={() => setView('grid')}><LayoutGrid size={18} /></button></div></div></div>
        {(query || category !== 'All') && <button className="market-reset" onClick={reset}><RotateCcw size={14} aria-hidden="true" /> Clear filters</button>}
        <div className={'market-listings ' + view} id="discover">{pagination.items.map(c => <CreatorCard key={c.slug} creator={c} />)}</div>
        <Pagination {...pagination} onPageChange={changePage} />
        {!filtered.length && <div className="portal-empty"><h2>No creators found</h2><p>Try a different keyword or browse all categories.</p><button className="button" onClick={reset}>Show all creators</button></div>}
        <p className="market-demo-note">Demo listings · Photos and profile details are examples. Pricing is available on request.</p>
      </section>
    </div>
    <section className="market-steps" id="how-it-works"><h2>From browsing to your next project</h2><div>{[['01', 'Find a creator', 'Search or choose a category that fits your business.'], ['02', 'Check their work', 'Open a profile to see their style and sample content.'], ['03', 'Request a quote', 'Share your project details using the request form.']].map(([number, title, copy]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}</div><p className="market-demo-note">This is a demo website. Requests are simulated and are not sent to creators.</p></section>
  </div>;
}
