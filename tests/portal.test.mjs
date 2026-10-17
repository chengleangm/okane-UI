import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateLogin, validateCreator, parseCreators, isSafeDemoMedia, normalizeSocialLinks, validateSocialLinks, DEMO_EMAIL, DEMO_PASSWORD } from '../src/lib/portal-demo.ts';
const creator = { id: 'demo', name: 'Demo Creator', category: 'Travel', description: 'A sample travel profile.', location: 'Demo city', image: '/images/ambrel.jpg', content: [{ id: 'one', title: 'Mountains', src: '/images/mountains.jpg', kind: 'image' }] };
test('demo login accepts only the displayed credentials', () => {
  assert.equal(validateLogin(DEMO_EMAIL, DEMO_PASSWORD), '');
  assert.equal(validateLogin(' DEMO@OKANE.TEST ', DEMO_PASSWORD), '');
  for (const [email, password] of [['', ''], ['wrong', 'pass'], [DEMO_EMAIL, ''], [DEMO_EMAIL, 'incorrect'], ['someone@example.com', DEMO_PASSWORD]]) assert.ok(validateLogin(email, password));
});
test('creator form requires meaningful profile details', () => {
  assert.equal(validateCreator('Demo Creator', 'Travel', 'A sample travel profile.'), '');
  assert.ok(validateCreator(' ', 'Travel', 'A sample travel profile.'));
  assert.ok(validateCreator('Demo', '', 'A sample travel profile.'));
  assert.ok(validateCreator('Demo', 'Travel', ' '));
});
test('saved creator data round trips and supports an empty roster', () => {
  assert.deepEqual(parseCreators(JSON.stringify([creator])), [creator]);
  assert.deepEqual(parseCreators('[]'), []);
});
test('corrupt storage, duplicate IDs and unexpected media are rejected', () => {
  for (const value of ['oops', '{}', JSON.stringify([creator, creator]), JSON.stringify([{ ...creator, image: 'javascript:alert(1)' }]), JSON.stringify([{ ...creator, content: [{ ...creator.content[0], kind: 'script' }] }]), JSON.stringify([{ ...creator, content: [creator.content[0], creator.content[0]] }])]) assert.throws(() => parseCreators(value));
});
test('demo media accepts only local sample assets or typed media data', () => {
  assert.equal(isSafeDemoMedia('/images/ambrel.jpg', 'image'), true);
  assert.equal(isSafeDemoMedia('data:image/png;base64,YQ==', 'image'), true);
  assert.equal(isSafeDemoMedia('data:video/mp4;base64,YQ==', 'video'), true);
  for (const src of ['https://example.com/image.jpg', 'data:image/svg+xml;base64,YQ==', '/images/../../secret.jpg', 'data:video/mp4;base64,YQ==']) assert.equal(isSafeDemoMedia(src, 'image'), false);
});

test('optional social links accept pasted URLs, normalize missing schemes, and round trip', () => {
  assert.equal(validateSocialLinks(undefined), '');
  assert.deepEqual(normalizeSocialLinks({ facebook: '  ', tiktok: '' }), {});
  const socialLinks = normalizeSocialLinks({ facebook: ' www.facebook.com/demo ', tiktok: 'https://www.tiktok.com/@demo', instagram: 'instagram.com/demo', youtube: 'youtu.be/demo', website: 'https://example.com/portfolio' });
  assert.equal(socialLinks.facebook, 'https://www.facebook.com/demo');
  assert.equal(socialLinks.instagram, 'https://instagram.com/demo');
  const saved = { ...creator, socialLinks };
  assert.deepEqual(parseCreators(JSON.stringify([saved])), [saved]);
});

test('unsafe, malformed, and mismatched social URLs cannot be saved or loaded', () => {
  for (const socialLinks of [null, [], 'bad', { other: 'https://example.com' }, { website: 'javascript:alert(1)' }, { website: 'data:text/html,hello' }, { website: 'https://user:password@example.com' }, { website: 'not a link' }, { facebook: 'https://facebook.com.evil.test/demo' }, { instagram: 'https://tiktok.com/@demo' }, { tiktok: 123 }]) {
    assert.ok(validateSocialLinks(socialLinks));
    assert.throws(() => parseCreators(JSON.stringify([{ ...creator, socialLinks }])));
  }
});
