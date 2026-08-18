# Overhead Desk Project Notebook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the approved light-mode overhead desk and native project notebook while preserving the existing dark-mode project portfolio.

**Architecture:** Author the light notebook as semantic `<details>` content in `index.html`, style it as a desk and two-page spread in `css/style.css`, and add only a small optional enhancement in `js/main.js` for deep links and current-note styling. The existing static stack remains the default; the user permits a framework only if implementation uncovers a concrete limitation. The site may be deployed to Vercel without requiring a framework migration.

**Tech Stack:** HTML5, custom CSS, vanilla JavaScript, Node’s built-in test runner, browser QA.

## Global Constraints

- Dark mode remains the existing recruiter-facing project portfolio.
- Light mode uses the approved A — Overhead Working Desk direction.
- The generated image is a visual-only reference and never a source of factual content.
- Use only the project claims, dates, statuses, technologies, and links already verified in `index.html` and the approved content spec.
- Both “The story” and “Under the hood” are initially visible on desktop.
- Mobile uses native disclosure controls; without JavaScript, all notebook content remains readable and operable.
- Add no framework, build step, animation library, or runtime dependency unless the static implementation fails a documented requirement.
- Preserve `prefers-reduced-motion`, `prefers-reduced-transparency`, and `prefers-contrast: more` behavior.
- Do not change dark-mode filters, shared contact behavior, theme persistence, or project claims.

---

## File Map

- Modify `index.html`: add the authored notebook and isolate the existing dark project presentation.
- Modify `css/style.css`: add notebook tokens, desk atmosphere, paper components, responsive layouts, focus states, and preference fallbacks.
- Modify `js/main.js`: add optional hash/deep-link enhancement without owning disclosure state.
- Modify `tests/apple-material-refinement.test.mjs`: add structural regression checks for the notebook and protect dark-mode behavior.
- Use `docs/design-references/overhead-desk-project-notebook.png`: visual reference only; do not reference it from runtime HTML or CSS.

### Task 1: Define the notebook contract with failing tests

**Files:**
- Modify: `tests/apple-material-refinement.test.mjs`
- Test: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: existing `index.html`, `css/style.css`, and `js/main.js` as text fixtures.
- Produces: regression requirements for `.project-notebook`, `.project-entry`, `.project-entry__spread`, `enhanceProjectNotebook(root)`, and light-mode desk tokens.

- [ ] **Step 1: Add failing structural tests**

Append these tests:

```js
test('authors a native light-mode project notebook with both perspectives', () => {
  assert.match(html, /data-content-theme="light" hidden[\s\S]*?class="project-notebook"/);
  assert.equal((html.match(/class="project-entry"/g) || []).length, 3);
  assert.match(html, /<details class="project-entry"[^>]*name="portfolio-project"[^>]*open/);
  assert.equal((html.match(/<strong>The story<\/strong>/g) || []).length, 3);
  assert.equal((html.match(/<strong>Under the hood<\/strong>/g) || []).length, 3);
  assert.match(html, /Moving a system, not just its files/);
  assert.match(html, /Showing private work responsibly/);
  assert.match(html, /Keeping a small service alive/);
});

test('keeps the desk reference visual-only and preserves dark projects', () => {
  assert.doesNotMatch(html, /overhead-desk-project-notebook\.png/);
  assert.doesNotMatch(css, /overhead-desk-project-notebook\.png/);
  assert.match(html, /data-content-theme="dark"[\s\S]*?class="filter-bar"/);
  assert.match(html, /id="current-work-grid"/);
  assert.match(html, /id="filter-cloud"/);
});

test('defines accessible light notebook materials and optional enhancement', () => {
  assert.match(css, /--desk-wood:\s*#d8b98f/i);
  assert.match(css, /--paper:\s*#fff9ed/i);
  assert.match(css, /\.project-entry__cover:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.project-entry__cover/);
  assert.match(js, /function enhanceProjectNotebook\(root\)/);
  assert.doesNotMatch(html, /<summary[^>]*role="button"/);
});
```

- [ ] **Step 2: Run the tests and verify the new requirements fail**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: the three new tests fail because the notebook markup, tokens, and enhancement do not exist yet; the six existing tests continue to pass.

- [ ] **Step 3: Commit the failing contract**

```bash
git add tests/apple-material-refinement.test.mjs
git commit -m "test: define project notebook behavior"
```

