# Café Workspace Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make light mode a warm, clean soft-sage café workspace while retaining dark mode as the portfolio’s cool technical build mode.

**Architecture:** Keep `data-theme` as the one theme selector. CSS semantic tokens drive every component; a CSS-only light hero vignette decorates the existing hero without markup or JavaScript changes. The particle field reads its theme-specific color from the document’s computed CSS custom property.

**Tech Stack:** Static HTML, CSS custom properties and pseudo-elements, vanilla JavaScript, Node’s built-in test runner.

## Global Constraints

- Preserve all existing content, navigation, filters, contact behavior, and `portfolio-theme` local-storage key.
- Dark mode retains black/cyan technical styling; warm light mode uses ivory, cocoa, warm tan, and soft sage.
- No external images or new dependencies.
- Decorative hero art must be non-interactive and unavailable to assistive technologies.
- Preserve the existing reduced-motion, reduced-transparency, and high-contrast preference support.

---

## File Structure

- `.gitignore`: excludes visual-companion session files.
- `css/style.css`: owns semantic theme colors, the responsive café hero vignette, and component-specific token use.
- `js/main.js`: reads the active particle color token so the canvas follows the stylesheet.
- `tests/apple-material-refinement.test.mjs`: owns static regression checks for theme behavior and decorative accessibility boundaries.

### Task 1: Lock the café workspace contract with tests and ignore tooling artefacts

**Files:**
- Modify: `.gitignore`
- Modify: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: theme-controlled root element (`data-theme="light"`) and the existing `#hero-particles` canvas.
- Produces: static test coverage for café theme tokens, CSS-only decorative art, and token-driven canvas color selection.

- [ ] **Step 1: Add failing static assertions**

Append this test to `tests/apple-material-refinement.test.mjs`:

```js
test('defines a warm café light theme without changing the theme contract', () => {
  assert.match(css, /\[data-theme="light"\][\s\S]*?--clr-bg:\s*#f5ead8/);
  assert.match(css, /\[data-theme="light"\][\s\S]*?--clr-accent:\s*#748b67/);
  assert.match(css, /\.hero-section\.cafe-workspace::before/);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*?\.hero-section\.cafe-workspace::before/);
  assert.match(js, /getComputedStyle\(document\.documentElement\)\.getPropertyValue\('--particle-rgb'\)/);
  assert.match(html, /<section id="home" class="hero-section cafe-workspace">/);
});
```

- [ ] **Step 2: Run the targeted test to verify failure**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: FAIL because light-theme café tokens, `cafe-workspace`, and computed particle color do not yet exist.

- [ ] **Step 3: Ignore visual companion files**

Add this exact line under the temporary-files section of `.gitignore`:

```gitignore
.superpowers/
```

- [ ] **Step 4: Commit the test and ignore rule**

```bash
git add .gitignore tests/apple-material-refinement.test.mjs
git commit -m "test: define cafe workspace theme boundaries"
```

### Task 2: Implement the two intentional themes and the café hero vignette

**Files:**
- Modify: `index.html:85`
- Modify: `css/style.css:8-72,426-493,1290-1325`

**Interfaces:**
- Consumes: the theme attribute already set by `js/main.js` and the existing `.hero-section`, `.hero-content`, and `.hero-particles` elements.
- Produces: `cafe-workspace` as the decorative hero hook and `--particle-rgb` as the CSS-to-canvas color contract.

- [ ] **Step 1: Add the hero hook without altering accessible content**

Change the existing home section opening tag to:

```html
<section id="home" class="hero-section cafe-workspace">
```

Do not add image elements or text for the scene. The pseudo-elements are decorative by construction and the canvas remains `aria-hidden="true"`.

- [ ] **Step 2: Replace the light token palette and define the canvas token**

Keep the dark root colors, add `--particle-rgb: 103, 232, 249;` in `:root`, and use these light overrides:

