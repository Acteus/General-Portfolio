# Single-Leaf Journal Flip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the light-mode project spread into a convincing stationary journal whose single paper leaf flips across the center seam when projects change.

**Architecture:** Keep the authored `<details>` entries as the accessible source of truth and no-JavaScript fallback. Add a stable journal workspace and one `aria-hidden` turn layer in HTML/CSS, then isolate selection and Web Animations API behavior in `js/journal-flip.js`; `js/main.js` only initializes the controller and notifies it when a theme change interrupts a turn.

**Tech Stack:** Semantic HTML, CSS custom properties and 3D transforms, vanilla JavaScript, Web Animations API, Node.js built-in test runner.

## Global Constraints

- Work directly in the existing static HTML/CSS/JavaScript stack; add no framework, package, animation dependency, image asset, or build step.
- Change only the light-mode project notebook. Dark-mode project cards and filters must remain unchanged.
- Preserve all verified project copy, dates, technologies, privacy labels, repository links, theme behavior, and deep links.
- The journal base stays planted; only one decorative paper leaf moves.
- Later notes turn right-to-left; earlier notes mirror the path left-to-right.
- The desktop flip applies at `min-width: 56.25rem`, lasts `580ms`, has no bounce, and animates only `transform`, `opacity`, and shadow intensity.
- Below `56.25rem`, at 400% zoom, under reduced motion, or without Web Animations API support, retain native disclosure behavior and do not create a 3D leaf.
- The temporary leaf is always `aria-hidden`, contains no focusable content, and is removed on finish or cancellation.
- Focus remains on the activated summary, targets remain at least `44px` tall, and exactly one desktop journal entry is open after every commit or cancellation.
- Do not copy generated-reference facts. The strings `GreenTrack`, `CafeConnect`, `ECS Fargate`, `MongoDB Atlas`, `CloudWatch`, `Terraform`, and `your-username` must not enter shipped HTML, CSS, or JavaScript.
- Read `docs/superpowers/specs/2026-08-19-single-leaf-journal-flip-design.md` before editing.

## File Structure

- Modify `index.html`: wrap the field-note list in a stable workspace, add the decorative turn layer, and load the controller before `js/main.js`.
- Modify `css/style.css`: add semantic journal tokens, realistic stationary-page material, 3D leaf faces, responsive rules, and preference fallbacks.
- Create `js/journal-flip.js`: own direction calculation, capability gating, decorative leaf creation, selection commits, cancellation, deep links, and cleanup.
- Modify `js/main.js`: initialize the controller and cancel a turn before light content is hidden.
- Modify `tests/apple-material-refinement.test.mjs`: extend static integration and content-integrity assertions.
- Create `tests/journal-flip.test.mjs`: unit-test the pure direction, gating, and leaf-face contracts without a DOM dependency.

---

### Task 1: Build the Stationary Journal Shell and Material

**Files:**
- Modify: `tests/apple-material-refinement.test.mjs:61-107`
- Modify: `index.html:347-450`
- Modify: `css/style.css:48-84`
- Modify: `css/style.css:1247-1416`

**Interfaces:**
- Consumes: existing `.project-notebook`, `.project-notebook__index`, `.project-entry`, and `.project-entry__spread` markup.
- Produces: `.project-notebook__workspace` as the positioning context and `.project-journal__turn-layer[aria-hidden="true"]` as the later controller’s only transient-render target.

- [ ] **Step 1: Write the failing structural and material test**

Append these tests to `tests/apple-material-refinement.test.mjs`:

```js
test('authors one persistent decorative journal turn layer', () => {
  assert.equal((html.match(/class="project-notebook__workspace"/g) || []).length, 1);
  assert.equal((html.match(/class="project-journal__turn-layer" aria-hidden="true"/g) || []).length, 1);
  assert.match(html, /project-notebook__workspace[\s\S]*?project-notebook__index[\s\S]*?project-journal__turn-layer/);
});

test('styles the open spread as a bound stationary journal', () => {
  assert.match(css, /--journal-binding:\s*#6d5039/i);
  assert.match(css, /--journal-gutter:\s*rgba\(74, 48, 31, 0\.22\)/i);
  assert.match(css, /\.project-notebook__workspace\s*\{[\s\S]*?position:\s*relative[\s\S]*?min-height:\s*42rem/);
  assert.match(css, /\.project-entry__spread::before\s*\{[\s\S]*?journal-gutter/);
  assert.match(css, /\.project-entry__spread::after\s*\{[\s\S]*?journal-page-depth/);
  assert.match(css, /\.project-page--story\s*\{[\s\S]*?linear-gradient/);
  assert.match(css, /\.project-page--technical\s*\{[\s\S]*?linear-gradient/);
});
```

