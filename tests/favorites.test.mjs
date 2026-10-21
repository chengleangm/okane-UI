import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFavoriteCreators, toggleFavoriteCreator } from '../src/lib/favorites.ts';

test('favorites survive serialization and toggling removes only the selected creator', () => {
  const saved = toggleFavoriteCreator(['ambrel'], 'sophea');
  assert.deepEqual(parseFavoriteCreators(JSON.stringify(saved)), ['ambrel', 'sophea']);
  assert.deepEqual(toggleFavoriteCreator(saved, 'ambrel'), ['sophea']);
});

test('invalid favorites storage falls back safely and duplicate entries are collapsed', () => {
  for (const raw of [null, 'invalid', '{}', '[null]', '[1]', '["../bad"]']) assert.deepEqual(parseFavoriteCreators(raw), []);
  assert.deepEqual(parseFavoriteCreators('["ambrel","ambrel"]'), ['ambrel']);
});
