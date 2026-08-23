# Illuminated Engineer's Notebook Redesign

## Objective

Redesign Garren Dullas's cloud and platform engineering portfolio as a maintainable Astro site with two deliberate experiences:

- A warm, tactile field journal for visitors who want to understand the stories, decisions, evidence, and lessons behind the work.
- A dark, proof-focused recruiter view for visitors who need roles, capabilities, status, and links quickly.

The redesign adds Project Archive as the first flagship chapter, deepens the journal's material and narrative quality, introduces restrained physical motion, and deploys the finished static site to Vercel.

The memorable outcome is: **visiting feels like being invited into Garren's actual working space, not scrolling through a resume.**

## Context and Research

The current portfolio already contains a semantic overhead desk journal, three field notes, a single-leaf page-turn controller, responsive native disclosures, light/dark content fragments, and accessibility preferences. These are assets to preserve, not prototypes to discard.

Current portfolio research converges on personal branding, narrative case studies, strong typography, and detailed project journeys. The opportunity is not to imitate more animated portfolios. It is to make the existing journal more legible, more evidence-led, and more purposeful.

The approved direction incorporates four design lenses:

- High-craft frontend direction: a specific editorial identity rather than a generic project grid.
- Apple-style interaction: immediate response, spatial consistency, interruptible motion, restraint, and accessibility preferences.
- Design-system coherence: one type, color, spacing, material, and motion system shared across both modes.
- Image direction: real product captures and evidence artifacts rather than stock imagery or abstract decoration.

## Approved Direction

The approved direction is **Illuminated Engineer's Notebook**.

The light experience is a quiet morning desk with warm paper, graphite text, careful shadows, and evidence tucked into the journal. It is not a faux desktop, a scrapbook, or a draggable workspace.

The dark experience is a calm graphite recruiter view. It summarizes the same work without borrowing generic AI-dashboard conventions.

Project Archive is a threshold rather than a card. Opening it changes the journal's rhythm and reveals a five-spread case study before inviting the visitor into the separate live product.

## Scope

### Included

- Migrate the portfolio from static HTML/CSS/JavaScript to Astro.
- Deploy statically generated output to Vercel.
- Preserve separate light journal and dark recruiter modes.
- Establish the design system defined in `DESIGN.md`.
- Move project content into a validated Astro content collection.
- Rebuild the page-turn experience as a focused React/Motion island with semantic server-rendered content.
- Preserve graceful operation without JavaScript.
- Add a five-spread Project Archive flagship chapter.
- Use verified evidence artifacts throughout the flagship.
- Improve navigation, responsive behavior, metadata, performance, accessibility, and automated verification.
- Preserve current project facts, statuses, public/private distinctions, links, resume access, and contact paths.
- Preserve or map existing `#note-*` deep links.
- Redirect the former GitHub Pages entry after the final Vercel production domain is known.

### Excluded

- Rebuilding or embedding the Project Archive application.
- Redesigning Project Archive's own public or owner interfaces in this repository.
- Fetching portfolio case-study content from the live Project Archive API at runtime.
- Authentication, accounts, comments, a CMS, or server-rendered personalization.
- A draggable desk simulation, scroll-jacking, sound, haptics, or continuous ambient loops.
- Invented metrics, screenshots, architecture details, or deployment claims.
- Server rendering before a verified dynamic requirement exists.

## Experience Architecture

Astro owns the document shell, metadata, content loading, static rendering, and non-interactive components. React and Motion are limited to the journal interaction island.

### Light journal mode

- The first viewport feels like entering an actual working space.
- The project notebook is the primary exploration surface.
- Visitors select chapter covers, open spreads, and inspect evidence artifacts.
- Chapter number, spread position, contents access, and a stable return path prevent the metaphor from obscuring navigation.
- Smaller projects remain concise field notes. Only projects declared `case-study` or `flagship` receive additional spreads.

### Dark recruiter mode

- Leads with role, capabilities, verified proof, project status, and direct actions.
- Condenses projects into scannable summaries without repeating the full journal.
- Project Archive receives a proof-focused flagship summary.
- Each qualifying project can link to its exact field-journal chapter.

### Cross-mode continuity

- Theme choice persists locally.
- Active chapter and reading location use stable URLs.
- Switching modes preserves the visitor's relevant project context where possible.
- Existing deep links map to their new chapter identifiers.
- Theme setup runs early enough to avoid a visible incorrect-theme flash.

## Project Content Model

Projects live in an Astro content collection with schema validation. Each entry contains:

- Slug, title, project identity, role, date, and status.
- Public, private, in-progress, deployed, and link-pending distinctions.
- Short recruiter summary.
- Human story and technical narrative.
- Technologies and verified claims.
- Evidence artifact definitions.
- Chapter size: `field-note`, `case-study`, or `flagship`.
- Theme availability.
- Verified repository and live-product links.
- Optional architecture, operations, lessons, and outcome sections.

The schema must reject incomplete required identity fields and invalid chapter types at build time. Optional live links must not render as active links unless a verified URL exists.

