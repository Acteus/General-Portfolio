# Project Archive Notebook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task.

**Goal:** Add Project Archive as the portfolio flagship and refine the light-mode notebook into a performant, depth-aware desk experience.

**Architecture:** Preserve the static HTML/CSS/JS site. Add one decorative local image layer, revise the existing first notebook entry, and tune the established journal controller rather than adding a framework or an animation dependency.

**Tech Stack:** HTML, CSS, browser Web Animations API, Node test runner.

## Global Constraints

- Keep the dark-mode portfolio and existing project entries intact.
- Use a local, non-interactive desk image only in light-mode Projects.
- Use native controls and reduced-motion fallbacks.
- Animate compositor-friendly transforms only.

---

### Task 1: Flagship notebook content and desk layer

**Files:**
- Modify: `index.html`
- Create: `assets/project-archive-desk.webp`

- [ ] Replace Field Note 01 with Project Archive content, architecture, project facts, technologies, and a live link.
- [ ] Add the decorative desk image inside the notebook workspace with empty alternative text.

### Task 2: Depth-aware visual system

**Files:**
- Modify: `css/style.css`

- [ ] Position the desk image below the notebook, preserve readable paper contrast, and hide the image at narrow widths.
- [ ] Strengthen paper-edge depth and active-card feedback without animating filters or backgrounds.

### Task 3: Short interruptible page turn

**Files:**
- Modify: `tests/journal-flip.test.mjs`
- Modify: `js/journal-flip.js`

- [ ] Write a failing test for a short transform-only page turn with depth projection.
- [ ] Update the controller’s duration and keyframes while retaining interruption, hash, keyboard, and reduced-motion behavior.
- [ ] Run `node --test tests/journal-flip.test.mjs`.

### Task 4: Verify the static site

**Files:**
- Modify: `index.html`, `css/style.css`, `js/journal-flip.js`

- [ ] Run the focused journal test suite and a static HTML asset/reference check.
- [ ] Inspect the final diff for accidental framework files or untracked build output.
