# Cozy Motion Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the portfolio to static Astro and deliver an accessible, Motion-powered light-mode journal with a cozier coffee-workspace treatment.

**Architecture:** Astro renders all portfolio content, navigation, and the semantic journal fallback. A small React island enhances only journal state changes, URL synchronization, and desktop page turns using `motion/react`; non-JavaScript and reduced-motion visitors retain direct disclosure-based content access. Global CSS preserves the existing dark portfolio while consolidating the light journal material system.

**Tech Stack:** Astro 7.2.4, React 19.2.8, `@astrojs/react` 6.0.4, Motion 13.1.0, TypeScript 6.0.3, Node test runner, static GitHub Pages output.

## Global Constraints

- Preserve every factual project claim, status, resume URL, external URL, and `#note-*` deep link.
- Use `motion/react` for React animation; do not introduce direct `framer-motion` imports.
- Never animate layout properties; use transforms and opacity only.
- Store animation duration, easing, distances, scales, and spring values in shared motion tokens.
- Honour `prefers-reduced-motion` and remove non-essential transforms on low-end devices.
- Keep the dark recruiter mode proof-first and functionally unchanged.
- Keep output fully static and compatible with GitHub Pages.
- Do not make shadcn a visual theme; only configure it for future React-island primitives.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `package.json` | Reproducible Astro, React, Motion, test, and build commands. |
| `astro.config.mjs` | Static output and React integration. |
| `components.json` | shadcn configuration scoped to the Astro React source tree. |
| `src/layouts/PortfolioLayout.astro` | Static document shell, fonts, theme bootstrap, navigation, and script loading. |
| `src/pages/index.astro` | Composes the portfolio’s existing content sections into the Astro route. |
| `src/components/journal/JournalPortfolio.astro` | Server-rendered journal chapter markup and interactive-island mount point. |
| `src/components/journal/JournalIsland.tsx` | Client journal selection, hash syncing, press feedback, and turning-leaf animation. |
| `src/lib/motion-tokens.ts` | Shared motion values and named spring presets. |
| `src/lib/motion-config.ts` | Low-end and reduced-motion gate. |
| `src/styles/global.css` | Migrated global styles, coffee workspace materials, responsive journal fallback, and accessibility preference overrides. |
| `src/scripts/portfolio.ts` | Theme persistence, mobile navigation, filtering, form mailto behavior, and observer-based entry reveals. |
| `tests/astro-portfolio.test.mjs` | Regression checks against source and production static output. |

### Task 1: Establish reproducible static Astro setup

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `components.json`
- Create: `.gitignore` additions for Astro build artifacts
- Test: `tests/astro-portfolio.test.mjs`

**Interfaces:**
- Produces `npm run dev`, `npm run build`, `npm run preview`, and `npm test`.
- Produces `astro.config.mjs` with `output: 'static'` and React integration used by Task 3.

- [ ] **Step 1: Write the failing setup contract test**

```js
test('declares Astro static build and Motion React dependencies', () => {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
  assert.equal(packageJson.scripts.build, 'astro build');
  assert.ok(packageJson.dependencies.astro);
  assert.ok(packageJson.dependencies.motion);
  assert.match(readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8'), /output:\s*'static'/);
  assert.match(readFileSync(new URL('../components.json', import.meta.url), 'utf8'), /\"tsx\"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/astro-portfolio.test.mjs`

Expected: FAIL because `package.json`, `astro.config.mjs`, and `components.json` do not exist.

- [ ] **Step 3: Add the minimal Astro configuration**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [react()],
});
```

```json
// components.json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "tsx": true,
  "rsc": false,
  "tailwind": { "config": "", "css": "src/styles/global.css", "baseColor": "stone", "cssVariables": true, "prefix": "" },
  "aliases": { "components": "@/components", "utils": "@/lib/utils", "ui": "@/components/ui", "lib": "@/lib", "hooks": "@/hooks" }
}
```

- [ ] **Step 4: Run the setup contract test**

Run: `node --test tests/astro-portfolio.test.mjs`

Expected: PASS for the setup contract.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json components.json .gitignore tests/astro-portfolio.test.mjs
git commit -m "chore: configure static Astro portfolio"
```