### Task 2: Author the semantic notebook and verified content

**Files:**
- Modify: `index.html` in the Projects section
- Test: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: the three approved field-note stories and the verified project facts already present in `index.html`.
- Produces: `.project-notebook`, three `#note-*` `.project-entry` disclosures, and six nested `.project-page` disclosures.

- [ ] **Step 1: Replace the light field-note card grid with authored disclosures**

Use this structure for each note, repeating it with the approved content from the design spec:

```html
<div data-content-theme="light" hidden>
  <section class="project-notebook" aria-labelledby="project-notebook-title">
    <header class="section-header project-notebook__intro">
      <p class="section-label">Lessons worth keeping</p>
      <h2 class="section-title" id="project-notebook-title">Field notes</h2>
    </header>

    <ol class="project-notebook__index">
      <li>
        <details class="project-entry" id="note-jobboard" name="portfolio-project" open>
          <summary class="project-entry__cover">
            <span class="project-entry__number">Field Note 01</span>
            <strong>Moving a system, not just its files</strong>
            <span>JobBoard-DevOps</span>
          </summary>
          <div class="project-entry__spread">
            <details class="project-page project-page--story" open>
              <summary><strong>The story</strong></summary>
              <div class="project-page__content">
                <p>The AWS-to-Azure study reinforced that migration is also about separating application concerns from delivery and infrastructure decisions.</p>
                <p class="project-page__takeaway"><strong>What stayed with me:</strong> moving a system means understanding the boundaries that make it deployable.</p>
              </div>
            </details>
            <details class="project-page project-page--technical" open>
              <summary><strong>Under the hood</strong></summary>
              <div class="project-page__content">
                <p class="project-role">Cloud / DevOps Developer · 2025</p>
                <ul class="project-architecture-list">
                  <li>Frontend and backend separated for independent delivery.</li>
                  <li>Containerized API deployed through GitHub Actions.</li>
                  <li>Azure Static Web Apps, Container Apps, and MySQL.</li>
                </ul>
                <div class="tech-tags">
                  <span class="tech-tag">Azure</span>
                  <span class="tech-tag">Docker</span>
                  <span class="tech-tag">GitHub Actions</span>
                  <span class="tech-tag">ARM Templates</span>
                </div>
                <a href="https://github.com/Acteus/JobBoard-DevOps-Project" target="_blank" rel="noopener noreferrer" class="project-notebook__link">View public repository</a>
              </div>
            </details>
          </div>
        </details>
      </li>
    </ol>
  </section>
</div>
```

For Note 02, include separate factual blocks for JRU Atlas and LaborWise and no repository link. For Note 03, include the Oracle Cloud, Podman, Quadlet, Caddy, HTTPS, and public repository facts from the design spec.

Use these exact content bodies inside the same ordered list:

```html
<li>
  <details class="project-entry" id="note-private-work" name="portfolio-project">
    <summary class="project-entry__cover">
      <span class="project-entry__number">Field Note 02</span>
      <strong>Showing private work responsibly</strong>
      <span>JRU Atlas &amp; LaborWise</span>
    </summary>
    <div class="project-entry__spread">
      <details class="project-page project-page--story" open>
        <summary><strong>The story</strong></summary>
        <div class="project-page__content">
          <p>The useful story is not private source code. It is the sanitized architecture, operational choices, and lessons that can be shared safely.</p>
          <p class="project-page__takeaway"><strong>What stayed with me:</strong> responsible documentation can make private work understandable without making it exposed.</p>
        </div>
      </details>
      <details class="project-page project-page--technical" open>
        <summary><strong>Under the hood</strong></summary>
        <div class="project-page__content project-page__content--split">
          <section>
            <h3>JRU Atlas</h3>
            <p class="project-role">Cloud / Full-Stack Developer · 2026–Present</p>
            <p>Private DigitalOcean thesis project using Laravel, two background workers, and a private FastAPI NLP service.</p>
          </section>
          <section>
            <h3>LaborWise</h3>
            <p class="project-role">Cloud / Backend Developer · 2026–Present</p>
            <p>Private Azure service using Container Apps, ACR, managed identity, and Log Analytics.</p>
          </section>
        </div>
      </details>
    </div>
  </details>
</li>

<li>
  <details class="project-entry" id="note-discord-bot" name="portfolio-project">
    <summary class="project-entry__cover">
      <span class="project-entry__number">Field Note 03</span>
      <strong>Keeping a small service alive</strong>
      <span>GitHub → Discord Bot</span>
    </summary>
    <div class="project-entry__spread">
      <details class="project-page project-page--story" open>
        <summary><strong>The story</strong></summary>
        <div class="project-page__content">
          <p>Running a small service on Oracle Cloud made HTTPS, service supervision, recovery, and deployment part of the project itself.</p>
          <p class="project-page__takeaway"><strong>What stayed with me:</strong> a small service still deserves an operational plan.</p>
        </div>
      </details>
      <details class="project-page project-page--technical" open>
        <summary><strong>Under the hood</strong></summary>
        <div class="project-page__content">
          <p class="project-role">Cloud / Backend Developer · 2026–Present</p>
          <ul class="project-architecture-list">
            <li>Hosted on Oracle Cloud.</li>
            <li>Containerized with Podman and supervised through Quadlet.</li>
            <li>Exposed through a secure HTTPS gateway using Caddy.</li>
          </ul>
          <a href="https://github.com/Acteus/github-discord-bot" target="_blank" rel="noopener noreferrer" class="project-notebook__link">View public repository</a>
        </div>
      </details>
    </div>
  </details>
</li>
```

