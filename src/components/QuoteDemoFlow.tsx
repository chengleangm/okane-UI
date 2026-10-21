'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Bot, Check, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import type { Creator } from '@/types/creator';
import {
  createQuoteDemoRequest,
  createQuoteDemoSessionToken,
  isQuoteDemoStorageValid,
  parseQuoteDemoRequests,
  QUOTE_DEMO_STORAGE_KEY,
  validateQuoteDemoInput,
  type QuoteDemoErrors,
  type QuoteDemoInput,
  type QuoteDemoRequest,
} from '@/lib/quote-demo';
import { QuoteDemoConversation } from './QuoteDemoConversation';

const emptyInput: Omit<QuoteDemoInput, 'creatorSlugs' | 'creatorNames'> = {
  clientName: '',
  companyName: '',
  campaignDescription: '',
  service: '',
  preferredDate: '',
  budget: '',
  notes: '',
};

function readRequests(): QuoteDemoRequest[] {
  return parseQuoteDemoRequests(window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY));
}

function todayLocal(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function QuoteDemoFlow({ creators }: { creators: Creator[] }) {
  const [connected, setConnected] = useState(false);
  const [sessionToken, setSessionToken] = useState('');
  const [requests, setRequests] = useState<QuoteDemoRequest[]>([]);
  const [currentRequest, setCurrentRequest] = useState<QuoteDemoRequest>();
  const [values, setValues] = useState<QuoteDemoInput>(() => ({
    ...emptyInput,
    creatorSlugs: creators.map(creator => creator.slug),
    creatorNames: creators.map(creator => creator.name),
  }));
  const [errors, setErrors] = useState<QuoteDemoErrors>({});
  const [demoConsent, setDemoConsent] = useState(false);
  const [storageMessage, setStorageMessage] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function load() {
      try {
        const raw = window.localStorage.getItem(QUOTE_DEMO_STORAGE_KEY);
        const saved = readRequests();
        setRequests(saved);
        if (!isQuoteDemoStorageValid(raw)) {
          setStorageMessage('Malformed demo records were ignored. Clear local demo data in the admin simulator to start clean.');
        } else {
          setStorageMessage('');
        }
        const token = window.location.hash.match(/^#session=([a-f0-9]{64})$/)?.[1] ?? '';
        const found = token ? saved.find(request => request.sessionToken === token) : undefined;
        setSessionToken(token);
        if (found) {
          setCurrentRequest(found);
          setConnected(true);
        } else if (token) {
          setCurrentRequest(undefined);
          setConnected(true);
        } else {
          setCurrentRequest(undefined);
          setConnected(false);
        }
      } catch {
        setStorageMessage('Demo storage is unavailable in this browser. Allow local storage to run this prototype.');
      }
      setReady(true);
    }
    load();
    function onStorage(event: StorageEvent) {
      if (event.key === QUOTE_DEMO_STORAGE_KEY || event.key === null) load();
    }
    function onHashChange() {
      load();
    }
    window.addEventListener('storage', onStorage);
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  function setField<K extends keyof QuoteDemoInput>(key: K, value: QuoteDemoInput[K]) {
    setValues(current => {
      return { ...current, [key]: value };
    });
    setErrors(current => ({ ...current, [key]: undefined }));
  }

  function toggleCreator(slug: string) {
    const next = values.creatorSlugs.includes(slug)
      ? values.creatorSlugs.filter(item => item !== slug)
      : [...values.creatorSlugs, slug];
    setValues(current => ({
      ...current,
      creatorSlugs: next,
      creatorNames: creators.filter(creator => next.includes(creator.slug)).map(creator => creator.name),
    }));
    setErrors(current => ({ ...current, creatorSlugs: undefined }));
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateQuoteDemoInput(values, todayLocal(), demoConsent);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!sessionToken) {
      setStorageMessage('Connect the Telegram demo again to create a private demo session.');
      setConnected(false);
      return;
    }
    if (requests.length >= 500) {
      setStorageMessage('This browser has reached the 500-request demo limit. Clear local demo data in the admin simulator to continue.');
      return;
    }

    let request: QuoteDemoRequest;
    try {
      request = createQuoteDemoRequest({
        ...values,
        clientName: values.clientName.trim(),
        companyName: values.companyName.trim(),
        campaignDescription: values.campaignDescription.trim(),
        service: values.service.trim(),
        notes: values.notes.trim(),
      }, sessionToken);
    } catch {
      setStorageMessage('A secure demo session could not be created in this browser. Use a modern browser and try again.');
      return;
    }
    const nextRequests = [request, ...requests.filter(item => item.id !== request.id)];
    try {
      window.localStorage.setItem(QUOTE_DEMO_STORAGE_KEY, JSON.stringify(nextRequests));
      setRequests(nextRequests);
      setCurrentRequest(request);
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#session=${sessionToken}`);
      setStorageMessage('');
    } catch {
      setStorageMessage('The demo request could not be saved in this browser. Check available local storage and try again.');
    }
  }

  function connectTelegramDemo() {
    try {
      const token = createQuoteDemoSessionToken();
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#session=${token}`);
      setSessionToken(token);
      setCurrentRequest(undefined);
      setConnected(true);
      setStorageMessage('');
    } catch {
      setStorageMessage('A secure demo connection could not be created in this browser. Try a modern browser with Web Crypto support.');
    }
  }

  if (!ready) return <section className="quote-demo-panel" aria-busy="true"><p>Loading demo request…</p></section>;

  return <section className="quote-demo-panel" aria-labelledby="quote-demo-heading">
    <div className="quote-demo-banner"><Bot size={18} aria-hidden="true" /><span>DEMO ONLY — No real Telegram messages are sent.</span></div>
    {storageMessage && <p className="quote-demo-alert" role="alert">{storageMessage}</p>}

    {!connected && <div className="quote-demo-connect">
      <span className="quote-demo-step">STEP 1 · TELEGRAM CONNECTION SIMULATOR</span>
      <h2 id="quote-demo-heading">Connect Your Telegram</h2>
      <p>Connect Telegram to receive updates and responses about your quotation request. This demo does not contact Telegram or authenticate a real account.</p>
      <button className="button quote-demo-primary" type="button" onClick={connectTelegramDemo}><MessageCircle size={17} aria-hidden="true" />Connect Telegram (Demo)<ArrowRight size={16} aria-hidden="true" /></button>
    </div>}

    {connected && !currentRequest && <div className="quote-demo-form-wrap">
      <div className="quote-demo-connected" role="status"><CheckCircle2 size={18} aria-hidden="true" /><span>Telegram Connected (Demo)</span></div>
      <div className="quote-demo-heading">
        <span className="quote-demo-step">STEP 2 · QUOTE REQUEST</span>
        <h2 id="quote-demo-heading">Tell us about your campaign</h2>
        <p>Use fictional details only. This request stays in this browser and is not sent to OKANE.</p>
      </div>
      <form className="quote-demo-form" onSubmit={submitRequest} noValidate>
        <div className="quote-demo-fields">
          <label className="quote-demo-field">
            <span>Client name <b aria-hidden="true">*</b></span>
            <input autoComplete="off" maxLength={100} value={values.clientName} onChange={event => setField('clientName', event.target.value)} aria-invalid={Boolean(errors.clientName)} aria-describedby={errors.clientName ? 'demo-client-name-error' : undefined} />
            {errors.clientName && <small id="demo-client-name-error" role="alert">{errors.clientName}</small>}
          </label>
          <label className="quote-demo-field">
            <span>Company name <small>Optional</small></span>
            <input autoComplete="off" maxLength={100} value={values.companyName} onChange={event => setField('companyName', event.target.value)} aria-invalid={Boolean(errors.companyName)} />
            {errors.companyName && <small role="alert">{errors.companyName}</small>}
          </label>
          <fieldset className="quote-demo-creators">
            <legend>Selected creator(s) <b aria-hidden="true">*</b></legend>
            <div>{creators.map(creator => <label key={creator.slug}><input type="checkbox" checked={values.creatorSlugs.includes(creator.slug)} onChange={() => toggleCreator(creator.slug)} /><span>{creator.name}</span><small>{creator.category}</small></label>)}</div>
            {errors.creatorSlugs && <small role="alert">{errors.creatorSlugs}</small>}
          </fieldset>
          <label className="quote-demo-field quote-demo-field-wide">
            <span>Campaign description <b aria-hidden="true">*</b></span>
            <textarea rows={4} maxLength={2000} value={values.campaignDescription} onChange={event => setField('campaignDescription', event.target.value)} aria-invalid={Boolean(errors.campaignDescription)} aria-describedby={errors.campaignDescription ? 'demo-campaign-error' : undefined} />
            {errors.campaignDescription && <small id="demo-campaign-error" role="alert">{errors.campaignDescription}</small>}
          </label>
          <label className="quote-demo-field">
            <span>Requested service <b aria-hidden="true">*</b></span>
            <input autoComplete="off" maxLength={100} placeholder="Describe the service you have in mind" value={values.service} onChange={event => setField('service', event.target.value)} aria-invalid={Boolean(errors.service)} />
            {errors.service && <small role="alert">{errors.service}</small>}
          </label>
          <label className="quote-demo-field">
            <span>Preferred date <b aria-hidden="true">*</b></span>
            <input type="date" min={todayLocal()} value={values.preferredDate} onChange={event => setField('preferredDate', event.target.value)} aria-invalid={Boolean(errors.preferredDate)} />
            {errors.preferredDate && <small role="alert">{errors.preferredDate}</small>}
          </label>
          <label className="quote-demo-field quote-demo-field-wide">
            <span>Budget <small>Optional · demo amount; currency is not specified</small></span>
            <input type="number" min="0.01" max="1000000000" step="any" inputMode="decimal" placeholder="Enter an amount (optional)" value={values.budget} onChange={event => setField('budget', event.target.value)} aria-invalid={Boolean(errors.budget)} />
            {errors.budget && <small role="alert">{errors.budget}</small>}
          </label>
          <label className="quote-demo-field quote-demo-field-wide">
            <span>Additional notes <small>Optional</small></span>
            <textarea rows={3} maxLength={2000} value={values.notes} onChange={event => setField('notes', event.target.value)} aria-invalid={Boolean(errors.notes)} />
            {errors.notes && <small role="alert">{errors.notes}</small>}
          </label>
        </div>
        <label className="quote-demo-consent"><input type="checkbox" checked={demoConsent} onChange={event => { setDemoConsent(event.target.checked); setErrors(current => ({ ...current, demoConsent: undefined })); }} /><span>I’m using fictional demo details, not real customer information. <b aria-hidden="true">*</b></span></label>
        {errors.demoConsent && <p className="quote-demo-error" role="alert">{errors.demoConsent}</p>}
        <button className="button quote-demo-primary quote-demo-submit" type="submit"><Send size={16} aria-hidden="true" />Submit Demo Request</button>
      </form>
    </div>}

    {currentRequest && <div className="quote-demo-submitted">
      <div className="quote-demo-success" role="status"><Check size={18} aria-hidden="true" /><div><strong>Request submitted successfully!</strong><span>Received by this browser’s demo simulator only. No real Telegram notification or OKANE request was sent.</span></div></div>
      <div className="quote-demo-request-card">
        <div className="quote-demo-request-title"><div><span className="quote-demo-step">REQUEST ID</span><h2 id="quote-demo-heading">{currentRequest.id}</h2></div><span className={'quote-demo-status quote-demo-status-' + currentRequest.status}>{currentRequest.status === 'responded' ? 'Response received (Demo)' : 'Pending (Demo)'}</span></div>
        <dl>
          <div><dt>Client</dt><dd>{currentRequest.clientName}{currentRequest.companyName ? ` · ${currentRequest.companyName}` : ''}</dd></div>
          <div><dt>Creator(s)</dt><dd>{currentRequest.creatorNames.join(', ')}</dd></div>
          <div><dt>Campaign</dt><dd>{currentRequest.campaignDescription}</dd></div>
          <div><dt>Requested service</dt><dd>{currentRequest.service}</dd></div>
          <div><dt>Preferred date</dt><dd>{currentRequest.preferredDate}</dd></div>
          {currentRequest.budget && <div><dt>Budget</dt><dd>{currentRequest.budget} <small>(currency unspecified)</small></dd></div>}
          {currentRequest.notes && <div><dt>Additional notes</dt><dd>{currentRequest.notes}</dd></div>}
        </dl>
      </div>
      {currentRequest.sessionToken && <QuoteDemoConversation sessionToken={currentRequest.sessionToken} />}
      {currentRequest.sessionToken && <div className="quote-demo-links"><Link href={`/demo/telegram#session=${currentRequest.sessionToken}`}>View Demo Telegram Conversation <ArrowRight size={15} aria-hidden="true" /></Link><Link href="/demo/admin">Admin Demo Simulator <ArrowRight size={15} aria-hidden="true" /></Link></div>}
    </div>}
  </section>;
}