- [ ] **Step 2: Run the test and confirm the new contract fails**

Run:

```bash
node --test tests/apple-material-refinement.test.mjs
```

Expected: the two new tests fail because the workspace, turn layer, journal tokens, and bound-page selectors do not exist; the existing tests remain green.

- [ ] **Step 3: Add the semantic workspace and turn layer**

In `index.html`, insert this opening wrapper immediately before the existing `<ol class="project-notebook__index">`:

```html
<div class="project-notebook__workspace">
```

Immediately after the ordered list’s existing closing `</ol>`, insert:

```html
    <div class="project-journal__turn-layer" aria-hidden="true"></div>
</div>
```

The final source order must remain header → workspace → ordered list entries → decorative layer. Do not put the decorative layer inside the `<ol>`.

- [ ] **Step 4: Add journal tokens and replace the flat spread styling**

Add these tokens to the existing `[data-theme="light"]` token block after `--desk-sage`:

```css
--journal-binding:       #6d5039;
--journal-gutter:        rgba(74, 48, 31, 0.22);
--journal-page-highlight:rgba(255, 255, 255, 0.72);
--journal-page-depth:    rgba(98, 66, 42, 0.16);
--journal-turn-shadow:   rgba(54, 35, 22, 0.28);
```

Replace the current `.project-notebook__index` positioning block and extend the spread/page blocks with:

```css
.project-notebook__workspace {
    position: relative;
    min-height: 42rem;
}

.project-notebook__index {
    list-style: none;
}

.project-entry__spread {
    position: absolute;
    top: 0;
    right: 0;
    width: 68%;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    isolation: isolate;
    border: 1px solid var(--paper-edge);
    border-radius: 1.1rem 1.1rem 1.35rem 1.35rem;
    background: var(--paper);
    box-shadow:
        0 1.4rem 2.8rem var(--paper-shadow),
        0 0.22rem 0 rgba(113, 77, 49, 0.14),
        0 0.48rem 0 rgba(255, 249, 237, 0.58);
    overflow: visible;
}

.project-entry__spread::before {
    content: '';
    position: absolute;
    z-index: 3;
    top: 0.4rem;
    bottom: 0.4rem;
    left: 50%;
    width: 1.15rem;
    pointer-events: none;
    transform: translateX(-50%);
    background:
        linear-gradient(90deg,
            transparent,
            var(--journal-gutter) 43%,
            var(--journal-binding) 49%,
            rgba(255, 255, 255, 0.46) 52%,
            var(--journal-gutter) 58%,
            transparent);
    opacity: 0.72;
    filter: blur(0.25px);
}

.project-entry__spread::after {
    content: '';
    position: absolute;
    z-index: -1;
    inset: 0.45rem 0.5rem -0.65rem;
    border: 1px solid var(--paper-edge);
    border-radius: 0 0 1.35rem 1.35rem;
    background: var(--paper-edge);
    box-shadow: 0 0.62rem 1rem var(--journal-page-depth);
}

.project-page {
    position: relative;
    min-width: 0;
    padding: clamp(1.5rem, 3vw, 2.45rem);
    background: var(--paper);
}

.project-page--story {
    border-radius: 1.05rem 0 0 1.25rem;
    background:
        linear-gradient(90deg,
            var(--journal-page-highlight) 0,
            transparent 70%,
            var(--journal-page-depth) 100%),
        var(--paper);
}

.project-page--technical {
    border-radius: 0 1.05rem 1.25rem 0;
    background:
        linear-gradient(90deg,
            var(--journal-page-depth) 0,
            transparent 30%,
            var(--journal-page-highlight) 100%),
        var(--paper);
}

.project-page + .project-page { border-left: 0; }
```

In the existing `@media (max-width: 56.24rem)` block, replace the old index reset with:

```css
.project-notebook__workspace { min-height: 0; }
.project-entry { margin-bottom: 1.25rem; }
.project-entry__cover { width: 100%; }
.project-entry__spread {
    position: static;
    width: 100%;
    margin-top: 1rem;
}
.project-journal__turn-layer { display: none; }
```