- [ ] **Step 2: Make the existing project presentation dark-mode-specific**

Wrap the dark filter, flagship headings, project grids, and archive headings in dark-themed containers without changing their IDs or internal content. Do not duplicate `id="current-work-grid"`, project links, or the filter buttons.

- [ ] **Step 3: Run the structural tests**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: notebook markup tests pass; CSS-token and JavaScript-enhancement assertions still fail.

- [ ] **Step 4: Commit the semantic content**

```bash
git add index.html tests/apple-material-refinement.test.mjs
git commit -m "feat: add semantic project notebook"
```

### Task 3: Build the overhead desk and responsive notebook styling

**Files:**
- Modify: `css/style.css`
- Test: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: notebook class names from Task 2 and existing light-theme color tokens.
- Produces: desk material tokens, edge-only objects, desktop spread, tablet layout, mobile disclosures, and preference fallbacks.

- [ ] **Step 1: Add the notebook tokens and load the serif face**

Extend the existing Google Fonts import to load `Instrument Serif`, then add:

```css
[data-theme="light"] {
    --desk-wood: #d8b98f;
    --desk-wood-deep: #c39d70;
    --paper: #fff9ed;
    --paper-edge: #e8d8be;
    --paper-line: rgba(63, 48, 39, 0.12);
    --paper-shadow: rgba(79, 53, 36, 0.16);
    --desk-sage: #6f8062;
}
```

- [ ] **Step 2: Style the desktop desk and open spread**

Add a light-scoped desk surface and the core layout:

```css
[data-theme="light"] #projects {
    position: relative;
    isolation: isolate;
    background:
        linear-gradient(118deg, rgba(255,255,255,0.26), transparent 38%),
        repeating-linear-gradient(92deg, rgba(91,58,39,0.028) 0 1px, transparent 1px 18px),
        linear-gradient(135deg, var(--desk-wood), var(--desk-wood-deep));
}

[data-theme="light"] #projects .section-inner {
    position: relative;
    z-index: 1;
}

.project-notebook__index {
    position: relative;
    min-height: 42rem;
    list-style: none;
}

.project-entry {
    margin-bottom: 1rem;
}

.project-entry:not([open]) .project-entry__spread { display: none; }

.project-entry__cover {
    width: min(28%, 19rem);
    min-height: 8rem;
    padding: 1.25rem;
    border: 1px solid var(--paper-edge);
    border-radius: 0.75rem;
    background: var(--paper);
    box-shadow: 0 0.6rem 1.4rem var(--paper-shadow);
    color: var(--clr-text);
    cursor: pointer;
    transform: rotate(-1deg);
    transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease, border-color 180ms ease;
}

.project-entry[open] > .project-entry__cover {
    border-color: var(--desk-sage);
    transform: translateY(-0.25rem) rotate(0);
}

.project-entry__spread {
    position: absolute;
    top: 0;
    right: 0;
    width: 68%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    border: 1px solid var(--paper-edge);
    border-radius: 0.9rem;
    background: var(--paper);
    box-shadow: 0 1rem 2.5rem var(--paper-shadow);
    overflow: visible;
}
```