### Task 2: Move the document shell and static portfolio content to Astro

**Files:**
- Create: `src/layouts/PortfolioLayout.astro`
- Create: `src/pages/index.astro`
- Create: `src/styles/global.css`
- Create: `src/scripts/portfolio.ts`
- Modify: `public/output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf` by copying existing output asset
- Modify: `public/assets/project-archive-desk.webp` by copying existing asset
- Test: `tests/astro-portfolio.test.mjs`

**Interfaces:**
- Consumes existing factual content from `index.html` exactly once.
- Produces a static `/index.html` that keeps the main navigation, dark recruiter content, form, resume, and theme contract.

- [ ] **Step 1: Write failing output-preservation tests**

```js
test('renders portfolio facts and a pre-hydration theme contract', () => {
  const output = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.match(output, /Garren Dullas — Cloud &amp; Platform Engineering/);
  assert.match(output, /data-theme="dark"/);
  assert.match(output, /portfolio-theme/);
  assert.match(output, /Garren-Dullas-Cloud-Platform-Resume\.pdf/);
  assert.match(output, /id="contact-form"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run build && node --test tests/astro-portfolio.test.mjs`

Expected: FAIL because Astro has no page route.

- [ ] **Step 3: Create the layout and route**

Put the inline theme bootstrap before visual content in `PortfolioLayout.astro`:

```html
<script is:inline>
  const stored = localStorage.getItem('portfolio-theme');
  const theme = stored === 'light' || stored === 'dark'
    ? stored
    : matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.dataset.theme = theme;
</script>
```

Migrate all existing factual sections to `src/pages/index.astro`; preserve element IDs, forms, theme-labelled fragments, and external URLs. Move assets to `public/` so their existing root-relative output URLs remain valid. Move the existing CSS into `src/styles/global.css`, then remove AOS imports and `data-aos` attributes while retaining semantic class names.

- [ ] **Step 4: Add progressive non-journal interactions**

Implement the existing theme toggle, menu escape handling, project filters, `mailto:` form submission, and native smooth anchor scrolling in `src/scripts/portfolio.ts`. Use `IntersectionObserver` to add a `.is-revealed` class to `[data-reveal]`; do not add a new animation library or a continuously-running canvas effect.

- [ ] **Step 5: Run production build and output tests**

Run: `npm run build && node --test tests/astro-portfolio.test.mjs`

Expected: static output builds and the preservation test passes.

- [ ] **Step 6: Commit**

```bash
git add src public tests/astro-portfolio.test.mjs index.html css js
git commit -m "feat: migrate portfolio shell to Astro"
```

### Task 3: Add shared safe Motion primitives

**Files:**
- Create: `src/lib/motion-tokens.ts`
- Create: `src/lib/motion-config.ts`
- Create: `src/hooks/use-safe-motion.ts`
- Test: `tests/astro-portfolio.test.mjs`

**Interfaces:**
- Produces `motionTokens`, `springs`, `motionConfig.shouldAnimate`, and `useSafeMotion(distance)`.
- Consumed by `JournalIsland.tsx` in Task 4.

- [ ] **Step 1: Write the failing source contract test**

```js
test('centralizes Motion values and respects reduced motion', () => {
  const tokens = readFileSync(new URL('../src/lib/motion-tokens.ts', import.meta.url), 'utf8');
  const config = readFileSync(new URL('../src/lib/motion-config.ts', import.meta.url), 'utf8');
  assert.match(tokens, /export const motionTokens/);
  assert.match(tokens, /export const springs/);
  assert.match(config, /prefers-reduced-motion/);
  assert.match(config, /shouldAnimate/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/astro-portfolio.test.mjs`

Expected: FAIL because the Motion source files do not exist.

- [ ] **Step 3: Create shared tokens and runtime gate**

```ts
export const motionTokens = {
  duration: { instant: 0.08, fast: 0.16, normal: 0.24, slow: 0.46 },
  easing: { smooth: [0.22, 1, 0.36, 1] as const, sharp: [0.4, 0, 0.2, 1] as const },
  distance: { xs: 4, sm: 8, md: 16 },
  scale: { press: 0.97, subtle: 0.985 },
};
export const springs = {
  snappy: { type: 'spring' as const, stiffness: 300, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 18 },
};
```

