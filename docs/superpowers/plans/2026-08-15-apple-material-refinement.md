# Apple Material Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reserve glass for floating navigation while presenting portfolio content on calm solid panels.

**Architecture:** `index.html` applies a panel class to reading surfaces. `style.css` separates panel and floating-material tokens. `main.js` has no cursor-driven content animation, and a Node built-in test enforces those asset boundaries.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node built-in test runner.

## Global Constraints

- Do not add dependencies or change portfolio copy.
- Preserve visible focus, immediate press feedback, and all three existing preference media queries.
- Use glass only for fixed navigation and the mobile navigation sheet.

---

### Task 1: Define the regression test

**Files:**

- Create: `tests/apple-material-refinement.test.mjs`

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');

test('uses panels for reading content and no liquid cursor effect', () => {
  assert.match(html, /class="skill-card panel cloud-priority"/);
  assert.match(html, /class="project-card panel/);
  assert.match(html, /class="contact-form-panel panel"/);
  assert.match(css, /\.panel\s*\{/);
  assert.doesNotMatch(html, /id="lg-svg-defs"/);
  assert.doesNotMatch(js, /LIQUID GLASS|rotateX\(|--mouse-x/);
});

test('keeps accessibility preference queries', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)/);
  assert.match(css, /@media \(prefers-contrast: more\)/);
});
```

- [ ] **Step 2: Verify red**

Run `node --test tests/apple-material-refinement.test.mjs`. Expect the first test to fail because the legacy glass classes, SVG, and cursor effect remain.

- [ ] **Step 3: Commit the test**

Run `git add tests/apple-material-refinement.test.mjs && git commit -m "test: define apple material boundaries"`.

### Task 2: Establish panel surfaces and reduce motion

**Files:**

- Modify: `index.html:30-48, 190-560`
- Modify: `css/style.css:12-67, 130-214, 1330-1370`

- [ ] **Step 1: Add panel tokens and rules**

```css
--clr-panel: rgba(255, 255, 255, 0.055);
--clr-panel-hover: rgba(255, 255, 255, 0.08);
--clr-panel-border: rgba(255, 255, 255, 0.1);

.panel {
    position: relative;
    background: var(--clr-panel);
    border: 1px solid var(--clr-panel-border);
    border-radius: var(--card-radius);
    box-shadow: var(--shadow-card), inset 0 1px 0 rgba(255, 255, 255, 0.04);
    transition: transform 180ms ease-out, border-color 180ms ease-out, background-color 180ms ease-out, box-shadow 180ms ease-out;
}
```

Define light-theme equivalents, replace all reading-surface `glass` classes with `panel`, remove `lg-svg-defs`, and include `.panel` in reduced-transparency and high-contrast selectors.

- [ ] **Step 2: Shorten initial reveal motion**

Use `opacity: 0`, `translateY(8px)`, and `reveal-fade-up 360ms cubic-bezier(0.2, 0.8, 0.2, 1)` for `.reveal-item`; use 360ms for the other hero reveals. Delete the unused old text-reveal keyframe.

- [ ] **Step 3: Verify partial progress**

Run `node --test tests/apple-material-refinement.test.mjs`. Expect only the legacy JavaScript assertion to fail.

### Task 3: Remove ornamental cursor physics and verify

**Files:**

- Modify: `js/main.js:83-159`
- Test: `tests/apple-material-refinement.test.mjs`

- [ ] **Step 1: Remove legacy interactions**

Delete the ambient-orb parallax and the `LIQUID GLASS` mousemove/mouseleave card effect. Do not replace them with a new cursor animation.

- [ ] **Step 2: Verify green**

Run `node --test tests/apple-material-refinement.test.mjs`. Expect 2 passing tests and 0 failures.

- [ ] **Step 3: Verify static assets and commit**

Run `node --test tests/apple-material-refinement.test.mjs && git diff --check`. Expect exit code 0. Then run `git add index.html css/style.css js/main.js tests/apple-material-refinement.test.mjs && git commit -m "feat: refine portfolio material hierarchy"`.
