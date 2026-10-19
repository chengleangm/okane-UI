export const QUOTE_SELECTION_KEY = 'okane.quote-selection.v1';

export function parseQuoteSlugs(value: string | string[] | undefined): string[] {
  const values = typeof value === 'string' ? [value] : value ?? [];
  return [...new Set(values.flatMap(item => item.split(',')).map(item => item.trim()).filter(item => /^[a-z0-9-]{1,100}$/.test(item)))].slice(0, 1000);
}

export function resolveQuoteSelection<T extends { slug: string }>(slugs: readonly string[], roster: readonly T[]): T[] {
  const bySlug = new Map(roster.map(creator => [creator.slug, creator]));
  return [...new Set(slugs)].flatMap(slug => {
    const creator = bySlug.get(slug);
    return creator ? [creator] : [];
  });
}
