export const CREATORS_PER_PAGE = 40;

export function paginateItems<T>(items: readonly T[], requestedPage: number, pageSize = CREATORS_PER_PAGE) {
  const size = Number.isSafeInteger(pageSize) && pageSize > 0 ? pageSize : CREATORS_PER_PAGE;
  const totalPages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(totalPages, Math.max(1, Math.trunc(requestedPage) || 1));
  const offset = (page - 1) * size;
  return {
    items: items.slice(offset, offset + size), page, totalPages, total: items.length,
    start: items.length ? offset + 1 : 0, end: Math.min(offset + size, items.length),
  };
}
