# Illuminated Engineer's Notebook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the existing portfolio to a statically generated Astro 7 site that preserves its factual content and two modes, deepens the journal into the approved Illuminated Engineer's Notebook, adds the source-backed Project Archive flagship chapter, and ships safely on Vercel.

**Architecture:** Astro owns the document, content collection, metadata, factual markup, and static build. A single React/Motion island enhances the server-rendered journal roots; it owns navigation state and temporary turn layers, never project facts. Light journal and dark recruiter views read the same validated project records and remain fully readable when JavaScript or animation is unavailable.

**Tech Stack:** Node.js 22, Astro 7.2.4, `@astrojs/react` 6.0.4, React 19.2.8, Motion 13.1.0, TypeScript, Zod through `astro/zod`, Vitest, Testing Library, Playwright, axe-core, CSS custom properties, static Vercel output.

## Global Constraints

- Read `DESIGN.md` and `docs/superpowers/specs/2026-08-24-illuminated-engineers-notebook-redesign-design.md` before editing.
- Use `frontend-design` for distinctive editorial execution, `apple-design` for spatial feedback and restraint, `accessibility` for WCAG 2.2 AA, and `vercel-react-best-practices` for the React island. `design-consultation` and `imagegen-frontend-web` already shaped the approved direction; do not reopen art direction during implementation.
- Keep both experiences: light is the warm journal; dark is the proof-first recruiter view. Both consume the same content collection.
- Preserve every current project fact, status, repository URL, resume path, email path, and `#note-*` deep link before removing the legacy implementation.
- Add Project Archive claims only when a repository file, test, approved design document, deployment record, or reviewed product capture supports the claim.
- Do not use generated imagery as Project Archive evidence. Product captures must come from the reviewed Project Archive build or verified deployment.
- Render all factual content in `.astro` components. The React island receives only `id`, `label`, `spreadCount`, and navigation metadata.
- Hydrate only `JournalIsland.tsx`; do not convert the page shell, recruiter view, or factual chapters into React.
- Static output only. Do not add `@astrojs/vercel`, SSR, actions, sessions, middleware, a CMS, or runtime Project Archive API calls.
- Motion timings: press `100–180ms`, evidence reveal `180–280ms`, journal turn `420–520ms`; no bounce and no continuous decorative loops.
- At `prefers-reduced-motion: reduce`, commit navigation directly with a short opacity transition. At reduced transparency use solid surfaces. At increased contrast strengthen boundaries, labels, selection, and focus.
- Controls must remain at least `44px` on touch layouts; focus must survive theme switches and journal turns.
- Test widths `375`, `768`, `1024`, and `1440`; test Chromium, Firefox, and WebKit; test JavaScript disabled and 400% zoom.
- Commit `package-lock.json`. Do not commit `node_modules`, `dist`, Playwright reports, Vercel local state, or generated test artifacts.
- Do not deploy production or change the former GitHub Pages site until every Task 5 gate passes and the final Vercel domain is known.

## Luna Execution Contract

- Use `gpt-5.6-luna` for implementation workers and a fresh worker per task through `subagent-driven-development`.
- Work in an isolated worktree created at execution time. Record task commits in `.superpowers/sdd/progress.md`.
- Run the focused test before the full gate in every task. A failed gate remains in the same task until green.
- Review every task for specification compliance first and code quality second before dispatching the next worker.
- Task 4 contains an external evidence gate. If the referenced Project Archive redesign task is still active, finish the source-backed markup and tests, then pause only the capture substep until that task is reviewed.

## File Structure

```text
legacy/                              Frozen pre-Astro implementation used only for parity
public/
  assets/project-archive/            Reviewed Project Archive captures and annotation SVGs
  output/pdf/                         Existing public resume
src/
  components/
    artifacts/                        Evidence, architecture, operations, and live-doorway views
    journal/                          Journal chapter markup and one React controller island
    recruiter/                        Dark proof-first project summaries
    ui/                               Shared status, link, and typography primitives
  data/
    projects/*.json                   One validated record per project
    site.ts                           Identity, navigation, skills, contact, and deep-link map
    project-archive-evidence.json     Audited source paths and capture metadata
  layouts/PortfolioLayout.astro       Metadata, early theme bootstrap, shell, and shared assets
  pages/index.astro                   Loads content once and composes both modes
  scripts/theme.ts                    Pure theme/URL helpers plus browser bootstrap
  styles/                             Tokens, base, recruiter, journal, preferences
  content.config.ts                   Project collection schema
tests/
  e2e/                                Browser, accessibility, no-JS, and responsive coverage
  fixtures/                           Frozen legacy facts and evidence audit fixture
  unit/                               Schema, theme, and journal state coverage
scripts/
  audit-legacy-content.mjs            Compares migrated records to the frozen legacy page
  audit-project-archive-evidence.mjs  Verifies the flagship audit against the sibling repository
```

---

### Task 1: Establish the Astro 7 static foundation and freeze the parity baseline

