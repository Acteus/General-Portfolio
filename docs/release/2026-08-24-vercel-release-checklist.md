# Vercel release checklist — 2026-08-24

This checklist records the static release gates for the Astro portfolio. It is intentionally truthful about checks that require a Vercel project, a reviewed preview, or a production domain. No production deployment or external GitHub Pages change was performed in this sandbox.

## Local release candidate

- [x] Astro output remains `static`; `@astrojs/vercel` and server functions are absent.
- [x] `@astrojs/sitemap` is configured and `public/robots.txt` is shipped.
- [x] `npm run audit:content` passes before legacy cleanup.
- [x] Project Archive evidence audit passes with the reviewed source commit.
- [x] `npm run check` passes.
- [x] `npm run test:unit` passes.
- [x] `npm run build` passes and emits `dist/index.html`.
- [x] Chromium accessibility, no-JavaScript, preference, and responsive suites pass.
- [ ] Firefox and WebKit browser projects: not run in this sandbox; browser binaries/matrix execution is deferred to CI or a review machine.
- [ ] Lighthouse thresholds (performance 90, accessibility 100, best practices 95, SEO 95): blocked until a production-equivalent preview is available.
- [ ] 200% and 400% Chromium zoom at `1280×800`: manual browser check remains deferred; automated narrow-flow overflow coverage passes.
- [x] Chromium visual baselines generated and inspected for the requested recruiter/journal layouts; the Project Archive image is a portfolio layout capture only, not an external product capture. Firefox/WebKit remain functional-matrix checks; visual baselines are intentionally Chromium-only.

## Vercel project settings

Configure these values in the Vercel project before preview approval:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Node.js | 22.x |
| Production branch | `main` |
| `SITE_URL` | Set to the verified final production domain |

Local `npx vercel@latest build` and preview deployment were not run because no Vercel project, token, or final domain is authorized in this sandbox. Run them after project access is supplied, then record the preview URL and results here.

## Preview verification (deferred)

- Preview URL: not available — no deployment performed.
- [ ] Canonical and Open Graph URLs use the configured preview/production `SITE_URL`.
- [ ] Resume, email, GitHub, public repositories, and verified links resolve.
- [ ] Direct mode/chapter/spread URLs and theme persistence survive reload.
- [ ] No console errors, failed assets, or mixed-content requests.
- [ ] Project Archive remains a truthful no-capture state until the external screenshot gate is reviewed; no WebP or external UI snapshot is fabricated here.
- [ ] Lighthouse thresholds verified over the preview network.

## Production and legacy entry

- Production deployment: not performed.
- Former `https://acteus.github.io` entry: unchanged. It is outside this repository and requires explicit authority plus a verified final Vercel URL before redirecting. Query/hash preservation and the old `#note-jobboard`, `#note-private-work`, and `#note-discord-bot` links must be rechecked after that external change.
