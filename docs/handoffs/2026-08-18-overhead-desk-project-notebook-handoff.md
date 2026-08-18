# Overhead Desk Project Notebook Handoff

## Current State

The design phase is complete. Implementation has not started.

- Branch: `main`
- Design package commit: `9617c5f` (`docs: hand off overhead desk notebook design`)
- Existing verification at handoff: `node --test tests/apple-material-refinement.test.mjs` passes 6/6 tests.
- Established execution preference: work directly on `main`, no worktree, inline execution.

## Approved Experience

Light mode becomes an overhead café work desk in the Projects section. Three field-note covers sit together on the left. Selecting one opens a two-page notebook spread on the right:

- Left page: **The story**
- Right page: **Under the hood**

Both pages are visible initially on desktop so visitors discover the personal lesson and technical architecture together. On mobile, projects and their two pages become native accordions. Dark mode remains the existing professional cloud/platform project portfolio.

## Source Documents

Read these before implementation:

1. `docs/superpowers/specs/2026-08-18-overhead-desk-project-notebook-design.md`
2. `docs/superpowers/plans/2026-08-18-overhead-desk-project-notebook.md`
3. `docs/design-references/overhead-desk-project-notebook.png`

The PNG is a visual-only reference for layout, paper material, sunlight, coffee, edge objects, and sage accents. Its generated names, dates, architecture, technologies, and URLs are intentionally fictional and must never be copied into the site.

## Technical Direction

- Start with the existing HTML/CSS/vanilla-JavaScript stack.
- Use authored `<details>` and `<summary>` content so the notebook works without JavaScript.
- Use JavaScript only for optional deep-link and current-note enhancement.
- Build the shipped desk atmosphere with responsive CSS rather than using the reference PNG as a background.
- Keep the three cover notes together in the desktop left column while the active spread occupies the right side.
- Reset the spread to normal document flow at tablet/mobile widths.
- Preserve reduced motion, reduced transparency, increased contrast, keyboard focus, theme state, form values, and dark project filters.

The user has authorized a framework migration if the static implementation hits a documented limitation. Do not migrate preemptively: the approved interaction fits the current stack. The user plans to deploy on Vercel, which is a separate deployment step.

## Content Integrity

Use verified facts from the current `index.html` and the approved dual-mode content spec only:

- JobBoard-DevOps: Azure migration study and public repository.
- JRU Atlas and LaborWise: private projects; share sanitized architecture only.
- GitHub to Discord Bot: Oracle Cloud, Podman, Quadlet, Caddy, HTTPS, and public repository.

Before finishing, run the plan’s generated-fact leak check for `GreenTrack`, `CafeConnect`, `ECS Fargate`, `MongoDB Atlas`, `CloudWatch`, `Terraform`, and `your-username`.

## Next Conversation

Begin by reading the spec, plan, and this handoff. Then invoke `executing-plans` and follow the implementation plan inline on `main`. Use test-driven steps, commit each verified logical unit, and finish with browser QA at 375px, 768px, and 1440px in both themes.

Suggested opening request:

> Restore the overhead desk project notebook handoff and execute `docs/superpowers/plans/2026-08-18-overhead-desk-project-notebook.md` inline on `main`. Keep the static stack unless a concrete limitation appears, and prepare the site for later Vercel deployment.
