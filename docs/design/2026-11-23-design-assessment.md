# Portfolio design assessment — 23 November 2026

Method: dual-agent (A: /root/design_assessment · B: /root/browser_assessment), plus local conversation recovery and public-source research.

## Recommendation

Keep the tactile engineering journal as the portfolio's signature. Use a steady desktop book, readable evidence, restrained page turns, and direct access to professional information. Retain the current fast recruiter presentation. The best fit is a personal engineering field journal with editorial clarity; its success depends on showing the work as convincingly as the book.

This is a recommendation based on the user's recorded preferences and the inspected implementation, not a claim that one style objectively performs best. No comparative user testing has established a winner.

## Recovered context

The accessible September 8 conversation, “Apply journal concept design,” explicitly asks for a close match to the supplied journal image, then calls out a floating book/pencil, page-turn quality, and the journal becoming larger between project selections. These requests make material fidelity and stable geometry priorities. Earlier indexed chats and the shared project memory establish the broader cloud/platform portfolio context, but their complete transcripts were not recovered. Shared memory was read only.

The August design documents establish story/technical page pairs, native mobile disclosures, truthful project claims, and a professional dark presentation. September's reference notes and current source establish a later pale-oak, ivory, olive, Instrument Serif direction. These documents differ; the latest explicit journal preference should guide a future reconciliation rather than silently restoring the older appearance.

Current main is static HTML/CSS/JavaScript. An alternate Astro/React/Motion implementation exists in `.worktrees/codex-cozy-motion-journal` on `codex/cozy-motion-journal`, including optional drag/tilt inspection. The existence of that branch does not establish that it is the deployed site or the better design. Assessment targets current main.

## Directions compared

| Direction | Fit for the recorded brief | Principal tradeoff | Decision |
| --- | --- | --- | --- |
| Conventional project grid | Fast professional scanning | Less of the personal workspace the user requested | Keep as the existing recruiter path |
| Tactile journal with editorial case studies | Strongest match to the reference and repeated requests | Needs disciplined pagination and responsive adaptation | Recommended primary identity |
| Immersive interactive 3D workspace | Adds physical exploration | More interaction, rendering, and accessibility complexity before the evidence | Consider only after the reading experience works |