`motionConfig.shouldAnimate({ essential })` must return `false` for reduced motion and for non-essential effects on devices with four or fewer logical processors; it must never read `window` or `navigator` at module evaluation time.

- [ ] **Step 4: Run the source contract test and type check**

Run: `node --test tests/astro-portfolio.test.mjs && npx astro check`

Expected: PASS and zero TypeScript errors.

- [ ] **Step 5: Commit**

```bash
git add src/lib src/hooks tests/astro-portfolio.test.mjs
git commit -m "feat: add safe motion primitives"
```

### Task 4: Build the semantic journal and focused Motion island

**Files:**
- Create: `src/components/journal/JournalPortfolio.astro`
- Create: `src/components/journal/JournalIsland.tsx`
- Modify: `src/pages/index.astro`
- Test: `tests/astro-portfolio.test.mjs`

**Interfaces:**
- Consumes three journal notes as `{ id, number, title, label }` metadata and uses the existing semantic story/technical markup.
- Produces a `JournalIsland` that accepts `notes: JournalNote[]` and synchronizes the selected note to `#note-*`.

- [ ] **Step 1: Write failing journal contracts**

```js
test('keeps semantic journal content and isolates Motion enhancement', () => {
  const journal = readFileSync(new URL('../src/components/journal/JournalPortfolio.astro', import.meta.url), 'utf8');
  const island = readFileSync(new URL('../src/components/journal/JournalIsland.tsx', import.meta.url), 'utf8');
  assert.match(journal, /<details class="project-entry"/);
  assert.match(journal, /id="note-project-archive"/);
  assert.match(island, /from 'motion\/react'/);
  assert.match(island, /useReducedMotion/);
  assert.match(island, /history\.replaceState/);
  assert.doesNotMatch(island, /from 'framer-motion'/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/astro-portfolio.test.mjs`

Expected: FAIL because no journal components exist.

- [ ] **Step 3: Migrate authored journal markup into `JournalPortfolio.astro`**

Preserve the current three `details.project-entry` elements, their copy, `The story` / `Under the hood` sections, architecture figures, and outbound links. Add a visible chapter rail header and mount the island with `client:load`, passing only note metadata:

```astro
<JournalIsland client:load notes={notes} />
```

- [ ] **Step 4: Implement the enhanced journal controller**

Use `motion.div` for the visual turning leaf only. On desktop light mode, `AnimatePresence` renders an inert `aria-hidden` leaf and calls `setActiveId` at the midpoint of a `rotateY` transition. On reduced motion or narrow screens, update `<details>` state directly. Keep the selected summary focusable after selection and call `history.replaceState(null, '', '#' + id)` without scrolling. Use token values and `springs.gentle`; do not animate `height`, `width`, `top`, `left`, margins, or padding.

- [ ] **Step 5: Verify behavior**

Run: `npm run build && npx astro check && node --test tests/astro-portfolio.test.mjs`

Expected: static fallback markup and Motion import contracts pass; build has no hydration or type error.

- [ ] **Step 6: Commit**

```bash
git add src/components src/pages/index.astro tests/astro-portfolio.test.mjs
git commit -m "feat: add motion journal enhancement"
```

### Task 5: Refine the cozy coffee-workspace visual system and accessibility fallbacks

**Files:**
- Modify: `src/styles/global.css`
- Test: `tests/astro-portfolio.test.mjs`

**Interfaces:**
- Consumes existing class names and the journal DOM from Task 4.
- Produces desktop desk composition, tablet rail rearrangement, and mobile direct reading mode.

- [ ] **Step 1: Write failing visual-system source checks**

```js
test('defines cozy journal materials and resilient fallbacks', () => {
  const css = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
  assert.match(css, /--desk-wood:/);
  assert.match(css, /--paper:/);
  assert.match(css, /\.project-entry__cover:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(max-width: 56\.24rem\)/);
  assert.match(css, /\.project-journal__turn-layer\s*\{[\s\S]*?display:\s*none/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/astro-portfolio.test.mjs`

