# Cozy Motion Journal — Design

## Objective

Turn the existing light-mode project journal into a warmer, more alive reading experience while preserving the portfolio's technical credibility, accessible semantic content, and fast dark recruiter mode. The project will move from a loose static-page setup to a small Astro application with a focused React/Motion interaction island.

The memorable outcome is a quiet morning work surface: a substantial notebook, a nearby coffee, gentle desk light, and projects that feel like real field notes rather than animated cards.

## Constraints and Decisions

- Preserve every existing project claim, status, external link, resume path, and `#note-*` deep link.
- Continue shipping static output compatible with GitHub Pages.
- Use Astro for page structure and static rendering; use React only inside the journal controller.
- Use the `motion` package and import from `motion/react`; do not use `framer-motion` in the new implementation.
- Configure shadcn for the Astro/React project, but add only primitives that improve actual controls. It is not a replacement visual theme.
- Replace AOS with one shared motion system.
- Honour `prefers-reduced-motion`: no page-turn transforms, only direct updates or brief opacity transitions.
- Keep dark recruiter mode proof-focused and visually restrained.

## Experience

### Light journal

The project area remains a two-page notebook on a warm walnut desk. Material cues are limited to intentional layers: directional morning light, subtle wood grain, page edges, a gutter shadow, a coffee cup, a clipped note, a pencil, and a small botanical silhouette. Props never cover a control or essential text, and disappear progressively on narrower screens.

The chapter rail makes the reading model explicit: numbered field notes, active-state marker, current title, and a stable way back to the project index. Active content gains visual weight through paper depth and a quiet bookmark rather than a generic featured-card treatment.

### Motion

Motion is limited to state and spatial continuity:

- Selecting a different field note turns one virtual leaf about the gutter on desktop light mode.
- The active spread and its evidence elements settle into place with transform/opacity-only transitions.
- Covers, links, and buttons get short press/hover feedback.
- First entrance may use one brief staged reveal; no continuous ambient loops, cursor toys, or layout-property animation.
- Rapid note selections interrupt safely and resolve to the most recently selected note.

All durations, easing curves, distances, and spring configurations live in shared motion tokens. A runtime gate uses `useReducedMotion` and low-end-device detection to remove non-essential transforms.

### Responsive behaviour

Desktop retains the desk composition and notebook spread. Tablet moves the chapter rail above the spread before the text becomes tight. Mobile becomes a direct vertical reading flow using semantic disclosures, without 3D page turns or decorative props. At any size, controls have 44px targets, focus remains visible, and no content requires hover.

## Architecture

- `src/layouts/PortfolioLayout.astro`: document head, theme bootstrap, navigation, shared CSS, and static metadata.
- `src/pages/index.astro`: content assembly for light journal and dark recruiter mode.
- `src/components/journal/JournalPortfolio.astro`: semantic journal markup and no-JavaScript fallback.
- `src/components/journal/JournalIsland.tsx`: client-side note selection, URL syncing, accessible turning-leaf enhancement, and Motion transitions.
- `src/lib/motion-tokens.ts`: durations, easing, distance, scale, and named spring presets.
- `src/lib/motion-config.ts`: reduced-motion and low-end-device runtime gate.
- `src/styles/global.css`: existing design tokens migrated from the current stylesheet plus responsive material styling.
- `components.json`: shadcn configuration for the Astro React island.

Portfolio facts remain authored static data/markup. The island receives only IDs and interaction metadata; it does not own the factual content. A JavaScript or Motion failure leaves all project content, disclosures, and links usable.

## Verification

- Build static production output successfully.
- Test note deep links, keyboard selection, rapid changes, theme switches, and page-turn cleanup.
- Test reduced motion, small-screen fallback, and visible focus states.
- Confirm there are no AOS runtime references in the migrated page.
- Check the light journal at desktop, tablet, mobile, and 400% zoom for text clipping and horizontal overflow.
- Preserve the existing factual-content and project-layout test coverage, updating selectors only where the migration requires it.

## Out of Scope

- Rebuilding the Project Archive product or inventing project evidence.
- A full UI-kit conversion or importing shadcn components simply because they are available.
- A draggable desk, scroll-jacking, continuous decorative animation, or a dark-mode redesign.
