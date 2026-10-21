# OKANE Digital

OKANE Digital is a creator directory and administrator portal built with Next.js App Router, React, and TypeScript.

## Run locally

Requires Node.js 22.18+ and npm.

```sh
npm install
Copy-Item .env.example .env.local
npm run admin:hash-password
npm run dev
```

Before starting the site, configure `.env.local`:

- `AUTH_SECRET`: generate a private secret with `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"`.
- `AUTH_TRUST_HOST=true`: needed for local development. In deployment, trust only the correctly configured host/proxy.
- `ADMIN_EMAIL`: the administrator sign-in email.
- `ADMIN_PASSWORD_HASH`: paste the output of `npm run admin:hash-password`. Run it in an interactive terminal; the password is hidden as you type. Use a unique password of at least 12 characters.

For a first local setup in PowerShell, copy `.env.example` to `.env.local`, generate the `AUTH_SECRET` above, then open `.env.local` and fill in all four values. Run `npm run admin:hash-password` to create the password hash and paste that hash into `ADMIN_PASSWORD_HASH`. Restart the development server, then open `/admin/login` (or `/admin`, which redirects there until you sign in). The email and password are the values you configured; there are no built-in demo credentials.

Keep `.env.local` private and out of version control. Never share the password, hash, or `AUTH_SECRET`. The administrator password is verified on the server using scrypt; Auth.js issues an encrypted, HTTP-only session cookie. Only the configured administrator can sign in to `/admin`. Do not use the development demo simulator as an authenticated admin portal: `/demo/admin` is an unauthenticated, browser-local prototype, is unavailable in production, and must contain fictional data only. For a real deployment, use HTTPS and configure secrets and trusted host/proxy settings in the hosting provider.

## Pages

- `/`: OKANE homepage and creator listings.
- `/creators`: searchable creator directory.
- `/creators/[slug]`: creator profile and portfolio.
- `/request/[slug]` and `/request`: in development, these routes run a browser-local quote workflow demo; production builds retain the notice that online quote submissions are unavailable.
- `/demo`: development-only demo control panel.
- `/demo/telegram`: development-only simulated Telegram conversation. It requires the private session link created by a quote request; the link is a bearer token and should not be shared.
- `/demo/admin`: development-only, unauthenticated simulated admin Telegram bot and ratings viewer; not the administrator portal.
- `/admin/login`: administrator sign-in.
- `/admin`: authenticated creator management workspace.
- `/portal` and `/portal/login`: compatibility redirects to the matching `/admin` pages.

Creator information and photography currently included in the site are illustrative and should be replaced with approved real content before launch. Ratings are not shown unless actual rating data is supplied.

The administrator portal uses server-side Auth.js authentication. Creator edits and uploaded portfolio content are currently stored in the browser only; they are not shared between administrators and do not update public profiles. A shared database and media storage are not configured.

### Quote workflow prototype

Run `npm run dev` and open `/demo` to try the development-only quote workflow. It simulates a Telegram connection, client request, admin reply, and request-linked rating using fictional data in browser `localStorage`. There is no client account, client dashboard, or client inbox. The client follows a private session link containing an unguessable token in the URL fragment; the token is checked against local browser data and is not sent in the HTTP request. Treat the link as a bearer link and do not share it.

No real Telegram API, quote API, email, or server-side storage is connected. Demo data is not secure and cannot synchronize across different browsers or devices; separate browser profiles will not share requests or responses. Do not enter real customer information. Malformed stored records are ignored and reported in the simulator. The `/demo` routes are unavailable in production builds, which continue to show the non-submission notice.

## Validation

```sh
npm run typecheck
npm test
npm run build
```