**Files:**
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.nvmrc`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `src/env.d.ts`
- Create: `src/pages/index.astro`
- Create: `tests/unit/foundation.test.ts`
- Create: `tests/fixtures/legacy-index.html`
- Move: `index.html` to `legacy/index.html`
- Move: `css/style.css` to `legacy/css/style.css`
- Move: `js/main.js` to `legacy/js/main.js`
- Move: `js/journal-flip.js` to `legacy/js/journal-flip.js`
- Move: `output/pdf/` to `public/output/pdf/`
- Modify: `.gitignore`
- Modify: `scripts/build_resume.py`
- Modify: `tests/apple-material-refinement.test.mjs`
- Modify: `tests/journal-flip.test.mjs`

**Interfaces:**
- Consumes: the existing static site and Node.js `22.x`.
- Produces: `npm run dev`, `npm run build`, `npm run check`, `npm run test:unit`, `npm run test:legacy`, and `npm run test:e2e`; static output in `dist/`; a frozen legacy reference that later tasks can audit.

- [ ] **Step 1: Archive the current implementation without changing its contents**

Run:

```bash
mkdir -p legacy/css legacy/js tests/fixtures
git mv index.html legacy/index.html
git mv css/style.css legacy/css/style.css
git mv js/main.js legacy/js/main.js
git mv js/journal-flip.js legacy/js/journal-flip.js
mkdir -p public/output
git mv output/pdf public/output/pdf
cp legacy/index.html tests/fixtures/legacy-index.html
```

Update both legacy tests so their imports resolve from `legacy/`:

```js
const html = readFileSync(new URL('../legacy/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../legacy/css/style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../legacy/js/main.js', import.meta.url), 'utf8');
const journalJs = readFileSync(new URL('../legacy/js/journal-flip.js', import.meta.url), 'utf8');
```

For `tests/journal-flip.test.mjs`, change only the require path:

```js
const {
  createJournalFlipController,
  getFlipDirection,
  getLeafFaces,
  shouldAnimateJournal,
  TURN_DURATION,
} = require('../legacy/js/journal-flip.js');
```

Update the resume generator output in `scripts/build_resume.py` from `output/pdf` to `public/output/pdf` so future resume builds replace the shipped asset rather than recreate the legacy directory.

- [ ] **Step 2: Create the package and tool configuration**

Use this `package.json`:

```json
{
  "name": "garren-dullas-portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "engines": { "node": "22.x" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "npm run test:unit && npm run test:legacy",
    "test:unit": "vitest run",
    "test:legacy": "node --test tests/*.test.mjs",
    "test:e2e": "playwright test",
    "verify": "npm run check && npm run test && npm run build"
  },
  "dependencies": {
    "@astrojs/react": "6.0.4",
    "@fontsource-variable/fraunces": "latest",
    "@fontsource/ibm-plex-mono": "latest",
    "@fontsource/ibm-plex-sans": "latest",
    "astro": "7.2.4",
    "motion": "13.1.0",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@astrojs/check": "latest",
    "@axe-core/playwright": "latest",
    "@playwright/test": "1.62.1",
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

Use `.nvmrc`:

```text
22
```

Use `astro.config.mjs`:

```js
import react from '@astrojs/react';
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  integrations: [react()],
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  trailingSlash: 'never',
});
```

Use `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "legacy"],
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

Use `vitest.config.ts`:

```ts
/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    setupFiles: ['tests/unit/setup.ts'],
  },
});
```

Use `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: 'test-results',
  reporter: [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

Use `src/env.d.ts`:

```ts
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
```

Add `tests/unit/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Remove `package-lock.json` from `.gitignore`; add:

```gitignore
.astro/
.vercel/
playwright-report/
test-results/
coverage/
```

Run:

```bash
npm install
npx playwright install chromium firefox webkit
```

Expected: a committed `package-lock.json`; all three Playwright browser binaries install successfully.

- [ ] **Step 3: Write the failing foundation test**

Create `tests/unit/foundation.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Astro foundation', () => {
  it('is static and hydrates React only through the configured integration', () => {
    const config = readFileSync('astro.config.mjs', 'utf8');
    expect(config).toContain("output: 'static'");
    expect(config).toContain('integrations: [react()]');
    expect(config).not.toContain('@astrojs/vercel');
  });

  it('keeps the legacy portfolio as a non-shipping parity fixture', () => {
    expect(readFileSync('tests/fixtures/legacy-index.html', 'utf8')).toContain('Garren Dullas');
    expect(readFileSync('legacy/index.html', 'utf8')).toContain('note-jobboard');
  });

  it('has an Astro page with the existing public identity', () => {
    expect(readFileSync('src/pages/index.astro', 'utf8')).toContain('Garren Dullas');
  });
});
```

Run: `npm run test:unit`

Expected: FAIL with `ENOENT` for `src/pages/index.astro`.

- [ ] **Step 4: Add the smallest static Astro page**

Create `src/pages/index.astro`:

```astro
---
const title = 'Garren Dullas — Cloud & Platform Engineer';
---

<!doctype html>
<html lang="en" data-theme="dark" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="Cloud and platform engineering portfolio of Garren Dullas." />
    <title>{title}</title>
  </head>
  <body>
    <main id="main-content">
      <h1>Garren Dullas</h1>
      <p>Cloud &amp; Platform Engineer</p>
    </main>
  </body>
</html>
```

- [ ] **Step 5: Run the Task 1 gate**

Run:

```bash
npm run test:unit
npm run test:legacy
npm run check
npm run build
```

Expected: unit and legacy suites pass, Astro reports no type errors, and `dist/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add .gitignore .nvmrc package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts playwright.config.ts public src scripts/build_resume.py tests legacy
git commit -m "build: establish Astro portfolio foundation"
```

---

### Task 2: Create the validated project model and render semantic dual-mode parity

**Files:**
- Create: `src/content.config.ts`
- Create: `src/data/site.ts`
- Create: `src/data/projects/project-archive.json`
- Create: `src/data/projects/jobboard-devops.json`
- Create: `src/data/projects/jru-atlas.json`
- Create: `src/data/projects/laborwise.json`
- Create: `src/data/projects/github-discord-bot.json`
- Create: `src/data/projects/sumwork.json`
- Create: `src/data/projects/transport-ph.json`
- Create: `src/data/projects/estate-price-predictor.json`
- Create: `src/data/projects/seird-epidemic-simulator.json`
- Create: `src/data/projects/mindmate-ai.json`
- Create: `src/data/projects/iso-compliance-validator.json`
- Create: `src/data/projects/lifeline-emergency-app.json`
- Create: `src/data/projects/iot-sensor-monitor.json`
- Create: `src/layouts/PortfolioLayout.astro`
- Create: `src/components/recruiter/RecruiterPortfolio.astro`
- Create: `src/components/recruiter/RecruiterProject.astro`
- Create: `src/components/journal/JournalPortfolio.astro`
- Create: `src/components/journal/JournalChapter.astro`
- Create: `src/components/ui/StatusLabel.astro`
- Create: `src/components/ui/VerifiedLink.astro`
- Create: `src/scripts/theme.ts`
- Create: `scripts/audit-legacy-content.mjs`
- Create: `tests/fixtures/legacy-facts.json`
- Create: `tests/unit/content-schema.test.ts`
- Create: `tests/unit/theme.test.ts`
- Create: `tests/e2e/parity.spec.ts`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: Task 1 Astro shell and frozen legacy page.
- Produces: collection `projects`; `Theme = 'light' | 'dark'`; `ProjectRecord` inferred from the collection; `deepLinkMap`; semantic recruiter and journal roots; verified link/status behavior.

- [ ] **Step 1: Define and test the collection contract**

Create `src/content.config.ts`:

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const linkSchema = z.object({
  label: z.string().min(1),
  href: z.string().url(),
  kind: z.enum(['repository', 'live']),
});

const evidenceSchema = z.object({
  kind: z.enum(['path', 'citation', 'architecture', 'status', 'capture', 'operation']),
  label: z.string().min(1),
  value: z.string().min(1),
  sourcePath: z.string().min(1).optional(),
});

const spreadSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().min(1),
  narrative: z.array(z.string().min(1)).min(1),
  artifactIds: z.array(z.string().min(1)).min(1),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/data/projects' }),
  schema: z.object({
    order: z.number().int().nonnegative(),
    title: z.string().min(1),
    role: z.string().min(1),
    date: z.string().min(1),
    status: z.enum(['public', 'private', 'in-progress', 'deployed', 'link-pending']),
    statusLabel: z.string().min(1),
    chapterType: z.enum(['field-note', 'case-study', 'flagship']),
    themeAvailability: z.enum(['both', 'recruiter-only']),
    recruiterSummary: z.string().min(1),
    story: z.array(z.string().min(1)).min(1),
    technicalNarrative: z.array(z.string().min(1)).min(1),
    technologies: z.array(z.string().min(1)).min(1),
    verifiedClaims: z.array(z.string().min(1)),
    evidence: z.array(evidenceSchema),
    spreads: z.array(spreadSchema),
    links: z.array(linkSchema),
    architecture: z.array(z.string().min(1)).optional(),
    operations: z.array(z.string().min(1)).optional(),
    lessons: z.array(z.string().min(1)).optional(),
    outcome: z.string().min(1).optional(),
    legacyHashes: z.array(z.string().regex(/^#note-[a-z0-9-]+$/)),
  }).superRefine((project, ctx) => {
    if (project.chapterType === 'flagship' && project.spreads.length !== 5) {
      ctx.addIssue({ code: 'custom', path: ['spreads'], message: 'A flagship requires exactly five spreads.' });
    }
    if (project.links.some(link => link.href.includes('example.com'))) {
      ctx.addIssue({ code: 'custom', path: ['links'], message: 'Unverified example links are forbidden.' });
    }
  }),
});

export const collections = { projects };
```

