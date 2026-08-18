# Dual-Mode Portfolio Content Design

## Goal

Make the portfolio theme toggle change the perspective of the site as well as its appearance. Dark mode remains a recruiter-focused cloud and platform engineering portfolio. Light mode becomes a warm personal workspace and digital garden that shows what Garren is building, learning, and documenting.

The two modes describe the same person and the same verified work. Theme-specific content may change framing and emphasis, but it must not introduce unsupported claims or conflicting project facts.

## Experience Model

### Dark mode: professional portfolio

Dark mode keeps the existing content and structure:

- Cloud and platform engineering hero
- Technical About section
- Skills and toolkit
- Selected projects grouped by professional relevance
- Direct professional contact invitation

### Light mode: personal workspace and digital garden

Light mode uses the same page anchors but changes their visible labels and content:

| Anchor | Dark mode | Light mode |
| --- | --- | --- |
| `#home` | Home | Home |
| `#about` | About | Story |
| `#skills` | Skills | Now |
| `#projects` | Projects | Notes |
| `#contact` | Contact | Say hello |

The light experience includes:

1. A reflective hero that introduces the space as a place for projects, lessons, and open questions.
2. A personal story grounded in Garren's IT studies, interest in infrastructure, and preference for calm, focused work.
3. A “Now” section covering what is being built, learned, and improved.
4. Field notes derived from existing portfolio evidence rather than invented interests or achievements.
5. Project stories that emphasize decisions, challenges, and lessons while retaining the same dates, status, links, and technology facts as dark mode.
6. A warmer contact invitation without changing the email workflow.

## Initial Light-Mode Copy

### Hero

- Eyebrow: `Personal workspace · learning in public`
- Title remains `Garren Dullas` to preserve identity and search clarity.
- Subtitle: `A quiet corner for the systems I’m building, the lessons I’m keeping, and the questions I’m still exploring—usually with coffee nearby.`
- Primary action: `Read my notes` → `#projects`
- Secondary action: `What I’m working on` → `#skills`
- GitHub and résumé remain available but visually secondary.

### Story

The light About section explains that Garren is an IT student who became interested not only in writing applications, but in the quieter work that keeps them reachable: packaging, deployment, service connections, logs, and recovery. It presents the portfolio as a record of learning through real systems across Azure, DigitalOcean, and Oracle Cloud.

Education, certifications, and location remain visible and unchanged.

### Now

Three cards replace the visible Skills cards in light mode:

- **Building:** JRU Atlas and LaborWise, with their current private-project status stated clearly.
- **Learning:** observability, reliable container delivery, and clearer operational documentation.
- **Improving:** turning deployment work into concise, sanitized case studies that can be shared responsibly.

Each card may include existing technology tags, but the copy leads with intent and progress rather than skill ranking.

### Field Notes and Project Stories

The light Projects area leads with three short field notes:

- **Moving a system, not just its files:** lessons from the JobBoard AWS-to-Azure deployment study, including separating application concerns from delivery and infrastructure decisions.
- **Showing private work responsibly:** documenting JRU Atlas and LaborWise through sanitized architecture and operational lessons without exposing private repositories or sensitive data.
- **Keeping a small service alive:** lessons from running the GitHub-to-Discord bot on Oracle Cloud with Podman, Quadlet, and Caddy.

Below the notes, a compact “Projects behind the notes” list retains the real project titles, status labels, repository links, dates, roles, and technology tags. This avoids duplicating every dark-mode card while keeping evidence close to the reflective writing.

### Contact

- Eyebrow: `Pull up a chair`
- Heading: `Say hello`
- Copy: `If you’re building something thoughtful, learning through a difficult system, or looking for someone who cares about the details behind deployment, I’d be glad to hear from you.`
- The form, validation, email address, GitHub link, and mailto behavior remain unchanged.

## Architecture

Theme-specific content uses explicit containers marked with `data-content-theme="dark"` or `data-content-theme="light"`. Shared factual elements such as education metadata, project status, external links, and the contact form stay single-source wherever practical.

JavaScript adds one `syncThemeContent(theme)` function. It runs after the saved theme is restored and after every toggle. For every themed content container, it sets the native `hidden` property according to the active theme. Hidden content is therefore removed from layout, keyboard navigation, and the accessibility tree.

Navigation keeps the same links and anchors. Only the label inside each link changes, preventing broken scrolling, duplicated section IDs, or history changes when the theme changes.

CSS may animate the incoming visible container with a short opacity transition. Content must remain immediately available when `prefers-reduced-motion: reduce` is active. Theme switching must not reset scroll position, form values, filter state, or the open mobile-menu state.

## Failure and Fallback Behavior

- Without JavaScript, dark content is visible by default and light-only content remains hidden. The site continues to function as the current professional portfolio.
- An unrecognized theme value falls back to dark content.
- Theme-specific controls do not receive focus while hidden because the native `hidden` attribute is used.
- A theme change during contact-form editing preserves all entered values because the form is shared rather than duplicated.

## Accessibility and Metadata

- Only one thematic version of each content region is exposed to assistive technology at a time.
- Section landmarks and heading levels remain logical in both modes.
- The page title, meta description, Open Graph content, résumé, and canonical professional identity remain theme-independent.
- Theme-toggle labeling continues to describe the action (`Switch to light mode` or `Switch to dark mode`), not the content persona.
- All new light-mode copy must use existing contrast tokens and responsive layout rules.

## Verification

- Static tests confirm both content variants exist, dark is the no-JavaScript default, and `syncThemeContent` uses the `hidden` property.
- Toggle tests confirm the correct navigation labels and section content are visible in each theme.
- Reload tests confirm the saved theme restores the matching content.
- Keyboard checks confirm hidden links and buttons cannot receive focus.
- Contact-form checks confirm entered values survive a theme change.
- Mobile checks confirm navigation labels update without wrapping or breaking menu layout.
