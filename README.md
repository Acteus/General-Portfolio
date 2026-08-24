# Garren Dullas — Cloud & Platform Engineering Portfolio

Static Astro portfolio for Garren Dullas, an Information Technology student focused on deploying and operating cloud-hosted backend systems.

The former GitHub Pages entry remains unchanged until a verified Vercel production domain and explicit redirect authority are available.

## Focus

The portfolio is organized around three signals:

- Cloud and platform operations: Azure Container Apps, Azure Container Registry, Docker, Podman, GitHub Actions, Linux, managed identity, and logging.
- Backend systems: Python, FastAPI, PHP, Laravel, SQL, Caddy, Quadlet, and shell scripting.
- Supporting application and data work: JavaScript, TypeScript, React, Flutter, TensorFlow, NLP, and causal inference.

Projects are labeled by their actual status, including public repository, private project, in development, and link pending.

## Stack

- Astro 7 with static output and an `@astrojs/react` journal island
- Structured Astro content collection with build-time schema validation
- Motion for the interruptible journal spread transition
- Self-hosted Fraunces, IBM Plex Sans, and IBM Plex Mono fonts
- Vitest, Testing Library, axe-core, and Playwright for verification
- Vercel static hosting target (no adapter or server functions)

## Files

```text
.
├── src/content.config.ts       # Project collection schema
├── src/data/projects/          # Validated factual project records
├── src/layouts/                # Shared document shell and metadata
├── src/components/             # Recruiter, journal, and evidence components
├── public/output/pdf/          # Shipped resume asset
├── tests/                      # Unit, parity, preference, and browser suites
└── docs/release/               # Vercel release checklist and deferred gates
```

## Local preview

Install the locked dependencies and start the Astro development server:

```bash
npm ci
npm run dev
```

For a production-equivalent local build:

```bash
npm run build
npm run preview
```

## Updating content

Project descriptions, links, status labels, skills, and contact information live in the Astro content records and `src/data/site.ts`. Keep project claims aligned with evidence: distinguish deployed systems from private work, prototypes, and planned case studies. Project Archive captures remain deferred until the external redesign/evidence gate is reviewed; the shipped page uses a truthful no-capture state.

The cloud/platform resume is linked from the navigation and hero section as `public/output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf`. The original `Resume.pdf` is retained as an older version while the portfolio is being polished.

## Deployment

This is a static Astro site. Vercel should use the Astro preset, `npm ci`, `npm run build`, `dist`, and Node 22.x. Set `SITE_URL` to the verified production domain so canonical, Open Graph, and sitemap URLs are correct. See [the release checklist](docs/release/2026-08-24-vercel-release-checklist.md) for deferred preview, Lighthouse, browser-matrix, and external redirect gates. Do not change the former GitHub Pages entry from this repository.

## Contact

- Email: garrendullas@gmail.com
- GitHub: [@Acteus](https://github.com/Acteus)
