import { scrypt, timingSafeEqual, randomBytes } from 'node:crypto';

const HASH_BYTES = 64;

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, HASH_BYTES, { maxmem: 64 * 1024 * 1024 }, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

export function isAdminAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET?.trim() &&
    process.env.AUTH_SECRET.trim().length >= 32 &&
    process.env.ADMIN_EMAIL?.trim() &&
    /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/i.test(process.env.ADMIN_PASSWORD_HASH ?? ''),
  );
}

export async function verifyAdminPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, saltHex, hashHex, extra] = encodedHash.split('$');
  if (
    algorithm !== 'scrypt' ||
    extra !== undefined ||
    !/^[a-f0-9]{32}$/i.test(saltHex ?? '') ||
    !/^[a-f0-9]{128}$/i.test(hashHex ?? '')
  ) return false;

  const expected = Buffer.from(hashHex, 'hex');
  const actual = await deriveKey(password, Buffer.from(saltHex, 'hex'));
  return timingSafeEqual(expected, actual);
}

export async function createAdminPasswordHash(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await deriveKey(password, salt);
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`;
}
