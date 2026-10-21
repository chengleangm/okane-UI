# OKANE Digital

OKANE Digital is a creator directory and administrator portal built with Next.js App Router, React, and TypeScript.

## Run locally

Requires Node.js 22.18+ and npm.

```sh
npm install
npm run dev
```

Open `/admin/login` to use the public demo account. Its email and password are displayed on the login page, and they work locally and on Vercel without environment variables. Anyone can use this account; it is not secure and must never be used for real or private data. Creator edits and uploads are stored only in that browser.

For a private admin account, configure `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` in the server environment. Generate a private secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"` and run `npm run admin:hash-password` to create the password hash. The public demo login remains available, so this demo portal must not be used for real or private data.

Keep `.env.local` private and out of version control. Never share a real password, hash, or `AUTH_SECRET`. The optional administrator password is verified on the server using scrypt; Auth.js issues an encrypted, HTTP-only session cookie. The public demo account remains available to anyone, so this portal is for demonstration only and must not contain real or private data. The built-in fallback session secret is public and is not suitable for real authentication. For any real deployment, replace the demo setup with a private account, configure `AUTH_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD_HASH` in the hosting provider, and use HTTPS with a trusted host/proxy configuration. Do not use the quote workflow demo as an authenticated admin portal: `/demo/admin` is a separate unauthenticated, browser-local prototype.

## Pages

- `/`: OKANE homepage and creator listings.
- `/creators`: searchable creator directory.
- `/creators/[slug]`: creator profile and portfolio.
- `/request/[slug]` and `/request`: browser-local quote workflow demo; this does not submit real quote requests.
- `/demo`: quote demo control panel.
- `/demo/telegram`: simulated Telegram conversation. It requires the private session link created by a quote request; the link is a bearer token and should not be shared.
- `/demo/admin`: unauthenticated simulated admin Telegram bot and ratings viewer; not the administrator portal.
- `/admin/login`: administrator sign-in.
- `/admin`: authenticated creator management workspace.
- `/portal` and `/portal/login`: compatibility redirects to the matching `/admin` pages.

Creator information and photography currently included in the site are illustrative and should be replaced with approved real content before launch. Ratings are not shown unless actual rating data is supplied.

The administrator portal uses server-side Auth.js authentication. Creator edits and uploaded portfolio content are currently stored in the browser only; they are not shared between administrators and do not update public profiles. A shared database and media storage are not configured.

### Quote workflow prototype

Open `/demo` locally or on the deployed site to try the quote workflow. It simulates a Telegram connection, client request, admin reply, and request-linked rating using fictional data in browser `localStorage`. There is no client account, client dashboard, or client inbox. The client follows a private session link containing an unguessable token in the URL fragment; the token is checked against local browser data and is not sent in the HTTP request. Treat the link as a bearer link and do not share it.

No real Telegram API, quote API, email, or server-side storage is connected. Demo data is not secure and cannot synchronize across different browsers or devices; separate browser profiles will not share requests or responses. Do not enter real customer information. Malformed stored records are ignored and reported in the simulator.

## Validation

```sh
npm run typecheck
npm test
npm run build
```
