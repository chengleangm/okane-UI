import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { creators } from '@/data/creators';
import { loginAction } from '@/app/admin/login/actions';
import { DEMO_ADMIN_EMAIL, DEMO_ADMIN_PASSWORD } from '@/lib/admin-auth';

export function PortalLogin({ error, configured, demoEnabled = false }: { error?: string; configured: boolean; demoEnabled?: boolean }) {
  return <main id="main" className="shell login-layout">
    <section className="login-intro">
      <span className="demo-label">THE CREATIVE SIDE OF OKANE</span>
      <h1>Good stories.<br />Great people.<br /><span>One place.</span></h1>
      <p>Your space to bring the creator roster to life.</p>
      <div className="login-portraits">{creators.slice(0, 3).map(creator => <div key={creator.slug}><Image src={creator.image} alt="" fill sizes="130px" /></div>)}</div>
    </section>
    <section className="login-card">
      <span className="login-symbol"><ShieldCheck size={25} aria-hidden="true" /></span>
      <span className="demo-label">OKANE ADMIN PORTAL</span>
      <h2>Welcome back.</h2>
      <p>Sign in to manage creators and their content.</p>
      {demoEnabled && <div className="quote-demo-storage-note" role="note">
        <strong>Public demo login</strong><br />
        Email: <code>{DEMO_ADMIN_EMAIL}</code><br />
        Password: <code>{DEMO_ADMIN_PASSWORD}</code><br />
        This shared demo account is not secure. Changes are saved only in this browser.
      </div>}
      {!configured && <p className="field-error" role="alert">Admin login is not configured. Add the required authentication settings to the server environment.</p>}
      {error && <p id="login-error" className="field-error" role="alert">Email or password is incorrect. Please try again.</p>}
      <form action={loginAction}>
        <div className="field"><label htmlFor="portal-email">Email address</label><input id="portal-email" name="email" type="email" autoComplete="username" placeholder="Admin email" required aria-describedby={error ? 'login-error' : undefined} suppressHydrationWarning /></div>
        <div className="field"><label htmlFor="portal-password">Password</label><input id="portal-password" name="password" type="password" autoComplete="current-password" placeholder="Password" required aria-describedby={error ? 'login-error' : undefined} /></div>
        <button className="button login-submit" disabled={!configured}><ArrowUpRight size={16} aria-hidden="true" />Sign in</button>
      </form>
      <p className="micro muted">Authorized administrators only.</p>
      <Link href="/creators" className="portal-back"><ArrowLeft size={15} aria-hidden="true" /> Back to the website</Link>
    </section>
  </main>;
}
