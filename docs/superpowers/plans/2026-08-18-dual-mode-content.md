# Dual-Mode Portfolio Content Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dark mode retain the professional cloud portfolio while light mode presents a warm personal workspace and digital garden.

**Architecture:** Existing section IDs and shared factual content remain stable. Theme-specific fragments use `data-content-theme="dark|light"`; a single `syncThemeContent(theme)` function controls their native `hidden` property on initial load and every theme change. Shared education metadata, project cards, external links, and the contact form are not duplicated.

**Tech Stack:** Semantic HTML, CSS custom properties and responsive grids, vanilla JavaScript, Node’s built-in test runner.

## Global Constraints

- Dark mode keeps the existing professional cloud and platform content.
- Light mode uses only claims supported by the existing portfolio and approved specification.
- Keep `#home`, `#about`, `#skills`, `#projects`, and `#contact` unchanged.
- Keep education, certifications, project status, dates, roles, repository links, résumé, contact form, and metadata theme-independent.
- Without JavaScript, dark content is visible and light content is hidden.
- Theme changes must preserve scroll position, project-filter state, contact-form values, and mobile-menu state.
- Hidden thematic content must be absent from layout, keyboard navigation, and the accessibility tree.
- No new dependencies or external content sources.

---

## File Structure

- `index.html`: owns dark/light copy fragments and shared factual elements.
- `css/style.css`: owns `[hidden]` enforcement, light-mode Now/Notes layouts, and responsive presentation.
- `js/main.js`: owns theme normalization and content synchronization.
- `tests/apple-material-refinement.test.mjs`: owns static regression checks for fallback, copy, synchronization, and shared controls.

### Task 1: Define the dual-content contract with failing tests

**Files:**
- Modify: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: source strings already loaded as `html`, `css`, and `js`.
- Produces: regression boundaries for theme fragments, fallback visibility, shared form state, and `syncThemeContent(theme)`.

- [ ] **Step 1: Add the failing dual-mode tests**

Append:

```js
test('ships dark content as fallback and light workspace copy as an alternate view', () => {
  assert.match(html, /data-content-theme="dark"/);
  assert.match(html, /data-content-theme="light" hidden/);
  assert.match(html, /Personal workspace · learning in public/);
  assert.match(html, /A quiet corner for the systems I’m building/);
  assert.match(html, /<h2 class="section-title">Now<\/h2>/);
  assert.match(html, /Moving a system, not just its files/);
  assert.match(html, /Pull up a chair/);
});

test('synchronizes themed content without duplicating shared controls', () => {
  assert.match(js, /function syncThemeContent\(theme\)/);
  assert.match(js, /const normalizedTheme = theme === 'light' \? 'light' : 'dark'/);
  assert.match(js, /fragment\.hidden = fragment\.dataset\.contentTheme !== normalizedTheme/);
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.equal((html.match(/id="contact-form"/g) || []).length, 1);
  assert.equal((html.match(/id="current-work-grid"/g) || []).length, 1);
});
```

- [ ] **Step 2: Run the suite and verify the new tests fail**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: the two new tests FAIL because theme fragments and `syncThemeContent` do not exist; the existing four tests PASS.

- [ ] **Step 3: Commit the regression tests**

```bash
git add tests/apple-material-refinement.test.mjs
git commit -m "test: define dual-mode content behavior"
```

### Task 2: Add semantic theme-specific content while sharing factual elements

**Files:**
- Modify: `index.html:35-625`

**Interfaces:**
- Consumes: the existing anchors, metadata blocks, skills grid, project cards, external links, and contact form.
- Produces: `[data-content-theme]` fragments for `syncThemeContent(theme)` and `.now-grid`, `.field-notes-grid` presentation hooks for CSS.

- [ ] **Step 1: Make desktop and mobile navigation labels theme-aware**

Inside every existing anchor for `#about`, `#skills`, `#projects`, and `#contact`, replace the plain label with paired spans. Use the same pattern in desktop and mobile navigation:

```html
<a href="#about" class="nav-link" data-section="about">
    <span data-content-theme="dark">About</span>
    <span data-content-theme="light" hidden>Story</span>
</a>
<a href="#skills" class="nav-link" data-section="skills">
    <span data-content-theme="dark">Skills</span>
    <span data-content-theme="light" hidden>Now</span>
</a>
<a href="#projects" class="nav-link" data-section="projects">
    <span data-content-theme="dark">Projects</span>
    <span data-content-theme="light" hidden>Notes</span>
</a>
<a href="#contact" class="nav-link" data-section="contact">
    <span data-content-theme="dark">Contact</span>
    <span data-content-theme="light" hidden>Say hello</span>
</a>
```

