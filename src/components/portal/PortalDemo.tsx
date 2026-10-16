'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, ImagePlus, LoaderCircle, LogOut, Pencil, Plus, Search, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { creators } from '@/data/creators';
import { SESSION_KEY, STORAGE_KEY, parseCreators, validateCreator, type PortalCreator, type PortfolioItem } from '@/lib/portal-demo';

const categories = ['Lifestyle', 'Travel', 'Food & culture', 'Entertainment', 'Fashion'];
function initialCreators(): PortalCreator[] {
  return creators.map(c => ({ id: c.slug, name: c.name, category: c.category, description: c.description, image: c.image, location: 'Location to be confirmed', content: ['mountains', 'nature', 'sunset', 'landscape'].map((image, i) => ({ id: `${c.slug}-${i}`, title: ['The scenic route', 'A moment outdoors', 'Chasing the last light', 'A different perspective'][i], src: `/images/${image}.jpg`, kind: 'image' })) }));
}
const blankCreator = (): PortalCreator => ({ id: '', name: '', category: 'Lifestyle', description: '', image: '/images/neary.jpg', location: '', content: [] });
const blankContent = (): PortfolioItem => ({ id: '', title: '', src: '', kind: 'image' });
type Modal = 'creator' | 'content' | 'delete-creator' | 'delete-content' | 'reset' | null;