- [ ] **Step 5: Run tests and commit the stationary journal**

Run:

```bash
node --test tests/apple-material-refinement.test.mjs
```

Expected: all tests pass.

Commit:

```bash
git add index.html css/style.css tests/apple-material-refinement.test.mjs
git commit -m "style: turn project spread into bound journal"
```

---

### Task 2: Define the Flip Decision Contract

**Files:**
- Create: `js/journal-flip.js`
- Create: `tests/journal-flip.test.mjs`

**Interfaces:**
- Consumes: zero-based source/destination entry indices and an environment capability object.
- Produces: `window.PortfolioJournal.getFlipDirection(fromIndex, toIndex)`, `shouldAnimateJournal(environment)`, and `getLeafFaces(direction)`. In Node, the same API is exported through `module.exports`.

- [ ] **Step 1: Write failing unit tests for direction, capability gating, and face roles**

Create `tests/journal-flip.test.mjs`:

```js
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
  getFlipDirection,
  getLeafFaces,
  shouldAnimateJournal,
} = require('../js/journal-flip.js');

test('maps later and earlier notes to symmetric turn directions', () => {
  assert.equal(getFlipDirection(0, 2), 'forward');
  assert.equal(getFlipDirection(2, 0), 'backward');
  assert.equal(getFlipDirection(1, 1), 'none');
});

test('animates only in a visible capable desktop light notebook', () => {
  const ready = {
    isDesktop: true,
    reducedMotion: false,
    supportsWAAPI: true,
    isLightTheme: true,
  };

  assert.equal(shouldAnimateJournal(ready), true);
  assert.equal(shouldAnimateJournal({ ...ready, isDesktop: false }), false);
  assert.equal(shouldAnimateJournal({ ...ready, reducedMotion: true }), false);
  assert.equal(shouldAnimateJournal({ ...ready, supportsWAAPI: false }), false);
  assert.equal(shouldAnimateJournal({ ...ready, isLightTheme: false }), false);
});

test('maps the moving leaf faces to the pages they physically reveal', () => {
  assert.deepEqual(getLeafFaces('forward'), {
    frontRole: 'technical',
    backRole: 'story',
  });
  assert.deepEqual(getLeafFaces('backward'), {
    frontRole: 'story',
    backRole: 'technical',
  });
});
```

- [ ] **Step 2: Run the unit test and verify module resolution fails**

Run:

```bash
node --test tests/journal-flip.test.mjs
```

Expected: FAIL with `Cannot find module '../js/journal-flip.js'`.

- [ ] **Step 3: Implement the complete pure decision module**

Create `js/journal-flip.js` with:

```js
(function journalFlipModule(global) {
    'use strict';

    const DESKTOP_QUERY = '(min-width: 56.25rem)';
    const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
    const TURN_DURATION = 580;

    function getFlipDirection(fromIndex, toIndex) {
        if (toIndex === fromIndex) return 'none';
        return toIndex > fromIndex ? 'forward' : 'backward';
    }

    function shouldAnimateJournal({
        isDesktop,
        reducedMotion,
        supportsWAAPI,
        isLightTheme,
    }) {
        return isDesktop && !reducedMotion && supportsWAAPI && isLightTheme;
    }

    function getLeafFaces(direction) {
        return direction === 'backward'
            ? { frontRole: 'story', backRole: 'technical' }
            : { frontRole: 'technical', backRole: 'story' };
    }

    const api = {
        DESKTOP_QUERY,
        REDUCED_MOTION_QUERY,
        TURN_DURATION,
        getFlipDirection,
        getLeafFaces,
        shouldAnimateJournal,
    };

    global.PortfolioJournal = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis));
```

- [ ] **Step 4: Run unit and existing regression tests**

Run:

```bash
node --test tests/journal-flip.test.mjs tests/apple-material-refinement.test.mjs
```

Expected: all tests pass.

- [ ] **Step 5: Commit the decision contract**

```bash
git add js/journal-flip.js tests/journal-flip.test.mjs
git commit -m "test: define journal flip behavior contract"
```

---

### Task 3: Implement the Interruptible Leaf-Turn Controller