This ranking is a design judgment, not a measured conversion comparison. Bruno Simon's portfolio demonstrates how an explorable world fits a creative developer's work; it does not establish that a driving/3D experience suits a cloud/platform portfolio. [Primary example](https://bruno-simon.com/).

## Findings

1. **Geometry is the clearest confirmed problem.** `css/style.css:2059` gives Private Work a larger workspace minimum. At a 1440px viewport with 16px root text, the CSS computes 944px normally and 1056px for Private Work: a 112px increase. These are calculations, not browser measurements. Desktop spreads also grow with content, and the photographic book stretches to their dimensions. The page-turn layer takes its initial height from the outgoing spread. Together these are credible mechanisms for the reported resizing and a potential turn mismatch.
2. **Evidence is too small.** Some architecture text is approximately 10px; details and technical tags are approximately 11px at the default root size. The atmosphere has room while the proof is compressed. This is a legibility concern; a small font alone does not establish a WCAG failure.
3. **The story/technical split is useful.** The saved desktop image has a coherent silhouette, identifiable selection state, three understandable project choices, and selectable HTML evidence. Keep these strengths.
4. **The first impression needs professional clarity.** The light hero identifies Garren and describes a personal workspace, but could state the cloud/platform focus more directly. A brief factual role line can preserve its warmth while helping unfamiliar visitors understand relevance.
5. **Content should explain engineering decisions.** Project descriptions and technology lists need a specific constraint, personal contribution, decision, and verified result or lesson. Do not invent metrics or equate an architecture diagram with production evidence.
6. **Written and implemented systems diverge.** DESIGN.md describes Astro, Fraunces/IBM Plex, and graphite/moss dark colors. Main uses static HTML, Instrument Serif/system sans/DM Mono, and cyan/black dark tokens. The September reference is a later visual authority. Reconcile these records in a separately scoped implementation pass; this assessment does not replace approved design rules.

The deterministic detector returned 109 findings, including 58 undersized UI text findings, 18 tiny-text findings, 13 inferred contrast findings, 12 bounce-easing findings, and 8 other style findings. These are screening signals, not 109 confirmed usability defects. Contrast and runtime motion findings require rendered inspection. Full temporary output: `/private/tmp/portfolio-assessment-detector.json`.

## Proposed design specification

- **Hero:** quiet paper, name, one factual cloud/platform role sentence, a primary Selected work action, and direct Resume/GitHub access. Keep personal writing as a supporting line.
- **Desktop project area:** left field-note index, dominant two-page book, unchanged book footprint during selection at a given viewport and text scale. Keep the grounded oak, ivory pages, olive rules, binding, and ribbon. Place edge props outside reading and control areas.
- **Long projects:** divide the content into explicit spreads with Previous, Next, and a position indicator. For example, use a summary spread followed by architecture and operational evidence where material warrants it. Fit content through editing and pagination rather than shrinking text or clipping it. Enlarged text must be allowed to trigger a flowing reading layout.
- **Evidence hierarchy:** project purpose and status first; ownership, constraint, decision, and outcome next; architecture and real supporting links alongside. Show private-project limitations honestly. Project Archive remains the flagship if its available evidence supports that emphasis.
- **Type:** retain the latest reference's editorial serif/sans relationship while resolving the documented font conflict before implementation. Aim for 16–18px reading text and 13–14px supporting technical text; these are proposed design targets, not WCAG minimum font requirements. Simplify diagrams when labels cannot fit.
- **Motion:** keep the desk and resting book stationary while one leaf turns about the gutter. Match paper and shadow between resting and moving layers. Use immediate selection feedback, mirrored reverse navigation, and safe handling of rapid selections. Start with the documented 420–520ms turn range, then judge it in a running prototype. Avoid adding idle tilt or drag before this interaction is stable.
- **Mobile and zoom:** become a single-column reading flow with native disclosures and direct project links. Remove decorative desk props and 3D turns. Preserve content and functionality at 320 CSS pixels and enlarged text.
- **Professional access:** keep resume and work links available in both themes. A presentation preference must not hide essential project facts. If themes continue to change composition, explain that behavior with visible text rather than relying solely on a sun/moon icon.

## Research basis

- **Hiring relevance:** Josh Comeau's developer-portfolio guidance explains that polished templates can still miss employers' needs. This supports evaluating the portfolio by what it communicates about the candidate, rather than visual effects alone. [Building an Effective Dev Portfolio](https://www.joshwcomeau.com/effective-portfolio/).
- **Case-study structure:** Nielsen Norman Group recommends a few relevant projects, scannability, explicit ownership, problems, decisions, and outcomes. Its underlying audience is UX hiring; applying those content principles to engineering is an inference, not engineering-specific hiring evidence. [5 Steps to Creating a UX-Design Portfolio](https://www.nngroup.com/articles/ux-design-portfolios/).
- **Physical motion:** Apple recommends purposeful, brief, optional motion that follows expectations and can be canceled. This supports a page turn tied to navigation rather than extra decorative movement. [Motion](https://developer.apple.com/design/human-interface-guidelines/motion).
- **Rendering cost:** web.dev recommends understanding rendering impact and generally preferring transforms and opacity for animation. This informs implementation choices but does not guarantee smooth page turns. [High-performance CSS animations](https://web.dev/articles/animations-guide).
- **Reflow:** WCAG 2.2 SC 1.4.10 requires content to work at a 320 CSS pixel equivalent without unnecessary two-dimensional scrolling. [Reflow, Level AA](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).
- **Motion preference:** SC 2.3.3 addresses disabling nonessential interaction animation at Level AAA. Reduced motion is also already a project requirement. [Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html).

Sources consulted on 23 November 2026. Older research is identified by its subject and used as guidance, not presented as newly conducted research.

## Verification and limits

Assessment A independently reviewed source, design records, and the historical `journal-desktop.png`. Assessment B ran the detector and inspected geometry/accessibility source. The saved screenshot was inspected visually but is not proof of current rendering. Local server binding was denied, and Chromium failed to launch under the environment's permissions. No fresh screenshots, live animation review, keyboard test, contrast audit, or mobile overflow measurements were completed. No site code, design authority, shared memory, or existing unfinished changes were edited. No deployment was performed.

Before implementation is accepted, check 1440px desktop, a smaller laptop, tablet, 375px mobile, 320px reflow, and enlarged text; test every project, rapid selections, deep links, both themes, keyboard operation, and reduced motion. Compare book and desk geometry before/during/after navigation. Verify real evidence links and project status separately.

The recommended order is: stable geometry and content pagination; readable evidence and clearer professional positioning; material continuity in page turns; responsive/accessibility verification; optional depth interactions only if they improve the result.

Questions skipped: the recovered conversation provides a clear preference for a faithful journal with stable dimensions; no additional preference is needed to deliver this assessment.
