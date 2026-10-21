import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createAdminPasswordHash,
  isDemoAdminCredential,
  isDemoAdminEnabled,
  DEMO_ADMIN_EMAIL,
  DEMO_ADMIN_PASSWORD,
  verifyAdminPassword,
} from '../src/lib/admin-auth.ts';

test('admin password hashes verify only the original password', async () => {
  const hash = await createAdminPasswordHash('Strong-password-2026!');
  assert.match(hash, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);
  assert.equal(await verifyAdminPassword('Strong-password-2026!', hash), true);
  assert.equal(await verifyAdminPassword('wrong-password', hash), false);
});

test('malformed password hashes are rejected', async () => {
  for (const hash of ['', 'plain-text', 'scrypt$bad$salt', 'scrypt$' + '0'.repeat(32) + '$' + '0'.repeat(128) + '$extra']) {
    assert.equal(await verifyAdminPassword('any-password', hash), false);
  }
});

test('public demo admin credentials work without environment configuration', () => {
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = 'production';
    assert.equal(isDemoAdminEnabled(), true);
    assert.equal(isDemoAdminCredential(DEMO_ADMIN_EMAIL.toUpperCase(), DEMO_ADMIN_PASSWORD), true);
    assert.equal(isDemoAdminCredential(DEMO_ADMIN_EMAIL, 'wrong-password'), false);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