**Files:**
- Modify: `tests/apple-material-refinement.test.mjs:5-7,80-94`
- Modify: `tests/journal-flip.test.mjs`
- Modify: `js/journal-flip.js`
- Modify: `js/main.js:39-57`
- Modify: `index.html:798-802`
- Modify: `css/style.css:1282-1359`

**Interfaces:**
- Consumes: Task 1’s `.project-journal__turn-layer`, project entries, project-page roles, and Task 2’s direction/gating helpers.
- Produces: `PortfolioJournal.createJournalFlipController(root, options)` returning `{ getActiveEntry, commitEntry, cancelForEnvironmentChange, destroy }`.

- [ ] **Step 1: Extend tests for module loading, integration, and transient-leaf safety**

At the top of `tests/apple-material-refinement.test.mjs`, add:

```js
const journalJs = readFileSync(new URL('../js/journal-flip.js', import.meta.url), 'utf8');
```

Replace the complete existing deep-link test with:

```js
test('deep-links notebook entries without competing with generic hash scrolling', () => {
  assert.match(journalJs, /entry\.addEventListener\('toggle', toggleHandler\)/);
  assert.match(journalJs, /locationRef\.hash\?\.startsWith\('#note-'\)/);
  assert.match(journalJs, /commitEntry\(linkedEntry, \{ updateHash: false \}\)/);
  assert.match(js, /const hash = this\.getAttribute\('href'\);\s*if \(hash\.startsWith\('#note-'\)\) return;/);
});
```

Then append:

```js
test('loads the journal controller before the main initializer', () => {
  assert.match(html, /<script src="js\/journal-flip\.js"><\/script>\s*<script src="js\/main\.js"><\/script>/);
  assert.match(js, /PortfolioJournal\.createJournalFlipController/);
  assert.match(journalJs, /function createJournalFlipController\(root, options = \{\}\)/);
});

test('creates only an inert temporary leaf and cleans every exit path', () => {
  assert.match(journalJs, /leaf\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(journalJs, /leaf\.animate\(/);
  assert.match(journalJs, /clearActiveFlip/);
  assert.match(journalJs, /leaf\.remove\(\)/);
  assert.doesNotMatch(journalJs, /cloneNode\(true\)/);
  assert.doesNotMatch(journalJs, /innerHTML\s*=/);
});
```

Add this test to `tests/journal-flip.test.mjs` after the existing tests:

```js
test('exports the controller factory without requiring a browser DOM', () => {
  const { createJournalFlipController } = require('../js/journal-flip.js');
  assert.equal(typeof createJournalFlipController, 'function');
});
```

- [ ] **Step 2: Run tests and confirm the controller assertions fail**

Run:

```bash
node --test tests/journal-flip.test.mjs tests/apple-material-refinement.test.mjs
```

Expected: failures report the missing controller factory, missing script tag, and missing initializer.

- [ ] **Step 3: Add leaf construction and the full controller before `const api` in `js/journal-flip.js`**

Insert this code after `getLeafFaces`:

