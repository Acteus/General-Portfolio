# Journal readability implementation plan

Approved brief: `docs/design/2026-11-23-design-assessment.md`; user approved implementation on 23 November 2026.

Keep the static HTML/CSS/JavaScript implementation and existing project facts, links, assets, and deep links. Preserve unfinished edits. Execute inline; no framework migration, deployment, or commit is needed.

1. Add browser regression coverage for fixed desktop geometry across all projects and spreads, readable evidence, navigation, rapid selection, keyboard focus, deep links, mobile/reduced-motion/no-JavaScript fallbacks. Run against current code and confirm missing pagination fails.
2. Split each authored project into two semantic spreads: story/architecture and details/evidence. Add previous/next controls and a live position indicator as progressive enhancement. Extend the existing turn controller to handle spreads as well as projects and URL history changes. Keep all authored content readable without JavaScript.
3. Consolidate the desktop sizing to one book/desk footprint, move narrow screens to flowing pages, increase technical type sizes, match moving/resting paper, use a 500ms turn, and explain the theme compositions. Clarify the factual light hero and project lessons without inventing outcomes.
4. Run controller and browser tests; inspect desktop/mobile screenshots. Verify theme changes, keyboard controls, reduced motion, enlarged text, content preservation, and rapid navigation. Resolve obsolete design assertions while retaining meaningful fact/accessibility coverage.
5. Update DESIGN.md and README with current architecture, September visual choices, pagination, and validation. Report verified results and any remaining limits.