Create `tests/unit/content-schema.test.ts`:

```ts
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('project content', () => {
  it('contains the complete named project inventory', () => {
    const files = readdirSync('src/data/projects').filter(file => file.endsWith('.json'));
    expect(files).toHaveLength(13);
    expect(files).toContain('project-archive.json');
    expect(files).toContain('jobboard-devops.json');
    expect(files).toContain('iot-sensor-monitor.json');
  });

  it('never publishes an inactive URL', () => {
    for (const file of readdirSync('src/data/projects')) {
      if (!file.endsWith('.json')) continue;
      const data = JSON.parse(readFileSync(`src/data/projects/${file}`, 'utf8'));
      for (const link of data.links) expect(link.href).not.toContain('example.com');
      if (['private', 'link-pending'].includes(data.status)) {
        expect(data.links.filter((link: { kind: string }) => link.kind === 'live')).toHaveLength(0);
      }
    }
  });

  it('passes Astro content validation', () => {
    expect(() => execFileSync('npx', ['astro', 'sync'], { stdio: 'pipe' })).not.toThrow();
  });
});
```

Run: `npm run test:unit -- content-schema`

Expected: FAIL because the 13 records do not exist.

- [ ] **Step 2: Migrate the exact project inventory**

Create one JSON file per inventory row. Copy prose, role, dates, technologies, and links verbatim from `legacy/index.html`; do not rewrite facts during migration.

| id | chapter | modes | status | verified link |
|---|---|---|---|---|
| `project-archive` | flagship | both | in-progress until verified live | live URL only after HTTP and UI verification |
| `jobboard-devops` | field-note | both | public | `https://github.com/Acteus/JobBoard-DevOps-Project` |
| `jru-atlas` | field-note | both | private | none |
| `laborwise` | field-note | both | private | none |
| `github-discord-bot` | field-note | both | deployed | `https://github.com/Acteus/github-discord-bot` |
| `sumwork` | field-note | recruiter-only | link-pending | none |
| `transport-ph` | field-note | recruiter-only | public | `https://github.com/Acteus/TransPort-PH` |
| `estate-price-predictor` | field-note | recruiter-only | public | `https://github.com/Acteus/Estate-Prices-NN` |
| `seird-epidemic-simulator` | field-note | recruiter-only | public | `https://github.com/Acteus/Simple-Epidemic` |
| `mindmate-ai` | field-note | recruiter-only | public | `https://github.com/Acteus/Mindmate` |
| `iso-compliance-validator` | field-note | recruiter-only | link-pending | none |
| `lifeline-emergency-app` | field-note | recruiter-only | link-pending | none |
| `iot-sensor-monitor` | field-note | recruiter-only | public | `https://github.com/Acteus/IoT-Sensor-Dashboard` |

Use this exact shape for every non-flagship record, shown with JobBoard:

```json
{
  "order": 1,
  "title": "JobBoard-DevOps",
  "role": "Cloud / DevOps Developer",
  "date": "2025",
  "status": "public",
  "statusLabel": "Public repository",
  "chapterType": "field-note",
  "themeAvailability": "both",
  "recruiterSummary": "A full-stack job platform with an AWS-to-Azure deployment study. I worked across the application, containerization, cloud architecture, and delivery pipeline using Azure Static Web Apps, Container Apps, MySQL, Docker, GitHub Actions, and ARM templates.",
  "story": ["A full-stack job platform became a practical study in moving a deployment from AWS to Azure while keeping the application, containers, and delivery pipeline understandable."],
  "technicalNarrative": ["The frontend and backend are separated, container delivery is automated, and the Azure path uses Static Web Apps, Container Apps, MySQL, GitHub Actions, Docker, and ARM templates."],
  "technologies": ["Azure", "Docker", "GitHub Actions", "ARM Templates", "MySQL"],
  "verifiedClaims": ["Frontend / backend separation", "Automated container delivery", "AWS-to-Azure migration work"],
  "evidence": [{ "kind": "architecture", "label": "Delivery path", "value": "GitHub Actions → Azure Static Web Apps / Azure Container Apps → MySQL" }],
  "spreads": [],
  "links": [{ "label": "View public repository", "href": "https://github.com/Acteus/JobBoard-DevOps-Project", "kind": "repository" }],
  "architecture": ["GitHub Actions", "Azure Static Web Apps", "Azure Container Apps", "MySQL"],
  "operations": [],
  "lessons": [],
  "outcome": "A public, inspectable deployment study across application and platform concerns.",
  "legacyHashes": ["#note-jobboard"]
}
```

For `project-archive.json`, use the approved five question labels and the cover line from the spec. Its links array stays empty until Task 4 verifies the live URL. Its evidence items use repository-relative paths, never absolute Mac paths.

Create `src/data/site.ts` with the non-project facts that both modes share:

```ts
export const site = {
  name: 'Garren Dullas',
  role: 'Cloud & Platform Engineer',
  email: 'mailto:garrendullas@gmail.com',
  github: 'https://github.com/Acteus',
  resume: '/output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf',
  location: 'Philippines',
  navigation: [
    { id: 'home', recruiter: 'Home', journal: 'Home' },
    { id: 'about', recruiter: 'About', journal: 'Story' },
    { id: 'skills', recruiter: 'Skills', journal: 'Now' },
    { id: 'projects', recruiter: 'Projects', journal: 'Notes' },
    { id: 'contact', recruiter: 'Contact', journal: 'Say hello' },
  ],
} as const;
```

Port the existing About, Story, Skills, Now, education, certification, and contact prose from `legacy/index.html` into named exports in this file without rewriting the claims. Keep the current section ordering so the parity audit and recruiter scan remain stable.