## Component Boundaries

- `PortfolioLayout.astro`: document structure, global metadata, theme bootstrap, navigation, and shared assets.
- `RecruiterPortfolio.astro`: the dark proof-first presentation.
- `JournalPortfolio.astro`: light-mode workspace, chapter index, authored semantic content, and the serialized chapter manifest passed to the controller.
- `JournalIsland.tsx`: active chapter state, interruptible turns, URL synchronization, and environment preference handling. It controls server-rendered chapter roots and never owns factual project markup.
- `JournalChapter.astro`: semantic chapter content and spread sequence rendered by Astro before hydration.
- `CaseStudySpread.astro`: one narrative question and its primary artifact.
- `EvidenceArtifact.astro`: citations, paths, screenshots, queue states, status trails, and captions.
- `ArchitectureArtifact.astro`: legible, evidence-backed system diagrams.
- `LiveProjectDoorway.astro`: verified external project access or an honest status fallback.
- Shared primitives: buttons, links, status labels, tags, focus treatments, notice states, and typography roles.

Every component has one clear purpose, accepts structured inputs, and remains understandable without reading its implementation.

## Visual System

The detailed token and usage rules live in `DESIGN.md`.

### Light journal

- Fraunces for display and chapter voice.
- IBM Plex Sans for readable prose and interface copy.
- IBM Plex Mono for evidence, paths, data, status, and code.
- Warm paper, graphite, coffee ink, moss, quiet amber, and deep umber.
- Material depth from page thickness, gutter, edges, directional light, and contact shadows.
- Evidence provides visual texture.

### Dark recruiter mode

- Graphite surfaces, warm ivory text, muted stone, archive amber, and verified moss.
- Grid-disciplined composition and faster scanning.
- No purple gradients, neon infrastructure diagrams, stacked glass, decorative orbs, or fake dashboards.

### Media rules

- Use real and current Project Archive interface captures.
- Use screenshots only when they prove a point; crop and annotate them for the spread's narrative question.
- Use generated images only as design references, never as factual evidence.
- Avoid stock photography and irrelevant scenery.

## Motion and Depth

Motion must explain state, preserve spatial relationships, and respond immediately.

### Timing

- Press and micro response: `100–180ms`.
- Narrative evidence reveal: `180–280ms`.
- Journal spread change: `420–520ms`.

### Journal behavior

- Press feedback begins on pointer-down.
- A turn begins from the current visible page state.
- Rapid reselection cancels or redirects the active turn without a visual jump.
- Forward and backward paths mirror around the gutter.
- Input is never locked for the full animation.
- Critically damped motion is the default; no decorative bounce.
- Ordinary navigation remains immediate. Physical motion is reserved for chapter changes.

### Ambient behavior

- Morning light may soften as the journal enters.
- A leaf shadow may shift once.
- The notebook may settle by one or two pixels after a meaningful transition.
- Nothing decorative loops continuously.

### Depth layers

1. Desk and directional light.
2. Notebook body, page edges, gutter, and contact shadow.
3. Evidence artifacts resting on or inside the spread.
4. Temporary interaction layers such as the turning leaf or focused citation.

Only the active layer moves.

## Project Archive Flagship Chapter

Project Archive receives five spreads plus a threshold cover.

### Cover: the threshold

Opening line: **When source material becomes a system people can question.**

The cover is visually heavier and quieter than ordinary field notes. It communicates hierarchy without a large featured badge.

### Spread 1: Why build an archive?

Explain the problem: ordinary portfolios describe outcomes but often hide the decisions, source material, and operational lessons behind them.

Primary artifact: disconnected project and repository notes becoming one organized project record.

### Spread 2: Turning repositories into evidence

Explain ingestion and indexing using only facts verified from the Project Archive repository and deployment records.

Primary artifact: a legible source-to-index diagram supported by real repository paths, file counts, or indexing states when available and verified.

### Spread 3: Questions with receipts

Show how a visitor asks a project question, receives a source-grounded answer, and inspects its citation.

Primary artifact: a real annotated interaction sequence covering question, answer, citation, and source context.

### Spread 4: Operating the archive

Tell the operational story: indexing queues, safe project deletion, duplicate-action prevention, failure recovery, owner-safe errors, and deployment.

Primary artifact: a verified operations trail using real status messages and current owner-interface captures.

### Spread 5: Step inside

Close with lessons, honest current status, and a live-product invitation.

Primary artifact: the verified live Project Archive doorway. If the deployment is unavailable, render a truthful status panel with no dead or placeholder link.

### Dark-mode summary

The recruiter view condenses the chapter into problem, role, architecture, operational contribution, technology, status, links, and a direct journal entry.

## Data and Failure Flow

- Project content is curated and validated at build time.
- Astro renders the complete factual chapter markup. The React island receives only serializable identifiers and interaction metadata, then enhances those server-rendered roots.
- The portfolio does not call Project Archive at runtime to render the case study.
- External product availability never blocks portfolio rendering.
- Missing optional media produces an intentional text/evidence fallback.
- Missing verified links produce a status label rather than a disabled fake action.
- A content-schema failure stops the production build instead of silently shipping incomplete facts.
- A journal enhancement failure leaves semantic chapter content, disclosures, and links usable.
- A motion setup failure commits the requested chapter directly and cleans transient state.

