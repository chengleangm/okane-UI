export const CREATORS_PER_PAGE = 40;

export function paginateItems<T>(items: readonly T[], requestedPage: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / CREATORS_PER_PAGE));
  const page = Math.min(totalPages, Math.max(1, Math.trunc(requestedPage) || 1));
  const offset = (page - 1) * CREATORS_PER_PAGE;
  return {
    items: items.slice(offset, offset + CREATORS_PER_PAGE),
    page,
    totalPages,
    total: items.length,
    start: items.length ? offset + 1 : 0,
    end: Math.min(offset + CREATORS_PER_PAGE, items.length),
  };
}
