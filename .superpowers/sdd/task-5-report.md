# Task 5 report — Astro release hardening

Date: 2026-08-24

This is not a production-release approval. External Vercel, Lighthouse, manual zoom, production-domain, and GitHub Pages redirect gates remain blocked by missing authorization or domain information.

## Implemented

- Added axe serious/critical checks, keyboard focus checks, first-focus skip-link coverage, inert turning-leaf checks, JavaScript-off coverage separated from hydrated preference coverage, reduced-motion and increased-contrast coverage, a production CSS contract for reduced transparency, and stable Chromium visual captures in `tests/e2e/`.
- Added `public/robots.txt` and `@astrojs/sitemap`; `astro.config.mjs` remains `output: 'static'` with no Vercel adapter.
- Added `.vercelignore`, updated the Astro/Vercel README, and recorded the release settings and deferred external gates in `docs/release/2026-08-24-vercel-release-checklist.md`.
- Added robots/sitemap metadata to `PortfolioLayout.astro`.
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
- Final Chromium suite: 32 passed (27 functional checks, four reviewed visual baselines, and one Project Archive no-capture assertion).
- Full browser matrix after the WebKit fix: 86 tests passed across Chromium, Firefox, and WebKit; the five visual-file tests are intentionally skipped in Firefox/WebKit because reviewed baselines are Chromium-only (96 total, 10 skipped). The Project Archive screenshot gate remains deferred and uses a truthful no-capture assertion. The earlier WebKit history failure was reproduced, fixed, and the targeted `journal --project=webkit` suite passed 7/7.
- Chromium visual baselines were generated and inspected at recruiter desktop, journal desk, journal mobile, and recruiter tablet sizes; Project Archive has no snapshot until its external UI review is complete.

## Deferred or blocked gates

- No `npx vercel@latest build` or preview deployment: no authorized Vercel project/token/final production domain is available in this sandbox.
- Lighthouse thresholds (performance 90, accessibility 100, best practices 95, SEO 95) require a production-equivalent preview and remain deferred.
- Manual reduced-transparency browser emulation remains deferred because Playwright has no native reduced-transparency setting; the production CSS media block is covered by a static contract test.
- Manual Chromium 200%/400% zoom at `1280×800` remains deferred; automated narrow viewport overflow and control reachability checks pass.
- Production deployment and the former `https://acteus.github.io` redirect were not performed. That external source requires explicit authority and a verified final Vercel URL.