- [ ] **Step 3: Freeze and audit legacy facts**

Create `tests/fixtures/legacy-facts.json` with these required strings grouped as `titles`, `links`, `statuses`, and `contact`:

```json
{
  "titles": ["JobBoard-DevOps", "JRU Atlas", "LaborWise", "GitHub → Discord Bot", "Sumwork", "TransPort-PH: Traffic Policy Analyzer", "Estate Price Predictor", "SEIRD Epidemic Simulator", "MindMate AI", "ISO Compliance Validator", "Lifeline Emergency App", "IoT Sensor Monitor"],
  "links": ["https://github.com/Acteus/JobBoard-DevOps-Project", "https://github.com/Acteus/github-discord-bot", "https://github.com/Acteus/TransPort-PH", "https://github.com/Acteus/Estate-Prices-NN", "https://github.com/Acteus/Simple-Epidemic", "https://github.com/Acteus/Mindmate", "https://github.com/Acteus/IoT-Sensor-Dashboard"],
  "statuses": ["Private repository", "Link pending", "Public repository", "deployment details being documented", "sanitized case study planned"],
  "contact": ["mailto:garrendullas@gmail.com", "https://github.com/Acteus", "output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf"]
}
```

Create `scripts/audit-legacy-content.mjs`:

```js
import { readFileSync, readdirSync } from 'node:fs';

const legacy = readFileSync('tests/fixtures/legacy-index.html', 'utf8');
const fixture = JSON.parse(readFileSync('tests/fixtures/legacy-facts.json', 'utf8'));
const records = readdirSync('src/data/projects')
  .filter(file => file.endsWith('.json'))
  .map(file => JSON.parse(readFileSync(`src/data/projects/${file}`, 'utf8')));
const migrated = `${JSON.stringify(records)}\n${readFileSync('src/data/site.ts', 'utf8')}`;

for (const [group, values] of Object.entries(fixture)) {
  for (const value of values) {
    if (!legacy.includes(value)) throw new Error(`${group}: legacy source missing ${value}`);
    if (!migrated.includes(value)) throw new Error(`${group}: migrated content missing ${value}`);
  }
}

console.log('Legacy content audit passed.');
```

Add `"audit:content": "node scripts/audit-legacy-content.mjs"` to `package.json`.

Run: `npm run audit:content`

Expected: `Legacy content audit passed.`

- [ ] **Step 4: Add pure theme and URL behavior with tests**

Create `src/scripts/theme.ts` with this public API:

```ts
export type Theme = 'light' | 'dark';

export const deepLinkMap: Record<string, string> = {
  '#note-jobboard': 'jobboard-devops',
  '#note-private-work': 'jru-atlas',
  '#note-discord-bot': 'github-discord-bot',
};

export function resolveTheme(url: URL, stored: string | null, prefersDark: boolean): Theme {
  const requested = url.searchParams.get('mode');
  if (requested === 'journal') return 'light';
  if (requested === 'recruiter') return 'dark';
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function portfolioUrl(current: URL, theme: Theme, chapter?: string, spread?: number): URL {
  const next = new URL(current);
  next.searchParams.set('mode', theme === 'light' ? 'journal' : 'recruiter');
  if (chapter) next.searchParams.set('chapter', chapter);
  if (typeof spread === 'number') next.searchParams.set('spread', String(spread));
  return next;
}
```

Create `tests/unit/theme.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { deepLinkMap, portfolioUrl, resolveTheme } from '../../src/scripts/theme';

describe('theme and portfolio URLs', () => {
  it('gives an explicit URL mode precedence over storage and media', () => {
    expect(resolveTheme(new URL('https://portfolio.test/?mode=journal'), 'dark', true)).toBe('light');
  });

  it('preserves chapter context across mode changes', () => {
    const next = portfolioUrl(new URL('https://portfolio.test/?chapter=project-archive&spread=2'), 'dark', 'project-archive', 2);
    expect(next.searchParams.get('mode')).toBe('recruiter');
    expect(next.searchParams.get('chapter')).toBe('project-archive');
    expect(next.searchParams.get('spread')).toBe('2');
  });

  it('maps every existing journal hash', () => {
    expect(deepLinkMap).toEqual({
      '#note-jobboard': 'jobboard-devops',
      '#note-private-work': 'jru-atlas',
      '#note-discord-bot': 'github-discord-bot',
    });
  });
});
```

Run: `npm run test:unit -- theme`

Expected: PASS.

- [ ] **Step 5: Render both modes from the collection**

`PortfolioLayout.astro` must:

- render title, description, canonical, Open Graph, and theme-color metadata;
- include a skip link and one `<main id="main-content">`;
- run an inline head script before styles paint that resolves `mode`, storage key `portfolio-theme`, and `prefers-color-scheme`;
- remove `no-js`, set `data-theme`, and expose a labelled theme switch;
- show both mode sections under `.no-js` so no-JS visitors receive all content.

`RecruiterPortfolio.astro` must render identity, skills, all 13 project summaries, status text, verified links, contact, GitHub, and the resume.

`JournalPortfolio.astro` must render Project Archive, JobBoard, JRU Atlas, LaborWise, and GitHub → Discord as semantic `<details data-journal-chapter>` roots. Each chapter includes story, technical narrative, evidence, technologies, status, and links. At this task, details open and close natively; no animated controller exists.

`VerifiedLink.astro` must accept:

```ts
interface Props {
  href?: string;
  label: string;
  statusLabel: string;
}
```

When `href` exists render an `<a>`; otherwise render `<span role="status">{statusLabel}</span>`. Never render `href=""`, `href="#"`, or a disabled anchor.

Replace `src/pages/index.astro` with collection composition:

```astro
---
import { getCollection } from 'astro:content';
import JournalPortfolio from '../components/journal/JournalPortfolio.astro';
import RecruiterPortfolio from '../components/recruiter/RecruiterPortfolio.astro';
import PortfolioLayout from '../layouts/PortfolioLayout.astro';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
---

<PortfolioLayout>
  <RecruiterPortfolio projects={projects} />
  <JournalPortfolio projects={projects} />
</PortfolioLayout>
```

- [ ] **Step 6: Add the first browser parity test**

Create `tests/e2e/parity.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test('renders recruiter and journal modes from the same projects', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.getByRole('heading', { name: 'JobBoard-DevOps' })).toBeVisible();
  await page.getByRole('button', { name: /switch to journal/i }).click();
  await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
  await expect(page.getByText('JobBoard-DevOps', { exact: true }).first()).toBeVisible();
});

test('keeps inactive project links truthful', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await expect(page.getByText('Link pending', { exact: true }).first()).toBeVisible();
  await expect(page.locator('a[href=""], a[href="#"]')).toHaveCount(0);
});
```

Run:

```bash
npm run build
npm run test:e2e -- parity --project=chromium
```

Expected: PASS.

