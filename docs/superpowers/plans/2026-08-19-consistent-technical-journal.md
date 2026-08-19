# Consistent Technical Journal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give every light-mode project one stable desktop journal footprint, a project-specific technical architecture page, and a smooth physical page turn that never resizes the book.

**Architecture:** Keep the existing native `<details>` entries and `createJournalFlipController()` as the source of truth. Author semantic architecture/details/source regions in HTML, style them with reusable journal primitives and one fixed desktop height token, then tune the existing inert leaf animation to swap content at the midpoint without animating layout. Below the desktop breakpoint, retain natural-height pages and disable the leaf enhancement.

**Tech Stack:** Semantic HTML, CSS custom properties/Grid/Flexbox, vanilla JavaScript Web Animations API, Node.js built-in test runner, existing Inter/Instrument Serif/DM Mono fonts, existing Font Awesome assets.

**Design spec:** `docs/superpowers/specs/2026-08-19-consistent-technical-journal-design.md`

## Global Constraints

- Execution target is Luna using a fresh implementer per task and a fresh read-only reviewer after each task.
- Change only the light-mode project notebook; preserve dark-mode project cards and shared theme behavior.
- At `min-width: 56.25rem`, every open spread, page, turn layer, and temporary leaf uses the same `50rem` height.
- Below `56.25rem`, spreads return to natural height; below `40rem`, pages and architecture flows stack vertically.
- Do not add internal page scrolling, pagination, “read more,” content crossfades, or container-height animation.
- Do not add dependencies or fonts. Use Instrument Serif for editorial headings, Inter for reading, and DM Mono only for technical labels, metadata keys, diagram annotations, and tags.
- Architecture diagrams must use semantic HTML/CSS and existing Font Awesome icons; no raster diagrams, canvas, SVG asset generation, or animated diagrams.
- Use only facts already present in the portfolio. Never add private endpoints, repository locations, credentials, metrics, or fictional reference content.
- The desktop turn lasts exactly `640ms`, uses `cubic-bezier(0.22, 0.78, 0.18, 1)`, keeps the leaf opaque, and commits the destination/hash at the 50% midpoint.
- Preserve latest-selection-wins, deep links, exactly-one-open, keyboard focus, reduced motion, reduced transparency, increased contrast, theme cancellation, and decorative-failure fallback behavior.
- Follow TDD: add a focused failing test, observe the expected failure, make the smallest production change, rerun focused and full suites, then commit.
- After each task, generate an isolated review range and obtain an independent reviewer verdict before starting the next task.

## File Structure

- Modify `index.html`: author the three architecture figures, metadata definition lists, technology groups, and public/private source regions.
- Modify `css/style.css`: define the fixed journal height token, stable page grids, technical typography, architecture primitives, responsive flows, and preference fallbacks.
- Modify `js/journal-flip.js`: tune the existing leaf duration, keyframes, and easing without changing controller ownership or event contracts.
- Modify `tests/apple-material-refinement.test.mjs`: add semantic/content/CSS regression assertions and retain the fictional-reference leak guard.
- Modify `tests/journal-flip.test.mjs`: assert exact motion timing, opaque transform keyframes, midpoint commit, cleanup, and interruption invariants.
- Append `.superpowers/sdd/consistent-journal-task-N-report.md` during execution: record each task’s commit, test output, reviewer verdict, and browser findings. These ignored scratch reports must not contain implementation instructions or enter task commits.

---

### Task 1: Author the semantic technical journal content

**Files:**
- Modify: `index.html:364-446`
- Test: `tests/apple-material-refinement.test.mjs`
- Report: `.superpowers/sdd/consistent-journal-task-1-report.md`

**Interfaces:**
- Consumes: existing `.project-page--technical`, `.project-role`, `.tech-tags`, `.tech-tag`, and `.project-notebook__link` markup contracts.
- Produces: exactly three `.project-architecture` figures, three `.project-details` definition lists, three `.project-source` regions, reusable `.project-technical-label`, `.project-architecture__lanes`, `.project-architecture__lane`, `.project-architecture__flow`, `.project-architecture__node`, and `.project-architecture__boundary` hooks.

- [ ] **Step 1: Add failing semantic-content tests**

Append this test to `tests/apple-material-refinement.test.mjs`:

```js
test('authors a consistent semantic technical page for every journal note', () => {
  assert.equal((html.match(/<figure class="project-architecture/g) || []).length, 3);
  assert.equal((html.match(/<dl class="project-details">/g) || []).length, 3);
  assert.equal((html.match(/class="project-source(?:\s|\")/g) || []).length, 3);
  assert.equal((html.match(/class="project-technical-label"/g) || []).length >= 9, true);

  assert.match(html, /GitHub Actions[\s\S]*?Azure Static Web Apps[\s\S]*?Azure Container Apps[\s\S]*?MySQL/);
  assert.match(html, /JRU Atlas[\s\S]*?Laravel[\s\S]*?2 background workers[\s\S]*?FastAPI NLP/);
  assert.match(html, /LaborWise[\s\S]*?ACR[\s\S]*?Container Apps[\s\S]*?Log Analytics/);
  assert.match(html, /GitHub event[\s\S]*?Caddy HTTPS[\s\S]*?Podman bot[\s\S]*?Discord/);

  assert.match(html, /Private case study · architecture sanitized/);
  assert.equal((html.match(/View public repository/g) || []).length, 2);
  assert.doesNotMatch(html, /<table[\s>]/);
});
```

