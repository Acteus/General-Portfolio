# Overhead Desk Project Notebook Design

## Goal

Turn the light-mode Projects section into a warm overhead café desk where visitors can select a field note and discover both the human story and the technical work behind it. Dark mode remains the existing recruiter-facing project portfolio.

The memorable moment is an active paper note settling into an open two-page notebook: “The story” on the left and “Under the hood” on the right.

## Approved Direction

The approved visual direction is **A — Overhead Working Desk**.

- Warm ivory paper sits on a pale natural-wood surface.
- Morning light and faint leaf shadows create the breezy café feeling.
- A coffee cup, pencil, clipped paper corner, and small sage-green notebook or plant details stay around the outer edges.
- Project notes feel like papers currently being worked through, not decorative cards placed on a dashboard.
- The selected note straightens, lifts slightly, and opens into a notebook spread.
- Both project perspectives are initially visible. The experience does not hide one side behind tabs.

The generated reference at `docs/design-references/overhead-desk-project-notebook.png` is a **visual-only** guide for composition, material, spacing, and atmosphere. Its generated project names, dates, architecture, and technology copy are not source material. Implementation copy must come from the verified facts already present in `index.html` and the approved dual-mode content specification.

## Scope

### In scope

- Replace the light-mode Field Notes cards with an interactive project notebook.
- Present three approved field notes as selectable paper covers.
- Show “The story” and “Under the hood” together for the selected note on desktop.
- Adapt the same semantic content into nested accordions on mobile.
- Add a CSS-built overhead desk atmosphere to the light Projects section.
- Add restrained selection motion and immediate press feedback.
- Preserve keyboard, screen-reader, reduced-motion, reduced-transparency, and increased-contrast support.
- Keep project claims, dates, statuses, links, and technologies aligned with the existing portfolio evidence.

### Out of scope

- Changing dark-mode project content, filtering, or visual direction.
- Adding a framework, build step, animation library, or runtime dependency for this feature unless the static implementation fails a documented requirement. The user has authorized a framework migration if a real limitation is found, but it is not the default approach.
- Dragging papers, freeform object movement, parallax tied to scroll, or sound.
- Treating the generated visual reference as factual content or shipping it as the section background.
- Inventing screenshots, architecture claims, results, metrics, or repository access.

The finished static site may be deployed to Vercel. Deployment configuration is a separate step and does not require converting the portfolio to a framework.

## Content Model

The notebook contains the three already-approved light-mode field notes.

### Field Note 01 — JobBoard-DevOps

**Cover:** Moving a system, not just its files

**The story:** Explain how the AWS-to-Azure study became a lesson in separating application, delivery, and infrastructure concerns.

**Under the hood:** Use the existing verified facts: Cloud / DevOps Developer, 2025, Azure Static Web Apps, Azure Container Apps, MySQL, Docker, GitHub Actions, ARM templates, frontend/backend separation, automated container delivery, and the public GitHub repository.

### Field Note 02 — JRU Atlas and LaborWise

**Cover:** Showing private work responsibly

**The story:** Explain that useful case studies can communicate architecture, operational decisions, and lessons without exposing private code or data.

**Under the hood:** Present two concise sub-sections using existing facts. JRU Atlas is a private DigitalOcean thesis project with Laravel, two workers, and a private FastAPI NLP service. LaborWise is a private Azure service using Container Apps, ACR, managed identity, and Log Analytics. Do not add links to private repositories.

### Field Note 03 — GitHub to Discord Bot

**Cover:** Keeping a small service alive

**The story:** Explain how operating a small live service made HTTPS, service supervision, recovery, and deployment part of the project itself.

**Under the hood:** Use the existing verified facts: Cloud / Backend Developer, 2026–Present, Oracle Cloud, Podman, Quadlet, Caddy, a secure HTTPS gateway, and the public GitHub repository.

## Experience Structure

### Desktop: open notebook spread