```js
    function pageLabel(entry, role) {
        return entry.querySelector(`.project-page--${role} summary strong`)?.textContent.trim()
            || (role === 'story' ? 'The story' : 'Under the hood');
    }

    function makeFace(documentRef, className, label) {
        const face = documentRef.createElement('div');
        face.className = className;

        const heading = documentRef.createElement('span');
        heading.className = 'project-journal__leaf-heading';
        heading.textContent = label;
        face.append(heading);

        const rule = documentRef.createElement('span');
        rule.className = 'project-journal__leaf-rule';
        face.append(rule);

        for (let index = 0; index < 6; index += 1) {
            const line = documentRef.createElement('span');
            line.className = 'project-journal__leaf-line';
            if (index === 2 || index === 5) line.classList.add('project-journal__leaf-line--short');
            face.append(line);
        }

        return face;
    }

    function buildLeaf(documentRef, fromEntry, toEntry, direction) {
        const { frontRole, backRole } = getLeafFaces(direction);
        const leaf = documentRef.createElement('div');
        leaf.className = 'project-journal__leaf';
        leaf.setAttribute('aria-hidden', 'true');
        leaf.append(
            makeFace(documentRef, 'project-journal__leaf-face project-journal__leaf-face--front', pageLabel(fromEntry, frontRole)),
            makeFace(documentRef, 'project-journal__leaf-face project-journal__leaf-face--back', pageLabel(toEntry, backRole)),
        );
        return leaf;
    }

    function createJournalFlipController(root, options = {}) {
        const documentRef = root.ownerDocument;
        const entries = Array.from(root.querySelectorAll('.project-entry'));
        const layer = root.querySelector('.project-journal__turn-layer');
        const desktopMedia = options.desktopMedia || global.matchMedia(DESKTOP_QUERY);
        const motionMedia = options.motionMedia || global.matchMedia(REDUCED_MOTION_QUERY);
        const historyRef = options.history || global.history;
        const locationRef = options.location || global.location;
        const getTheme = options.getTheme || (() => documentRef.documentElement.dataset.theme);
        const requestFrame = options.requestFrame || global.requestAnimationFrame.bind(global);
        const cancelFrame = options.cancelFrame || global.cancelAnimationFrame.bind(global);
        const duration = options.duration || TURN_DURATION;
        const listeners = [];
        let activeFlip = null;
        let pendingFrame = 0;
        let requestedEntry = null;
        let destroyed = false;

        function getActiveEntry() {
            return entries.find(entry => entry.open) || entries[0] || null;
        }

        function replaceHash(entry) {
            if (!entry?.id || !historyRef?.replaceState) return;
            historyRef.replaceState(null, '', `#${entry.id}`);
        }

        function commitEntry(entry, { updateHash = true } = {}) {
            if (!entry || !entries.includes(entry)) return;
            entries.forEach(candidate => {
                if (candidate !== entry) candidate.open = false;
            });
            entry.open = true;
            if (updateHash) replaceHash(entry);
        }

        function supportsWAAPI() {
            return typeof documentRef.createElement('div').animate === 'function';
        }

        function canAnimateNow() {
            return Boolean(layer) && shouldAnimateJournal({
                isDesktop: desktopMedia.matches,
                reducedMotion: motionMedia.matches,
                supportsWAAPI: supportsWAAPI(),
                isLightTheme: getTheme() === 'light',
            });
        }

        function removeFlipVisual(flip) {
            if (!flip) return;
            global.clearTimeout(flip.midpointTimer);
            flip.animation.cancel();
            flip.leaf.remove();
            layer.removeAttribute('data-direction');
            layer.style.removeProperty('height');
            root.classList.remove('is-turning');
        }

        function clearActiveFlip({ commitTarget = false } = {}) {
            if (!activeFlip) return;
            const flip = activeFlip;
            activeFlip = null;
            removeFlipVisual(flip);
            if (commitTarget) commitEntry(flip.target);
        }

        function turnKeyframes(direction) {
            const midpoint = direction === 'forward' ? 'rotateY(-92deg)' : 'rotateY(92deg)';
            const finish = direction === 'forward' ? 'rotateY(-180deg)' : 'rotateY(180deg)';
            return [
                { transform: 'rotateY(0deg)', opacity: 1 },
                { transform: midpoint, opacity: 0.88, offset: 0.5 },
                { transform: finish, opacity: 1 },
            ];
        }

        function startTurn(target) {
            pendingFrame = 0;
            if (destroyed || !target) return;

            const fromEntry = getActiveEntry();
            const fromIndex = entries.indexOf(fromEntry);
            const toIndex = entries.indexOf(target);
            const direction = getFlipDirection(fromIndex, toIndex);

            if (direction === 'none') return;
            if (!canAnimateNow()) {
                commitEntry(target);
                return;
            }

            const spread = fromEntry.querySelector('.project-entry__spread');
            const leaf = buildLeaf(documentRef, fromEntry, target, direction);
            layer.dataset.direction = direction;
            layer.style.height = `${spread.getBoundingClientRect().height}px`;
            layer.append(leaf);
            root.classList.add('is-turning');

            const animation = leaf.animate(turnKeyframes(direction), {
                duration,
                easing: 'cubic-bezier(0.22, 0.76, 0.2, 1)',
                fill: 'forwards',
            });
            const flip = { animation, leaf, target, committed: false, midpointTimer: 0 };
            activeFlip = flip;

            flip.midpointTimer = global.setTimeout(() => {
                if (activeFlip !== flip) return;
                commitEntry(target);
                flip.committed = true;
            }, duration / 2);

            animation.finished.then(() => {
                if (activeFlip !== flip) return;
                if (!flip.committed) commitEntry(target);
                activeFlip = null;
                requestedEntry = null;
                removeFlipVisual(flip);
            }).catch(() => {});
        }

        function requestSelection(target) {
            requestedEntry = target;
            if (activeFlip) clearActiveFlip();
            if (pendingFrame) cancelFrame(pendingFrame);
            pendingFrame = requestFrame(() => startTurn(requestedEntry));
        }

        function onCoverClick(entry, event) {
            if (!canAnimateNow()) return;
            event.preventDefault();
            if (entry === getActiveEntry()) return;
            requestSelection(entry);
        }

        entries.forEach(entry => {
            const cover = entry.querySelector(':scope > .project-entry__cover');
            const clickHandler = event => onCoverClick(entry, event);
            const toggleHandler = () => {
                if (entry.open && !activeFlip) replaceHash(entry);
            };
            cover.addEventListener('click', clickHandler);
            entry.addEventListener('toggle', toggleHandler);
            listeners.push([cover, 'click', clickHandler], [entry, 'toggle', toggleHandler]);
        });

        if (locationRef.hash?.startsWith('#note-')) {
            const linkedEntry = entries.find(entry => `#${entry.id}` === locationRef.hash);
            if (linkedEntry) commitEntry(linkedEntry, { updateHash: false });
        }

        function cancelForEnvironmentChange() {
            if (pendingFrame) {
                cancelFrame(pendingFrame);
                pendingFrame = 0;
            }
            if (activeFlip) clearActiveFlip({ commitTarget: true });
            else if (requestedEntry) commitEntry(requestedEntry);
            requestedEntry = null;
        }

        function onEnvironmentChange() {
            if (!canAnimateNow()) cancelForEnvironmentChange();
        }

        desktopMedia.addEventListener('change', onEnvironmentChange);
        motionMedia.addEventListener('change', onEnvironmentChange);

        function destroy() {
            destroyed = true;
            cancelForEnvironmentChange();
            listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
            desktopMedia.removeEventListener('change', onEnvironmentChange);
            motionMedia.removeEventListener('change', onEnvironmentChange);
        }

        return { getActiveEntry, commitEntry, cancelForEnvironmentChange, destroy };
    }
