'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Creator } from '@/types/creator';
import { CreatorPortfolio } from './CreatorPortfolio';

export function CreatorExperience({ creator, desktopDetails, mobileDetails }: {
  creator: Creator; desktopDetails: ReactNode; mobileDetails: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open,setOpen] = useState(false);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 801px)');
    function resize() { if (desktop.matches) dialog.current?.close(); }
    desktop.addEventListener('change',resize);
    return () => desktop.removeEventListener('change',resize);
  },[]);
  function showInfo() { dialog.current?.showModal(); setOpen(true); }
  return <>
    <div className="v3-desktop-details">{desktopDetails}</div>
    <CreatorPortfolio creator={creator} onShowInfo={showInfo} infoOpen={open} />
    <dialog ref={dialog} id="mobile-creator-info" className="v3-mobile-sheet" aria-labelledby="mobile-creator-name" onClose={() => setOpen(false)} onClick={event => {
      if (event.target === event.currentTarget && event.clientY < event.currentTarget.getBoundingClientRect().top) event.currentTarget.close();
    }}>
      <button className="v3-sheet-close" onClick={() => dialog.current?.close()} aria-label="Close creator information" autoFocus><X size={20} aria-hidden="true" /></button>
      {mobileDetails}
    </dialog>
  </>;
}