- [ ] **Step 7: Run the Task 2 gate and commit**

```bash
npm run audit:content
npm run test:unit
npm run check
npm run build
npm run test:e2e -- parity --project=chromium
git add package.json src scripts tests
git commit -m "feat: migrate portfolio content into Astro"
```

---

### Task 3: Implement the Illuminated Notebook and recruiter visual systems

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/recruiter.css`
- Create: `src/styles/journal.css`
- Create: `src/styles/preferences.css`
- Create: `src/components/ui/SectionHeading.astro`
- Create: `src/components/ui/EvidenceArtifact.astro`
- Create: `src/components/ui/ArchitectureArtifact.astro`
- Create: `tests/unit/design-system.test.ts`
- Create: `tests/e2e/responsive.spec.ts`
- Modify: `src/layouts/PortfolioLayout.astro`
- Modify: `src/components/recruiter/RecruiterPortfolio.astro`
- Modify: `src/components/recruiter/RecruiterProject.astro`
- Modify: `src/components/journal/JournalPortfolio.astro`
- Modify: `src/components/journal/JournalChapter.astro`

**Interfaces:**
- Consumes: Task 2 semantic components and `ProjectRecord` data.
- Produces: shared design tokens; `.mode--recruiter`; `.mode--journal`; evidence and architecture primitives; responsive and preference-safe presentation.

- [ ] **Step 1: Write the design-system contract test**

Create `tests/unit/design-system.test.ts`:

```ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const preferences = readFileSync('src/styles/preferences.css', 'utf8');

describe('Illuminated Notebook design system', () => {
  it('defines the approved palettes and type roles', () => {
    for (const value of ['#F5EEDF', '#E8D8BF', '#2E2924', '#6A4B37', '#53634C', '#C57A3A', '#15191A', '#222A29', '#F0E7D6', '#D18A46']) {
      expect(tokens).toContain(value);
    }
    expect(tokens).toContain("'Fraunces Variable'");
    expect(tokens).toContain("'IBM Plex Sans'");
    expect(tokens).toContain("'IBM Plex Mono'");
  });

  it('defines reduced motion, reduced transparency, and increased contrast', () => {
    expect(preferences).toContain('prefers-reduced-motion: reduce');
    expect(preferences).toContain('prefers-reduced-transparency: reduce');
    expect(preferences).toContain('prefers-contrast: more');
  });
});
```

Run: `npm run test:unit -- design-system`

Expected: FAIL because the style files do not exist.

- [ ] **Step 2: Define the exact token layer and local fonts**

At the top of `src/styles/tokens.css`, import only the required font weights:

```css
@import '@fontsource-variable/fraunces/wght.css';
@import '@fontsource/ibm-plex-sans/400.css';
@import '@fontsource/ibm-plex-sans/500.css';
@import '@fontsource/ibm-plex-sans/600.css';
@import '@fontsource/ibm-plex-mono/400.css';
@import '@fontsource/ibm-plex-mono/500.css';

:root {
  --font-display: 'Fraunces Variable', Georgia, serif;
  --font-body: 'IBM Plex Sans', system-ui, sans-serif;
  --font-evidence: 'IBM Plex Mono', ui-monospace, monospace;
  --space-2xs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  --space-2xl: 3rem;
  --space-3xl: 4rem;
  --space-4xl: 6rem;
  --space-5xl: 8rem;
  --motion-press: 140ms;
  --motion-reveal: 240ms;
  --motion-turn: 480ms;
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);
}

[data-theme='light'] {
  --surface: #F5EEDF;
  --surface-raised: #E8D8BF;
  --text: #2E2924;
  --text-muted: #6A4B37;
  --verified: #53634C;
  --accent: #C57A3A;
  --shadow-rgb: 44 28 20;
  --error: #9E453F;
  --info: #46657A;
}