export function PortalDemo() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [roster, setRoster] = useState<PortalCreator[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState<Modal>(null);
  const [draft, setDraft] = useState<PortalCreator>(blankCreator);
  const [contentDraft, setContentDraft] = useState<PortfolioItem>(blankContent);
  const [reading, setReading] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const uploadVersion = useRef(0);
  const selected = roster.find(c => c.id === selectedId);
  useEffect(() => {
    try { if (sessionStorage.getItem(SESSION_KEY) !== 'demo') { router.replace('/portal/login'); return; } }
    catch { router.replace('/portal/login'); return; }
    try { const saved = localStorage.getItem(STORAGE_KEY); setRoster(saved ? parseCreators(saved) : initialCreators()); }
    catch { setRoster(initialCreators()); setNotice('Saved demo data could not be loaded. The sample roster is shown.'); }
    setReady(true);
  }, [router]);
  useEffect(() => { if (modal) dialog.current?.showModal(); else dialog.current?.close(); }, [modal]);
  function openModal(next: Modal) { setError(''); setModal(next); }
  function closeModal() { uploadVersion.current++; setReading(false); setModal(null); setError(''); }
  function persist(next: PortalCreator[], message: string) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch { setError('Could not save this change. Browser storage may be full or disabled. Try a smaller file or remove some demo content.'); return false; }
    setRoster(next); setNotice(message); closeModal(); return true;
  }
  async function readFile(file: File | undefined, destination: 'creator' | 'content') {
    if (!file) return;
    const image = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
    const video = ['video/mp4', 'video/webm'].includes(file.type);
    if (!image && !(destination === 'content' && video)) { setError('Choose a JPG, PNG, or WebP image' + (destination === 'content' ? ', or an MP4/WebM video.' : '.')); return; }
    if (file.size > (destination === 'creator' ? 750_000 : 1_500_000)) { setError(destination === 'creator' ? 'Choose an image under 750 KB for this browser demo.' : 'Choose a file under 1.5 MB for this browser demo.'); return; }
    const version = ++uploadVersion.current; setReading(true); setError('');
    try {
      const src = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error('Read failed')); reader.readAsDataURL(file); });
      if (version !== uploadVersion.current) return;
      if (image) await new Promise<void>((resolve, reject) => { const probe = new window.Image(); probe.onload = () => resolve(); probe.onerror = () => reject(new Error('Invalid image')); probe.src = src; });
      if (video) await new Promise<void>((resolve, reject) => {
        const probe = document.createElement('video');
        const timer = window.setTimeout(() => finish(false), 8000);
        function finish(valid: boolean) { window.clearTimeout(timer); probe.onloadedmetadata = null; probe.onerror = null; probe.removeAttribute('src'); probe.load(); if (valid) resolve(); else reject(new Error('Invalid video')); }
        probe.onloadedmetadata = () => finish(Number.isFinite(probe.duration) && probe.duration > 0);
        probe.onerror = () => finish(false); probe.preload = 'metadata'; probe.src = src;
      });
      if (version !== uploadVersion.current) return;
      if (destination === 'creator') setDraft(d => ({ ...d, image: src }));
      else setContentDraft(d => ({ ...d, src, kind: image ? 'image' : 'video', title: d.title || file.name.replace(/\.[^.]+$/, '') }));
    } catch { if (version === uploadVersion.current) setError('This file could not be opened. Choose a different file.'); }
    finally { if (version === uploadVersion.current) setReading(false); }
  }
  function saveCreator(e: React.FormEvent) {
    e.preventDefault(); if (reading) return;
    const problem = validateCreator(draft.name, draft.category, draft.description);
    if (problem) { setError(problem); return; }
    if (!draft.id && roster.length >= 50) { setError('This demo supports up to 50 creators.'); return; }
    const creator = { ...draft, id: draft.id || crypto.randomUUID(), name: draft.name.trim(), description: draft.description.trim(), location: draft.location.trim() || 'Location to be confirmed' };
    persist(draft.id ? roster.map(c => c.id === draft.id ? creator : c) : [...roster, creator], `${creator.name} ${draft.id ? 'updated' : 'added'} in this browser demo.`);
  }
  function saveContent(e: React.FormEvent) {
    e.preventDefault(); if (!selected || reading) return;
    if (contentDraft.title.trim().length < 2 || !contentDraft.src) { setError('Add a title and choose an image or video.'); return; }
    const item = { ...contentDraft, title: contentDraft.title.trim(), id: contentDraft.id || crypto.randomUUID() };
    const content = contentDraft.id ? selected.content.map(c => c.id === item.id ? item : c) : [...selected.content, item];
    persist(roster.map(c => c.id === selected.id ? { ...c, content } : c), 'Content saved to this browser demo.');
  }
  function logout() { try { sessionStorage.removeItem(SESSION_KEY); } finally { router.replace('/portal/login'); } }
  if (!ready) return <main id="main" className="shell portal-loading" role="status"><LoaderCircle className="spin" aria-hidden="true" /> Opening demo portal…</main>;
  const filtered = roster.filter(c => (category === 'All' || c.category === category) && `${c.name} ${c.category}`.toLowerCase().includes(query.toLowerCase()));
  return <main id="main" className="shell portal-page">
    <div className="portal-topline"><span className="demo-label">ADMIN PORTAL · FRONTEND DEMO</span><button className="quiet-button" onClick={logout}><LogOut size={15} aria-hidden="true" /> Log out</button></div>
    <div className="portal-demo-banner"><span><ShieldCheck size={17} aria-hidden="true" /> Demo workspace</span><p>Changes are saved only in this browser. Nothing is published to the public website.</p><button onClick={() => openModal('reset')}>Reset demo</button></div>
    {notice && <div className="portal-status" role="status"><Check size={16} aria-hidden="true" />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><X size={16} /></button></div>}
    {!selected ? <><div className="portal-heading"><div><h1>Okane Portal</h1><p>Your people. Their stories. All in one place.</p></div><button className="button" onClick={() => { setDraft(blankCreator()); openModal('creator'); }}><Plus size={16} aria-hidden="true" /> Add creator</button></div>
      <div className="portal-toolbar"><label className="portal-search"><Search size={17} aria-hidden="true" /><input aria-label="Search creators" placeholder="Search creators…" value={query} onChange={e => setQuery(e.target.value)} /></label><label className="portal-category">Category<select value={category} onChange={e => setCategory(e.target.value)}><option>All</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label><span className="micro muted">{filtered.length} {filtered.length === 1 ? 'creator' : 'creators'}</span></div>
      <div className="creator-grid portal-grid">{filtered.map(c => <button key={c.id} className="creator-card portal-creator" onClick={() => { setSelectedId(c.id); setNotice(''); }}><div className="creator-photo"><Image src={c.image} alt={`${c.name} — demo profile`} fill sizes="(max-width:600px) 45vw, 20vw" unoptimized={c.image.startsWith('data:')} /><span className="card-arrow"><ArrowUpRight size={18} aria-hidden="true" /></span></div><h2>{c.name}</h2><p>{c.category}<span>Demo profile · {c.content.length} content items</span></p></button>)}</div>
      {!filtered.length && <div className="portal-empty"><Search size={28} aria-hidden="true" /><h2>{roster.length ? 'No creators found.' : 'Your next story starts here.'}</h2><p>{roster.length ? 'Try another name or category.' : 'Add a creator to start building your roster.'}</p>{roster.length > 0 && <button className="quiet-button" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button>}</div>}
    </> : <><button className="portal-back" onClick={() => setSelectedId(null)}><ArrowLeft size={16} aria-hidden="true" /> All creators</button><div className="portal-profile-layout"><section><h1>{selected.name}</h1><div className="portal-profile-info"><div className="profile-image"><Image src={selected.image} alt={selected.name} fill sizes="230px" unoptimized={selected.image.startsWith('data:')} /></div><div><h2>{selected.category} Content</h2><span className="micro muted">Demo profile</span><h3>About {selected.name}</h3><p>{selected.description}</p><p className="micro muted">{selected.location}</p><div className="profile-actions"><button className="button" onClick={() => { setDraft({ ...selected }); openModal('creator'); }}><Pencil size={14} aria-hidden="true" /> Edit creator</button><button className="danger-button" onClick={() => openModal('delete-creator')}><Trash2 size={14} aria-hidden="true" /> Remove creator</button></div></div></div></section><section className="portal-content"><div className="content-heading"><h2>{selected.name}’s Content <span>{selected.content.length}</span></h2><button className="button" onClick={() => { setContentDraft(blankContent()); openModal('content'); }}><Plus size={15} aria-hidden="true" /> Add content</button></div><div className="portal-content-grid">{selected.content.map(item => <article className="content-item" key={item.id}><div className="content-media">{item.kind === 'video' ? <video src={item.src} controls preload="metadata" aria-label={item.title} /> : <Image src={item.src} alt={item.title} fill sizes="(max-width:600px) 45vw, 25vw" unoptimized={item.src.startsWith('data:')} />}</div><div className="content-info"><h3>{item.title}</h3><p>{item.kind === 'video' ? 'Video' : 'Image'} · Demo content</p><div><button aria-label={`Edit ${item.title}`} onClick={() => { setContentDraft({ ...item }); openModal('content'); }}><Pencil size={15} /></button><button aria-label={`Remove ${item.title}`} onClick={() => { setContentDraft(item); openModal('delete-content'); }}><Trash2 size={15} /></button></div></div></article>)}</div>{!selected.content.length && <div className="portal-empty"><ImagePlus size={30} aria-hidden="true" /><h2>Make room for a great story.</h2><p>Add an image or short video to this creator’s portfolio.</p></div>}</section></div></>}
    <dialog ref={dialog} className={`portal-dialog ${modal === 'creator' || modal === 'content' ? 'drawer' : ''}`} aria-labelledby="dialog-title" onCancel={e => { e.preventDefault(); closeModal(); }} onClick={e => { if (e.target === dialog.current) { const r = dialog.current.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeModal(); } }}>
      <div className="dialog-header"><span className="demo-label">OKANE PORTAL</span><button className="icon-button" aria-label="Close panel" onClick={closeModal}><X size={20} /></button></div>
      {modal === 'creator' ? <><h2 id="dialog-title">{draft.id ? 'Edit creator' : 'Add a creator'}</h2><p className="dialog-description">A fresh face. A new perspective. Bring their profile to life.</p><form onSubmit={saveCreator} noValidate><div className="upload-profile"><Image src={draft.image} width={92} height={112} alt="Creator photo preview" unoptimized /><label className="upload-label"><Upload size={16} aria-hidden="true" /> Choose photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { void readFile(e.target.files?.[0], 'creator'); e.target.value = ''; }} /><span>JPG, PNG or WebP · up to 750 KB</span></label></div><div className="field"><label htmlFor="creator-name">Name *</label><input id="creator-name" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} maxLength={80} required /></div><div className="field"><label htmlFor="creator-category">Content category *</label><select id="creator-category" value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></div><div className="field"><label htmlFor="creator-location">Location</label><input id="creator-location" value={draft.location} onChange={e => setDraft({ ...draft, location: e.target.value })} maxLength={120} placeholder="City, country" /></div><div className="field"><label htmlFor="creator-description">About the creator *</label><textarea id="creator-description" value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} rows={5} maxLength={1000} required placeholder="Their style, their interests, their story…" /></div>{error && <p role="alert" className="field-error">{error}</p>}<div className="dialog-actions"><button className="button" disabled={reading}>{reading ? 'Reading photo…' : draft.id ? 'Save changes' : 'Add creator'}<Check size={15} aria-hidden="true" /></button><button className="quiet-button" type="button" onClick={closeModal}>Cancel</button></div><p className="micro muted">Demo profiles only. Changes are saved in this browser.</p></form></> : modal === 'content' ? <><h2 id="dialog-title">{contentDraft.id ? 'Edit content' : 'Add creator content'}</h2><p className="dialog-description">Give {selected?.name}’s next story a place to shine.</p><form onSubmit={saveContent} noValidate><label className="content-upload"><Upload size={25} aria-hidden="true" /><strong>{contentDraft.src ? 'Choose a replacement file' : 'Choose an image or video'}</strong><span>JPG, PNG, WebP, MP4 or WebM · up to 1.5 MB</span><input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" onChange={e => { void readFile(e.target.files?.[0], 'content'); e.target.value = ''; }} /></label>{contentDraft.src && <div className="upload-preview">{contentDraft.kind === 'image' ? <Image src={contentDraft.src} alt="Content preview" width={400} height={260} unoptimized /> : <video src={contentDraft.src} controls preload="metadata" aria-label="Video preview" />}</div>}<div className="field"><label htmlFor="content-title">Content title *</label><input id="content-title" value={contentDraft.title} onChange={e => setContentDraft({ ...contentDraft, title: e.target.value })} maxLength={100} required placeholder="A story worth sharing" /></div>{error && <p role="alert" className="field-error">{error}</p>}<div className="dialog-actions"><button className="button" disabled={reading}>{reading ? 'Reading file…' : 'Save content'}<Check size={15} aria-hidden="true" /></button><button className="quiet-button" type="button" onClick={closeModal}>Cancel</button></div><p className="micro muted">Small files keep the browser demo responsive. Production uploads will use secure media storage.</p></form></> : <><h2 id="dialog-title">{modal === 'reset' ? 'Reset the demo?' : modal === 'delete-creator' ? `Remove ${selected?.name}?` : 'Remove this content?'}</h2><p className="dialog-description">{modal === 'reset' ? 'Restore the original five sample profiles. Your added creators, edits, and uploaded content will be removed from this browser.' : modal === 'delete-creator' ? 'This removes the creator and their content from this browser demo.' : `“${contentDraft.title}” will be removed from this creator’s demo portfolio.`}</p>{error && <p role="alert" className="field-error">{error}</p>}<div className="dialog-actions"><button className="button" onClick={() => { if (modal === 'reset') { if (persist(initialCreators(), 'Demo restored to the original sample profiles.')) { setSelectedId(null); setQuery(''); setCategory('All'); } } else if (modal === 'delete-creator' && selected) { if (persist(roster.filter(c => c.id !== selected.id), 'Creator removed from the demo.')) setSelectedId(null); } else if (selected) persist(roster.map(c => c.id === selected.id ? { ...c, content: c.content.filter(item => item.id !== contentDraft.id) } : c), 'Content removed from the demo.'); }}>{modal === 'reset' ? 'Reset demo' : 'Remove'}<Trash2 size={15} aria-hidden="true" /></button><button className="quiet-button" onClick={closeModal}>Keep editing</button></div></>}
    </dialog>
  </main>;
}