Extend the existing fictional-reference test with the reference-only diagram labels that must not ship:

```js
const fictionalTerms = [
  'GreenTrack',
  'CafeConnect',
  'ECS Fargate',
  'MongoDB Atlas',
  'CloudWatch',
  'Terraform',
  'Route 53',
  'your-username',
];
```

- [ ] **Step 2: Run the focused test and verify failure**

Run:

```bash
node --test --test-name-pattern="consistent semantic technical page|fictional visual-reference" tests/apple-material-refinement.test.mjs
```

Expected: FAIL because no `.project-architecture`, `.project-details`, `.project-source`, or `.project-technical-label` regions exist yet.

- [ ] **Step 3: Replace the JobBoard technical content with the exact page grammar**

Inside `#note-jobboard .project-page--technical`, keep the existing summary and replace `.project-page__content` with:

```html
<div class="project-page__content project-page__content--technical">
    <p class="project-role">Cloud / DevOps Developer · 2025</p>

    <figure class="project-architecture project-architecture--jobboard"
        aria-label="Architecture overview: GitHub Actions delivers the frontend to Azure Static Web Apps and the containerized API to Azure Container Apps, which uses MySQL.">
        <figcaption class="project-technical-label">Architecture overview</figcaption>
        <div class="project-architecture__lanes">
            <section class="project-architecture__lane" aria-label="Frontend delivery">
                <span class="project-architecture__lane-label">Frontend</span>
                <ol class="project-architecture__flow">
                    <li class="project-architecture__node"><i class="fab fa-github" aria-hidden="true"></i><span>GitHub Actions</span></li>
                    <li class="project-architecture__node"><i class="fas fa-window-maximize" aria-hidden="true"></i><span>Azure Static Web Apps</span></li>
                </ol>
            </section>
            <section class="project-architecture__lane" aria-label="API runtime">
                <span class="project-architecture__lane-label">Backend</span>
                <ol class="project-architecture__flow">
                    <li class="project-architecture__node"><i class="fab fa-github" aria-hidden="true"></i><span>GitHub Actions</span></li>
                    <li class="project-architecture__node project-architecture__boundary"><i class="fas fa-cube" aria-hidden="true"></i><span>Azure Container Apps</span></li>
                    <li class="project-architecture__node"><i class="fas fa-database" aria-hidden="true"></i><span>MySQL</span></li>
                </ol>
            </section>
        </div>
    </figure>

    <section aria-labelledby="jobboard-details-label">
        <h3 class="project-technical-label" id="jobboard-details-label">Project details</h3>
        <dl class="project-details">
            <dt>Project type</dt><dd>Full-stack job platform</dd>
            <dt>Role</dt><dd>Cloud / DevOps Developer</dd>
            <dt>Timeline</dt><dd>2025</dd>
            <dt>Deployment</dt><dd>Azure Static Web Apps + Container Apps</dd>
            <dt>Visibility</dt><dd>Public repository</dd>
        </dl>
    </section>

    <section aria-labelledby="jobboard-tech-label">
        <h3 class="project-technical-label" id="jobboard-tech-label">Technologies</h3>
        <div class="tech-tags">
            <span class="tech-tag">Azure</span>
            <span class="tech-tag">Docker</span>
            <span class="tech-tag">GitHub Actions</span>
            <span class="tech-tag">ARM Templates</span>
        </div>
    </section>

    <footer class="project-source">
        <span class="project-technical-label">Source code</span>
        <a href="https://github.com/Acteus/JobBoard-DevOps-Project" target="_blank" rel="noopener noreferrer" class="project-notebook__link">View public repository</a>
    </footer>
</div>
```

- [ ] **Step 4: Replace the private-work technical content with two sanitized lanes**

Inside `#note-private-work .project-page--technical`, keep the existing summary and replace `.project-page__content` with:

```html
<div class="project-page__content project-page__content--technical">
    <p class="project-role">Cloud / Full-Stack &amp; Backend Developer · 2026–Present</p>

    <figure class="project-architecture project-architecture--private"
        aria-label="Sanitized architecture overview: JRU Atlas uses Laravel, background workers, and a private FastAPI NLP service. LaborWise uses ACR, Container Apps with managed identity, and Log Analytics.">
        <figcaption class="project-technical-label">Architecture overview</figcaption>
        <div class="project-architecture__lanes">
            <section class="project-architecture__lane" aria-label="JRU Atlas architecture">
                <span class="project-architecture__lane-label">JRU Atlas</span>
                <ol class="project-architecture__flow">
                    <li class="project-architecture__node"><i class="fab fa-laravel" aria-hidden="true"></i><span>Laravel</span></li>
                    <li class="project-architecture__node"><i class="fas fa-gears" aria-hidden="true"></i><span>2 background workers</span></li>
                    <li class="project-architecture__node project-architecture__boundary"><i class="fas fa-language" aria-hidden="true"></i><span>FastAPI NLP</span></li>
                </ol>
            </section>
            <section class="project-architecture__lane" aria-label="LaborWise architecture">
                <span class="project-architecture__lane-label">LaborWise</span>
                <ol class="project-architecture__flow">
                    <li class="project-architecture__node"><i class="fas fa-box" aria-hidden="true"></i><span>ACR</span></li>
                    <li class="project-architecture__node project-architecture__boundary"><i class="fas fa-cubes" aria-hidden="true"></i><span>Container Apps<small>Managed identity</small></span></li>
                    <li class="project-architecture__node"><i class="fas fa-chart-line" aria-hidden="true"></i><span>Log Analytics</span></li>
                </ol>
            </section>
        </div>
    </figure>

    <section aria-labelledby="private-details-label">
        <h3 class="project-technical-label" id="private-details-label">Project details</h3>
        <dl class="project-details">
            <dt>Project type</dt><dd>Private systems in active development</dd>
            <dt>Role</dt><dd>Cloud / Full-Stack &amp; Backend Developer</dd>
            <dt>Timeline</dt><dd>2026–Present</dd>
            <dt>Deployment</dt><dd>DigitalOcean + Azure Container Apps</dd>
            <dt>Visibility</dt><dd>Private · architecture sanitized</dd>
        </dl>
    </section>

    <section aria-labelledby="private-tech-label">
        <h3 class="project-technical-label" id="private-tech-label">Technologies</h3>
        <div class="tech-tags">
            <span class="tech-tag">Laravel</span>
            <span class="tech-tag">FastAPI</span>
            <span class="tech-tag">DigitalOcean</span>
            <span class="tech-tag">Azure</span>
            <span class="tech-tag">Container Apps</span>
            <span class="tech-tag">ACR</span>
        </div>
    </section>

    <footer class="project-source project-source--private">
        <span class="project-technical-label">Source status</span>
        <p><i class="fas fa-lock" aria-hidden="true"></i> Private case study · architecture sanitized</p>
    </footer>
</div>
```

- [ ] **Step 5: Replace the Discord-bot technical content with its runtime flow**

Inside `#note-discord-bot .project-page--technical`, keep the existing summary and replace `.project-page__content` with:

```html
<div class="project-page__content project-page__content--technical">
    <p class="project-role">Cloud / Backend Developer · 2026–Present</p>

    <figure class="project-architecture project-architecture--discord"
        aria-label="Architecture overview: a GitHub event enters through a Caddy HTTPS gateway, reaches a Podman bot supervised by Quadlet on Oracle Cloud, and posts to Discord.">
        <figcaption class="project-technical-label">Architecture overview</figcaption>
        <ol class="project-architecture__flow">
            <li class="project-architecture__node"><i class="fab fa-github" aria-hidden="true"></i><span>GitHub event</span></li>
            <li class="project-architecture__node"><i class="fas fa-shield-halved" aria-hidden="true"></i><span>Caddy HTTPS</span></li>
            <li class="project-architecture__node project-architecture__boundary"><i class="fas fa-box-open" aria-hidden="true"></i><span>Podman bot<small>Oracle Cloud · Quadlet</small></span></li>
            <li class="project-architecture__node"><i class="fab fa-discord" aria-hidden="true"></i><span>Discord</span></li>
        </ol>
    </figure>

    <section aria-labelledby="discord-details-label">
        <h3 class="project-technical-label" id="discord-details-label">Project details</h3>
        <dl class="project-details">
            <dt>Project type</dt><dd>Discord app</dd>
            <dt>Role</dt><dd>Cloud / Backend Developer</dd>
            <dt>Timeline</dt><dd>2026–Present</dd>
            <dt>Deployment</dt><dd>Oracle Cloud · Podman + Quadlet</dd>
            <dt>Visibility</dt><dd>Public repository</dd>
        </dl>
    </section>

    <section aria-labelledby="discord-tech-label">
        <h3 class="project-technical-label" id="discord-tech-label">Technologies</h3>
        <div class="tech-tags">
            <span class="tech-tag">Oracle Cloud</span>
            <span class="tech-tag">Podman</span>
            <span class="tech-tag">Quadlet</span>
            <span class="tech-tag">Caddy</span>
        </div>
    </section>

    <footer class="project-source">
        <span class="project-technical-label">Source code</span>
        <a href="https://github.com/Acteus/github-discord-bot" target="_blank" rel="noopener noreferrer" class="project-notebook__link">View public repository</a>
    </footer>
</div>
```

