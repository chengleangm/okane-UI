'use client';
import { useRef, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { creators } from '@/data/creators';
import { CreatorCard } from './CreatorCard';
import { paginateItems } from '@/lib/pagination';

export function CreatorDirectory({ initialQuery = '' }: { initialQuery?: string }) {
  const [sort, setSort] = useState('rating');
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState(initialQuery);
  const heading = useRef<HTMLHeadingElement>(null);
  const filtered = creators.filter(creator => [creator.name, creator.category, creator.description].join(' ').toLowerCase().includes(query.trim().toLowerCase())).sort((a,b) => sort === 'name' ? a.name.localeCompare(b.name) : (b.rating ?? -1) - (a.rating ?? -1));
  const pagination = paginateItems(filtered, page, 30);
  const pages = Array.from({length:pagination.totalPages},(_,index) => index+1).filter(number => number === 1 || number === pagination.totalPages || Math.abs(number-pagination.page) <= 1);
  function changePage(next: number) {
    setPage(next);
    heading.current?.focus({preventScroll:true});
    heading.current?.scrollIntoView({block:'start'});
  }
  return <div className="v3-directory">
    <header className="v3-directory-heading"><h1 ref={heading} tabIndex={-1}>Our Creators</h1><div className="v3-directory-tools">
      <label className="v3-directory-search"><Search size={22} aria-hidden="true" /><span className="v3-sr-only">Search creators</span><input type="search" placeholder="Search creator" value={query} maxLength={120} onChange={event => {setQuery(event.target.value);setPage(1);}} /></label>
      <label className="v3-directory-sort">Sort by<select value={sort} onChange={event => {setSort(event.target.value);setPage(1);}}><option value="rating">Rating</option><option value="name">Name</option></select></label>
    </div></header>
    <p className="v3-sr-only" role="status">{filtered.length} creators found. Showing {pagination.start} to {pagination.end}.</p>
    <div className="v3-creator-grid">{pagination.items.map(creator => <CreatorCard key={creator.slug} creator={creator} />)}</div>
    {!filtered.length && <div className="v3-directory-empty"><h2>No creators found</h2><p>Try another name or category.</p><button className="button" onClick={() => {setQuery('');setPage(1);}}>Show all creators</button></div>}
    <div className="v3-directory-pagination"><p>30 creators per page</p><nav aria-label="Creator pages">
      <button aria-label="Previous page" disabled={pagination.page === 1} onClick={() => changePage(pagination.page-1)}><ChevronLeft size={20} aria-hidden="true" /></button>
      {pages.map((number,index) => <span className="v3-page-entry" key={number}>{index > 0 && number-pages[index-1] > 1 && <span className="v3-page-gap" aria-hidden="true">…</span>}<button aria-label={`Page ${number}`} aria-current={number === pagination.page ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button></span>)}
      <button aria-label="Next page" disabled={pagination.page === pagination.totalPages} onClick={() => changePage(pagination.page+1)}><ChevronRight size={20} aria-hidden="true" /></button>
    </nav></div>
  </div>;
}
