export const FAVORITES_KEY = 'okane.favorite-creators.v1';

export function parseFavoriteCreators(raw: string | null | undefined): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? '[]');
    if (!Array.isArray(value) || value.length > 1000 || value.some(slug => typeof slug !== 'string' || !/^[a-z0-9-]{1,100}$/.test(slug))) return [];
    return [...new Set(value)] as string[];
  } catch { return []; }
}

export function toggleFavoriteCreator(favorites: readonly string[] | null | undefined, slug: string): string[] {
  const list = Array.isArray(favorites) ? favorites.filter(item => typeof item === 'string') : [];
  const normalizedSlug = typeof slug === 'string' ? slug.trim() : '';
  if (!normalizedSlug || !/^[a-z0-9-]{1,100}$/.test(normalizedSlug)) return [...new Set(list)];
  return [...new Set(list.includes(normalizedSlug) ? list.filter(item => item !== normalizedSlug) : [...list, normalizedSlug])];
}
