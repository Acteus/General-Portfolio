# Design System — Garren Dullas Portfolio

## Product Context

- **What this is:** A dual-mode cloud and platform engineering portfolio. Its light mode invites visitors into a tactile field journal; its dark mode gives recruiters a fast, proof-focused view of the same work.
- **Who it is for:** Recruiters, engineering peers, collaborators, and visitors who want to understand both the systems and the thinking behind them.
- **Space:** Technical portfolio, editorial case studies, and cloud/platform engineering.
- **Project type:** Static HTML/CSS portfolio with a progressively enhanced vanilla-JavaScript journal. The Astro/Motion worktree is an alternate implementation, not the current main site.
- **Memorable outcome:** Visiting should feel like being invited into Garren's actual working space, not scrolling through a resume.

## Aesthetic Direction

- **Direction:** Illuminated Engineer's Notebook.
- **Decoration level:** Intentional. Material, light, and evidence add character without becoming a desk simulation.
- **Mood:** Quiet, tactile morning light; careful paper handling; precise engineering evidence. The portfolio should feel personal, calm, and technically credible within the first few seconds.
- **Concept spine:** The light journal reveals how scattered source material becomes trustworthy systems. The dark recruiter mode compresses that same evidence into a direct professional summary.
- **References:**
  - https://www.siteinspire.com/
  - https://www.wix.com/blog/web-developer-portfolio-examples
  - https://www.creativebloq.com/portfolios/examples-712368

### Safe choices

- Clear recruiter scanning, stable navigation, truthful project status, and direct links.
- Familiar semantic controls, strong keyboard focus, and responsive single-column fallbacks.
- Static generation for reliability, speed, search visibility, and graceful failure behavior.

### Deliberate risks

- **The portfolio is a physical journal rather than a project grid.** This creates recognition and emotional memory, but requires explicit wayfinding so the metaphor never costs usability.
- **Evidence is the decoration.** Citations, repository paths, architecture annotations, queue states, and interface captures replace generic visual flourishes. This demands careful curation but makes the engineering proof inseparable from the visual identity.
- **LaborWise leads the internship narrative.** Its deployment safety and retrieval safeguards are followed by JobBoard DevOps and completed JRU Atlas. Project Archive and the Discord bot remain additional notes; every project has two spreads in this iteration.

## Typography

- **Display and chapter titles:** Instrument Serif, following the September journal reference. Georgia is the fallback.
- **Body and interface:** Inter inside the journal; platform sans elsewhere. Reading text is 1rem with generous line height.
- **Evidence, data, and code:** DM Mono for step numbers and short evidence labels. Technical descriptions remain sans serif, at least 0.875rem in the journal.
- **Loading:** Current main loads Google Fonts with system fallbacks. The journal remains readable when external fonts and icon resources are unavailable; key navigation icons use inline SVG.
- **Fallbacks:** Georgia for display; a platform sans stack for body; a platform monospace stack for evidence.

### Type scale

- Display: `clamp(3rem, 7vw, 6.5rem)` / `0.92–1.0` line-height
- Section title: `clamp(2.25rem, 4vw, 4.25rem)` / `0.98–1.05`
- Chapter title: `clamp(1.75rem, 3vw, 3rem)` / `1.0–1.1`
- Heading: `1.375rem` / `1.2`
- Body large: `1.125rem` / `1.65`
- Body: `1rem` / `1.6`
- Small: `0.875rem` / `1.5`
- Evidence label: `0.75rem` / `1.4`, with modest positive tracking

Large display text uses slightly negative optical tracking. Body text stays near neutral tracking. Small mono labels may use positive tracking for legibility.

## Color

- **Approach:** Restrained and semantic. Warm neutrals dominate light mode; graphite neutrals dominate dark mode. Moss and amber are rare, meaningful signals.

### Light journal

- Page material: `#F5F1E7`
- Main ink: `#24251D`
- Reading text: `#29291F`
- Secondary ink: `#393B31`
- Olive interactions and labels: `#606239`
- Paper rule: `#C5BDAB`
- Selected outline and keyboard focus: `#53634C`
- Surrounding light paper: `#F5EAD8`
- Desk: supplied pale-oak photographic material, with restrained contact shadows.

### Dark recruiter mode

- Background: `#000000`
- Main text: `#F5F5F5`
- Cyan interaction accent: `#06B6D4`
- Hover accent: `#22D3EE`
- Existing translucent panels retain their current treatment.
- A visible Journal view / Recruiter view label explains the presentation change; the button names its destination.

All foreground/background pairs must be verified during implementation. Semantic meaning never relies on color alone.

## Spacing

- **Base unit:** `4px`.
- **Density:** Spacious for editorial reading; comfortable for recruiter scanning; compact only inside evidence artifacts.
- **Scale:** `2xs 0.25rem`, `xs 0.5rem`, `sm 0.75rem`, `md 1rem`, `lg 1.5rem`, `xl 2rem`, `2xl 3rem`, `3xl 4rem`, `4xl 6rem`, `5xl 8rem`.
- Major sections use generous, consistent vertical rhythm. Denser evidence spreads are followed by calmer spreads.

## Layout