At widths of `56.25rem` and above, the section uses an asymmetric two-column composition:

- The left column occupies roughly 27–30% and contains the ordered note covers.
- The right column occupies the remaining space and contains the selected project’s open spread.
- The selected cover is visually straight, elevated, and marked with a visible current-state cue.
- Unselected covers use restrained rotations of no more than 1.5 degrees.
- The spread shows both pages at once. “The story” is the left page and “Under the hood” is the right page.
- A subtle center seam, paper edge, and contact shadow establish material without reducing legibility.

### Tablet: stacked work surface

Between `40rem` and `56.24rem`, covers become a horizontally scrollable or wrapping note index above the open spread. The spread may remain two columns when space allows, but it must collapse before body text becomes narrow or the architecture content becomes cramped.

### Mobile: accessible accordion

Below `40rem`, each project is an outer native disclosure. Opening a project reveals two nested disclosures, “The story” and “Under the hood.” The first project and both of its pages are open in authored HTML so useful content appears immediately.

Only one outer project needs to remain open at a time when the browser supports named `<details>` groups. Browsers without that support may leave multiple projects open; this is an acceptable fallback.

## Semantic HTML Architecture

The light notebook is authored as real content rather than generated entirely by JavaScript.

```html
<section class="project-notebook" aria-labelledby="project-notebook-title">
  <header class="project-notebook__intro">
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
            <div class="project-page__content">...</div>
          </details>

          <details class="project-page project-page--technical" open>
            <summary><strong>Under the hood</strong></summary>
            <div class="project-page__content">...</div>
          </details>
        </div>
      </details>
    </li>
  </ol>
</section>
```

Native `<details>` and `<summary>` elements own the expanded state, Enter/Space activation, keyboard focus, and announced state. Do not add `role="button"` or manually duplicate `aria-expanded` on summaries.

The notebook remains inside `data-content-theme="light"`. Existing dark-mode cards and filters remain inside dark-mode content. Any compact archive retained below the notebook must avoid repeating the three full stories.

## Progressive Enhancement

JavaScript is optional and small:

```js
function enhanceProjectNotebook(root) {
    const entries = root.querySelectorAll('.project-entry');

    entries.forEach(entry => {
        entry.addEventListener('toggle', () => {
            if (!entry.open) return;
            history.replaceState(null, '', `#${entry.id}`);
        });
    });

    const linkedEntry = root.querySelector(location.hash);
    if (linkedEntry instanceof HTMLDetailsElement) linkedEntry.open = true;
}
```

The enhancement may synchronize deep links, add a current-note styling hook, and normalize single-open behavior if needed. It must not own the core visibility or accessibility state. Generic smooth-scrolling logic must ignore notebook hashes that are handled by the notebook.

Theme changes must preserve the open project and open page state because the markup stays mounted and only its theme container becomes hidden.

## Visual System

### Palette

Continue using the approved café tokens and add notebook-specific semantic tokens under light mode:

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

Sage green remains the only interaction accent. Tan and wood colors are environmental, not competing action colors.

### Typography

- Use `Instrument Serif` for note-cover titles and the two page headings.
- Use the existing sans stack for body copy and metadata.
- Use `DM Mono` for field-note numbers, small labels, architecture captions, and technology tags.
- Load `Instrument Serif` explicitly rather than relying on the current fallback.
- Large headings use tight leading and slightly negative tracking; small labels use modest positive tracking.

### Desk atmosphere

Build the shipped atmosphere with layered CSS gradients, pseudo-elements, borders, and shadows. This keeps the section responsive, lightweight, and easy to soften under accessibility preferences.

Decorative objects must stay at the section edges and use `pointer-events: none`. They must never overlap the notebook, headings, links, or focus rings. At narrow widths, remove objects in this order: clipped paper corner, plant/leaf shadow, pencil, coffee cup. The notebook content always wins.

## Motion and Feedback

Motion must guide attention, communicate selection, or preserve spatial continuity.

- A note responds immediately on press with a scale no smaller than `0.98`.
- Opening a note moves it from its slight paper rotation to `rotate(0)` and translates it upward by no more than `4px`.
- Use `transform` and `opacity` only. Do not animate width, height, position, margin, or padding.
- Default selection timing is 180–260ms with a calm ease such as `cubic-bezier(0.22, 1, 0.36, 1)`.
- Do not use bounce for ordinary note selection.
- Do not disable pointer or keyboard input while transitions run.
- The path is symmetric: a note returns along the same lift/rotation path when it closes.

Under `prefers-reduced-motion: reduce`, remove rotations, lifts, sliding, and decorative shadow movement. Preserve state feedback through immediate border/color changes or an opacity-only transition no longer than 150ms.

Under `prefers-reduced-transparency: reduce`, use solid paper and desk surfaces without blur. Under `prefers-contrast: more`, increase paper boundaries, selected outlines, summary markers, and text contrast.

## Accessibility

- Use native `<details>` and `<summary>` before custom ARIA widgets.
- Keep every summary target at least 44px tall, exceeding the WCAG 2.2 24×24 CSS pixel minimum.
- Provide a visible focus indicator that is not clipped by paper overflow or shadows.
- Do not indicate selection through sage color alone. Combine it with position, outline, and a textual or shape marker.
- Preserve logical source order: project, story, technical details, links.
- Keep the architecture explanation meaningful as text; any diagram is supplementary and `aria-hidden` if it repeats the same information.
- Decorative coffee and desk objects are CSS-only or explicitly hidden from assistive technology.
- Content must reflow without horizontal page scrolling at 400% zoom.
- Public repository links retain descriptive accessible names and `rel="noopener noreferrer"`.

## Failure and Fallback Behavior

- Without JavaScript, the native notebook disclosures remain readable and operable.
- If named details groups are unsupported, multiple projects may remain open.
- If CSS fails, the ordered list and disclosure content retain a logical reading order.
- If the theme value is invalid, the existing dark-mode fallback remains active.
- If the visual desk objects cannot fit, they disappear rather than overlap content.
- If a deep-linked note is requested, JavaScript may open it, but the hash still lands near the correct authored content without enhancement.

## Verification

### Static tests

- Confirm the notebook exists only in light-mode content.
- Confirm all three approved note titles and both page labels exist.
- Confirm native `<details>` and `<summary>` are used and the first project is open.
- Confirm dark project filters and cards remain present.
- Confirm the generated reference is never used as a CSS background or content image.
- Confirm light notebook tokens and all three accessibility preference queries remain present.
- Confirm JavaScript enhancement is optional and does not manually assign summary button roles.

### Browser checks

- Test dark and light modes at 375px, 768px, and 1440px.
- Toggle every project and both pages with pointer, Enter, and Space.
- Verify focus order and visible focus indicators.
- Verify theme switching preserves notebook state, project-filter state, form values, and scroll position.
- Verify direct notebook hashes open or land on the correct note.
- Verify no horizontal overflow at mobile widths or 400% zoom.
- Verify reduced motion removes paper transforms while preserving state cues.
- Verify generated visual-reference facts do not appear in the implemented page.

## Design Skills Applied

- `frontend-design`: clear editorial direction, asymmetry, material atmosphere, and avoidance of generic card grids.
- `apple-design`: instant feedback, spatial continuity, restrained transform motion, interruption safety, and accessibility preferences.
- `design-an-interface`: comparison of minimal JavaScript, flexible registry, and native HTML-first architectures; the native architecture was selected.
- `accessibility`: semantic controls, target sizing, focus visibility, keyboard behavior, contrast, and reflow.
- `imagegen-frontend-web`: one horizontal reference image for the one affected section.
- `browser-qa`: planned desktop, mobile, interaction, and accessibility verification after implementation.