```css
[data-theme="light"] {
    --clr-bg: #f5ead8;
    --clr-bg2: #eadbc5;
    --clr-surface: rgba(85, 57, 41, 0.045);
    --clr-surface-hover: rgba(85, 57, 41, 0.08);
    --clr-border: rgba(73, 49, 36, 0.14);
    --clr-border-hover: rgba(73, 49, 36, 0.26);
    --clr-text: #39251d;
    --clr-text-2: rgba(57, 37, 29, 0.67);
    --clr-text-3: rgba(57, 37, 29, 0.42);
    --clr-accent: #748b67;
    --clr-accent-2: #5e7754;
    --clr-glass-bg: rgba(255, 250, 242, 0.70);
    --clr-glass-border: rgba(255, 250, 242, 0.90);
    --clr-glass-rim: rgba(255, 255, 255, 0.82);
    --clr-shimmer: rgba(255, 255, 255, 0.34);
    --clr-panel: rgba(255, 250, 242, 0.72);
    --clr-panel-hover: rgba(255, 250, 242, 0.90);
    --clr-panel-border: rgba(73, 49, 36, 0.13);
    --particle-rgb: 102, 135, 96;
}
```

Update scrollbar track and primary-button shadow to use existing semantic variables or add a `--clr-accent-shadow` token, ensuring no cyan shadow remains in light mode.

- [ ] **Step 3: Add the CSS-only café scene and responsive boundary**

Place this after `.hero-section` rules:

```css
.hero-section.cafe-workspace::before {
    content: '';
    position: absolute;
    right: clamp(24px, 8vw, 150px);
    bottom: 14%;
    width: min(24vw, 250px);
    aspect-ratio: 0.68;
    opacity: 0;
    pointer-events: none;
    background:
        radial-gradient(ellipse at 26% 76%, #748b67 0 9%, transparent 10%),
        radial-gradient(ellipse at 65% 58%, #748b67 0 11%, transparent 12%),
        linear-gradient(#c5e0d7 0 44%, #f3cf95 45% 61%, #b8906e 62% 100%);
    border: 10px solid #b98b6d;
    box-shadow: inset 0 -50px #8c7057, 0 18px 45px rgba(91, 58, 39, 0.12);
    transition: opacity 240ms ease;
}

[data-theme="light"] .hero-section.cafe-workspace::before { opacity: 0.9; }

@media (max-width: 768px) {
    .hero-section.cafe-workspace::before { display: none; }
}
```

Keep `.hero-content` and `.scroll-indicator` at a higher z-index than the pseudo-element.

- [ ] **Step 4: Run the static checks to verify the CSS/HTML contract**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit the visual implementation**

```bash
git add index.html css/style.css
git commit -m "feat: add cafe workspace light theme"
```

### Task 3: Connect the particle field, then verify responsive and interaction behavior

**Files:**
- Modify: `js/main.js:185-188`
- Modify: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: `--particle-rgb` supplied by `css/style.css`.
- Produces: particle colors that automatically track the saved and toggled `data-theme` state.

- [ ] **Step 1: Replace the hard-coded canvas color branch**

Replace:

```js
const isLightTheme = document.documentElement.dataset.theme === 'light';
const color = isLightTheme ? '8,145,178' : '103,232,249';
```

with:

```js
const color = getComputedStyle(document.documentElement)
    .getPropertyValue('--particle-rgb')
    .trim();
```

The value is read each animation frame so theme switching updates the canvas immediately, with no extra event handler.

- [ ] **Step 2: Add an assertion that no legacy color branch remains**

Add this line to the café theme test:

```js
assert.doesNotMatch(js, /isLightTheme\s*=|8,145,178/);
```

- [ ] **Step 3: Run automated verification**

Run: `node --test tests/apple-material-refinement.test.mjs`

Expected: all tests PASS.

- [ ] **Step 4: Manually verify the static site**

Run: `python3 -m http.server 8000`

Verify at `http://localhost:8000`:

1. Dark mode remains black/cyan; light mode is ivory/cocoa/sage with the hero window scene visible on desktop.
2. Toggle light → dark → light and reload; the saved preference remains active.
3. Tab through the toggle, links, filter buttons, and form inputs; focus remains visible in each theme.
4. At a narrow viewport, the decorative hero scene is absent while hero copy and action buttons remain unobstructed.
5. Emulate reduced motion; particles and decorative animation do not run.

- [ ] **Step 5: Commit the integration**

```bash
git add js/main.js tests/apple-material-refinement.test.mjs
git commit -m "feat: sync particles with portfolio theme"
```