- **Approach:** Hybrid. Creative editorial composition for the journal; grid-disciplined composition for the recruiter mode and technical evidence.
- **Maximum content width:** `88rem` for the desk and journal; `76rem` for recruiter content.
- **Grid:** 12 columns on wide screens, 8 on tablet, and one fluid column on mobile.
- **Journal desktop:** At 75rem and above, a compact five-note project index sits left of a dominant two-page spread. Book and desk dimensions stay fixed across projects at the current viewport and text scale. Each project has two authored spreads: story/architecture, then project details/evidence. Previous/Next controls and a live spread indicator sit below the left index.
- **Journal tablet:** Below 75rem, all spreads of the selected project flow in document order. No page turns or photographic book backdrop. Enlarged root text also switches to this reading layout when the desktop would become too cramped.
- **Journal mobile:** Native semantic disclosures, single-column pages, direct project links, and readable evidence. All authored spreads remain accessible without JavaScript. No 3D motion or desk props.
- **Radius scale:** `2px` paper edge, `6px` control, `10px` panel, `9999px` only for compact tags or segmented controls.
- **Wayfinding:** Chapter number, spread position, contents access, and a stable return path are always visible or immediately reachable.

## Material and Media

- Material realism comes from shape, directed light, page thickness, gutter depth, edge highlights, and contact shadows.
- Use low-contrast paper grain sparingly. The approved September reference uses a pale-oak photographic desk and an isolated open-book material below selectable HTML. Retain these assets. Avoid torn edges, faux leather, stacked glass, and additional ornamental clutter.
- Product imagery must use real product captures or clearly labeled architecture summaries. LaborWise uses its public landing-page capture from 23 November 2026. A landing-page capture does not establish backend correctness or deployment health.
- Evidence artifacts include repository paths, citations, architecture annotations, indexing states, queue events, and owner-interface captures.
- Generated imagery may be used as a design reference, never as factual project evidence.

## Motion

- **Approach:** Intentional and physical.
- **Micro response:** `100–180ms`.
- **Narrative reveal:** `180–280ms`.
- **Journal spread change:** `500ms`, with symmetric timing so the edge-on leaf coincides with the content swap.
- **Default physical behavior:** Critically damped, no bounce. Bounce is reserved for future momentum-driven gestures.
- Press feedback begins on pointer-down.
- Page turns originate at the gutter, mirror in reverse, remain interruptible, and resolve rapid selections to the latest requested project or spread. The existing controller cancels its temporary leaf and resumes from committed content; continuous velocity-preserving retargeting is not implemented.
- Only the active depth layer moves.
- Ambient motion is brief and event-driven. Nothing decorative loops continuously.
- Reduced motion uses direct state changes and short opacity cross-fades.
- Reduced transparency uses solid materials. Increased contrast strengthens boundaries and focus indicators.

## Component Principles

- Components expose one clear responsibility and preserve semantic HTML.
- Evidence artifacts communicate something verifiable; they are never empty decoration.
- Light and dark modes share content facts and core primitives but use different compositions.
- Ordinary navigation remains immediate. Physical page motion is reserved for meaningful chapter changes.
- External product availability never determines whether the portfolio case study can render.

## Decisions Log

| Date | Decision | Rationale |
| --- | --- | --- |
| 2026-08-24 | Use the Illuminated Engineer's Notebook direction | Preserves the memorable warm journal while strengthening technical proof. |
| 2026-08-24 | Keep separate light journal and dark recruiter modes | Serves reflective exploration and fast professional scanning without forcing one compromise experience. |
| 2026-08-24 | Migrate to Astro with a focused React/Motion journal island | Gives structured content and maintainable interaction without turning the whole portfolio into a client-side app. |
| 2026-08-24 | Deploy static Astro output to Vercel | Supports reliable static delivery and preview deployments while avoiding unnecessary server runtime. |
| 2026-08-24 | Treat Project Archive as a five-spread flagship threshold | Gives the flagship appropriate narrative and operational depth without diminishing smaller field notes. |
| 2026-08-24 | Use evidence as the visual detail language | Makes technical credibility and visual identity reinforce each other. |
| 2026-11-23 | Retain static main and September journal materials; use two spreads per project | Supersedes the earlier migration and five-spread implementation plans for this pass; stabilizes geometry and improves evidence readability. |


## Current implementation — 23 November 2026

The user approved the assessment in `docs/design/2026-11-23-design-assessment.md`. September's pale oak, ivory, olive, and Instrument Serif reference takes precedence over the older August font/material choices. Earlier Astro migration and Vercel decisions describe historical plans; current main remains the static GitHub Pages-compatible site.

`css/journal.css` owns the refined reading layout and overrides legacy material/layout rules in `css/style.css`. `js/journal-flip.js` owns selection, spread state, page turns, deep links, cleanup, and responsive fallback. The hero states the cloud/platform focus directly. Project facts, statuses, source links, and resume paths are retained.

The book and desk stay stationary through navigation. A temporary inert leaf uses matching typesetting and ivory material. Nonessential motion is disabled for reduced motion. Key controls have 44px targets, visible focus, and a keyboard focus handoff at disabled pagination boundaries. No content is clipped to make it fit a spread; narrow and enlarged-text views use document flow.

## Internship content — 23 November 2026

The user approved aligning the portfolio with the supplied internship resume and corrected Atlas to completed. Both LaborWise and Atlas are completed projects. Internship availability, required hours, unmeasured outcomes, and a specific Atlas completion month remain unspecified.

LaborWise leads both presentations and links to its public frontend and a sanitized case study. JobBoard DevOps and Atlas follow; Project Archive and Discord retain their original note IDs. `#note-private-work` resolves to Atlas. Note links open the journal presentation so shared case-study links are usable regardless of the last saved theme. Compact desktop selectors keep all five notes within the stable desk footprint; full descriptions remain in the flowing layout.

All resume controls serve the refined internship PDF. The source PDF is archived unchanged. Atlas's EC2/ECR/SSM details come from its current AWS release runbook; its completed status comes from the user's correction. No production deployment or private evidence publication is part of this pass.