Keep Home and Resume unchanged. Mobile links use `class="nav-mobile-link"` and the same paired span content.

- [ ] **Step 2: Add light hero copy and actions alongside the existing hero copy**

Insert this opening tag immediately before the current eyebrow's `.reveal-wrapper`:

```html
<div class="hero-theme-content" data-content-theme="dark">
```

Insert this closing tag immediately after the closing tag of the current `.hero-actions`:

```html
</div>
```

This preserves every existing dark hero node verbatim while placing the complete block inside one themed container.

Immediately after it, add:

```html
<div class="hero-theme-content" data-content-theme="light" hidden>
    <div class="reveal-wrapper">
        <p class="hero-eyebrow reveal-item">Personal workspace · learning in public</p>
    </div>
    <h1 class="hero-title">
        <span class="reveal-wrapper"><span class="reveal-item">Garren</span></span>
        <span class="reveal-wrapper"><span class="reveal-item">Dullas</span></span>
    </h1>
    <div class="reveal-wrapper">
        <p class="hero-subtitle reveal-item">A quiet corner for the systems I’m building, the lessons I’m keeping, and the questions I’m still exploring—usually with coffee nearby.</p>
    </div>
    <div class="hero-actions reveal-fade-in">
        <a href="#projects" class="btn btn-primary"><i class="fas fa-book-open" aria-hidden="true"></i>Read my notes</a>
        <a href="#skills" class="btn btn-secondary">What I’m working on</a>
        <a href="output/pdf/Garren-Dullas-Cloud-Platform-Resume.pdf" target="_blank" rel="noopener noreferrer" class="btn btn-secondary"><i class="fas fa-file-arrow-down" aria-hidden="true"></i>Resume</a>
        <a href="https://github.com/Acteus" target="_blank" rel="noopener noreferrer" class="btn btn-ghost"><i class="fab fa-github" aria-hidden="true"></i>GitHub</a>
    </div>
</div>
```

- [ ] **Step 3: Add the light Story copy while retaining shared metadata**

Mark the current `.about-text` with `data-content-theme="dark"`. Add this sibling before `.about-meta`:

```html
<div class="about-text" data-content-theme="light" hidden>
    <p>I’m an IT student who became interested not only in writing applications, but in the quieter work that keeps them reachable: packaging, deployment, service connections, logs, and recovery.</p>
    <p>This space is a record of learning through real systems across Azure, DigitalOcean, and Oracle Cloud—what worked, what needed another attempt, and what I want to understand better next.</p>
</div>
```

Replace the About header with:

```html
<header class="section-header" data-aos="fade-up">
    <div data-content-theme="dark">
        <p class="section-label">Who I am</p>
        <h2 class="section-title">About</h2>
    </div>
    <div data-content-theme="light" hidden>
        <p class="section-label">The person behind the terminal</p>
        <h2 class="section-title">My story</h2>
    </div>
</header>
```

Leave `.about-meta` outside both themed fragments.

- [ ] **Step 4: Add the light Now section alongside the existing Skills content**

Wrap the current Skills header and `.skills-grid` in `<div data-content-theme="dark">`. Add this sibling:

```html
<div data-content-theme="light" hidden>
    <header class="section-header">
        <p class="section-label">What has my attention</p>
        <h2 class="section-title">Now</h2>
    </header>
    <div class="now-grid">
        <article class="now-card panel">
            <p class="skill-tier">Building</p>
            <h3>JRU Atlas &amp; LaborWise</h3>
            <p>Two private systems in active development: an accreditation workspace on DigitalOcean and an employment-rights service on Azure.</p>
            <div class="tech-tags"><span class="tech-tag">DigitalOcean</span><span class="tech-tag">Azure</span><span class="tech-tag">Private projects</span></div>
        </article>
        <article class="now-card panel">
            <p class="skill-tier">Learning</p>
            <h3>Making operations visible</h3>
            <p>I’m paying closer attention to observability, reliable container delivery, and documentation that explains what happens after deployment.</p>
            <div class="tech-tags"><span class="tech-tag">Observability</span><span class="tech-tag">Containers</span><span class="tech-tag">Documentation</span></div>
        </article>
        <article class="now-card panel">
            <p class="skill-tier">Improving</p>
            <h3>Sharing the work responsibly</h3>
            <p>I’m turning deployment work into concise, sanitized case studies that show decisions and lessons without exposing private code or data.</p>
            <div class="tech-tags"><span class="tech-tag">Case studies</span><span class="tech-tag">Architecture</span><span class="tech-tag">Clear writing</span></div>
        </article>
    </div>
</div>
```

