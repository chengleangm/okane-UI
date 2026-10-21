'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, RotateCcw, Send, Star } from 'lucide-react';
import {
  parseQuoteDemoRequests,
  isQuoteDemoStorageValid,
  QUOTE_DEMO_STORAGE_KEY,
  type QuoteDemoRequest,
} from '@/lib/quote-demo';

function readRequests(): QuoteDemoRequest[] {
  return parseQuoteDemoRequests(window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY));
}

function requestHref(request: QuoteDemoRequest): string {
  return `/demo/telegram#session=${request.sessionToken}`;
}

export function QuoteDemoAdmin() {
  const [requests, setRequests] = useState<QuoteDemoRequest[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [response, setResponse] = useState('');
  const [notice, setNotice] = useState('');
  const [storageError, setStorageError] = useState('');
  const selected = requests.find(request => request.id === selectedId) ?? requests[0];

  useEffect(() => {
    function load() {
      try {
        const raw = window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY);
        const saved = readRequests();
        setRequests(saved);
        setSelectedId(current => saved.some(request => request.id === current) ? current : saved[0]?.id ?? '');
        setStorageError(isQuoteDemoStorageValid(raw) ? '' : 'Malformed demo records were ignored. Clear local demo data to start clean.');
      } catch {
        setStorageError('Demo storage is unavailable. Allow local storage to use the simulator.');
      }
    }
    load();
    function onStorage(event: StorageEvent) {
      if (event.key === QUOTE_DEMO_STORAGE_KEY || event.key === null) load();
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  function sendResponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = response.trim();
    if (!selected || selected.status !== 'pending' || selected.response || message.length < 2 || message.length > 2000) {
      setNotice('Write a response between 2 and 2,000 characters.');
      return;
    }
    try {
      const raw = window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY);
      if (!isQuoteDemoStorageValid(raw)) {
        setStorageError('Malformed demo records were ignored. Clear local demo data before continuing.');
        return;
      }
      const saved = parseQuoteDemoRequests(raw);
      const current = saved.find(request => request.id === selected.id);
      if (!current || current.status !== 'pending' || current.response) {
        setRequests(saved);
        setNotice('A final result has already been sent for this request.');
        return;
      }
      const updated = { ...current, status: 'responded' as const, response: message };
      const next = saved.map(request => request.id === current.id ? updated : request);
      window.localStorage.setItem(QUOTE_DEMO_STORAGE_KEY, JSON.stringify(next));
      setRequests(next);
      setResponse('');
      setNotice(`Demo response saved for ${selected.id}. No Telegram message was sent.`);
      setStorageError('');
    } catch {
      setStorageError('The demo response could not be saved in this browser.');
      setNotice('');
    }
  }

  function clearDemoData() {
    try {
      window.localStorage.removeItem(QUOTE_DEMO_STORAGE_KEY);
      setRequests([]);
      setSelectedId('');
      setResponse('');
      setNotice('Browser-local demo requests were cleared.');
      setStorageError('');
    } catch {
      setStorageError('Demo data could not be cleared from this browser.');
    }
  }

  return <main id="main" className="shell inner-page quote-demo-admin-page">
    <header className="quote-demo-page-heading">
      <Link className="market-back" href="/demo"><ArrowLeft size={16} aria-hidden="true" />Demo Control Panel</Link>
      <div className="quote-demo-banner"><MessageCircle size={18} aria-hidden="true" /><span>ADMIN TELEGRAM SIMULATOR · DEMO ONLY</span></div>
      <h1>Quote requests</h1>
      <p>Requests below are stored in this browser only. Sending a response simulates an admin Telegram bot; it does not contact Telegram.</p>
    </header>
    {storageError && <p className="quote-demo-alert" role="alert">{storageError}</p>}
    {notice && <p className="quote-demo-notice" role="status"><CheckCircle2 size={16} aria-hidden="true" />{notice}</p>}
    <div className="quote-demo-admin-grid">
      <section className="quote-demo-inbox" aria-labelledby="demo-inbox-title">
        <div className="quote-demo-section-heading"><div><span className="quote-demo-step">LOCAL DEMO INBOX</span><h2 id="demo-inbox-title">New requests</h2></div><span className="quote-count-badge" aria-label={`${requests.length} requests`}>{requests.length}</span></div>
        {!requests.length ? <div className="quote-demo-empty"><p>No demo requests yet.</p><Link href="/creators">Browse creators to start the client flow</Link></div> : <div className="quote-demo-request-list">{requests.map(request => <button key={request.id} type="button" className={'quote-demo-request-item' + (selected?.id === request.id ? ' is-selected' : '')} onClick={() => { setSelectedId(request.id); setNotice(''); }}>
          <span className="quote-demo-item-top"><strong>{request.id}</strong><span className={'quote-demo-status quote-demo-status-' + request.status}>{request.status}</span></span>
          <span><b>Client:</b> {request.clientName}</span>
          <span><b>Creator:</b> {request.creatorNames.join(', ')}</span>
          <span><b>Service:</b> {request.service}</span>
          <span className="quote-demo-item-date">{new Date(request.createdAt).toLocaleString()}</span>
        </button>)}</div>}
      </section>

      <section className="quote-demo-admin-detail" aria-labelledby="demo-request-detail-title">
        {selected ? <>
          <div className="quote-demo-section-heading"><div><span className="quote-demo-step">REQUEST DETAILS</span><h2 id="demo-request-detail-title">{selected.id}</h2></div><span className={'quote-demo-status quote-demo-status-' + selected.status}>{selected.status}</span></div>
          <dl className="quote-demo-detail-list">
            <div><dt>Client</dt><dd>{selected.clientName}{selected.companyName ? ` · ${selected.companyName}` : ''}</dd></div>
            <div><dt>Creator(s)</dt><dd>{selected.creatorNames.join(', ')}</dd></div>
            <div><dt>Campaign</dt><dd>{selected.campaignDescription}</dd></div>
            <div><dt>Service</dt><dd>{selected.service}</dd></div>
            <div><dt>Preferred date</dt><dd>{selected.preferredDate}</dd></div>
            <div><dt>Budget</dt><dd>{selected.budget ? <>{selected.budget} <small>(currency unspecified)</small></> : 'Not provided'}</dd></div>
            {selected.notes && <div><dt>Notes</dt><dd>{selected.notes}</dd></div>}
          </dl>
          {selected.rating && <p className="quote-demo-admin-rating"><Star size={17} fill="currentColor" aria-hidden="true" /> Client demo rating: <strong>{selected.rating}/5</strong></p>}
          {selected.response && <div className="quote-demo-existing-response"><strong>Previously simulated response</strong><p>{selected.response}</p></div>}
          {!selected.response && <form className="quote-demo-response-form" onSubmit={sendResponse}>
            <label htmlFor="demo-admin-response">Send simulated response</label>
            <textarea id="demo-admin-response" rows={5} maxLength={2000} value={response} onChange={event => setResponse(event.target.value)} placeholder="Write the response the client will see in their demo conversation." />
            <p>This is saved only in this browser and appears in the client demo. No Telegram API call is made.</p>
            <button className="button quote-demo-primary" type="submit"><Send size={16} aria-hidden="true" />Send Result (Demo)</button>
          </form>}
          {selected.response && <p className="quote-demo-notice" role="status"><CheckCircle2 size={16} aria-hidden="true" />Final result sent in the demo. The response is now available in the matching simulated Telegram conversation.</p>}
          {selected.sessionToken
            ? <Link className="quote-demo-admin-link" href={requestHref(selected)}>Preview simulated Telegram result <ArrowRight size={15} aria-hidden="true" /></Link>
            : <p className="quote-demo-waiting">Legacy demo record: no private session token is available, so it cannot be opened as a client conversation.</p>}
        </> : <div className="quote-demo-empty quote-demo-empty-detail"><MessageCircle size={24} aria-hidden="true" /><h2>Waiting for a request</h2><p>Submit a fictional client request to populate this local simulator.</p></div>}
      </section>
    </div>

    <section className="quote-demo-ratings" aria-labelledby="demo-ratings-heading">
      <div className="quote-demo-section-heading"><div><span className="quote-demo-step">FEEDBACK</span><h2 id="demo-ratings-heading">Submitted demo ratings</h2></div></div>
      {requests.some(request => request.rating) ? <ul>{requests.filter(request => request.rating).map(request => <li key={request.id}><span>{request.id}</span><span>{request.clientName} · {request.creatorNames.join(', ')}</span><span aria-label={`${request.rating} out of 5 stars`}>{'★'.repeat(request.rating ?? 0)}{'☆'.repeat(5 - (request.rating ?? 0))} {request.rating}/5</span></li>)}</ul> : <p>No ratings have been submitted in this browser.</p>}
    </section>
    <div className="quote-demo-admin-footer"><Link href="/creators">Browse creators</Link><button type="button" className="quote-demo-clear" onClick={clearDemoData}><RotateCcw size={15} aria-hidden="true" />Clear local demo data</button></div>
  </main>;
}