- [ ] **Step 6: Run focused and full static tests**

Run:

```bash
node --test --test-name-pattern="consistent semantic technical page|fictional visual-reference|native light-mode project notebook" tests/apple-material-refinement.test.mjs
node --test tests/*.test.mjs
git diff --check
```

Expected: focused tests PASS; full suite reports 33 tests passing; `git diff --check` produces no output.

- [ ] **Step 7: Commit and request review**

```bash
git add index.html tests/apple-material-refinement.test.mjs
git commit -m "feat: author technical journal architecture pages"
```

Reviewer gate: confirm semantic figure/list/definition-list structure, factual accuracy, sanitized private content, two public links, and no reference-image fact leakage.

---

### Task 2: Lock the desktop spread and establish the page grammar

**Files:**
- Modify: `css/style.css:28-90, 1252-1509, 1546-1558`
- Test: `tests/apple-material-refinement.test.mjs`
- Report: `.superpowers/sdd/consistent-journal-task-2-report.md`

**Interfaces:**
- Consumes: Task 1’s `.project-page__content--technical`, `.project-details`, `.project-source`, and `.project-technical-label` markup.
- Produces: `--journal-spread-height: 50rem`, a fixed desktop `.project-entry__spread`/page grid, bottom-aligned source slot, and natural-height reset under `56.24rem`.

- [ ] **Step 1: Add failing fixed-geometry tests**

Append:

```js
test('locks every desktop journal spread to one shared height and releases it on narrow screens', () => {
  assert.match(css, /--journal-spread-height:\s*50rem/);
  assert.match(css, /\.project-notebook__workspace\s*\{[\s\S]*?min-height:\s*var\(--journal-spread-height\)/);
  assert.match(css, /\.project-entry__spread\s*\{[\s\S]*?height:\s*var\(--journal-spread-height\)/);
  assert.match(css, /\.project-page\s*\{[\s\S]*?height:\s*100%[\s\S]*?grid-template-rows:\s*auto minmax\(0, 1fr\)/);
  assert.match(css, /\.project-page--story \.project-page__content\s*\{[\s\S]*?grid-template-rows:\s*minmax\(0, 15rem\) auto/);
  assert.match(css, /\.project-page__content--technical\s*\{[\s\S]*?grid-template-rows:\s*auto auto auto auto minmax\(0, 1fr\)/);
  assert.match(css, /\.project-source\s*\{[\s\S]*?align-self:\s*end/);

  const narrow = mediaBlock(css, 'max-width: 56.24rem');
  assert.match(narrow, /\.project-entry__spread\s*\{[\s\S]*?height:\s*auto/);
  assert.match(narrow, /\.project-page\s*\{[\s\S]*?height:\s*auto/);
});
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
node --test --test-name-pattern="locks every desktop journal spread" tests/apple-material-refinement.test.mjs
```

Expected: FAIL because `--journal-spread-height` and the fixed page grids do not exist.

- [ ] **Step 3: Add the shared height token and stable desktop grids**

Add the token beside the existing journal material tokens:

```css
--journal-spread-height: 50rem;
```

Update the existing journal rules to include these declarations, preserving their current material/background/border rules:

```css
.project-notebook__workspace {
    position: relative;
    min-height: var(--journal-spread-height);
}

.project-entry__spread {
    height: var(--journal-spread-height);
}

.project-page {
    height: 100%;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
}

.project-page__content {
    min-height: 0;
}

.project-page--story .project-page__content {
    align-content: start;
    grid-template-rows: minmax(0, 15rem) auto;
}

.project-page__content--technical {
    grid-template-rows: auto auto auto auto minmax(0, 1fr);
    align-content: stretch;
    gap: 0.72rem;
    padding-top: 0.85rem;
}

.project-source {
    align-self: end;
}
```

Do not add `overflow: auto`, `overflow-y`, `max-height`, per-project height modifiers, or project-specific vertical margins.

- [ ] **Step 4: Add the narrow-layout height reset**

Inside the existing `@media (max-width: 56.24rem)` block, add:

```css
.project-entry__spread,
.project-page {
    height: auto;
}

.project-page__content--technical {
    grid-template-rows: none;
}

.project-page--story .project-page__content {
    grid-template-rows: none;
}
```

Keep the existing `position: static`, `width: 100%`, and hidden turn-layer rules.

- [ ] **Step 5: Run focused and full tests**

```bash
node --test --test-name-pattern="locks every desktop journal spread|bound stationary journal|accessible responsive desk spread" tests/apple-material-refinement.test.mjs
node --test tests/*.test.mjs
git diff --check
```

Expected: all tests PASS; full suite reports 34 tests passing; no whitespace errors.

- [ ] **Step 6: Commit and request review**