[data-theme='dark'] {
  --surface: #15191A;
  --surface-raised: #222A29;
  --text: #F0E7D6;
  --text-muted: #AFA797;
  --verified: #93A58B;
  --accent: #D18A46;
  --shadow-rgb: 0 0 0;
  --error: #E79A92;
  --info: #8FB5CC;
}
```

- [ ] **Step 3: Build the light journal surface**

In `journal.css`, implement four explicit depth layers:

```css
.mode--journal { background: var(--surface); color: var(--text); }
.journal-desk { position: relative; isolation: isolate; max-width: 88rem; margin-inline: auto; }
.journal-desk::before { content: ''; position: absolute; inset: -4rem; z-index: -2; background: radial-gradient(circle at 78% 8%, rgb(255 244 211 / .72), transparent 42%), linear-gradient(135deg, #8b684b, #5f4432); }
.journal-book { position: relative; border: 1px solid rgb(106 75 55 / .24); border-radius: 1.25rem; background: var(--surface); box-shadow: 0 2.5rem 5rem rgb(var(--shadow-rgb) / .28), 0 .35rem 0 var(--surface-raised); }
.journal-book::before { content: ''; position: absolute; inset-block: 1rem; left: 50%; width: 1px; background: linear-gradient(transparent, rgb(44 28 20 / .24), transparent); box-shadow: 0 0 1.5rem rgb(44 28 20 / .22); }
.evidence-artifact { position: relative; border: 1px solid rgb(106 75 55 / .24); background: color-mix(in srgb, var(--surface) 88%, white); box-shadow: 0 .55rem 1.2rem rgb(var(--shadow-rgb) / .14); }
.journal-turn-layer { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
```

Keep the index beside the two-page spread above `64rem`; stack it above the spread from `48rem` to `63.99rem`; switch to a single-column native-details reading flow below `48rem`. Hide decorative desk objects before `64rem`.

- [ ] **Step 4: Build the dark recruiter surface**

Use a disciplined 12-column grid, at most `76rem` wide. Lead with role, proof, status, and actions. Project Archive gets a slightly stronger amber rule and label, not an oversized card. Use solid charcoal surfaces; no blur, glowing orb, gradient headline, dashboard chrome, or 3D card tilt.

The project card contract is:

```astro
<article class:list={['recruiter-project', { 'recruiter-project--flagship': project.data.chapterType === 'flagship' }]}>
  <StatusLabel status={project.data.status} label={project.data.statusLabel} />
  <h3>{project.data.title}</h3>
  <p class="recruiter-project__role">{project.data.role} · {project.data.date}</p>
  <p>{project.data.recruiterSummary}</p>
  <ul aria-label={`${project.data.title} verified proof`}>
    {project.data.verifiedClaims.map(claim => <li>{claim}</li>)}
  </ul>
</article>
```

- [ ] **Step 5: Add preference fallbacks**

Create `preferences.css`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
  .journal-turn-layer { display: none !important; }
}

@media (prefers-reduced-transparency: reduce) {
  .journal-book, .evidence-artifact, .site-header { background: var(--surface) !important; backdrop-filter: none !important; }
}

@media (prefers-contrast: more) {
  :focus-visible { outline: .2rem solid currentColor; outline-offset: .2rem; }
  .journal-book, .evidence-artifact, .recruiter-project, [aria-current='true'] { border: .15rem solid currentColor; }
  .status-label { color: var(--text); text-decoration: underline; text-underline-offset: .2em; }
}
```

- [ ] **Step 6: Add responsive assertions**

Create `tests/e2e/responsive.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

for (const width of [375, 768, 1024, 1440]) {
  test(`has no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/?mode=journal');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test('uses native chapter disclosures on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/?mode=journal');
  await expect(page.locator('details[data-journal-chapter]').first()).toBeVisible();
  await expect(page.locator('.journal-turn-layer')).toBeHidden();
});
```

Run:

```bash
npm run test:unit -- design-system
npm run build
npm run test:e2e -- responsive --project=chromium
```

Expected: PASS at all four widths.

- [ ] **Step 7: Run the Task 3 gate and commit**

```bash
npm run check
npm run test:unit
npm run build
npm run test:e2e -- parity responsive --project=chromium
git add src tests
git commit -m "feat: apply illuminated portfolio design system"
```

---

### Task 4: Add the interruptible journal island and source-backed Project Archive flagship

**Files:**
- Create: `src/components/journal/state.ts`
- Create: `src/components/journal/JournalIsland.tsx`
- Create: `src/components/journal/CaseStudySpread.astro`
- Create: `src/components/artifacts/EvidenceArtifact.astro`
- Create: `src/components/artifacts/ArchitectureArtifact.astro`
- Create: `src/components/artifacts/OperationsTrail.astro`
- Create: `src/components/artifacts/LiveProjectDoorway.astro`
- Create: `src/data/project-archive-evidence.json`
- Create: `scripts/audit-project-archive-evidence.mjs`
- Create: `tests/unit/journal-state.test.ts`
- Create: `tests/unit/project-archive-evidence.test.ts`
- Create: `tests/e2e/journal.spec.ts`
- Create: `public/assets/project-archive/source-to-index.svg`
- Create after the evidence gate: `public/assets/project-archive/public-workspace.webp`
- Create after the evidence gate: `public/assets/project-archive/citation-inspector.webp`
- Create after the evidence gate: `public/assets/project-archive/owner-indexing.webp`
- Modify: `src/components/journal/JournalPortfolio.astro`
- Modify: `src/components/journal/JournalChapter.astro`
- Modify: `src/data/projects/project-archive.json`

**Interfaces:**
- Consumes: server-rendered `[data-journal-chapter]` roots and Task 3 style tokens.
- Produces: `ChapterManifest`, `JournalState`, `journalReducer`, `JournalIsland`; five Project Archive spreads; audited evidence records; reviewed captures or a truthful no-capture state.

- [ ] **Step 1: Read and verify the external source before authoring evidence**

Use `read_thread` for task `01a02f79-2aa2-70a3-bd97-5ff48f39cf30` on host `local`. Treat the task summary as context, then verify every claim against `/Users/gdullas/Desktop/Projects/Project-Repository`.

The initial approved evidence paths are:

```text
apps/api/src/project_archive/services/chat.py
apps/api/src/project_archive/services/indexing.py
apps/api/src/project_archive/adapters/cosmos/outbox.py
apps/api/src/project_archive/services/catalog.py
apps/api/tests/chat/test_chat_service.py
apps/api/tests/catalog/test_catalog_service.py
apps/api/tests/indexing/test_outbox_orchestration.py
apps/web/src/public/PublicApp.tsx
apps/web/src/owner/OwnerApp.tsx
docs/stability-operations.md
docs/superpowers/specs/2026-07-15-project-archive-chat-design.md
```

Generate `src/data/project-archive-evidence.json` from the current Project Archive commit with this shape:

```json
{
  "sourceCommit": "40-character commit SHA generated by the audit command",
  "claims": [
    { "id": "source-grounded-answers", "paths": ["apps/api/src/project_archive/services/chat.py", "apps/api/tests/chat/test_chat_service.py"] },
    { "id": "commit-pinned-citations", "paths": ["apps/api/src/project_archive/services/chat.py", "apps/web/src/public/PublicApp.tsx"] },
    { "id": "durable-indexing", "paths": ["apps/api/src/project_archive/services/indexing.py", "apps/api/src/project_archive/adapters/cosmos/outbox.py"] },
    { "id": "safe-deletion", "paths": ["apps/api/src/project_archive/services/catalog.py", "apps/api/tests/catalog/test_catalog_service.py"] },
    { "id": "owner-safe-operations", "paths": ["apps/web/src/owner/OwnerApp.tsx", "docs/stability-operations.md"] }
  ]
}
```

The SHA is generated data, not hand-authored text:

```bash
git -C /Users/gdullas/Desktop/Projects/Project-Repository rev-parse HEAD
```

Create `scripts/audit-project-archive-evidence.mjs`:

```js
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const repository = process.env.PROJECT_ARCHIVE_REPO
  ?? '/Users/gdullas/Desktop/Projects/Project-Repository';
const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));

if (!/^[a-f0-9]{40}$/.test(audit.sourceCommit)) {
  throw new Error('Project Archive evidence requires a full commit SHA.');
}

execFileSync('git', ['-C', repository, 'cat-file', '-e', `${audit.sourceCommit}^{commit}`]);
for (const claim of audit.claims) {
  if (!claim.id || !Array.isArray(claim.paths) || claim.paths.length === 0) {
    throw new Error('Every Project Archive claim requires an id and source paths.');
  }
  for (const path of claim.paths) {
    execFileSync('git', ['-C', repository, 'cat-file', '-e', `${audit.sourceCommit}:${path}`]);
  }
}

console.log('Project Archive evidence audit passed.');
```

- [ ] **Step 2: Write the journal state tests**

Create `src/components/journal/state.ts`:

```ts
export interface ChapterManifest {
  id: string;
  label: string;
  spreadCount: number;
}

export interface JournalState {
  chapterId: string;
  spread: number;
  phase: 'idle' | 'turning';
  direction: -1 | 0 | 1;
  requestId: number;
}

export type JournalAction =
  | { type: 'request'; chapterId: string; spread: number; requestId: number; direction: -1 | 1 }
  | { type: 'commit'; requestId: number }
  | { type: 'cancel'; chapterId: string; spread: number };

export function journalReducer(state: JournalState, action: JournalAction): JournalState {
  if (action.type === 'request') return { chapterId: action.chapterId, spread: action.spread, phase: 'turning', direction: action.direction, requestId: action.requestId };
  if (action.type === 'commit' && action.requestId === state.requestId) return { ...state, phase: 'idle', direction: 0 };
  if (action.type === 'cancel') return { chapterId: action.chapterId, spread: action.spread, phase: 'idle', direction: 0, requestId: state.requestId + 1 };
  return state;
}
```

Create `tests/unit/journal-state.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { journalReducer, type JournalState } from '../../src/components/journal/state';

