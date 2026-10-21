import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseQuoteSlugs, resolveQuoteSelection } from '../src/lib/quote-selection.ts';

const roster = [{ slug: 'ambrel', name: 'Ambrel' }, { slug: 'sophea', name: 'Sophea' }, { slug: 'lina', name: 'Lina' }];

test('group quote URLs accept multiple creators and remove duplicates', () => {
  const slugs = parseQuoteSlugs(['ambrel,sophea', 'ambrel,lina']);
  assert.deepEqual(slugs, ['ambrel', 'sophea', 'lina']);
  assert.deepEqual(resolveQuoteSelection(slugs, roster).map(creator => creator.name), ['Ambrel', 'Sophea', 'Lina']);
});

test('unknown and malformed quote selections cannot invent creator details', () => {
  assert.deepEqual(parseQuoteSlugs(undefined), []);
  const slugs = parseQuoteSlugs(' ambrel,../secret,<script>,unknown,sophea, ');
  assert.deepEqual(resolveQuoteSelection(slugs, roster).map(creator => creator.slug), ['ambrel', 'sophea']);
  assert.deepEqual(resolveQuoteSelection(['missing'], roster), []);
});

test('quote selections preserve order across filtered or paginated browsing', () => {
  const many = Array.from({ length: 85 }, (_, i) => ({ slug: 'creator-' + i }));
  const chosen = ['creator-44', 'creator-2', 'creator-81'];
  assert.deepEqual(resolveQuoteSelection(parseQuoteSlugs(chosen.join(',')), many).map(creator => creator.slug), chosen);
  assert.deepEqual(resolveQuoteSelection(['sophea', 'sophea'], roster), [roster[1]]);
  assert.deepEqual(resolveQuoteSelection(['ambrel'], roster), [roster[0]]);
});