Style the page interiors, center seam, takeaway, architecture list, tags, and repository link with these rules:

```css
.project-page {
    min-width: 0;
    padding: clamp(1.25rem, 3vw, 2.25rem);
    background: var(--paper);
}

.project-page + .project-page { border-left: 1px solid var(--paper-line); }

.project-page > summary {
    min-height: 44px;
    display: flex;
    align-items: center;
    color: var(--clr-text);
    cursor: pointer;
    font-family: var(--font-serif);
    font-size: clamp(1.65rem, 3vw, 2.5rem);
    line-height: 1;
    letter-spacing: -0.02em;
}

.project-page__content {
    display: grid;
    gap: 1rem;
    padding-top: 1.25rem;
    color: var(--clr-text-2);
    line-height: 1.7;
}

.project-page__content--split section + section {
    padding-top: 1rem;
    border-top: 1px solid var(--paper-line);
}

.project-page__takeaway {
    padding-top: 1rem;
    border-top: 1px solid var(--paper-line);
    color: var(--clr-text);
}

.project-architecture-list {
    display: grid;
    gap: 0.6rem;
    padding-left: 1.2rem;
}

.project-notebook__link {
    width: fit-content;
    color: var(--clr-accent-2);
    font-weight: 700;
    text-underline-offset: 0.2em;
}

.project-entry__cover:focus-visible,
.project-page > summary:focus-visible,
.project-notebook__link:focus-visible {
    outline: 3px solid var(--desk-sage);
    outline-offset: 4px;
}

.project-entry__cover:active { transform: scale(0.98) rotate(0); }
```

- [ ] **Step 3: Add CSS-only edge objects**

Use a coffee-cup ring and a soft leaf-shadow field at the section edges. Keep the implementation deliberately smaller than the visual reference so content remains primary:

```css
[data-theme="light"] #projects::before {
    content: '';
    position: absolute;
    top: clamp(5rem, 10vw, 9rem);
    left: max(1rem, calc(50% - 46rem));
    z-index: 0;
    width: clamp(5rem, 9vw, 7rem);
    aspect-ratio: 1;
    border: 0.75rem solid rgba(255, 249, 237, 0.82);
    border-radius: 50%;
    background: radial-gradient(circle, #4c3024 0 52%, #8b5d42 53% 61%, transparent 62%);
    box-shadow: 0 0.8rem 1.6rem rgba(79, 53, 36, 0.18);
    pointer-events: none;
}

[data-theme="light"] #projects::after {
    content: '';
    position: absolute;
    top: 2rem;
    right: 0;
    z-index: 0;
    width: min(28vw, 22rem);
    height: 18rem;
    background:
        radial-gradient(ellipse at 72% 20%, rgba(77, 98, 65, 0.14) 0 10%, transparent 11%),
        radial-gradient(ellipse at 88% 42%, rgba(77, 98, 65, 0.12) 0 12%, transparent 13%),
        radial-gradient(ellipse at 66% 63%, rgba(77, 98, 65, 0.1) 0 11%, transparent 12%);
    filter: blur(0.35rem);
    pointer-events: none;
}

.project-notebook {
    position: relative;
    z-index: 1;
}
```

- [ ] **Step 4: Add tablet and mobile layouts**

```css
@media (max-width: 56.24rem) {
    .project-notebook__index { min-height: 0; }
    .project-entry { margin-bottom: 1.25rem; }
    .project-entry__cover { width: 100%; }
    .project-entry__spread {
        position: static;
        width: 100%;
        margin-top: 1rem;
    }
}

@media (max-width: 40rem) {
    [data-theme="light"] #projects::before,
    [data-theme="light"] #projects::after { display: none; }

    .project-entry__spread { grid-template-columns: 1fr; }
    .project-page + .project-page { border-top: 1px solid var(--paper-line); }
    .project-entry__cover,
    .project-page > summary { min-height: 44px; }
}
```

- [ ] **Step 5: Add accessibility preference fallbacks**

```css
@media (prefers-reduced-motion: reduce) {
    .project-entry__cover,
    .project-entry[open] > .project-entry__cover,
    .project-entry__cover:active {
        transform: none;
        transition: border-color 150ms ease, color 150ms ease;
    }
}

@media (prefers-reduced-transparency: reduce) {
    .project-entry__cover,
    .project-entry__spread { background: var(--paper); backdrop-filter: none; }
}

@media (prefers-contrast: more) {
    .project-entry__cover,
    .project-entry__spread { border-color: var(--clr-text); }
}
```

