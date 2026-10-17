export const FAVORITES_KEY = 'okane.favorite-creators.v1';

export function parseFavoriteCreators(raw: string | null): string[] {
  try {
    const value: unknown = JSON.parse(raw || '[]');
    if (!Array.isArray(value) || value.length > 1000 || value.some(slug => typeof slug !== 'string' || !/^[a-z0-9-]{1,100}$/.test(slug))) return [];
    return [...new Set(value)] as string[];
  } catch { return []; }
}

export function toggleFavoriteCreator(favorites: string[], slug: string): string[] {
  return favorites.includes(slug) ? favorites.filter(item => item !== slug) : [...favorites, slug];
}
