# Consistent Technical Journal Design

**Date:** 2026-08-19  
**Status:** Approved direction, pending written-spec review  
**Scope:** Light-mode project notebook only

## Objective

Make every project state feel like the same physical journal. Switching notes must not resize the desktop book. Each technical page will gain a compact, project-specific architecture overview and a restrained typewriter typography layer inspired by the supplied journal reference.

The design preserves the existing project facts, native disclosure controls, single-leaf turn animation, theme behavior, and responsive fallbacks.

## Design Principles

1. **One physical object:** every desktop project uses the same spread dimensions.
2. **Consistent page grammar:** information appears in the same vertical zones even when projects contain different amounts of detail.
3. **Technical, not decorative:** diagrams explain real project architecture using only existing portfolio facts.
4. **Three-font hierarchy:** serif for journal titles, sans serif for reading, and typewriter-style mono for technical annotations.
5. **Intentional white space:** shorter projects retain breathing room rather than stretching their copy.

## Desktop Journal Footprint

At the existing desktop enhancement breakpoint (`min-width: 56.25rem`), the open spread will use one shared `50rem` height token. The selected project, turn layer, and both pages fill that height. The left index cards retain their current independent dimensions.

The height is sized for the densest authored project after the technical-page reorganization. Pages will not use internal scrollbars. If future content exceeds the page budget, the shared height token must be increased for every project or the content must be edited; an individual project must never create a taller book.

At tablet and mobile breakpoints, the spread returns to natural height. This preserves readability and prevents a large empty fixed-height object on narrow screens.

## Page Grammar

### Story page

The left page keeps a stable three-zone composition:

1. Serif page title: “The story.”
2. Narrative paragraph in the existing sans-serif reading face.
3. Ruled takeaway block aligned to a consistent vertical position.

Shorter stories leave intentional blank paper below the takeaway. Existing copy remains unchanged unless a small line-length edit is necessary to fit the shared page budget.

### Technical page

The right page uses the same ordered regions for every note:

1. Serif page title: “Under the hood.”
2. Role and timeline line.
3. `ARCHITECTURE OVERVIEW` label and diagram region.
4. `PROJECT DETAILS` metadata region.
5. `TECHNOLOGIES` tag region.
6. A bottom-aligned source/status region.

The technical page uses a grid so the source/status region stays near the bottom without relying on project-specific margins.

Public projects show the existing repository link. Private work uses the same footer slot for a concise “Private case study · architecture sanitized” status instead of presenting a broken or unavailable link.

## Architecture Overviews

Each overview is authored as semantic HTML inside a `<figure>`. It uses simple outlined nodes, connectors, short labels, and existing Font Awesome icons where appropriate. It is not a raster image, canvas, or externally generated asset. Each figure includes an accessible text description of the flow.

The diagrams share one visual language:

- outlined rounded nodes on paper;
- thin sage/brown connectors with arrowheads;
- mono uppercase region labels;
- concise node names with optional secondary labels;
- one highlighted deployment/runtime boundary when useful;
- no animation inside the diagram.

Project-specific flows use only facts already present in the portfolio:

- **JobBoard-DevOps:** frontend delivery, containerized API, GitHub Actions, Azure Container Apps, and MySQL. The diagram distinguishes delivery from runtime without inventing services.
- **JRU Atlas / LaborWise:** two compact, labeled lanes. JRU Atlas shows Laravel, background workers, and the private FastAPI NLP service. LaborWise shows ACR, managed identity, Container Apps, and Log Analytics. No private endpoints, repositories, or sensitive topology are exposed.
- **GitHub → Discord Bot:** GitHub event/source, Caddy HTTPS gateway, Podman container, Quadlet supervision, Oracle Cloud runtime, and Discord destination.

At desktop width, flows run horizontally where space permits. Tablet diagrams may wrap. Mobile diagrams become vertical flows with connectors rotated accordingly.

## Project Details

Metadata uses a semantic definition list rather than a visual-only table. Labels remain consistent across notes where the information exists:

- project type;
- role;
- timeline;
- deployment/runtime;
- visibility or source status.

Unknown facts are omitted rather than guessed. The layout reserves a stable metadata region, so an omitted row becomes white space rather than changing the book height.

## Typography

No new font download is required. The existing font stack already provides the intended hierarchy:

- `Instrument Serif`: page titles, project-card editorial titles, and major journal statements;
- `Inter`: narrative paragraphs, architecture node names, descriptions, and repository links;
- `DM Mono`: uppercase section labels, metadata keys, diagram annotations, deployment-boundary captions, and technology tags.

The mono face is an accent, not a body font. It must read like a typed engineering field note, not a novelty handwritten script. Uppercase mono labels use modest tracking and remain large enough to meet readability requirements.

## Component Boundaries

The implementation introduces small, reusable class families rather than project-specific layout CSS:

- `project-architecture` for the figure and flow canvas;
- `project-architecture__node`, `__connector`, and `__boundary` for diagram primitives;
- `project-details` for the definition-list metadata grid;
- `project-source` for either repository or private-status content;
- shared journal typography tokens for technical labels and annotations.

Project-specific differences belong in authored HTML content and modifier classes for diagram topology, not in duplicated page-layout rules.

## Interaction and Motion

The existing project-selection and single-leaf animation contracts remain unchanged. The fixed desktop height removes layout movement before, during, and after a turn. The temporary leaf must inherit the same shared height as the stationary spread.

Rapid selection, hash updates, keyboard behavior, reduced motion, reduced transparency, increased contrast, and theme-switch cancellation retain their current behavior.

## Accessibility

- Keep native `<details>` and `<summary>` controls as the interaction source of truth.
- Architecture figures receive concise accessible descriptions; decorative connector lines and icons are hidden from assistive technology.
- Diagram meaning cannot depend on color alone.
- Typewriter labels meet the existing contrast and minimum-size requirements.
- Focus indicators remain visible in normal and increased-contrast modes.
- Mobile flow order follows the DOM reading order.
- No technical page uses an internal scrolling region.

## Responsive Behavior

- **Desktop (`>= 56.25rem`):** fixed-height spread, two pages, horizontal diagrams, page-turn animation enabled when preferences allow.
- **Tablet (`< 56.25rem`):** natural-height spread, two columns when space allows, wrapped diagrams, no decorative leaf animation.
- **Mobile (`<= 40rem`):** pages stack vertically, architecture flows become vertical, metadata becomes one column, and the center gutter remains hidden.

## Verification

Automated and browser checks must verify:

1. All three desktop project spreads have the same computed height.
2. Every desktop page satisfies `scrollHeight <= clientHeight`; no copy, diagram, tag, or source content is clipped.
3. The turn layer and temporary leaf match the stationary spread height.
4. The architecture overview and details regions exist for every note and do not introduce facts absent from the authored portfolio.
5. Project switching does not move the book’s top or bottom edge.
6. The current rapid-selection, deep-link, keyboard, theme, and preference tests continue to pass.
7. At `768px` and `375px`, pages use natural height, diagrams remain legible, and there is no horizontal overflow.
8. Public repository links and the private-status alternative occupy the same source region and remain accessible.

## Non-Goals

- Redesigning the dark-mode project cards.
- Replacing the current page-turn controller.
- Adding invented infrastructure, metrics, or private system details.
- Adding a literal handwriting font or applying mono typography to narrative copy.
- Creating animated architecture diagrams.
- Adding internal page scrolling, pagination, or “read more” controls.