- [ ] **Step 6: Run the tests**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: the HTML and CSS assertions pass; the JavaScript enhancement assertion still fails.

- [ ] **Step 7: Commit the visual system**

```bash
git add css/style.css tests/apple-material-refinement.test.mjs
git commit -m "feat: style overhead desk notebook"
```

### Task 4: Add optional deep-link enhancement

**Files:**
- Modify: `js/main.js`
- Test: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: `.project-notebook` and `.project-entry` authored in Task 2.
- Produces: `enhanceProjectNotebook(root): void`; native details state remains authoritative.

- [ ] **Step 1: Add the small enhancement after theme initialization**

```js
function enhanceProjectNotebook(root) {
    const entries = root.querySelectorAll('.project-entry');

    entries.forEach(entry => {
        entry.addEventListener('toggle', () => {
            if (!entry.open) return;
            history.replaceState(null, '', `#${entry.id}`);
        });
    });

    if (!location.hash.startsWith('#note-')) return;
    const linkedEntry = document.getElementById(location.hash.slice(1));
    if (root.contains(linkedEntry) && linkedEntry instanceof HTMLDetailsElement) {
        linkedEntry.open = true;
    }
}

const projectNotebook = document.querySelector('.project-notebook');
if (projectNotebook) enhanceProjectNotebook(projectNotebook);
```

In the site’s generic same-page-link handler, return early for hashes beginning with `#note-` so notebook routes are not handled twice.

- [ ] **Step 2: Run the complete static suite**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: all tests pass with zero failures.

- [ ] **Step 3: Commit the enhancement**

```bash
git add js/main.js tests/apple-material-refinement.test.mjs
git commit -m "feat: enhance notebook deep links"
```

### Task 5: Perform browser QA and finalize documentation

**Files:**
- Modify if needed: `index.html`, `css/style.css`, `js/main.js`
- Modify: `README.md` only if local preview or Vercel deployment guidance changes
- Test: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: the complete notebook experience.
- Produces: verified responsive, accessible light-mode behavior without regressions in dark mode.

- [ ] **Step 1: Start the static preview**

Run: `python3 -m http.server 8000`

Expected: the portfolio is available at `http://localhost:8000/` with no build step.

- [ ] **Step 2: Run the browser QA matrix**

At 375px, 768px, and 1440px:

1. Load dark mode and verify the existing project filters and cards.
2. Switch to light mode and verify the overhead desk and notebook.
3. Open each project using pointer, Enter, and Space.
4. Open and close both nested pages on mobile.
5. Verify focus order, visible focus, repository links, and no horizontal overflow.
6. Switch themes while a note is open and confirm its disclosure state remains.
7. Enter contact-form values, switch themes, and confirm values remain.
8. Load `#note-jobboard`, `#note-private-work`, and `#note-discord-bot` directly.
9. Emulate reduced motion and confirm paper transforms disappear while state remains visible.
10. Compare the atmosphere with `docs/design-references/overhead-desk-project-notebook.png`, checking composition and material only.

- [ ] **Step 3: Confirm generated facts did not leak into the site**

Run:

```bash
rg -n "GreenTrack|CafeConnect|ECS Fargate|MongoDB Atlas|CloudWatch|Terraform|your-username" index.html css/style.css js/main.js
```

Expected: no matches.

- [ ] **Step 4: Run final verification**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: all tests pass with zero failures.

Run: `git status --short`

Expected: only intentional documentation or QA-fix changes remain.

- [ ] **Step 5: Commit the verified experience**

```bash
git add index.html css/style.css js/main.js tests/apple-material-refinement.test.mjs README.md
git commit -m "feat: complete cafe project notebook"
```

Do not stage `README.md` if it did not change.

## Plan Self-Review

- Spec coverage: the tasks cover authored content, dark-mode isolation, desktop spread, mobile disclosures, CSS atmosphere, optional deep links, accessibility preferences, factual integrity, and browser QA.
- Placeholder scan: implementation steps contain exact selectors, function names, test assertions, commands, and expected outcomes; no implementation placeholder is required.
- Interface consistency: the plan consistently uses `.project-notebook`, `.project-entry`, `.project-entry__cover`, `.project-entry__spread`, `.project-page`, and `enhanceProjectNotebook(root)`.
