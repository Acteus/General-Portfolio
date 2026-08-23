# Design System — Garren Dullas Portfolio

## Product Context

- **What this is:** A dual-mode cloud and platform engineering portfolio. Its light mode invites visitors into a tactile field journal; its dark mode gives recruiters a fast, proof-focused view of the same work.
- **Who it is for:** Recruiters, engineering peers, collaborators, and visitors who want to understand both the systems and the thinking behind them.
- **Space:** Technical portfolio, editorial case studies, and cloud/platform engineering.
- **Project type:** Statically generated Astro portfolio with one focused interactive journal island.
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
- **Project Archive is a threshold, not a larger card.** The flagship changes the chapter rhythm and earns multiple spreads. This makes hierarchy unmistakable while requiring smaller projects to remain intentionally concise.

## Typography

- **Display and chapter titles:** Fraunces Variable. Literary, personal, and slightly idiosyncratic without becoming nostalgic costume.
- **Body and interface:** IBM Plex Sans. Clear at reading sizes and compatible with technical content.
- **Evidence, data, and code:** IBM Plex Mono. Use for citations, repository paths, status labels, architecture captions, and operational states.
- **Loading:** Self-host WOFF2 assets through the Astro build. Avoid layout-blocking remote font imports. Preload only the display and body faces needed above the fold.
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

- Paper: `#F5EEDF`
- Aged paper and page edge: `#E8D8BF`
- Graphite text: `#2E2924`
- Coffee-ink secondary: `#6A4B37`
- Moss interaction and verified state: `#53634C`
- Quiet amber flagship or live-project signal: `#C57A3A`
- Shadow umber: `#2C1C14`
- Error: `#9E453F`
- Information: `#46657A`

### Dark recruiter mode

- Ink background: `#15191A`
- Charcoal surface: `#222A29`
- Warm ivory text: `#F0E7D6`
- Muted stone: `#AFA797`
- Archive amber: `#D18A46`
- Moss verified state: `#93A58B`
- Error: `#E79A92`
- Information: `#8FB5CC`

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
- **Journal desktop:** Compact chapter index plus a dominant two-page spread.
- **Journal tablet:** Chapter index above the spread; spread collapses before text becomes cramped.
- **Journal mobile:** Native semantic disclosures and direct navigation; no large spatial animation.
- **Radius scale:** `2px` paper edge, `6px` control, `10px` panel, `9999px` only for compact tags or segmented controls.
- **Wayfinding:** Chapter number, spread position, contents access, and a stable return path are always visible or immediately reachable.

## Material and Media

- Material realism comes from shape, directed light, page thickness, gutter depth, edge highlights, and contact shadows.
- Use low-contrast paper grain sparingly. Avoid photorealistic desk backgrounds, torn edges, faux leather, stacked glass, and ornamental clutter.
- Product imagery must use real, current Project Archive captures or clearly labeled conceptual diagrams.
- Evidence artifacts include repository paths, citations, architecture annotations, indexing states, queue events, and owner-interface captures.
- Generated imagery may be used as a design reference, never as factual project evidence.

## Motion

- **Approach:** Intentional and physical.
- **Micro response:** `100–180ms`.
- **Narrative reveal:** `180–280ms`.
- **Journal spread change:** `420–520ms`.
- **Default physical behavior:** Critically damped, no bounce. Bounce is reserved for future momentum-driven gestures.
- Press feedback begins on pointer-down.
- Page turns originate at the gutter, mirror in reverse, remain interruptible, and begin from the current visible state.
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