```bash
git add css/style.css tests/apple-material-refinement.test.mjs
git commit -m "style: lock the desktop journal footprint"
```

Reviewer gate: confirm all desktop notes share one height token, pages fill the spread, narrow layouts reset to auto, no internal scrolling exists, and dark projects are unaffected.

---

### Task 3: Style the technical typography, diagrams, metadata, and responsive flows

**Files:**
- Modify: `css/style.css:1400-1575, 1806-1885`
- Test: `tests/apple-material-refinement.test.mjs`
- Report: `.superpowers/sdd/consistent-journal-task-3-report.md`

**Interfaces:**
- Consumes: Task 1’s architecture/detail/source class families and Task 2’s stable page grid.
- Produces: reusable paper-diagram primitives; DM Mono technical labels; responsive horizontal/wrapped/vertical flows; accessible reduced-transparency and increased-contrast treatments.

- [ ] **Step 1: Add failing visual-system assertions**

Append:

```js
test('uses a typed technical-journal system for diagrams and metadata', () => {
  assert.match(css, /\.project-technical-label\s*\{[\s\S]*?font-family:\s*var\(--font-mono\)[\s\S]*?text-transform:\s*uppercase/);
  assert.match(css, /\.project-architecture\s*\{[\s\S]*?border-top:\s*1px solid var\(--paper-line\)/);
  assert.match(css, /\.project-architecture__flow\s*\{[\s\S]*?display:\s*flex/);
  assert.match(css, /\.project-architecture__node\s*\{[\s\S]*?border:\s*1px solid var\(--paper-edge\)/);
  assert.match(css, /\.project-architecture__boundary\s*\{[\s\S]*?border-style:\s*dashed/);
  assert.match(css, /\.project-details\s*\{[\s\S]*?grid-template-columns:\s*max-content minmax\(0, 1fr\)/);
  assert.match(css, /\.project-details dt\s*\{[\s\S]*?font-family:\s*var\(--font-mono\)/);

  const mobile = mediaBlock(css, 'max-width: 40rem');
  assert.match(mobile, /\.project-architecture__flow\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(mobile, /\.project-details\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
});
```

Extend `defines explicit journal accessibility preference fallbacks` with:

```js
assert.match(reducedTransparency, /\.project-architecture__node[\s\S]*?background:\s*var\(--paper\)/);
assert.match(increasedContrast, /\.project-architecture__node[\s\S]*?border-color:\s*var\(--clr-text\)/);
assert.match(increasedContrast, /\.project-technical-label[\s\S]*?color:\s*var\(--clr-text\)/);
```

- [ ] **Step 2: Run the focused test and verify failure**

```bash
node --test --test-name-pattern="typed technical-journal system|accessibility preference" tests/apple-material-refinement.test.mjs
```

Expected: FAIL because the new technical component styles are absent.

- [ ] **Step 3: Add the exact technical typography and compact component rules**

Add after the current `.project-page__content` rules:

```css
.project-technical-label {
    margin: 0;
    color: var(--clr-accent-2);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    font-weight: 500;
    line-height: 1.3;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.project-architecture {
    display: grid;
    gap: 0.5rem;
    margin: 0;
    padding-top: 0.65rem;
    border-top: 1px solid var(--paper-line);
}

.project-architecture__lanes {
    display: grid;
    gap: 0.42rem;
}

.project-architecture__lane {
    display: grid;
    grid-template-columns: 4.2rem minmax(0, 1fr);
    gap: 0.45rem;
    align-items: center;
}

.project-architecture__lane-label {
    color: var(--clr-text-2);
    font-family: var(--font-mono);
    font-size: 0.61rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.project-architecture__flow {
    display: flex;
    align-items: stretch;
    gap: 0.82rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.project-architecture__node {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    min-height: 3.25rem;
    display: grid;
    place-items: center;
    align-content: center;
    gap: 0.2rem;
    padding: 0.38rem;
    border: 1px solid var(--paper-edge);
    border-radius: 0.42rem;
    background: rgba(255, 249, 237, 0.72);
    color: var(--clr-text);
    font-size: 0.62rem;
    line-height: 1.2;
    text-align: center;
}

.project-architecture__node:not(:last-child)::after {
    content: '→';
    position: absolute;
    top: 50%;
    left: calc(100% + 0.12rem);
    width: 0.58rem;
    transform: translateY(-50%);
    color: var(--clr-accent-2);
    font-family: var(--font-mono);
}

.project-architecture__node i {
    color: var(--clr-accent-2);
    font-size: 0.92rem;
}

.project-architecture__node small {
    display: block;
    margin-top: 0.1rem;
    color: var(--clr-text-2);
    font-family: var(--font-mono);
    font-size: 0.5rem;
}

.project-architecture__boundary {
    border-style: dashed;
    border-color: var(--desk-sage);
}

.project-details {
    display: grid;
    grid-template-columns: max-content minmax(0, 1fr);
    margin: 0.35rem 0 0;
    font-size: 0.67rem;
    line-height: 1.35;
}

.project-details dt,
.project-details dd {
    margin: 0;
    padding: 0.22rem 0;
    border-bottom: 1px dotted var(--paper-line);
}

.project-details dt {
    padding-right: 0.8rem;
    color: var(--clr-text);
    font-family: var(--font-mono);
    font-weight: 500;
}

.project-details dd {
    color: var(--clr-text-2);
}

.project-page--technical .tech-tags {
    gap: 0.35rem;
    margin-top: 0.35rem;
}

.project-page--technical .tech-tag {
    padding: 0.28rem 0.55rem;
    font-size: 0.62rem;
}

.project-source {
    display: grid;
    gap: 0.25rem;
    padding-top: 0.55rem;
    border-top: 1px solid var(--paper-line);
}

.project-source p {
    margin: 0;
    color: var(--clr-text-2);
    font-size: 0.72rem;
}

.project-source--private i {
    margin-right: 0.35rem;
    color: var(--clr-accent-2);
}
```

