# OKANE Digital

Phase 1 frontend demo built with Next.js App Router, React, TypeScript, and Tailwind CSS. Production services are intentionally not implemented.

## Run locally

Requires Node.js 22.18+ (for the TypeScript validation test runner) and npm. The app itself supports Next.js's Node.js minimum. The nanoid transitive dependency is pinned to 3.3.16 because the registry returned an unavailable 3.3.20 during installation.

```sh
npm install
npm run dev
```

Open http://localhost:3000. For a production build:

```sh
npm run typecheck
npm test
npm run build
npm start
```

## Pages and components

- `/`: screenshot-inspired landing page, statistic cards, content/activation sections, brand names, and project CTA.
- `/creators`: creator cards and working alphabetical/featured sorting.
- `/creators/[slug]`: individual creator information and illustrative portfolio.
- `/request/[slug]`: simulated Telegram connection, validated request form, and demo confirmation.
- `/portal/login`: simulated admin login with visible demo credentials, validation, show/hide password, and loading state.
- `/portal`: browser-local creator management, search/filter, add/edit/remove creator, image/video upload, edit/remove portfolio content, reset, and logout.
- Shared navigation, mobile menu, footer, creator cards/profile, directory, and request flow components.
- CSS custom properties define color, radius, and typography tokens. Responsive grids and reduced-motion support are included.

## Try the demo

1. Open Our Creators and choose a profile.
2. Select Request work.
3. Optionally expand Demo testing options and enable the connection-error preview. Disable it to continue.
4. Select Simulate Telegram connection.
5. Submit an empty form to see field-level validation; then fill the required fields and submit.
6. Review the demo confirmation. No request is sent or saved.

The selected creator is represented by the route and preserved through the flow. Form values stay only in memory; navigating away or refreshing clears them. No Telegram account is authenticated and no messages are sent. There is no production submission endpoint.

## Design and asset limitations

The Figma integration denied access to file `1TyeOXEshi0wWaimmnIuhr`, node `42:76`. Implementation therefore uses the user-supplied screenshots as reference, rather than extracted Figma measurements. The green typography, white space, burgundy buttons, colorful cards, section order, and profile/request proportions follow those screenshots. Typography uses locally hosted Google Sans (regular 400, medium 500, and bold 700), with natural letter spacing. Its SIL Open Font License is included in `public/fonts/OFL.txt`.

Original photos, partner brand logos, and videos were not accessible. The user-supplied OKANE logo is now used unchanged in the header, with the matching supplied icon as the favicon. Local illustrative Unsplash photos are temporary assets; reference partner brand names are temporary treatments. Exact asset fidelity is not claimed. Creator names follow the supplied screenshots, but photos, categories, descriptions, and portfolio imagery are explicitly demo content. No follower counts or prices are represented as verified. Landing statistics and partner names from the screenshots are labeled pending verification. Replace these with approved content before launch.

Photo source IDs (https://images.unsplash.com/):

| Local file | Source ID |
| --- | --- |
| neary / fashion | photo-1483985988355-763728e1935b |
| ambrel | photo-1500648767791-00dcc994a43e |
| kalucas | photo-1506794778202-cad84cf45f1d |
| michie | photo-1519085360753-af0119f7cbe7 |
| gabriel | photo-1524504388940-b1c1722653e1 |
| city | photo-1519608487953-e999c86e7455 |
| friends | photo-1529156069898-49953e39b3ac |
| nature | photo-1441974231531-c6227db76b6e |
| mountains | photo-1464822759023-fed622ff2c3b |
| sunset | photo-1472120435266-53107fd0c44a |
| landscape | photo-1470770841072-f978cf4d019e |

## Phase 2 — only after approval

Replace the typed sample creator data with database reads. Add PostgreSQL/Prisma and server-validated Route Handlers, expiring Telegram linking tokens, genuine bot verification, request persistence, administrator notifications, result delivery, and Telegram ratings. Add authentication for administrator bot commands, rate limits, webhook verification, and duplicate-submission protection. Keep tokens server-side. Browser-supplied Telegram chat IDs must never be trusted.

The user approved expanding Phase 1 to include a frontend-only administrator portal and a login screen. The portal is a simulated browser-local workspace, not production authentication or a secure admin dashboard. Public profiles remain the fixed sample data; portal edits are not published. See `DEMO.md` for the full client presentation walkthrough. No contact address or creator-application destination was invented.

## Verification

Verified locally: `npm run typecheck`, all ten validation tests, and `npm run build` pass. The production server returned HTTP 200 for the landing page, directory, Ambrel profile, and Ambrel request page; an unknown profile returned HTTP 404. Next.js image optimization returned a valid JPEG with HTTP 200.

Browser-based visual and interaction QA could not run because the in-app browser was unavailable. Responsive CSS is implemented but viewport screenshots, console inspection, mobile menu clicks, and the complete browser submission flow still require verification. Manually check 375, 390, 768, 1024, 1280, 1440, and 1920 pixel widths before approving design fidelity.

## Portal demo implementation

The login is `demo@okane.test` / `OkaneDemo123!`. Authentication is explicitly simulated with a sessionStorage flag. Direct portal visits without that flag redirect to login. Roster and portfolio changes are saved under a versioned localStorage key. Saved data is validated on load; storage errors preserve unsaved edits and display an actionable error. Reset restores sample creators after confirmation. No credentials are stored. Image uploads are checked for decoding and file size; video uploads are checked for readable metadata. Browser quota limits apply.

The native dialog handles focus trapping and Escape. Upload operations are invalidated when panels close so a delayed file read cannot overwrite another edit. All directional arrows are Lucide SVG icons.

## Expanded demo directory

The public roster contains 12 illustrative creators. Browse Creators opens in a
four-column desktop grid, with three, two, and one column layouts at narrower
widths. The homepage retains its list view by default. Seven added names are
fictional examples; portraits do not identify verified creators.

Additional illustrative photo sources (https://images.unsplash.com/):

| Local file | Source ID |
| --- | --- |
| sophea | photo-1438761681033-6461ffad8d80 |
| dara | photo-1504257432389-52343af06ae3 |
| sreypov | photo-1534528741775-53994a69daeb |
| vannak | photo-1535713875002-d1d0cf377fde |
| lina | photo-1517841905240-472988babdf9 |
| piseth | photo-1507591064344-4c6ce005b128 |
| kanika | photo-1544005313-94ddf0286df2 |

## Creator social links

Add/Edit Creator includes optional Facebook, TikTok, Instagram, YouTube, and
website fields. Paste a profile URL; links without a scheme receive https://.
Blank fields are omitted, platform domains are checked, and unsafe URL schemes
are rejected. Existing browser records without social links still load.

Saved links appear in the portal detail and on the matching public sample
profile in the same browser through localStorage. This is a local demo preview,
not publication or a shared database. Newly added portal creators still do not
create public routes. No social accounts are invented for the illustrative
sample roster.
