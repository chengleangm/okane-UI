import { stdin, stdout } from 'node:process';
import { createAdminPasswordHash } from '../src/lib/admin-auth.ts';

if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
  throw new Error('Run this command in an interactive terminal.');
}

stdout.write('Admin password (input hidden): ');
stdin.setRawMode(true);
stdin.resume();

let password = '';
function cleanup() {
  stdin.setRawMode(false);
  stdin.pause();
  stdout.write('\n');
}

stdin.on('data', async chunk => {
  for (const character of chunk.toString()) {
    if (character === '\u0003') {
      cleanup();
      process.exit(1);
    }
    if (character === '\r' || character === '\n') {
      cleanup();
      if (password.length < 12) {
        console.error('Use a password with at least 12 characters.');
        process.exitCode = 1;
        return;
      }
      console.log(await createAdminPasswordHash(password));
      password = '';
      return;
    }
    if (character === '\u007f' || character === '\b') {
      password = password.slice(0, -1);
    } else {
      password += character;
    }
  }
});