If the desktop content-fit browser check in Task 5 shows clipping, reduce only these compact technical tokens in this order: vertical gaps, node padding, metadata row padding, then technical tag padding. Do not shrink narrative text below its current size and do not change the `50rem` height per project.

- [ ] **Step 4: Add tablet and mobile flow behavior**

Inside `@media (max-width: 56.24rem)` add:

```css
.project-page__content--technical { gap: 0.9rem; }
.project-architecture__flow { flex-wrap: wrap; }
.project-architecture__node { min-width: 7rem; }
```

Inside `@media (max-width: 40rem)` add:

```css
.project-architecture__lane { grid-template-columns: 1fr; }

.project-architecture__flow {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.72rem;
}

.project-architecture__node { min-width: 0; }

.project-architecture__node:not(:last-child)::after {
    content: '↓';
    top: calc(100% + 0.08rem);
    left: 50%;
    width: auto;
    transform: translateX(-50%);
}

.project-details { grid-template-columns: 1fr; }
.project-details dt { padding-bottom: 0; border-bottom: 0; }
.project-details dd { padding-top: 0.08rem; }
```

- [ ] **Step 5: Extend reduced-transparency and increased-contrast rules**

Inside `@media (prefers-reduced-transparency: reduce)` add:

```css
.project-architecture__node { background: var(--paper); }
```

Inside `@media (prefers-contrast: more)` add:

```css
.project-architecture,
.project-architecture__node,
.project-details dt,
.project-details dd,
.project-source {
    border-color: var(--clr-text);
}

.project-technical-label,
.project-architecture__lane-label,
.project-architecture__node,
.project-architecture__node small,
.project-details dt,
.project-details dd,
.project-source p {
    color: var(--clr-text);
}
```

- [ ] **Step 6: Run focused and full tests**

```bash
node --test --test-name-pattern="typed technical-journal system|accessibility preference|responsive desk spread" tests/apple-material-refinement.test.mjs
node --test tests/*.test.mjs
git diff --check
```

Expected: focused and full suites PASS; full suite remains 35 tests; no whitespace errors.

- [ ] **Step 7: Commit and request review**

```bash
git add css/style.css tests/apple-material-refinement.test.mjs
git commit -m "style: add technical journal diagrams and type system"
```

Reviewer gate: confirm the three-font hierarchy, reusable diagram primitives, correct connector reading order, mobile vertical flow, no color-only meaning, and no dark-mode regressions.

---

### Task 4: Smooth the locked-spread leaf transition

**Files:**
- Modify: `js/journal-flip.js:6, 143-187`
- Modify: `tests/journal-flip.test.mjs:28-117, 262-366`
- Test: `tests/journal-flip.test.mjs`
- Report: `.superpowers/sdd/consistent-journal-task-4-report.md`

**Interfaces:**
- Consumes: existing `createJournalFlipController(root, options)`, injected frame/timer dependencies, stable `50rem` spread from Task 2, and `turnKeyframes(direction)` private helper.
- Produces: exported `TURN_DURATION === 640`; recorded transform-only animation frames; exact easing; unchanged midpoint, latest-wins, cleanup, and fallback contracts.

- [ ] **Step 1: Make the fake animation capture keyframes and timing**

In `makeFakeJournal()`, change the fake node’s animation function from `node.animate = () => { ... }` to:

```js
node.animate = (keyframes, options) => {
  if (animationThrows) throw new Error('animation failed');
  let resolveFinished;
  const finished = new Promise(resolve => { resolveFinished = resolve; });
  const animation = {
    keyframes,
    options,
    cancelCalls: 0,
    cancel() { this.cancelCalls += 1; },
    finished,
    finish() { resolveFinished(); },
  };
  node.animation = animation;
  return animation;
};
```

- [ ] **Step 2: Add the failing exact-motion test**

