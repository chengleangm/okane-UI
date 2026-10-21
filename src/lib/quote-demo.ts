export const QUOTE_DEMO_STORAGE_KEY = 'okane.quote-demo.requests.v1';

export type QuoteDemoInput = {
  clientName: string;
  companyName: string;
  creatorSlugs: string[];
  creatorNames: string[];
  campaignDescription: string;
  service: string;
  preferredDate: string;
  budget: string;
  notes: string;
};

export type QuoteDemoRequest = QuoteDemoInput & {
  id: string;
  sessionToken?: string;
  telegramDemoConnected: true;
  status: 'pending' | 'responded';
  response?: string;
  rating?: number;
  createdAt: string;
};

export type QuoteDemoErrors = Partial<Record<keyof QuoteDemoInput | 'demoConsent', string>>;

function isDate(value: string): boolean {
  const date = new Date(`${value}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function validateQuoteDemoInput(input: QuoteDemoInput, today: string, demoConsent: boolean): QuoteDemoErrors {
  const errors: QuoteDemoErrors = {};
  if (input.clientName.trim().length < 2 || input.clientName.length > 100) errors.clientName = 'Enter your name (2–100 characters).';
  if (input.companyName.length > 100) errors.companyName = 'Company name must be 100 characters or fewer.';
  if (input.creatorSlugs.length === 0 || input.creatorNames.length !== input.creatorSlugs.length) errors.creatorSlugs = 'Select at least one creator.';
  if (input.campaignDescription.trim().length < 20) errors.campaignDescription = 'Describe your campaign in at least 20 characters.';
  if (input.campaignDescription.length > 2000) errors.campaignDescription = 'Campaign description must be 2,000 characters or fewer.';
  if (!input.service.trim() || input.service.length > 100) errors.service = 'Enter a requested service (100 characters or fewer).';
  if (!isDate(input.preferredDate) || input.preferredDate < today) errors.preferredDate = 'Choose today or a future date.';
  const budget = Number(input.budget);
  if (input.budget && (!Number.isFinite(budget) || budget <= 0 || budget > 1_000_000_000)) errors.budget = 'Enter a budget greater than zero or leave it blank.';
  if (input.notes.length > 2000) errors.notes = 'Additional notes must be 2,000 characters or fewer.';
  if (!demoConsent) errors.demoConsent = 'Confirm that these are fictional demo details.';
  return errors;
}

export function parseQuoteDemoRequests(raw: string | null | undefined): QuoteDemoRequest[] {
  if (typeof raw !== 'string' || !raw) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed) || parsed.length > 500) return [];

  const ids = new Set<string>();
  for (const item of parsed) {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return [];
    const request = item as Record<string, unknown>;
    const strings = ['id', 'clientName', 'companyName', 'campaignDescription', 'service', 'preferredDate', 'budget', 'notes', 'createdAt'];
    if (strings.some(key => typeof request[key] !== 'string')) return [];
    if (typeof request.id !== 'string' || !/^DEMO-[A-Z0-9-]{8,64}$/.test(request.id) || ids.has(request.id)) return [];
    if (request.sessionToken !== undefined && (typeof request.sessionToken !== 'string' || !/^[a-f0-9]{64}$/.test(request.sessionToken))) return [];
    if (typeof request.clientName !== 'string' || request.clientName.trim().length < 2 || request.clientName.length > 100) return [];
    if (typeof request.companyName !== 'string' || request.companyName.length > 100) return [];
    if (typeof request.campaignDescription !== 'string' || request.campaignDescription.trim().length < 20 || request.campaignDescription.length > 2000) return [];
    if (typeof request.service !== 'string' || !request.service.trim() || request.service.length > 100) return [];
    if (typeof request.preferredDate !== 'string' || !isDate(request.preferredDate)) return [];
    if (typeof request.budget !== 'string' || (request.budget !== '' && (!Number.isFinite(Number(request.budget)) || Number(request.budget) <= 0 || Number(request.budget) > 1_000_000_000))) return [];
    if (typeof request.notes !== 'string' || request.notes.length > 2000) return [];
    if (!Array.isArray(request.creatorSlugs) || !Array.isArray(request.creatorNames) || request.creatorSlugs.length < 1 || request.creatorSlugs.length > 50 || request.creatorSlugs.length !== request.creatorNames.length) return [];
    if (new Set(request.creatorSlugs).size !== request.creatorSlugs.length) return [];
    if (!request.creatorSlugs.every(value => typeof value === 'string' && /^[a-z0-9-]{1,80}$/.test(value)) || !request.creatorNames.every(value => typeof value === 'string' && value.trim().length > 0 && value.length <= 100)) return [];
    if (request.telegramDemoConnected !== true || !['pending', 'responded'].includes(String(request.status))) return [];
    if (request.status === 'responded' && (typeof request.response !== 'string' || !request.response.trim() || request.response.length > 2000)) return [];
    if (request.status === 'pending' && request.response !== undefined) return [];
    if (request.response !== undefined && (typeof request.response !== 'string' || request.response.length > 2000)) return [];
    if (request.rating !== undefined && (typeof request.rating !== 'number' || !Number.isInteger(request.rating) || request.rating < 1 || request.rating > 5 || request.status !== 'responded')) return [];
    if (typeof request.createdAt !== 'string' || Number.isNaN(Date.parse(request.createdAt))) return [];
    ids.add(request.id);
  }
  return parsed as QuoteDemoRequest[];
}

export function isQuoteDemoStorageValid(raw: string | null | undefined): boolean {
  if (raw === null || raw === undefined || raw === '') return true;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length <= 500 && (parsed.length === 0 || parseQuoteDemoRequests(raw).length === parsed.length);
  } catch {
    return false;
  }
}

export function createQuoteDemoSessionToken(): string {
  const bytes = new Uint8Array(32);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function createQuoteDemoRequest(input: QuoteDemoInput, sessionToken: string, now = new Date()): QuoteDemoRequest {
  if (!/^[a-f0-9]{64}$/.test(sessionToken)) throw new Error('Invalid demo session token');
  const random = globalThis.crypto?.randomUUID?.().replaceAll('-', '').slice(0, 12) ?? Math.random().toString(36).slice(2, 14);
  return {
    ...input,
    id: `DEMO-${now.getTime().toString(36).toUpperCase()}-${random.toUpperCase()}`,
    sessionToken,
    telegramDemoConnected: true,
    status: 'pending',
    createdAt: now.toISOString(),
  };
}