const initial: JournalState = { chapterId: 'jobboard-devops', spread: 0, phase: 'idle', direction: 0, requestId: 0 };

describe('journalReducer', () => {
  it('lets a newer request supersede an active turn', () => {
    const first = journalReducer(initial, { type: 'request', chapterId: 'project-archive', spread: 1, requestId: 1, direction: 1 });
    const second = journalReducer(first, { type: 'request', chapterId: 'github-discord-bot', spread: 0, requestId: 2, direction: 1 });
    expect(journalReducer(second, { type: 'commit', requestId: 1 })).toEqual(second);
    expect(journalReducer(second, { type: 'commit', requestId: 2 })).toMatchObject({ chapterId: 'github-discord-bot', phase: 'idle', direction: 0 });
  });

  it('cancels directly for an environment change', () => {
    const turning = journalReducer(initial, { type: 'request', chapterId: 'project-archive', spread: 2, requestId: 1, direction: 1 });
    expect(journalReducer(turning, { type: 'cancel', chapterId: 'project-archive', spread: 2 })).toMatchObject({ phase: 'idle', direction: 0 });
  });
});
```

Run: `npm run test:unit -- journal-state`

Expected: PASS.

- [ ] **Step 3: Implement the one controller island**

`JournalIsland.tsx` receives:

```ts
interface JournalIslandProps {
  manifest: ChapterManifest[];
  initialChapterId: string;
  initialSpread: number;
}
```

It must:

- query server roots with `[data-journal-chapter="${id}"]`;
- set `hidden` and `inert` only after a destination is committed;
- create one temporary `.journal-leaf` cloned from the visible `.case-study-spread`, mark it `aria-hidden="true"` and `inert`, and remove it on finish, cancellation, unmount, media change, or theme change;
- call Motion's `animate()` with `duration: 0.48` and easing `[0.22, 1, 0.36, 1]` only above `48rem`, in light mode, and when reduced motion is false;
- on rapid selection stop the current animation, remove the leaf, and start from the current committed root;
- update `mode`, `chapter`, and `spread` using `history.pushState` after commit;
- restore state on `popstate` without adding a second history entry;
- move focus to the destination chapter heading only when navigation was keyboard-initiated;
- expose an `aria-live="polite"` status such as `Project Archive, spread 2 of 5`;
- render controls and temporary layers only; no title, narrative, technology, claim, or evidence prose may appear in this TSX file.

Hydrate it once inside `JournalPortfolio.astro`:

```astro
<JournalIsland
  client:load
  manifest={manifest}
  initialChapterId={initialChapterId}
  initialSpread={initialSpread}
/>
```

- [ ] **Step 4: Author the five source-backed spreads**

Use the approved questions exactly:

1. `Why build an archive?`
2. `Turning repositories into evidence`
3. `Questions with receipts`
4. `Operating the archive`
5. `Step inside`

Use cover text exactly: `When source material becomes a system people can question.`

Each `CaseStudySpread.astro` renders one `<section>` with a heading, one concise narrative block, one primary artifact, source-path captions, and spread position. Spread 2 uses `source-to-index.svg`; spread 3 uses the public workspace and citation inspector captures after the gate; spread 4 uses the owner indexing capture plus the safe operations trail; spread 5 uses `LiveProjectDoorway.astro`.

`LiveProjectDoorway.astro` renders a live `<a>` only after both checks succeed:

```bash
curl -I https://gdullas.kwadrateam.dev
```

and visual inspection confirms the response is the current Project Archive. Otherwise it renders `Project Archive is in active development; the public doorway is not being linked yet.`

- [ ] **Step 5: Pass the capture evidence gate**

Do not capture from the older Project Archive interface after the referenced redesign work begins. The gate passes when the referenced task reports the redesign implementation reviewed and its production build green.

Capture these exact states from the reviewed build at 1440×1000 with device scale factor 1:

- public collection or workspace with a selected project;
- an answer with an open citation inspector and visible source context;
- owner indexing view showing status, progress, file/chunk counts, or safe recovery UI.

Crop secrets, private repository content, personal account identifiers, tokens, request bodies, and raw provider errors. Preserve only the UI evidence needed by the spread. Save WebP at quality 82 with intrinsic dimensions recorded in the Astro component. Add a caption containing capture date, reviewed Project Archive commit, surface, and what the image proves.

If a required state cannot be produced truthfully, omit that image and render the source-backed path/status artifact. Do not fabricate UI.

- [ ] **Step 6: Add evidence and interaction tests**

Create `tests/unit/project-archive-evidence.test.ts`:

```ts
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Project Archive evidence', () => {
  it('records a full source commit and five audited claim groups', () => {
    const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));
    expect(audit.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(audit.claims).toHaveLength(5);
  });

  it('passes the sibling repository audit', () => {
    expect(() => execFileSync('node', ['scripts/audit-project-archive-evidence.mjs'], { stdio: 'pipe' })).not.toThrow();
  });
});
```

Create `tests/e2e/journal.spec.ts` covering:

```ts
import { expect, test } from '@playwright/test';

test('opens a direct flagship spread URL', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=project-archive&spread=2');
  await expect(page.getByRole('heading', { name: 'Turning repositories into evidence' })).toBeVisible();
});

test('rapid chapter selection commits only the last destination', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await page.getByRole('button', { name: /github.*discord/i }).click();
  await expect(page.locator('[data-journal-chapter]:not([hidden])')).toHaveCount(1);
  await expect(page.locator('[data-journal-chapter="github-discord-bot"]')).toBeVisible();
  await expect(page.locator('.journal-leaf')).toHaveCount(0);
});

