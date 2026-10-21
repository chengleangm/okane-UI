import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createQuoteDemoRequest,
  isQuoteDemoStorageValid,
  parseQuoteDemoRequests,
  validateQuoteDemoInput,
} from '../src/lib/quote-demo.ts';

const sessionToken = 'a'.repeat(64);
const input = {
  clientName: 'Demo Client',
  companyName: '',
  creatorSlugs: ['neary-na-nary'],
  creatorNames: ['Neary Na Nary'],
  campaignDescription: 'A fictional campaign for testing the quote request flow.',
  service: 'TikTok promotion',
  preferredDate: '2026-10-21',
  budget: '',
  notes: '',
};

test('valid demo quote details require explicit fictional-data consent', () => {
  assert.deepEqual(validateQuoteDemoInput(input, '2026-10-21', true), {});
  assert.match(validateQuoteDemoInput(input, '2026-10-21', false).demoConsent, /fictional/);
  assert.deepEqual(validateQuoteDemoInput({ ...input, budget: '500' }, '2026-10-21', true), {});
});

test('demo quote form rejects missing, malformed, past, and excessive values', () => {
  const errors = validateQuoteDemoInput({
    ...input,
    clientName: ' ',
    creatorSlugs: [],
    creatorNames: [],
    campaignDescription: 'Too short',
    service: '',
    preferredDate: '2026-10-20',
    budget: 'Infinity',
    notes: 'x'.repeat(2001),
    companyName: 'x'.repeat(101),
  }, '2026-10-21', false);
  for (const field of ['clientName', 'creatorSlugs', 'campaignDescription', 'service', 'preferredDate', 'budget', 'notes', 'companyName', 'demoConsent']) {
    assert.ok(errors[field], `expected ${field} validation`);
  }
});

test('demo request IDs are unique-shaped and requests start pending', () => {
  const request = createQuoteDemoRequest(input, sessionToken, new Date('2026-10-21T01:00:00.000Z'));
  assert.match(request.id, /^DEMO-[A-Z0-9-]{8,64}$/);
  assert.equal(request.status, 'pending');
  assert.equal(request.telegramDemoConnected, true);
  assert.equal(request.sessionToken, sessionToken);
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([request])), [request]);
});

test('malformed or untrusted demo storage is ignored', () => {
  assert.deepEqual(parseQuoteDemoRequests(null), []);
  assert.deepEqual(parseQuoteDemoRequests('{broken'), []);
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([{ ...createQuoteDemoRequest(input, sessionToken), id: 'production-request' }])), []);
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([{ ...createQuoteDemoRequest(input, sessionToken), sessionToken: 'weak', rating: undefined }])), []);
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([{ ...createQuoteDemoRequest(input, sessionToken), rating: 6 }])), []);
  assert.equal(isQuoteDemoStorageValid(null), true);
  assert.equal(isQuoteDemoStorageValid('[]'), true);
  assert.equal(isQuoteDemoStorageValid('{broken'), false);
  assert.equal(isQuoteDemoStorageValid(JSON.stringify([{ ...createQuoteDemoRequest(input, sessionToken), id: 'invalid' }])), false);
});

test('ratings are accepted only after a simulated admin response', () => {
  const request = createQuoteDemoRequest(input, sessionToken, new Date('2026-10-21T01:00:00.000Z'));
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([{ ...request, rating: 5 }])), []);
  const responded = { ...request, status: 'responded', response: 'Thank you for your demo request.', rating: 5 };
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([responded])), [responded]);
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([{ ...request, response: 'Unexpected pending response' }])), []);
});

test('legacy demo requests without session tokens remain visible to admin storage readers', () => {
  const legacy = createQuoteDemoRequest(input, sessionToken);
  delete legacy.sessionToken;
  assert.deepEqual(parseQuoteDemoRequests(JSON.stringify([legacy])), [legacy]);
});
