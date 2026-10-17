'use client';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, Youtube, Globe, Music2 } from 'lucide-react';
import { STORAGE_KEY, parseCreators, socialPlatforms, normalizeSocialLinks, type SocialLinks, type SocialFollowers } from '@/lib/portal-demo';

const icons = { facebook: Facebook, instagram: Instagram, tiktok: Music2, youtube: Youtube, website: Globe };
const formatFollowers = (count: number) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(count);

export function SocialProfiles({ links, followers, creatorId }: { links?: SocialLinks; followers?: SocialFollowers; creatorId?: string }) {
  const [saved, setSaved] = useState<{ links?: SocialLinks; followers?: SocialFollowers }>();
  useEffect(() => {
    if (!creatorId) return;
    function read() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const creator = raw ? parseCreators(raw).find(item => item.id === creatorId) : undefined;
        setSaved(creator ? { links: creator.socialLinks, followers: creator.socialFollowers } : undefined);
      } catch { setSaved(undefined); }
    }
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, [creatorId]);
  let normalized: SocialLinks = {};
  try { normalized = normalizeSocialLinks(saved?.links ?? links); } catch { /* Invalid saved links are not rendered. */ }
  const counts = saved?.followers ?? followers ?? {};
  const hasLinks = Object.keys(normalized).length > 0;
  const platforms = socialPlatforms.filter(platform => normalized[platform.key] || counts[platform.key] !== undefined || (!hasLinks && ['facebook', 'tiktok', 'instagram'].includes(platform.key)));
  return <section className="social-profiles" aria-label="Creator social profiles"><h2>Social audience</h2>
    <div className="social-audience-grid">{platforms.map(platform => {
      const Icon = icons[platform.key];
      const count = counts[platform.key];
      const href = normalized[platform.key];
      return <div className="social-audience-item" key={platform.key}>
        {href ? <a className={'social-circle social-demo-' + platform.key} href={href} target="_blank" rel="noopener noreferrer" title={platform.label} aria-label={platform.label + ' (opens in a new tab)'}><Icon size={20} aria-hidden="true" focusable="false" /></a> : <span className={'social-demo-icon social-demo-' + platform.key} role="img" aria-label={platform.label + ' example icon'} title={platform.label + ' (demo)'}><Icon size={20} aria-hidden="true" focusable="false" /></span>}
        <span className="social-platform-name">{platform.label === 'Website / other link' ? 'Website' : platform.label}</span>
        {platform.key !== 'website' && <><strong className="social-follower-count" title={count !== undefined ? count.toLocaleString('en') + ' followers' : 'Follower count not provided'}>{count !== undefined ? formatFollowers(count) : '—'}</strong><span className="social-follower-label">followers</span></>}
      </div>;
    })}</div>
    <p className="social-empty">Demo or manually entered counts · not live or verified.</p>
    {!hasLinks && <p className="social-empty">Example icons · profile links not added yet.</p>}
  </section>;
}
