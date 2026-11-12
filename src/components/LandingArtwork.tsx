import type { CSSProperties } from 'react';

/** Artwork windows measured in the supplied 694 x 2048 reference.
 * Text and controls are HTML. Replace these photo/logo windows with original
 * image exports when available; the source image is shared and cached once.
 */
export function LandingArtwork({ crop, label, className = '', source = '/images/landing-reference.png', canvas = [694, 2048] }: {
  crop: [number, number, number, number]; label?: string; className?: string;
  source?: string; canvas?: [number, number];
}) {
  const [x, y, width, height] = crop;
  const style = {
    aspectRatio: `${width} / ${height}`,
    backgroundImage: `url(${source})`,
    backgroundSize: `${canvas[0] / width * 100}% ${canvas[1] / height * 100}%`,
    backgroundPosition: `${x / (canvas[0] - width) * 100}% ${y / (canvas[1] - height) * 100}%`,
    '--art-width': width,
  } as CSSProperties;
  return <div className={`landing-artwork ${className}`} style={style} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : true} />;
}