Import `TURN_DURATION` from `journal-flip.js`, then append:

```js
test('uses a smooth opaque transform-only turn over the locked spread', () => {
  const journal = makeFakeJournal();
  clickCover(journal, 1);
  journal.flushFrame();

  const leaf = journal.layer.children[0];
  assert.equal(TURN_DURATION, 640);
  assert.equal(journal.layer.style.height, '320px');
  assert.equal(leaf.animation.options.duration, 640);
  assert.equal(leaf.animation.options.easing, 'cubic-bezier(0.22, 0.78, 0.18, 1)');
  assert.equal(leaf.animation.options.fill, 'forwards');
  assert.equal(leaf.animation.keyframes[0].transform, 'rotateY(0deg) translateZ(0)');
  assert.equal(leaf.animation.keyframes.at(-1).transform, 'rotateY(-180deg) translateZ(0)');
  assert.equal(leaf.animation.keyframes.some(frame => /-90deg/.test(frame.transform)), true);
  assert.equal(leaf.animation.keyframes.every(frame => !Object.hasOwn(frame, 'opacity')), true);
  assert.equal(leaf.animation.keyframes.every(frame => Object.keys(frame).every(key => ['transform', 'offset'].includes(key))), true);
});
```

Add the backward-direction assertion:

```js
test('mirrors the smooth turn for backward navigation', () => {
  const journal = makeFakeJournal({ initialIndex: 2 });
  clickCover(journal, 0);
  journal.flushFrame();
  const frames = journal.layer.children[0].animation.keyframes;
  assert.equal(frames.some(frame => /90deg/.test(frame.transform)), true);
  assert.equal(frames.at(-1).transform, 'rotateY(180deg) translateZ(0)');
});
```

- [ ] **Step 3: Run the motion tests and verify failure**

```bash
node --test --test-name-pattern="smooth opaque transform-only|mirrors the smooth turn" tests/journal-flip.test.mjs
```

Expected: FAIL because the current duration is `580`, easing is different, opacity is animated, and the keyframes lack the required transform sequence.

- [ ] **Step 4: Implement the exact turn timing and keyframes**

Change:

```js
const TURN_DURATION = 640;
```

Replace `turnKeyframes(direction)` with:

```js
function turnKeyframes(direction) {
    const sign = direction === 'forward' ? -1 : 1;
    return [
        { transform: 'rotateY(0deg) translateZ(0)', offset: 0 },
        { transform: `rotateY(${sign * 24}deg) translateZ(1px)`, offset: 0.18 },
        { transform: `rotateY(${sign * 90}deg) translateZ(2px)`, offset: 0.5 },
        { transform: `rotateY(${sign * 156}deg) translateZ(1px)`, offset: 0.82 },
        { transform: `rotateY(${sign * 180}deg) translateZ(0)`, offset: 1 },
    ];
}
```

Change the animation options to:

```js
animation = leaf.animate(turnKeyframes(direction), {
    duration,
    easing: 'cubic-bezier(0.22, 0.78, 0.18, 1)',
    fill: 'forwards',
});
```

Do not animate `height`, `width`, `top`, `bottom`, `margin`, `padding`, content opacity, or the journal container. Keep the midpoint timer at `duration / 2`.

- [ ] **Step 5: Run all controller behavior tests**

```bash
node --test tests/journal-flip.test.mjs
node --test tests/*.test.mjs
git diff --check
```

Expected: controller suite reports 14 tests passing; full suite reports 37 tests passing. Midpoint/hash, pre/post-midpoint interruption, current reselection, environment cancellation, deep link, failure cleanup, and exactly-one-open tests all remain green.

- [ ] **Step 6: Commit and request review**

```bash
git add js/journal-flip.js tests/journal-flip.test.mjs
git commit -m "fix: smooth the locked journal page turn"
```

Reviewer gate: confirm keyframes are opaque and transform-only, timing/easing are exact, commit remains at 50%, fallback cleanup remains safe, and the controller does not animate layout.

---

### Task 5: Verify equal geometry, content fit, responsive behavior, and interaction stability

**Files:**
- Modify only if QA reveals a defect: `index.html`, `css/style.css`, `js/journal-flip.js`, and their matching tests
- Append: `.superpowers/sdd/consistent-journal-task-5-report.md`

**Interfaces:**
- Consumes: the complete journal markup, fixed-height layout, responsive diagram system, and tuned flip controller from Tasks 1–4.
- Produces: evidence that all spec acceptance criteria pass at `1440×1000`, `768×1000`, and `375×900`; any fix must include its own regression assertion and focused commit.

- [ ] **Step 1: Run the static and controller suites from a clean tree**

```bash
node --test tests/*.test.mjs
git diff --check
git status --short
```

Expected: 37 tests pass, `git diff --check` has no output, and the tree is clean before browser QA.

