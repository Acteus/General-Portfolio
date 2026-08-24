# Task 5 report — Astro release hardening

Date: 2026-08-24

This is not a production-release approval. External Vercel, Lighthouse, manual zoom, production-domain, and GitHub Pages redirect gates remain blocked by missing authorization or domain information.

## Implemented

- Added axe serious/critical checks, keyboard focus checks, first-focus skip-link coverage, inert turning-leaf checks, JavaScript-off coverage separated from hydrated preference coverage, reduced-motion and increased-contrast coverage, a production CSS contract for reduced transparency, and stable Chromium visual captures in `tests/e2e/`.
- Added `public/robots.txt` and `@astrojs/sitemap`; `astro.config.mjs` remains `output: 'static'` with no Vercel adapter.
- Added `.vercelignore`, updated the Astro/Vercel README, and recorded the release settings and deferred external gates in `docs/release/2026-08-24-vercel-release-checklist.md`.
- Added robots/sitemap metadata to `PortfolioLayout.astro`.
- Made legacy `#note-*` hashes resolve through the production `deepLinkMap`, canonicalize to journal chapter/spread URLs after hydration, and retain no-JavaScript alias anchors.
- Made the brand and navigation switch between recruiter and journal labels/targets, while preserving valid static anchors without JavaScript.
- Kept plain desktop journal URLs on one resolved chapter/spread, preserved independent mobile `<details>`, restored parameterless Back/Forward defaults, and reconciled mode changes on `popstate`.
- Changed the journal index to progressive-enhancement anchors, added dynamic current/boundary semantics and 44px targets, derived turn direction from manifest order, and added animation setup/rejection cleanup fallbacks.
- Preserved the current leaf transform when a turn is superseded, removed cloned-leaf IDs/IDREFs, and kept mobile chapter selection native-disclosure friendly while scrolling/focusing the selected chapter.
- Added exact internal journal links for both-mode recruiter projects, omitted unavailable role/date metadata, and bound Project Archive source captions to the audited evidence manifest.
- Bound each Project Archive citation and Operations Trail item to its explicit audited claim/path pair (including PublicApp, OwnerApp, indexing/outbox, catalog, and stability-operations sources), with equality assertions in the browser suite.
- Changed `npm test` to run only `test:unit` and removed `test:legacy`.
- Preserved `tests/fixtures/legacy-index.html` and `tests/fixtures/legacy-facts.json` as historical parity evidence. Removed the four legacy implementation files and two obsolete legacy implementation tests after the final parity audit; preserved the unrelated `legacy/package.json` file.
- Made browser Back/Forward restoration commit immediately, preventing WebKit history navigation from waiting on a physical turn animation.
- Kept Project Archive in its truthful no-capture state. No WebP or external product UI snapshot was fabricated.
- Made the sibling Project Archive audit validate evidence shape locally and skip only the optional path audit when `PROJECT_ARCHIVE_REPO` is absent or missing; a supplied available repository remains strict.
- Removed the unverifiable relative `Sitemap` directive from `public/robots.txt`; Vercel should add the absolute sitemap after `SITE_URL` is verified.

## Fresh verification gates

- `npm ci`: passed after refreshing the lockfile metadata; npm reports an existing `jsdom@30.0.1` Node 22.21.1 engine warning, but install completed with 0 vulnerabilities.
- `npm run audit:content`: passed after legacy cleanup.
- `node scripts/audit-project-archive-evidence.mjs`: passed local shape validation with a clear sibling-repository skip because `PROJECT_ARCHIVE_REPO` is unavailable.
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: passed, 0 errors/warnings/hints.
- `ASTRO_TELEMETRY_DISABLED=1 npm run test:unit`: passed, 7 files / 19 tests.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: passed; static output emitted `dist/index.html` and `dist/sitemap-index.xml`.
- Final Chromium suite: 42 passed (37 functional checks, four reviewed visual baselines, and one Project Archive no-capture assertion).
- Full browser matrix: 116 tests passed across Chromium, Firefox, and WebKit; the five visual-file tests are intentionally skipped in Firefox/WebKit because reviewed baselines are Chromium-only (126 total, 10 skipped). The Project Archive screenshot gate remains deferred and uses a truthful no-capture assertion. All 13 journal cases passed in each browser project.
- Chromium visual baselines were generated and inspected at recruiter desktop, journal desk, journal mobile, and recruiter tablet sizes; Project Archive has no snapshot until its external UI review is complete.

## Deferred or blocked gates

- No `npx vercel@latest build` or preview deployment: no authorized Vercel project/token/final production domain is available in this sandbox.
- Lighthouse thresholds (performance 90, accessibility 100, best practices 95, SEO 95) require a production-equivalent preview and remain deferred.
- Manual reduced-transparency browser emulation remains deferred because Playwright has no native reduced-transparency setting; the production CSS media block is covered by a static contract test.
- Manual Chromium 200%/400% zoom at `1280×800` remains deferred; automated narrow viewport overflow and control reachability checks pass.
- Production deployment and the former `https://acteus.github.io` redirect were not performed. That external source requires explicit authority and a verified final Vercel URL.