- [ ] **Step 5: Add light Field Notes before the shared project cards**

Wrap only the existing Projects header and filter bar in `<div data-content-theme="dark">`; leave every existing project card and project grid single-source. Insert before `#current-work-grid`:

```html
<div data-content-theme="light" hidden>
    <header class="section-header">
        <p class="section-label">Lessons worth keeping</p>
        <h2 class="section-title">Field notes</h2>
    </header>
    <div class="field-notes-grid">
        <article class="field-note panel">
            <p class="field-note-index">Note 01 · JobBoard-DevOps</p>
            <h3>Moving a system, not just its files</h3>
            <p>The AWS-to-Azure study reinforced that migration is also about separating application concerns from delivery and infrastructure decisions.</p>
        </article>
        <article class="field-note panel">
            <p class="field-note-index">Note 02 · JRU Atlas &amp; LaborWise</p>
            <h3>Showing private work responsibly</h3>
            <p>The useful story is not private source code. It is the sanitized architecture, operational choices, and lessons that can be shared safely.</p>
        </article>
        <article class="field-note panel">
            <p class="field-note-index">Note 03 · GitHub → Discord Bot</p>
            <h3>Keeping a small service alive</h3>
            <p>Running a small service on Oracle Cloud has made Podman, Quadlet, Caddy, HTTPS, and recovery part of the project—not background details.</p>
        </article>
    </div>
    <div class="projects-subsection-heading projects-behind-notes">
        <p class="section-label">Projects behind the notes</p>
        <p class="projects-subsection-note">The same real systems, statuses, links, and tools—kept close to the lessons they produced.</p>
    </div>
</div>
```

Mark all three existing `.projects-subsection-heading` blocks with `data-content-theme="dark"` so their professional category labels disappear in light mode. Project grids remain shared and visible.

- [ ] **Step 6: Add light contact framing while retaining one form**

Replace the Contact header with paired dark/light fragments and add paired copy inside `.contact-info`:

```html
<header class="section-header" data-aos="fade-up">
    <div data-content-theme="dark">
        <p class="section-label">Get in touch</p>
        <h2 class="section-title">Contact</h2>
    </div>
    <div data-content-theme="light" hidden>
        <p class="section-label">Pull up a chair</p>
        <h2 class="section-title">Say hello</h2>
    </div>
</header>
```

```html
<p data-content-theme="dark">Open to discussing cloud deployments, platform operations, backend systems, and practical infrastructure work. Email is the best way to reach me.</p>
<p data-content-theme="light" hidden>If you’re building something thoughtful, learning through a difficult system, or looking for someone who cares about the details behind deployment, I’d be glad to hear from you.</p>
```

Leave `.contact-links`, `#contact-form`, and `#form-message` shared and unchanged.

- [ ] **Step 7: Run the suite to confirm markup assertions advance**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: the light-copy assertions PASS; synchronization assertions still FAIL because JavaScript and `[hidden]` enforcement are not implemented.

- [ ] **Step 8: Commit the semantic content**

```bash
git add index.html
git commit -m "feat: add personal workspace content"
```

### Task 3: Synchronize content and style the new light-mode sections

**Files:**
- Modify: `js/main.js:18-42`
- Modify: `css/style.css:75-150, 445-540, 760-870, 1260-1360`

**Interfaces:**
- Consumes: every `[data-content-theme]` fragment from Task 2.
- Produces: `syncThemeContent(theme): void`, `.now-grid`, `.now-card`, `.field-notes-grid`, and `.field-note` behavior.

- [ ] **Step 1: Add theme normalization and native visibility synchronization**

Add after the theme element lookups:

```js
const themeContent = document.querySelectorAll('[data-content-theme]');

function syncThemeContent(theme) {
    const normalizedTheme = theme === 'light' ? 'light' : 'dark';
    themeContent.forEach(fragment => {
        fragment.hidden = fragment.dataset.contentTheme !== normalizedTheme;
    });
}
```