```

Add `createJournalFlipController` to `api`:

```js
const api = {
    DESKTOP_QUERY,
    REDUCED_MOTION_QUERY,
    TURN_DURATION,
    createJournalFlipController,
    getFlipDirection,
    getLeafFaces,
    shouldAnimateJournal,
};
```

- [ ] **Step 4: Load and initialize the controller**

In `index.html`, add the controller immediately before the existing main script:

```html
<script src="js/journal-flip.js"></script>
<script src="js/main.js"></script>
```

Replace `enhanceProjectNotebook` and its initialization in `js/main.js` with:

```js
function enhanceProjectNotebook(root) {
    return window.PortfolioJournal.createJournalFlipController(root, {
        motionMedia: reducedMotion,
        getTheme: () => html.getAttribute('data-theme'),
        history: window.history,
        location: window.location,
    });
}

const projectNotebook = document.querySelector('.project-notebook');
const projectJournalController = projectNotebook
    ? enhanceProjectNotebook(projectNotebook)
    : null;
```

- [ ] **Step 5: Style the two-faced leaf and its inert impressions**

Add after the stable spread styles in `css/style.css`:

```css
.project-journal__turn-layer {
    position: absolute;
    z-index: 8;
    top: 0;
    right: 0;
    width: 68%;
    pointer-events: none;
    perspective: 110rem;
    transform-style: preserve-3d;
}

.project-journal__leaf {
    position: absolute;
    top: 0;
    width: 50%;
    height: 100%;
    transform-style: preserve-3d;
    will-change: transform, opacity;
}

.project-journal__turn-layer[data-direction="forward"] .project-journal__leaf {
    left: 50%;
    transform-origin: left center;
}

.project-journal__turn-layer[data-direction="backward"] .project-journal__leaf {
    left: 0;
    transform-origin: right center;
}

