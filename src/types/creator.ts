import type { SocialLinks, SocialFollowers } from '@/lib/portal-data';
export type Creator = { slug: string; name: string; category: string; image: string; description: string; socialLinks?: SocialLinks; socialFollowers?: SocialFollowers; rating?: number; ratingCount?: number; totalViews?: number };