Call `syncThemeContent(savedTheme);` immediately after `html.setAttribute('data-theme', savedTheme);`. In the toggle handler, call `syncThemeContent(next);` immediately after setting `data-theme` and before saving it.

- [ ] **Step 2: Enforce hidden state and add content layouts**

Add to the base rules:

```css
[hidden] { display: none !important; }

.hero-theme-content { width: 100%; }

.now-grid,
.field-notes-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.now-card,
.field-note {
    padding: 26px;
}

.now-card h3,
.field-note h3 {
    margin-bottom: 12px;
    color: var(--clr-text);
    font-size: 1rem;
    line-height: 1.35;
}

.now-card > p:not(.skill-tier),
.field-note > p:not(.field-note-index) {
    margin-bottom: 18px;
    color: var(--clr-text-2);
    font-size: 0.875rem;
    line-height: 1.65;
}

.field-note-index {
    margin-bottom: 10px;
    color: var(--clr-accent);
    font-family: var(--font-mono);
    font-size: 0.66rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

.projects-behind-notes { margin-top: 48px; }
```

Add responsive behavior:

```css
@media (max-width: 768px) {
    .now-grid,
    .field-notes-grid { grid-template-columns: 1fr; }

    .nav-link [data-content-theme],
    .nav-mobile-link [data-content-theme] { white-space: nowrap; }
}
```

Add these rules to make shared project evidence feel calmer in light mode without hiding facts:

```css
[data-theme="light"] #projects .project-card {
    box-shadow: 0 4px 20px rgba(91, 58, 39, 0.08);
}

[data-theme="light"] #projects .project-proof-list,
[data-theme="light"] #projects .project-evidence-placeholder {
    background: rgba(var(--clr-accent-rgb), 0.035);
}
```

- [ ] **Step 3: Run the full static suite**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: all six tests PASS.

- [ ] **Step 4: Check formatting and obsolete duplication**

Run:

```bash
git diff --check
rg -n 'id="contact-form"|id="current-work-grid"' index.html
```

Expected: `git diff --check` exits 0; each ID appears exactly once.

- [ ] **Step 5: Commit synchronization and styling**

```bash
git add js/main.js css/style.css
git commit -m "feat: sync content with portfolio theme"
```

### Task 4: Verify theme switching as a user journey

**Files:**
- Modify only if verification reveals a defect: `index.html`, `css/style.css`, `js/main.js`, `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: the completed static site.
- Produces: evidence that both perspectives are usable and preserve shared state.

- [ ] **Step 1: Start the local preview**

Run: `python3 -m http.server 8000`

Expected: the site is available at `http://127.0.0.1:8000`.

- [ ] **Step 2: Verify the dark experience**

At a 1440px viewport, confirm dark mode shows About, Skills, Projects, the professional hero subtitle, and the professional contact copy. Confirm Story, Now, Field Notes, and “Pull up a chair” are absent from layout and keyboard navigation.

- [ ] **Step 3: Verify the light experience and persistence**

Switch to light mode and confirm the navigation reads Story, Now, Notes, and Say hello. Confirm the personal hero, Story, three Now cards, three Field Notes, shared project cards, and warm contact copy are visible. Reload and confirm the light content is restored.

- [ ] **Step 4: Verify shared state survives switching**

Enter values in every contact-form field, open the mobile menu, and scroll midway through Projects. Toggle the theme and confirm field values, menu state, and scroll position are unchanged. In dark mode, choose a project filter, toggle twice, and confirm the chosen filter remains active.

- [ ] **Step 5: Verify accessibility and responsive behavior**

At 375px and 768px widths, confirm navigation labels do not wrap or overflow. Tab through the page in both themes and confirm no hidden thematic controls receive focus. Enable reduced motion and confirm content appears without a transition dependency.

- [ ] **Step 6: Run final automated verification**

Run:

```bash
node --test tests/apple-material-refinement.test.mjs
git diff --check
git status --short
```

Expected: all six tests PASS, no whitespace errors, and only intended files are modified.

- [ ] **Step 7: Commit any verification fixes**

If Step 2–5 required changes, commit them with:

```bash
git add index.html css/style.css js/main.js tests/apple-material-refinement.test.mjs
git commit -m "fix: polish dual-mode content behavior"
```

If no files changed during verification, do not create an empty commit.
