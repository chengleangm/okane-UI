import { test } from 'node:test';
import assert from 'node:assert/strict';
import { paginateItems } from '../src/lib/pagination.ts';

test('pagination appears only above 40 creators', () => {
  for (const count of [0, 1, 12, 40]) {
    const result = paginateItems(Array.from({ length: count }, (_, i) => i), 1);
    assert.equal(result.totalPages, 1);
    assert.equal(result.items.length, count);
  }
  const rows = Array.from({ length: 41 }, (_, i) => i);
  assert.equal(paginateItems(rows, 1).items.length, 40);
  assert.deepEqual(paginateItems(rows, 2).items, [40]);
  assert.equal(paginateItems(rows, 2).totalPages, 2);
});

test('all numbered pages cover the full roster once, including a partial last page', () => {
  const rows = Array.from({ length: 163 }, (_, i) => 'creator-' + i);
  const collected = [];
  for (let page = 1; page <= 5; page++) collected.push(...paginateItems(rows, page).items);
  assert.deepEqual(collected, rows);
  assert.equal(new Set(collected).size, rows.length);
  assert.equal(paginateItems(rows, 5).start, 161);
  assert.equal(paginateItems(rows, 5).end, 163);
});

test('out-of-range pages are clamped after filtering or deletion', () => {
  const filtered = Array.from({ length: 8 }, (_, i) => i);
  assert.deepEqual(paginateItems(filtered, 4).items, filtered);
  assert.equal(paginateItems(filtered, 4).page, 1);
  assert.equal(paginateItems(filtered, -2).page, 1);
  assert.equal(paginateItems([], 3).start, 0);
  assert.equal(paginateItems([], 3).end, 0);
});
