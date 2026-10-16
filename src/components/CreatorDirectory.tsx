"use client";
import { useState } from 'react';
import { Search, ArrowDownUp, RotateCcw } from 'lucide-react';
import { creators } from '@/data/creators';
import { CreatorCard } from './CreatorCard';
export function CreatorDirectory() {
  const [sort, setSort] = useState('featured');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const filtered = creators.filter(c => (category === 'All' || c.category === category) && c.name.toLowerCase().includes(query.toLowerCase())).sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : 0);
  return <><div className="page-heading"><h1>Our Creators</h1><label className="sort"><span className="icon-label"><ArrowDownUp className="ui-icon" aria-hidden="true" focusable="false"/> Sort by</span> <select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="name">Name A-Z</option></select></label></div><div className="directory-tools"><div className="category-tabs" aria-label="Filter creators by category">{['All', ...new Set(creators.map(c => c.category))].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}</button>)}</div><label className="portal-search"><Search size={16} aria-hidden="true" /><input aria-label="Search creators" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find your creator..." /></label></div><div className="creator-grid" id="discover">{filtered.map(c => <CreatorCard key={c.slug} creator={c} />)}</div>{!filtered.length && <div className="portal-empty"><h2>No creators found.</h2><p>Try another name or category.</p><button className="quiet-button" onClick={() => { setCategory('All'); setQuery(''); }}><RotateCcw className="ui-icon" aria-hidden="true" focusable="false"/> Clear filters</button></div>}<p className="directory-note" role="status">{filtered.length} creators / Profiles shown here are demo examples.</p></>;
}
