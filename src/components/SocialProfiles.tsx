'use client';
import { useEffect, useState } from 'react';
import { Facebook, Instagram, Youtube, Globe, Music2 } from 'lucide-react';
import { STORAGE_KEY, parseCreators, socialPlatforms, normalizeSocialLinks, type SocialLinks } from '@/lib/portal-demo';

const icons = { facebook: Facebook, instagram: Instagram, tiktok: Music2, youtube: Youtube, website: Globe };

export function SocialProfiles({ links, creatorId }: { links?: SocialLinks; creatorId?: string }) {
  const [savedLinks, setSavedLinks] = useState<SocialLinks>();
  useEffect(() => {
    if (!creatorId) return;
    function read() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const creator = raw ? parseCreators(raw).find(item => item.id === creatorId) : undefined;
        setSavedLinks(creator?.socialLinks);
      } catch { setSavedLinks(undefined); }
    }
    read();
    window.addEventListener('storage', read);
    return () => window.removeEventListener('storage', read);
  }, [creatorId]);
  let normalized: SocialLinks = {};
  try { normalized = normalizeSocialLinks(savedLinks ?? links); } catch { /* Invalid saved links are not rendered. */ }
  const available = socialPlatforms.filter(platform => normalized[platform.key]);
  return <section className="social-profiles" aria-label="Creator social profiles"><h2>Find them online</h2>
    {available.length ? <div className="social-profile-links">{available.map(platform => {
      const Icon = icons[platform.key];
      return <a className={'social-circle social-demo-' + platform.key} key={platform.key} href={normalized[platform.key]} target="_blank" rel="noopener noreferrer" title={platform.label} aria-label={platform.label + ' (opens in a new tab)'}><Icon size={20} aria-hidden="true" focusable="false" /></a>;
    })}</div> : <><div className="social-demo-icons" aria-label="Example social icons">{socialPlatforms.filter(platform => ['facebook', 'tiktok', 'instagram'].includes(platform.key)).map(platform => {
      const Icon = icons[platform.key];
      return <span className={'social-demo-icon social-demo-' + platform.key} key={platform.key} role="img" aria-label={platform.label + ' example icon'} title={platform.label + ' (demo)'}><Icon size={20} aria-hidden="true" focusable="false" /></span>;
    })}</div><p className="social-empty">Example icons · profile links not added yet.</p></>}
  </section>;
}
