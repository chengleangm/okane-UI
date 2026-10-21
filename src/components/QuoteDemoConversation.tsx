'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, CheckCircle2, Star } from 'lucide-react';
import {
  parseQuoteDemoRequests,
  isQuoteDemoStorageValid,
  QUOTE_DEMO_STORAGE_KEY,
  type QuoteDemoRequest,
} from '@/lib/quote-demo';

function readSessionToken(): string {
  const match = window.location.hash.match(/^#session=([a-f0-9]{64})$/);
  return match?.[1] ?? '';
}

export function QuoteDemoConversation({ sessionToken: suppliedToken }: { sessionToken?: string }) {
  const [sessionToken, setSessionToken] = useState(suppliedToken ?? '');
  const [request, setRequest] = useState<QuoteDemoRequest>();
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    function load() {
      try {
        const token = suppliedToken || readSessionToken();
        setSessionToken(token);
        const raw = window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY);
        const requests = parseQuoteDemoRequests(raw);
        if (!isQuoteDemoStorageValid(raw)) throw new Error('Malformed demo storage');
        setRequest(token ? requests.find(item => item.sessionToken === token) : undefined);
        setStorageError('');
      } catch {
        setStorageError('Demo storage is unavailable in this browser.');
        setRequest(undefined);
      }
      setReady(true);
    }
    load();
    function onStorage(event: StorageEvent) {
      if (event.key === QUOTE_DEMO_STORAGE_KEY || event.key === null) load();
    }
    function onHashChange() {
      if (!suppliedToken) load();
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [suppliedToken]);

  function submitRating(rating: number) {
    if (!request || request.status !== 'responded' || request.rating !== undefined) return;
    try {
      const requests = parseQuoteDemoRequests(window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY));
      const raw = window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY);
      if (!isQuoteDemoStorageValid(raw)) throw new Error('Malformed demo storage');
      const current = requests.find(item => item.id === request.id && item.sessionToken === sessionToken);
      if (!current || current.status !== 'responded' || current.rating !== undefined) {
        setRequest(current);
        return;
      }
      const nextRequest = { ...current, rating };
      const next = requests.map(item => item.id === request.id && item.sessionToken === sessionToken ? nextRequest : item);
      window.localStorage.setItem(QUOTE_DEMO_STORAGE_KEY, JSON.stringify(next));
      setRequest(nextRequest);
      setStorageError('');
    } catch {
      setStorageError('Your demo rating could not be saved. Demo storage may be unavailable or malformed.');
    }
  }

  if (!ready) return <div className="quote-demo-conversation-page"><p>Loading simulated conversation…</p></div>;

  return <div className="quote-demo-conversation-page">
    <header className="quote-demo-page-heading">
      <Link className="market-back" href="/creators">Browse creators</Link>
      <div className="quote-demo-banner"><Bot size={18} aria-hidden="true" /><span>SIMULATED TELEGRAM CONVERSATION · DEMO ONLY</span></div>
      <h1>OKANE Telegram Bot — DEMO</h1>
      <p>This is a limited simulation of request confirmation, admin result delivery, and feedback. It is not a real Telegram conversation or live chat.</p>
    </header>
    {storageError && <p className="quote-demo-alert" role="alert">{storageError}</p>}
    {request ? <section className="quote-demo-conversation-page-card">
      <div className="quote-demo-message quote-demo-bot-message">
        <span>OKANE Telegram Bot · simulated</span>
        <p>Hello! Your quote request has been submitted successfully.</p>
        <p><strong>Request ID:</strong> {request.id}<br /><strong>Creator:</strong> {request.creatorNames.join(', ')}</p>
        <p>Our team will review your request. No real message was sent.</p>
        <small>{new Date(request.createdAt).toLocaleString()}</small>
      </div>
      <div className="quote-demo-conversation-status"><span className={'quote-demo-status quote-demo-status-' + request.status}>{request.status === 'responded' ? 'Final result delivered (Demo)' : 'Pending admin result (Demo)'}</span></div>
      {request.status === 'responded' && <div className="quote-demo-message quote-demo-admin-message">
        <span>OKANE Telegram Bot · simulated admin result</span>
        <p>Your request has been updated!</p>
        <p><strong>Request ID:</strong> {request.id}<br /><strong>Admin response:</strong><br />{request.response}</p>
        <small>Simulated result · {new Date(request.createdAt).toLocaleDateString()}</small>
      </div>}
      {request.status === 'responded' && <section className="quote-demo-rating" aria-labelledby="demo-conversation-rating">
        <h2 id="demo-conversation-rating">Thank you for choosing OKANE!</h2>
        <h3>How would you rate your experience?</h3>
        {request.rating !== undefined ? <p className="quote-demo-rating-confirmation" role="status"><CheckCircle2 size={17} aria-hidden="true" />Thank you for your feedback! ({request.rating}/5 demo stars)</p> : <>
          <div className="quote-demo-stars" role="group" aria-label="Rate your OKANE demo experience">
            {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" aria-label={`${rating} star${rating === 1 ? '' : 's'}`} onClick={() => submitRating(rating)}><Star size={27} fill="currentColor" aria-hidden="true" /></button>)}
          </div>
          <p>Rating is saved with this demo request only and is not published on creator profiles.</p>
        </>}
      </section>}
      <Link className="quote-demo-back-request" href={request.creatorSlugs.length > 1
        ? `/request?creators=${encodeURIComponent(request.creatorSlugs.join(','))}#session=${request.sessionToken}`
        : `/request/${request.creatorSlugs[0]}#session=${request.sessionToken}`}><ArrowRight size={15} aria-hidden="true" />Return to the request confirmation</Link>
    </section> : <section className="quote-demo-session-empty">
      <h2>Demo conversation unavailable</h2>
      <p>This browser session does not have a matching request. Open the conversation link from the original quote request confirmation. The request ID alone cannot open a private demo conversation.</p>
      <Link className="button quote-demo-primary" href="/creators">Browse creators <ArrowRight size={16} aria-hidden="true" /></Link>
    </section>}
  </div>;
}
