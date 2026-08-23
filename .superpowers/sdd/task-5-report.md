# Task 5 report — Astro release hardening

Date: 2026-08-24

## Implemented

- Added axe serious/critical checks, keyboard focus checks, inert turning-leaf checks, JavaScript-off coverage, reduced-motion coverage, injected reduced-transparency/contrast preference coverage, and stable Chromium visual captures in `tests/e2e/`.
- Added `public/robots.txt` and `@astrojs/sitemap`; `astro.config.mjs` remains `output: 'static'` with no Vercel adapter.
- Added `.vercelignore`, updated the Astro/Vercel README, and recorded the release settings and deferred external gates in `docs/release/2026-08-24-vercel-release-checklist.md`.
- Added robots/sitemap metadata to `PortfolioLayout.astro`.
- Changed `npm test` to run only `test:unit` and removed `test:legacy`.
- Preserved `tests/fixtures/legacy-index.html` and `tests/fixtures/legacy-facts.json` as historical parity evidence. Removed the four legacy implementation files and two obsolete legacy implementation tests after the final parity audit; preserved the unrelated `legacy/package.json` file.
- Made browser Back/Forward restoration commit immediately, preventing WebKit history navigation from waiting on a physical turn animation.
- Kept Project Archive in its truthful no-capture state. No WebP or external product UI snapshot was fabricated.

## Fresh verification gates

- `npm ci`: passed after refreshing the lockfile metadata; npm reports an existing `jsdom@30.0.1` Node 22.21.1 engine warning, but install completed with 0 vulnerabilities.
- `npm run audit:content`: passed after legacy cleanup.
- `node scripts/audit-project-archive-evidence.mjs`: passed.
- `ASTRO_TELEMETRY_DISABLED=1 npm run check`: passed, 0 errors/warnings/hints.
- `ASTRO_TELEMETRY_DISABLED=1 npm run test:unit`: passed, 6 files / 17 tests.
- `ASTRO_TELEMETRY_DISABLED=1 npm run build`: passed; static output emitted `dist/index.html` and `dist/sitemap-index.xml`.
- Final Chromium suite: 32 passed.
- Full browser matrix after the WebKit fix: Chromium, Firefox, and WebKit functional coverage passed; the five visual tests are intentionally skipped in Firefox/WebKit because reviewed baselines are Chromium-only. The earlier WebKit history failure was reproduced, fixed, and the targeted `journal --project=webkit` suite passed 7/7.
- Chromium visual baselines were generated and inspected at recruiter desktop, journal desk, Project Archive spread 3 layout, journal mobile, and recruiter tablet sizes.

## Deferred or blocked gates

- No `npx vercel@latest build` or preview deployment: no authorized Vercel project/token/final production domain is available in this sandbox.
- Lighthouse thresholds (performance 90, accessibility 100, best practices 95, SEO 95) require a production-equivalent preview and remain deferred.
- Manual Chromium 200%/400% zoom at `1280×800` remains deferred; automated narrow viewport overflow and control reachability checks pass.
- Production deployment and the former `https://acteus.github.io` redirect were not performed. That external source requires explicit authority and a verified final Vercel URL.
