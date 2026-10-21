export const QUOTE_SELECTION_KEY = 'okane.quote-selection.v1';

export function parseQuoteSlugs(value: string | string[] | undefined | null): string[] {
  const values = typeof value === 'string' ? [value] : Array.isArray(value) ? value : [];
  return [...new Set(values
    .filter((item): item is string => typeof item === 'string')
    .flatMap(item => item.split(','))
    .map(item => item.trim())
    .filter(item => /^[a-z0-9-]{1,100}$/.test(item)))].slice(0, 1000);
}

export function resolveQuoteSelection<T extends { slug: string }>(slugs: readonly string[], roster: readonly T[]): T[] {
  const bySlug = new Map(roster.map(creator => [creator.slug, creator]));
  return [...new Set(slugs.filter((slug): slug is string => typeof slug === 'string' && !!slug))].flatMap(slug => {
    const creator = bySlug.get(slug);
    return creator ? [creator] : [];
  });
}
