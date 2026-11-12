'use client';
import type { FormEvent } from 'react';
import type { QuoteDemoInput, QuoteDemoErrors } from '@/lib/quote-demo';

type Props = {
  values: QuoteDemoInput; errors: QuoteDemoErrors; demoConsent: boolean; ready: boolean;
  storageMessage: string; minDate: string;
  onChange: <K extends keyof QuoteDemoInput>(key: K, value: QuoteDemoInput[K]) => void;
  onConsent: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};
export function CreatorRequestForm({ values, errors, demoConsent, ready, storageMessage, minDate, onChange, onConsent, onSubmit }: Props) {
  return <section className="v3-request-form-panel" aria-labelledby="request-form-title">
    <h2 id="request-form-title">Request form</h2>
    <p className="v3-request-intro">Send us your info, we will match up with creator according to your<br className="v3-request-copy-break" /> preference, we will contact you directly once done.</p>
    <form className="v3-request-form" onSubmit={onSubmit} noValidate aria-busy={!ready}>
      <label className="v3-request-field"><span>Your name / Your company</span><input name="clientName" autoComplete="organization" required maxLength={100} placeholder="Your name or company" value={values.clientName} onChange={event => onChange('clientName',event.target.value)} aria-invalid={Boolean(errors.clientName)} aria-describedby={errors.clientName ? 'request-name-error' : undefined} />{errors.clientName && <small id="request-name-error" role="alert">{errors.clientName}</small>}</label>
      <label className="v3-request-field"><span>Project Detail</span><textarea name="campaignDescription" required rows={4} maxLength={2000} placeholder="Tell us about your project" value={values.campaignDescription} onChange={event => onChange('campaignDescription',event.target.value)} aria-invalid={Boolean(errors.campaignDescription)} aria-describedby={errors.campaignDescription ? 'request-project-error' : undefined} />{errors.campaignDescription && <small id="request-project-error" role="alert">{errors.campaignDescription}</small>}</label>
      <label className="v3-request-field"><span>Collaboration requirements</span><textarea name="service" required rows={4} maxLength={100} placeholder="Content, deliverables, and collaboration needs" value={values.service} onChange={event => onChange('service',event.target.value)} aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'request-service-error' : undefined} />{errors.service && <small id="request-service-error" role="alert">{errors.service}</small>}</label>
      <div className="v3-request-field-row">
        <label className="v3-request-field"><span>Preferred Date</span><input name="preferredDate" required type="date" min={minDate} value={values.preferredDate} onChange={event => onChange('preferredDate',event.target.value)} aria-invalid={Boolean(errors.preferredDate)} aria-describedby={errors.preferredDate ? 'request-date-error' : undefined} />{errors.preferredDate && <small id="request-date-error" role="alert">{errors.preferredDate}</small>}</label>
        <label className="v3-request-field"><span>Estimated Budget (USD)</span><input name="budget" type="number" min="0.01" max="1000000000" step="0.01" inputMode="decimal" placeholder="Amount in USD" value={values.budget} onChange={event => onChange('budget',event.target.value)} aria-invalid={Boolean(errors.budget)} aria-describedby={errors.budget ? 'request-budget-error' : undefined} />{errors.budget && <small id="request-budget-error" role="alert">{errors.budget}</small>}</label>
      </div>
      <label className="v3-request-consent"><input type="checkbox" checked={demoConsent} onChange={event => onConsent(event.target.checked)} aria-invalid={Boolean(errors.demoConsent)} aria-describedby="request-demo-notice" /><span id="request-demo-notice">I’m using fictional details. This demo saves locally and does not send a request.</span></label>
      {errors.demoConsent && <p className="v3-request-error" role="alert">{errors.demoConsent}</p>}
      {errors.creatorSlugs && <p className="v3-request-error" role="alert">{errors.creatorSlugs}</p>}
      {storageMessage && <p className="v3-request-error" role="alert">{storageMessage}</p>}
      <button className="button v3-request-submit" type="submit" disabled={!ready}>Request work</button>
    </form>
  </section>;
}