## Responsive Behavior

- Wide desktop: chapter index beside a dominant two-page spread.
- Tablet: chapter index above the spread; pages collapse before text becomes narrow.
- Mobile: native semantic disclosures, direct navigation, and no large 3D turn.
- At 400% zoom: use the mobile/stacked presentation and prevent horizontal content overflow.
- Desk objects disappear before they compete with content or focus indicators.
- Product captures scale with readable captions and never require horizontal scrolling to understand the proof.

## Accessibility

- Server-rendered semantic content is the source of truth.
- Controls meet a minimum 44px target size where applicable.
- Focus remains visible and stable through theme changes and journal turns.
- The turning leaf is hidden from assistive technology and contains no actionable descendants.
- Reduced motion uses direct state changes and short cross-fades.
- Reduced transparency uses solid materials with no backdrop blur dependency.
- Increased contrast strengthens boundaries, labels, selected states, and focus rings.
- Semantic meaning never relies on color, position, or motion alone.
- Heading order, landmarks, status announcements, and link labels remain explicit.

## Performance

- Static generation is the default.
- Hydrate only the journal island and only when it is relevant.
- Animate compositor-friendly transforms and opacity.
- Self-host and subset fonts; preload only critical faces.
- Process images at build time and provide intrinsic dimensions.
- Avoid a runtime animation or component library outside the journal without a measured need.
- Target representative Lighthouse scores of at least 90 for performance and 100 for accessibility.

## Vercel Deployment

- Deploy static Astro output to Vercel.
- Use Vercel's Astro framework detection and Git integration.
- Commit the selected package manager's lockfile so local, preview, and production builds resolve the same dependency versions.
- Generate preview deployments for branches and pull requests.
- Deploy production from `main`.
- Do not add serverless rendering initially.
- Add the Vercel adapter only when a selected Vercel feature requires it, such as platform-managed image optimization, configured Web Analytics, or future on-demand rendering.
- After the production domain is chosen and verified, preserve the old GitHub Pages entry with a redirect.

## Migration Strategy

The migration separates parity from redesign so defects remain diagnosable.

1. Establish Astro static output, content schemas, theme shell, and Vercel build compatibility.
2. Port every current factual project entry, link, status, resume path, contact path, and metadata field.
3. Recreate semantic light/dark behavior and mobile disclosures without expanded motion.
4. Rebuild the current journal interaction as the focused island and verify parity.
5. Apply the new visual system and evidence components.
6. Add the Project Archive five-spread flagship chapter from verified source material.
7. Add narrative reveals, view transitions, and preference-specific fallbacks.
8. Run full content, accessibility, responsive, browser, performance, and Vercel preview verification.

This sequence describes dependency order, not the detailed implementation task breakdown. The implementation plan will define exact files, tests, and checkpoints after this specification is approved.

## Verification

### Content and build

- Astro schema rejects invalid project records.
- Production build succeeds with no broken internal routes or assets.
- Every current factual claim, status, repository link, resume link, and contact path is accounted for.
- Project Archive claims and captures trace back to verified project sources.
- Missing optional live/media fields render defined fallbacks.

### Interaction

- Direct links open the correct mode and chapter.
- Theme switch preserves relevant context and does not flash the wrong theme.
- Rapid chapter selection leaves exactly one committed destination.
- Turns can be interrupted without locking input or leaving transient layers.
- Browser back/forward restores stable state.
- JavaScript-disabled content remains readable and navigable.

### Responsive and browser

- Test representative widths at 375px, 768px, 1024px, and 1440px.
- Verify Chromium, Firefox, and WebKit.
- Verify pointer, keyboard, and touch input.
- Verify 200% and 400% zoom with no content loss or incoherent overlap.

### Accessibility preferences

- Verify reduced motion, reduced transparency, and increased contrast.
- Verify focus order and visible focus in both modes.
- Verify landmarks, headings, disclosures, links, and status content with a screen reader.

### Visual and performance

- Capture the hero, journal contents, every flagship spread, dark flagship summary, mobile disclosures, and both theme states.
- Check font loading, intrinsic image dimensions, cumulative layout shift, page-turn frame stability, and initial JavaScript weight.
- Run Lighthouse against a production-equivalent Vercel preview.

## Success Criteria

- Visitors immediately feel invited into a personal working space.
- Recruiters can identify Garren's role, strengths, flagship work, status, and links quickly.
- Project Archive reads as the flagship through narrative and evidence, not badge size.
- The journal feels deeper and more physical without becoming a simulation.
- Motion is responsive, interruptible, restrained, and preference-aware.
- Smaller projects remain coherent and easy to add through structured content.
- The deployed site remains fast, accessible, truthful, and useful when optional JavaScript or external products fail.
