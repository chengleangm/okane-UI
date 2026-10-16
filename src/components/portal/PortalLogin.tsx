'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Eye, EyeOff, LoaderCircle, ShieldCheck } from 'lucide-react';
import { creators } from '@/data/creators';
import { DEMO_EMAIL, DEMO_PASSWORD, SESSION_KEY, validateLogin } from '@/lib/portal-demo';

export function PortalLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const lock = useRef(false);
  useEffect(() => { try { if (sessionStorage.getItem(SESSION_KEY) === 'demo') { router.replace('/portal'); return; } } catch { /* Login reports storage issues on submit. */ } setReady(true); }, [router]);
  async function signIn(e: React.FormEvent) {
    e.preventDefault(); if (lock.current) return;
    const problem = validateLogin(email, password); setError(problem); if (problem) return;
    lock.current = true; setBusy(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    try { sessionStorage.setItem(SESSION_KEY, 'demo'); router.replace('/portal'); }
    catch { setError('Browser storage is unavailable. Enable it to try the demo login.'); setBusy(false); lock.current = false; }
  }
  if (!ready) return <main id="main" className="shell portal-loading" role="status">Opening demo login…</main>;
  return <main id="main" className="shell login-layout">
    <section className="login-intro"><span className="demo-label">THE CREATIVE SIDE OF OKANE</span><h1>Good stories.<br/>Great people.<br/><span>One place.</span></h1><p>Your space to bring the creator roster to life.</p><div className="login-portraits">{creators.slice(0, 3).map(c => <div key={c.slug}><Image src={c.image} alt="" fill sizes="130px" /></div>)}</div><span className="micro muted">A preview of the creator management experience.</span></section>
    <section className="login-card"><span className="login-symbol"><ShieldCheck size={25} aria-hidden="true" /></span><span className="demo-label">ADMIN PORTAL · DEMO</span><h2>Welcome back.</h2><p>Sign in to manage creators and their content.</p><form onSubmit={signIn} noValidate>
      <div className="field"><label htmlFor="portal-email">Email address</label><input id="portal-email" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter demo email" required aria-describedby={error ? 'login-error' : undefined} /></div>
      <div className="field"><label htmlFor="portal-password">Password</label><div className="password-field"><input id="portal-password" type={visible ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter demo password" required aria-describedby={error ? 'login-error' : undefined} /><button type="button" aria-label={visible ? 'Hide password' : 'Show password'} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
      {error && <p id="login-error" className="field-error" role="alert">{error}</p>}<button className="button login-submit" disabled={busy}>{busy ? <LoaderCircle size={16} className="spin" aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}{busy ? 'Signing in…' : 'Sign in to demo'}</button>
    </form><div className="demo-credentials"><strong>Try it with demo credentials</strong><p>Email: <code>{DEMO_EMAIL}</code><br/>Password: <code>{DEMO_PASSWORD}</code></p><button type="button" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(''); }}>Fill demo credentials <ArrowUpRight size={14} aria-hidden="true" /></button></div><p className="micro muted">Simulated authentication only. Please don’t enter a personal password.</p><Link href="/creators" className="portal-back"><ArrowLeft size={15} aria-hidden="true" /> Back to the website</Link></section>
  </main>;
}