test('browser history restores chapter state', async ({ page }) => {
  await page.goto('/?mode=journal&chapter=jobboard-devops');
  await page.getByRole('button', { name: /project archive/i }).click();
  await page.goBack();
  await expect(page.locator('[data-journal-chapter="jobboard-devops"]')).toBeVisible();
});
```

Run:

```bash
npm run test:unit -- journal-state project-archive-evidence
npm run build
npm run test:e2e -- journal --project=chromium
```

Expected: all focused tests pass; exactly one chapter remains visible after rapid input; no temporary leaf remains.

- [ ] **Step 7: Run the Task 4 gate and commit**

```bash
node scripts/audit-project-archive-evidence.mjs
npm run check
npm run test:unit
npm run build
npm run test:e2e -- parity responsive journal --project=chromium
git add public/assets/project-archive src scripts tests
git commit -m "feat: add Project Archive journal flagship"
```

---

### Task 5: Complete accessibility, cross-browser, performance, and Vercel release gates

**Files:**
- Create: `tests/e2e/accessibility.spec.ts`
- Create: `tests/e2e/no-js.spec.ts`
- Create: `tests/e2e/visual.spec.ts`
- Create: `public/robots.txt`
- Create: `.vercelignore`
- Create: `docs/release/2026-08-24-vercel-release-checklist.md`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `src/layouts/PortfolioLayout.astro`
- Remove after parity passes: `legacy/index.html`
- Remove after parity passes: `legacy/css/style.css`
- Remove after parity passes: `legacy/js/main.js`
- Remove after parity passes: `legacy/js/journal-flip.js`
- Remove after parity passes: `tests/apple-material-refinement.test.mjs`
- Remove after parity passes: `tests/journal-flip.test.mjs`

**Interfaces:**
- Consumes: the complete Astro site and all previous tests.
- Produces: a release candidate proven across preferences, browsers, no-JS, zoom, and Vercel preview; final production URL recorded only after deployment.

- [ ] **Step 1: Add axe and keyboard coverage**

Create `tests/e2e/accessibility.spec.ts`:

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const mode of ['recruiter', 'journal']) {
  test(`${mode} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(`/?mode=${mode}`);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter(item => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  });
}

test('keyboard focus survives a theme switch and journal navigation', async ({ page }) => {
  await page.goto('/?mode=recruiter');
  await page.getByRole('button', { name: /switch to journal/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: /switch to recruiter/i })).toBeFocused();
  await page.getByRole('button', { name: /project archive/i }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: /when source material/i })).toBeFocused();
});
```

- [ ] **Step 2: Add JavaScript-off and preference coverage**

Create `tests/e2e/no-js.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('keeps both factual modes readable without JavaScript', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /selected work/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /field journal/i })).toBeVisible();
  await expect(page.getByText('When source material becomes a system people can question.')).toBeVisible();
  await expect(page.getByRole('link', { name: /resume/i }).first()).toHaveAttribute('href', /Garren-Dullas-Cloud-Platform-Resume\.pdf/);
});
```

Add tests using `page.emulateMedia({ reducedMotion: 'reduce' })`, injected `prefers-reduced-transparency`, and `prefers-contrast` emulation or a documented manual browser override. Assert no `.journal-leaf` is created under reduced motion and all journal content remains visible under reduced transparency.

- [ ] **Step 3: Add stable visual captures**

Create `tests/e2e/visual.spec.ts` with snapshots at:

- recruiter `1440×1000`;
- journal desk `1440×1000`;
- Project Archive spread 3 `1440×1000`;
- journal mobile `375×812`;
- recruiter tablet `768×1024`.

Disable animation for screenshots with reduced motion, wait for `document.fonts.ready`, and mask only changing timestamps from evidence captions. Review every diff; do not update baselines blindly.

- [ ] **Step 4: Verify content, zoom, and performance before removing legacy files**

Run the legacy audit one final time, then preserve only `tests/fixtures/legacy-index.html` and `tests/fixtures/legacy-facts.json` as historical parity evidence:

```bash
npm run audit:content
npm run verify
npm run test:e2e
```

Manually test browser zoom at 200% and 400% in Chromium at a `1280×800` viewport. Expected: the layout becomes the stacked mobile reading flow, no horizontal overflow appears, controls remain reachable, and captions wrap.

Run Lighthouse against `npm run preview` for both `/?mode=recruiter` and `/?mode=journal&chapter=project-archive&spread=2`. Required minimums: performance `90`, accessibility `100`, best practices `95`, SEO `95`.

Only after these gates pass, remove the four files under `legacy/` and the two legacy implementation tests. Keep the frozen fixtures and new audits. Then change `package.json` so `test` runs only `test:unit`, and remove the `test:legacy` script.

- [ ] **Step 5: Prepare zero-adapter Vercel output**

Create `.vercelignore`:

```text
.git
.superpowers
docs/design-references
docs/handoffs
legacy
playwright-report
test-results
```

Add `@astrojs/sitemap` through `npx astro add sitemap`, confirm `astro.config.mjs` still has `output: 'static'` and no Vercel adapter, and set `SITE_URL` to the final production domain in Vercel before the production build.

Use Vercel settings:

```text
Framework preset: Astro
Install command: npm ci
Build command: npm run build
Output directory: dist
Node.js: 22.x
Production branch: main
```

Run local platform preflight:

```bash
npm ci
npm run verify
npx vercel@latest build
```

Expected: Vercel detects Astro, produces static output, and creates no server function for the portfolio page.

- [ ] **Step 6: Deploy a preview and execute the release checklist**

Deploy preview from the implementation branch:

```bash
npx vercel@latest
```

Against the preview URL verify:

- canonical and Open Graph URLs use the configured preview or production site value appropriately;
- resume, email, GitHub, public repositories, and verified Project Archive live link work;
- theme persistence and direct chapter URLs work after a reload;
- Project Archive captures load at intrinsic dimensions;
- no browser console error, failed asset request, or mixed-content request appears;
- Lighthouse minimums remain satisfied over the network.

Record results and preview URL in `docs/release/2026-08-24-vercel-release-checklist.md`.

- [ ] **Step 7: Production release and old-entry redirect**

After preview approval, merge through the repository's normal review path and deploy `main` through Vercel Git integration. Verify the production URL before changing any external entry.

The former `https://acteus.github.io` entry is outside this repository's static Vercel output. Change it only with explicit authority for that GitHub Pages source. Its redirect must use the verified final production URL and preserve query strings and hashes where the hosting mechanism allows. Re-run old `#note-jobboard`, `#note-private-work`, and `#note-discord-bot` links after the redirect.

- [ ] **Step 8: Final gate and commit**

```bash
npm ci
npm run audit:content
node scripts/audit-project-archive-evidence.mjs
npm run check
npm run test:unit
npm run build
npm run test:e2e
git add .gitignore .vercelignore README.md package.json package-lock.json astro.config.mjs public src scripts tests docs/release
git commit -m "chore: prepare portfolio for Vercel release"
```

Expected: all unit and browser suites pass across Chromium, Firefox, and WebKit; static build passes; release checklist contains the reviewed preview and production results.

## Definition of Done

- The two modes remain distinct, truthful presentations of one validated project collection.
- Project Archive has one threshold cover and exactly five evidence-backed spreads.
- The shipped page contains no factual project prose in React.
- JavaScript-off visitors can read both presentations and reach all verified links.
- Rapid input, history, theme changes, reduced motion, reduced transparency, and increased contrast leave stable state.
- Content parity and Project Archive evidence audits pass from clean checkout.
- `npm ci`, type checking, unit tests, static build, and all three Playwright browser projects pass.
- Representative Lighthouse results meet the approved thresholds.
- Vercel serves static Astro output from `main`; no Astro Vercel adapter or server function is present.
- The former GitHub Pages entry redirects only after the final production domain is verified and authority for that external change is confirmed.
