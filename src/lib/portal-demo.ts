export const DEMO_EMAIL = 'demo@okane.test';
export const DEMO_PASSWORD = 'OkaneDemo123!';
export const SESSION_KEY = 'okane.portal.session.v1';
export const STORAGE_KEY = 'okane.portal.creators.v1';
export type PortfolioItem = { id: string; title: string; src: string; kind: 'image' | 'video' };
export type PortalCreator = { id: string; name: string; category: string; description: string; image: string; location: string; content: PortfolioItem[] };
export function validateLogin(email: string, password: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Enter a valid email address.';
  if (!password) return 'Enter the demo password.';
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) return 'Use the demo email and password shown below.';
  return '';
}
export function validateCreator(name: string, category: string, description: string) {
  if (name.trim().length < 2) return 'Enter a creator name with at least 2 characters.';
  if (!category.trim()) return 'Choose a content category.';
  if (description.trim().length < 10) return 'Add a description of at least 10 characters.';
  return '';
}
export function isSafeDemoMedia(src: unknown, kind: 'image' | 'video'): src is string {
  return typeof src === 'string' && ((kind === 'image' && /^\/images\/[a-z0-9-]+\.(jpg|png)$/.test(src)) || new RegExp(`^data:${kind === 'image' ? 'image/(png|jpeg|webp)' : 'video/(mp4|webm)'};base64,[A-Za-z0-9+/=]+$`).test(src));
}
export function parseCreators(raw: string): PortalCreator[] {
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data) || data.length > 50) throw new Error('Invalid demo data');
  const ids = new Set<string>();
  for (const c of data) {
    if (!c || typeof c.id !== 'string' || ids.has(c.id) || typeof c.name !== 'string' || typeof c.category !== 'string' || typeof c.description !== 'string' || typeof c.location !== 'string' || !isSafeDemoMedia(c.image, 'image') || !Array.isArray(c.content)) throw new Error('Invalid demo creator');
    ids.add(c.id);
    const contentIds = new Set<string>();
    for (const item of c.content) {
      if (!item || typeof item.id !== 'string' || contentIds.has(item.id) || typeof item.title !== 'string' || !['image', 'video'].includes(item.kind) || !isSafeDemoMedia(item.src, item.kind)) throw new Error('Invalid demo content');
      contentIds.add(item.id);
    }
  }
  return data;
}