.project-journal__leaf-face {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    padding: clamp(1.5rem, 3vw, 2.45rem);
    overflow: hidden;
    border: 1px solid var(--paper-edge);
    background: var(--paper);
    box-shadow: 0.85rem 0.7rem 1.5rem var(--journal-turn-shadow);
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.project-journal__leaf-face--front {
    border-radius: 0 1.05rem 1.25rem 0;
    background:
        linear-gradient(90deg, var(--journal-page-depth), transparent 28%),
        var(--paper);
}

.project-journal__leaf-face--back {
    border-radius: 1.05rem 0 0 1.25rem;
    background:
        linear-gradient(90deg, var(--journal-page-highlight), transparent 72%, var(--journal-page-depth)),
        var(--paper);
    transform: rotateY(180deg);
}

.project-journal__leaf-heading {
    color: var(--clr-text);
    font-family: var(--font-serif);
    font-size: clamp(1.65rem, 3vw, 2.5rem);
    line-height: 1;
    letter-spacing: -0.02em;
}

.project-journal__leaf-rule {
    width: 2.5rem;
    height: 1px;
    margin: 1rem 0 1.35rem;
    background: var(--desk-sage);
}

.project-journal__leaf-line {
    width: 100%;
    height: 0.42rem;
    margin-bottom: 0.75rem;
    border-radius: 999px;
    background: var(--paper-line);
}

.project-journal__leaf-line--short { width: 68%; }
```

- [ ] **Step 6: Run tests and commit the working desktop turn**

Run:

```bash
node --test tests/journal-flip.test.mjs tests/apple-material-refinement.test.mjs
```

Expected: all tests pass.

Commit:

```bash
git add index.html css/style.css js/journal-flip.js js/main.js tests/apple-material-refinement.test.mjs tests/journal-flip.test.mjs
git commit -m "feat: flip journal leaf between projects"
```

---

### Task 4: Complete Preference, Theme, and Responsive Fallbacks

**Files:**
- Modify: `tests/apple-material-refinement.test.mjs`
- Modify: `js/main.js:59-66`
- Modify: `css/style.css:1627-1690`

**Interfaces:**
- Consumes: Task 3’s `projectJournalController.cancelForEnvironmentChange()` and journal classes.
- Produces: clean cancellation before theme hiding plus explicit reduced-motion, reduced-transparency, increased-contrast, and narrow-screen treatments.

- [ ] **Step 1: Write failing fallback assertions**

Append to `tests/apple-material-refinement.test.mjs`:

```js
test('cancels journal motion before hiding light content', () => {
  assert.match(js, /if \(next === 'dark'\) projectJournalController\?\.cancelForEnvironmentChange\(\)/);
  assert.match(js, /cancelForEnvironmentChange\(\);[\s\S]*?html\.setAttribute\('data-theme', next\)/);
});

test('defines explicit journal accessibility preference fallbacks', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.project-journal__turn-layer\s*\{\s*display:\s*none/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*?\.project-journal__leaf-face/);
  assert.match(css, /@media \(prefers-contrast: more\)[\s\S]*?\.project-journal__leaf-face/);
  assert.match(css, /@media \(max-width: 56\.24rem\)[\s\S]*?\.project-journal__turn-layer\s*\{\s*display:\s*none/);
});
```

- [ ] **Step 2: Run the regression test and confirm fallback assertions fail**

Run:

```bash
node --test tests/apple-material-refinement.test.mjs
```

Expected: the two new tests fail while earlier tests pass.

- [ ] **Step 3: Cancel an active turn before switching to dark mode**

At the start of the theme-toggle listener, after `next` is calculated and before the `data-theme` attribute changes, add:

```js
if (next === 'dark') projectJournalController?.cancelForEnvironmentChange();
```

The complete beginning of the listener must read:

```js
themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    if (next === 'dark') projectJournalController?.cancelForEnvironmentChange();
    html.setAttribute('data-theme', next);
```

- [ ] **Step 4: Extend accessibility preference rules**

Add these selectors inside the existing preference queries:

```css
@media (prefers-reduced-motion: reduce) {
    .project-journal__turn-layer { display: none; }
}

@media (prefers-reduced-transparency: reduce) {
    .project-journal__leaf-face {
        opacity: 1 !important;
        background: var(--paper);
    }

    .project-entry__spread::before { filter: none; }
}

@media (prefers-contrast: more) {
    .project-journal__leaf-face {
        border-color: var(--clr-text);
        box-shadow: 0 0 0 1px var(--clr-text);
    }

    .project-entry__spread::before { opacity: 1; }
}
```

Keep the Task 1 narrow-screen rule `.project-journal__turn-layer { display: none; }` inside `@media (max-width: 56.24rem)`.

- [ ] **Step 5: Run all tests and commit the fallback contract**

Run:

```bash
node --test tests/journal-flip.test.mjs tests/apple-material-refinement.test.mjs
```

Expected: all tests pass.

Commit:

```bash
git add css/style.css js/main.js tests/apple-material-refinement.test.mjs
git commit -m "fix: honor journal motion and contrast preferences"
```

---

### Task 5: Lock Content Integrity and Complete Browser QA

**Files:**
- Modify: `tests/apple-material-refinement.test.mjs`

**Interfaces:**
- Consumes: the completed journal shell, controller, fallbacks, and existing project content.
- Produces: a regression guard against generated-reference fact leaks and a verified responsive/interaction matrix.

- [ ] **Step 1: Add the generated-fact leak regression test**

Append:

```js
test('does not leak fictional visual-reference facts into shipped source', () => {
  const shippedSource = `${html}\n${css}\n${js}\n${journalJs}`;
  const fictionalTerms = [
    'GreenTrack',
    'CafeConnect',
    'ECS Fargate',
    'MongoDB Atlas',
    'CloudWatch',
    'Terraform',
    'your-username',
  ];

  fictionalTerms.forEach(term => {
    assert.equal(shippedSource.includes(term), false, `${term} must remain visual-reference-only`);
  });
});
```

- [ ] **Step 2: Run the complete static and unit suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: every test passes with zero failures.

- [ ] **Step 3: Serve the site for browser verification**

Run in a persistent terminal:

```bash
python3 -m http.server 4173
```

Expected: `Serving HTTP on 0.0.0.0 port 4173` and the portfolio is available at `http://localhost:4173/`.

- [ ] **Step 4: Verify desktop motion and interruption at 1440px**

In light mode at a 1440px-wide viewport, perform this exact sequence:

1. Select Field Note 02, then Field Note 03. Both turns travel right-to-left.
2. Select Field Note 02, then Field Note 01. Both turns mirror left-to-right.
3. Rapidly activate 01 → 03 → 02 before any one turn finishes. Field Note 02 must win, one entry must be open, and no `.project-journal__leaf` may remain after settling.
4. Repeat 01 → 02 → 03 with Enter and Space. Focus must remain on the activated summary.
5. During a turn, switch to dark mode. The leaf must disappear before the notebook is hidden; dark project filters must still work.
6. Return to light mode. The most recently committed field note must remain selected without an arrival flip.

Expected: the journal base never translates, scales, or rotates; only one leaf moves, repository links remain clickable after settling, and no console errors appear.

- [ ] **Step 5: Verify responsive, deep-link, and preference fallbacks**

Check all of the following:

- At 768px and 375px, project and page disclosures use normal document flow, no `.project-journal__leaf` is created, and there is no horizontal page overflow.
- Load `http://localhost:4173/#note-private-work` and `http://localhost:4173/#note-discord-bot`; each requested note opens without an arrival flip.
- Start a turn at 1440px and resize below 900px; the destination commits and the transient leaf is removed.
- Emulate `prefers-reduced-motion: reduce`; selection remains immediate and no leaf is created.
- Emulate `prefers-reduced-transparency: reduce`; paper faces are solid and legible.
- Emulate `prefers-contrast: more`; selected cover, gutter, page edge, focus ring, and turning leaf boundaries remain distinct.
- Zoom to 400%; the stacked notebook remains readable without horizontal document scrolling.

Expected: every fallback matches the design specification and the dark experience is unchanged.

- [ ] **Step 6: Commit the final regression guard**

```bash
git add tests/apple-material-refinement.test.mjs
git commit -m "test: guard journal content and interaction regressions"
```

- [ ] **Step 7: Confirm the working tree and recent commits**

Run:

```bash
git status --short
git log -5 --oneline
```

Expected: `git status --short` prints nothing. The log shows the five task commits from this plan above the design and plan documentation commits.

## Luna Execution Notes

- Execute tasks in order; do not batch Tasks 1–4 into one edit.
- Use `apply_patch` for hand edits and preserve unrelated user changes.
- Run the stated failing test before implementation and the stated passing test afterward for every task.
- If browser behavior exposes a mismatch, fix the smallest relevant task boundary and rerun the complete suite before continuing.
- Do not replace native `<details>`/`<summary>` with custom buttons, tabs, or duplicated accessible content.
- Do not tune the `580ms` turn by adding bounce. The intended feeling is calm physical paper, not a card trick.
