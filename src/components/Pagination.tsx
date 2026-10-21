'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = { page: number; totalPages: number; start: number; end: number; total: number; onPageChange: (page: number) => void };

export function Pagination({ page, totalPages, start, end, total, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  return <div className="creator-pagination">
    <p role="status">Showing {start}–{end} of {total} creators</p>
    <nav aria-label="Creator pages">
      <button type="button" aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}><ChevronLeft size={18} aria-hidden="true" focusable="false" /></button>
      {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button type="button" key={number} aria-label={'Page ' + number} aria-current={number === page ? 'page' : undefined} onClick={() => onPageChange(number)}>{number}</button>)}
      <button type="button" aria-label="Next page" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}><ChevronRight size={18} aria-hidden="true" focusable="false" /></button>
    </nav>
  </div>;
}
