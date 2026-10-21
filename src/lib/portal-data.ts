export const STORAGE_KEY = 'okane.portal.creators.v1';
export const socialPlatforms = [
  { key: 'facebook', label: 'Facebook', placeholder: 'https://www.facebook.com/username' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'https://www.tiktok.com/@username' },
  { key: 'instagram', label: 'Instagram', placeholder: 'https://www.instagram.com/username' },
  { key: 'youtube', label: 'YouTube', placeholder: 'https://www.youtube.com/@username' },
  { key: 'website', label: 'Website / other link', placeholder: 'https://example.com' },
] as const;
export type SocialPlatform = typeof socialPlatforms[number]['key'];
export type SocialLinks = Partial<Record<SocialPlatform, string>>;
export type SocialFollowers = Partial<Record<SocialPlatform, number>>;
export function validateSocialFollowers(value: unknown): string {
  if (value === undefined) return '';
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Invalid follower counts.';
  for (const [platform, count] of Object.entries(value)) {
    if (!socialPlatforms.some(item => item.key === platform && item.key !== 'website') || typeof count !== 'number' || !Number.isSafeInteger(count) || count < 0 || count > 1_000_000_000_000) return 'Follower counts must be whole numbers of zero or more.';
  }
  return '';
}
const socialDomains: Record<SocialPlatform, readonly string[]> = {
  facebook: ['facebook.com', 'fb.com', 'fb.me'], tiktok: ['tiktok.com'],
  instagram: ['instagram.com'], youtube: ['youtube.com', 'youtu.be'], website: [],
};
export function normalizeSocialUrl(raw: string): string {
  if (typeof raw !== 'string') return '';
  const value = raw.trim();
  if (!value) return '';
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(value) ? value : 'https://' + value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || !url.hostname.includes('.') || value.length > 2048) throw new Error('Invalid profile URL');
  return url.href;
}
export function validateSocialLinks(value: unknown): string {
  if (value === undefined) return '';
  if (!value || typeof value !== 'object' || Array.isArray(value)) return 'Invalid social links.';
  const links = value as Record<string, unknown>;
  if (Object.keys(links).some(key => !socialPlatforms.some(platform => platform.key === key))) return 'Unknown social platform.';
  for (const platform of socialPlatforms) {
    const raw = links[platform.key];
    if (raw === undefined) continue;
    if (typeof raw !== 'string') return `Paste a valid ${platform.label} link or leave it blank.`;
    try {
      const normalized = normalizeSocialUrl(raw);
      if (!normalized) continue;
      const hostname = new URL(normalized).hostname.toLowerCase();
      const domains = socialDomains[platform.key];
      if (domains.length && !domains.some(domain => hostname === domain || hostname.endsWith('.' + domain))) throw new Error('Wrong platform');
    } catch { return `Paste a valid ${platform.label} link or leave it blank.`; }
  }
  return '';
}
export function normalizeSocialLinks(links: SocialLinks = {}): SocialLinks {
  const error = validateSocialLinks(links);
  if (error) throw new Error(error);
  const normalized: SocialLinks = {};
  for (const platform of socialPlatforms) {
    const url = normalizeSocialUrl(links[platform.key] || '');
    if (url) normalized[platform.key] = url;
  }
  return normalized;
}
export type PortfolioItem = { id: string; title: string; src: string; kind: 'image' | 'video' };
export type PortalCreator = { id: string; name: string; category: string; description: string; image: string; location: string; content: PortfolioItem[]; socialLinks?: SocialLinks; socialFollowers?: SocialFollowers };
export function validateCreator(name: unknown, category: unknown, description: unknown) {
  const normalizedName = typeof name === 'string' ? name : '';
  const normalizedCategory = typeof category === 'string' ? category : '';
  const normalizedDescription = typeof description === 'string' ? description : '';
  if (normalizedName.trim().length < 2) return 'Enter a creator name with at least 2 characters.';
  if (!normalizedCategory.trim()) return 'Choose a content category.';
  if (normalizedDescription.trim().length < 10) return 'Add a description of at least 10 characters.';
  return '';
}
export function isSafePortalMedia(src: unknown, kind: 'image' | 'video'): src is string {
  return typeof src === 'string' && ((kind === 'image' && /^\/images\/[a-z0-9-]+\.(jpg|png)$/.test(src)) || new RegExp(`^data:${kind === 'image' ? 'image/(png|jpeg|webp)' : 'video/(mp4|webm)'};base64,[A-Za-z0-9+/=]+$`).test(src));
}
export function parseCreators(raw: string | null | undefined): PortalCreator[] {
  if (typeof raw !== 'string' || !raw) throw new Error('Invalid creator data');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error('Invalid creator data');
  }
  if (!Array.isArray(data) || data.length > 50) throw new Error('Invalid creator data');
  const ids = new Set<string>();
  for (const c of data) {
    if (!c || typeof c.id !== 'string' || ids.has(c.id) || typeof c.name !== 'string' || typeof c.category !== 'string' || typeof c.description !== 'string' || typeof c.location !== 'string' || !isSafePortalMedia(c.image, 'image') || !Array.isArray(c.content)) throw new Error('Invalid creator record');
    ids.add(c.id);
    if (validateSocialLinks(c.socialLinks)) throw new Error('Invalid creator social links');
    if (validateSocialFollowers(c.socialFollowers)) throw new Error('Invalid creator follower counts');
    const contentIds = new Set<string>();
    for (const item of c.content) {
      if (!item || typeof item.id !== 'string' || contentIds.has(item.id) || typeof item.title !== 'string' || !['image', 'video'].includes(item.kind) || !isSafePortalMedia(item.src, item.kind)) throw new Error('Invalid portfolio content');
      contentIds.add(item.id);
    }
  }
  return data;
}
