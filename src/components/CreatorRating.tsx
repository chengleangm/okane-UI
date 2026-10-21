import { Star } from 'lucide-react';

type Props = { rating?: number; ratingCount?: number };

export function CreatorRating({ rating, ratingCount }: Props) {
  const hasRating = typeof rating === 'number' && Number.isFinite(rating) && rating >= 0 && rating <= 5;
  const safeRating = hasRating ? rating : 0;
  const safeCount = typeof ratingCount === 'number' && Number.isSafeInteger(ratingCount) && ratingCount > 0 ? ratingCount : undefined;
  const label = hasRating
    ? `Rated ${safeRating.toFixed(1)} out of 5${safeCount ? ` based on ${safeCount} ${safeCount === 1 ? 'rating' : 'ratings'}` : ''}`
    : 'Not rated yet';

  return <span className={'creator-rating' + (hasRating ? '' : ' creator-rating-empty')} aria-label={label}>
    <span className="creator-rating-stars" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => {
        const fill = Math.max(0, Math.min(1, safeRating - index));
        return <span className="creator-rating-star" key={index}>
          <Star size={15} strokeWidth={1.8} />
          {fill > 0 && <Star className="creator-rating-star-fill" size={15} strokeWidth={1.8} style={{ clipPath: `inset(0 ${(1 - fill) * 100}% 0 0)` }} />}
        </span>;
      })}
    </span>
    <span className="creator-rating-label">{hasRating ? `${safeRating.toFixed(1)}${safeCount ? ` (${safeCount} ${safeCount === 1 ? 'review' : 'reviews'})` : ''}` : 'Not rated yet'}</span>
  </span>;
}