- [ ] **Step 2: Start a local-only preview**

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Expected: the portfolio is available only at `http://127.0.0.1:4173/`. Keep the server in its own terminal session and stop it after QA.

- [ ] **Step 3: Run the desktop geometry and content-fit matrix**

Using the browser QA capability, load the light theme at `1440×1000`, open each of `#note-jobboard`, `#note-private-work`, and `#note-discord-bot`, and collect:

```js
const spread = document.querySelector('.project-entry[open] .project-entry__spread');
const pages = [...spread.querySelectorAll('.project-page')];
({
  id: document.querySelector('.project-entry[open]').id,
  top: spread.getBoundingClientRect().top,
  bottom: spread.getBoundingClientRect().bottom,
  height: spread.getBoundingClientRect().height,
  pageFit: pages.map(page => ({
    className: page.className,
    clientHeight: page.clientHeight,
    scrollHeight: page.scrollHeight,
    fits: page.scrollHeight <= page.clientHeight,
  })),
  horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
});
```

Expected for all three notes: identical `top`, `bottom`, and `height === 800`; every `fits` value is `true`; `horizontalOverflow` is `false`.

- [ ] **Step 4: Verify the turn does not move the spread**

At `1440×1000`, record the spread rectangle before selection, at the `320ms` midpoint, and after `700ms`. Also collect active entry, hash, leaf count, and `is-turning` state.

Expected:

```text
start.top === midpoint.top === finish.top
start.bottom === midpoint.bottom === finish.bottom
midpoint leafCount === 1
finish leafCount === 0
finish isTurning === false
finish active entry and hash equal the selected note
```

Visually confirm that the book and gutter remain stationary, the leaf covers the midpoint swap, the destination does not crossfade, and no text flashes outside the leaf.

- [ ] **Step 5: Verify rapid selection and preference fallbacks**

Run current→destination→current selection within `120ms`, then wait `800ms`.

Expected:

```js
({
  openCount: document.querySelectorAll('.project-entry[open]').length, // 1
  leafCount: document.querySelectorAll('.project-journal__leaf').length, // 0
  turning: document.querySelector('.project-notebook').classList.contains('is-turning'), // false
  active: document.querySelector('.project-entry[open]').id, // latest selected id
  hash: location.hash, // latest selected hash
});
```

Repeat one switch with reduced motion: destination commits immediately and no leaf appears. Repeat with reduced transparency: the leaf and its faces compute to `opacity: 1`. Switch to dark theme mid-turn: the leaf is removed, one entry remains open, and dark content is visible.

- [ ] **Step 6: Verify tablet and mobile natural-height layouts**

At `768×1000` and `375×900`, open each note and verify:

- spread and pages compute to natural content height rather than `800px`;
- no horizontal overflow;
- no turn leaf is created;
- architecture nodes wrap at `768px` and form a one-column flow at `375px`;
- mobile connector arrows point downward and follow DOM order;
- metadata becomes one column at `375px`;
- the center gutter remains hidden;
- cover labels paint above the spread;
- public links and private status remain visible and keyboard reachable.

- [ ] **Step 7: Fix only observed defects with regression coverage**

For each defect, first add a focused Node assertion or controller test that fails for the observed cause. Then make the smallest scoped production change, rerun the focused test, the 37-test suite, and the affected browser viewport. Do not change the global `50rem` height unless at least one desktop page still overflows after compacting technical gaps/padding in the order specified in Task 3.

- [ ] **Step 8: Record QA and commit only if files changed**

Append exact viewport measurements, interaction results, console errors, failed responses, test totals, and reviewer verdict to `.superpowers/sdd/consistent-journal-task-5-report.md`.

If production or test files changed:

```bash
git add index.html css/style.css js/journal-flip.js tests/apple-material-refinement.test.mjs tests/journal-flip.test.mjs
git commit -m "fix: polish consistent journal layout after browser QA"
```

If only the ignored scratch report changed, do not create an empty documentation commit. Preserve the report for the reviewer and include the same evidence in the final handoff.

Reviewer gate: provide the isolated Task 5 range and all measurements. The reviewer must confirm no clipped content, equal desktop geometry, natural responsive height, accessible diagrams, clean interaction state, and no new content claims.

---

## Final Whole-Branch Review

After all task reviews pass:

1. Run `node --test tests/*.test.mjs`, `git diff --check`, and `git status --short`.
2. Re-run the `1440×1000`, `768×1000`, and `375×900` browser matrix.
3. Generate a read-only review range from the commit immediately before Task 1 through the final Task 5 commit.
4. Ask the strongest available reviewer to compare the complete range against `docs/superpowers/specs/2026-08-19-consistent-technical-journal-design.md` and this plan.
5. Fix every Critical or Important finding in one corrective commit with regression coverage, then re-review the corrected full range.
6. Do not declare completion until the final reviewer returns **Ready to merge: Yes**, the full suite passes, the browser matrix passes, and the working tree is clean.