Expected: FAIL until the migrated stylesheet contains responsive reduced-motion rules.

- [ ] **Step 3: Implement material depth and responsive composition**

Use CSS custom properties for warm paper, walnut, coffee ink, moss, amber, and cover depth. Construct coffee, botanical, pencil, clipped note, light falloff, wood grain, page edges, gutter, bookmark, and shadows from non-semantic pseudo-elements or `aria-hidden` props. Keep props below content stacking contexts. On `max-width: 56.24rem`, hide props and the turn layer, make the spread static, and place the chapter rail before the content; on `max-width: 40rem`, use a one-column page stack.

- [ ] **Step 4: Implement preference overrides**

At `prefers-reduced-motion: reduce`, disable transition transforms and hide the turning layer. At `prefers-reduced-transparency: reduce`, replace transparent material effects with solid paper. At `prefers-contrast: more`, strengthen control borders, active state, labels, and focus outlines.

- [ ] **Step 5: Run source checks and production build**

Run: `npm run build && node --test tests/astro-portfolio.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css tests/astro-portfolio.test.mjs
git commit -m "feat: refine cozy journal visual system"
```

### Task 6: Remove legacy files, test interaction paths, and publish build instructions

**Files:**
- Modify: `README.md`
- Delete: `index.html`
- Delete: `css/style.css`
- Delete: `js/main.js`
- Delete: `js/journal-flip.js`
- Modify: existing tests under `tests/`
- Test: all `tests/*.mjs`

**Interfaces:**
- Produces a source tree with a single Astro entry point and no AOS dependency.

- [ ] **Step 1: Write failing legacy-removal and output checks**

```js
test('ships no AOS runtime and keeps direct journal anchors', () => {
  const output = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
  assert.doesNotMatch(output, /aos@|data-aos|AOS\.init/);
  assert.match(output, /id="note-project-archive"/);
  assert.match(output, /id="note-private-work"/);
  assert.match(output, /id="note-discord-bot"/);
});
```

- [ ] **Step 2: Run the complete suite to verify the desired gap**

Run: `npm run build && node --test tests/*.mjs`

Expected: legacy tests fail until they are redirected to the Astro source/output structure.

- [ ] **Step 3: Replace obsolete test assumptions and remove legacy entry files**

Move the durable factual, accessibility, and journal assertions into `tests/astro-portfolio.test.mjs`; delete only legacy tests that assert implementation-specific static-file locations or WAAPI internals. Delete the old entry HTML, CSS, and JavaScript after the Astro build and source tests supersede them.

- [ ] **Step 4: Update README**

Replace the static-server instructions with:

```bash
npm install
npm run dev
npm run build
npm test
```

State that the deployed artifact is `dist/`, Motion is limited to the journal island, shadcn is configured but not used as a theme, and static hosting should publish `dist/`.

- [ ] **Step 5: Run full verification and visual review**

Run: `npm run build && npx astro check && node --test tests/*.mjs`

Expected: all commands exit zero. Review the generated page at 1440px, 900px, 390px, and 400% zoom; verify light/dark switching, all three `#note-*` URLs, keyboard traversal, reduced-motion behavior, and no horizontal scrolling.

- [ ] **Step 6: Commit**

```bash
git add README.md tests src public package.json package-lock.json astro.config.mjs tsconfig.json components.json .gitignore
git add -u index.html css/style.css js/main.js js/journal-flip.js
git commit -m "feat: ship cozy motion portfolio"
```

## Plan Self-Review

- Spec coverage: Tasks 1–2 provide Astro/static output and preserve content; Tasks 3–4 introduce safe Motion journal behavior; Task 5 implements the cozy light-mode visual and preference fallbacks; Task 6 verifies and documents the completed migration.
- Placeholder scan: no unresolved work items or undefined interfaces remain.
- Consistency: every motion import is specified as `motion/react`; all journal deep-link behavior refers to the existing `#note-*` IDs; all non-journal interaction logic remains outside the React island.
