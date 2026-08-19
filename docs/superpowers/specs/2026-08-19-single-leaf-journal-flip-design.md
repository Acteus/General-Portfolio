# Single-Leaf Journal Flip Design

## Goal

Replace the light-mode project spread’s flat paper-panel feeling with a convincing open journal. When a visitor selects another field note, one paper leaf turns across the center seam while the journal itself stays planted. The interaction must feel calm, physical, readable, and native to the existing overhead-desk art direction.

The selected direction is **A — Single leaf turn** from the visual comparison. The journal remains a stable object; only the turning leaf moves.

## Scope

### In scope

- Refine the existing two-page project spread into a bound journal with a visible spine, curved page edges, layered paper, and grounded contact shadows.
- Animate project changes as one right-hand leaf turning from right to left for a later field note and from left to right for an earlier field note.
- Preserve all verified project content, repository links, note covers, theme behavior, and deep links.
- Keep the native `<details>` experience as the no-JavaScript and narrow-screen fallback.
- Provide immediate press feedback, keyboard operation, interruption-safe project selection, and reduced-motion, reduced-transparency, and increased-contrast treatments.
- Extend the existing notebook design tokens instead of creating an unrelated visual system.

### Out of scope

- Rewriting project copy or adding new project claims.
- Drag-to-turn, swipe gestures, sound, haptics, or freeform paper movement.
- Adding a framework, animation dependency, image asset, or build step.
- Changing the dark-mode project cards or filters.
- Simulating a book cover opening or animating multiple loose sheets.

## Experience

### Desktop

At `56.25rem` and wider, the three note covers remain in the left index and one open journal occupies the right stage. The journal has two readable pages, a stitched-looking center gutter, slight page curvature, visible stacked edges, and a warm shadow that grounds it on the desk.

Selecting another cover gives instant pressed feedback. The journal does not translate, scale, or rotate. A single leaf rotates around the center gutter in 3D:

- Moving to a later note turns the right leaf toward the left.
- Moving to an earlier note mirrors the same path from left to right.
- The front of the moving leaf carries a restrained impression of the outgoing page.
- The back carries a restrained impression of the incoming page.
- Incoming content is committed at the midpoint, while the leaf visually covers the seam.
- The selected cover and URL hash update with the committed project.

The full turn should settle in approximately `520–620ms`. It uses a calm, no-bounce response and keeps the turning surface slightly translucent at its fastest point to reduce visual strobing. Only `transform`, `opacity`, and shadow intensity animate.

### Rapid reselection

Project covers remain operable during the turn. If another project is selected before the current leaf settles, the controller cancels the decorative leaf, commits the most recently requested project from the current stable spread, and begins a fresh turn on the next animation frame. This avoids an input lock or a queue of stale turns. The journal must never be left between projects or with two entries marked current.

### Tablet and mobile

Below `56.25rem`, retain the existing document-flow layout. Below `40rem`, retain native outer and inner disclosures. Do not use a large 3D page turn when the journal pages are stacked vertically; selection changes use an opacity-only content change of at most `150ms`, or no animation.

## Architecture

### Authored HTML remains the source of truth

Each `.project-entry` continues to own its cover and `.project-entry__spread` content. The first entry remains open in authored HTML. Without JavaScript, named `<details>` groups provide the same readable and keyboard-operable fallback that exists today.

Add only a decorative journal stage layer inside `.project-notebook`:

```html
<div class="project-journal__turn-layer" aria-hidden="true"></div>
```

JavaScript creates the temporary turning leaf inside this layer only while a transition is active. The leaf is always `aria-hidden`, never contains focusable elements, and is removed when the turn finishes or is cancelled. The actual incoming spread remains the accessible content.

### `JournalFlipController`

Extend `enhanceProjectNotebook(root)` with a small controller responsible for:

1. Discovering entries and their cover summaries.
2. Tracking the currently open entry and most recently requested entry.
3. Determining direction from source and destination indices.
4. Building an `aria-hidden` two-faced decorative leaf from non-interactive text impressions of the outgoing and incoming pages.
5. Running the leaf with the Web Animations API so its current animation can be cancelled cleanly.
6. Committing exactly one native `<details>` entry at the turn midpoint.
7. Removing transient classes and the leaf on finish or cancellation.
8. Updating the deep link only after the destination is committed.

The controller intercepts activation only when all of these are true:

- the light-mode notebook is enhanced;
- the viewport is at least `56.25rem` wide;
- reduced motion is not requested;
- the destination is different from the active entry.

Otherwise, native `<details>` behavior remains in charge.

Do not duplicate repository links, IDs, roles, or accessible page content in the decorative leaf. Its face impressions may contain only cloned plain text headings and non-interactive line shapes.

## Component and State Contract

### Stable journal

`.project-entry__spread` becomes the journal base. New pseudo-elements supply:

- a narrow darkened gutter and highlight at the seam;
- asymmetric page gradients that curve into the binding;
- two or three offset paper-edge layers under the spread;
- a restrained contact shadow below the journal;
- subtle outer-page corner radii, with square inner corners at the binding.

The spread must remain legible without these decorative layers.

### Turning leaf

The generated `.project-journal__leaf` has front and back faces with `backface-visibility: hidden`, `transform-style: preserve-3d`, and a transform origin at the journal gutter. Direction is represented by a modifier or `data-direction` value rather than separate duplicated components.

The flip controller uses these states:

- `idle`: one entry is open; no decorative leaf exists.
- `turning`: the leaf exists and an animation is active.
- `committed`: the destination entry is open and the hash/current cover are synchronized.
- `cancelled`: transient DOM and classes are removed before a replacement selection begins.

All cleanup paths return to `idle`.

## Visual System

Continue the current ivory, brown, and sage palette. Add semantic tokens under light mode for the binding and page depth, for example:

```css
--journal-binding: #6d5039;
--journal-gutter: rgba(74, 48, 31, 0.22);
--journal-page-highlight: rgba(255, 255, 255, 0.72);
--journal-page-depth: rgba(98, 66, 42, 0.16);
--journal-turn-shadow: rgba(54, 35, 22, 0.28);
```

`Instrument Serif` remains the editorial display face, the existing sans face remains body copy, and `DM Mono` remains metadata. Headings keep tight optical tracking and body text keeps comfortable leading.

The journal must not introduce leather textures, photorealistic image backgrounds, torn edges, ruled paper, excessive grain, or skeuomorphic controls. Material realism comes from shape, light, seam, paper thickness, and motion.

## Accessibility and Preferences

- Native summaries retain their current Enter/Space behavior and minimum 44px target size.
- The committed entry is still represented by its native `open` state, visible outline, straightened cover, and current deep link.
- The turning leaf is `aria-hidden` and contains no actionable descendants.
- Focus stays on the activated cover summary throughout a turn.
- With `prefers-reduced-motion: reduce`, do not create the turning leaf; commit immediately and use a short opacity change at most.
- With `prefers-reduced-transparency: reduce`, use solid page faces and remove any translucency at the flip midpoint.
- With `prefers-contrast: more`, strengthen page boundaries, gutter, focus rings, selected-cover outline, and text contrast.
- At 400% zoom or below `56.25rem`, use the stacked native layout and avoid horizontal page overflow.

## Failure and Fallback Behavior

- Without JavaScript or without Web Animations API support, native disclosure switching works with no flip.
- If a decorative leaf cannot be created, commit the destination immediately and update the hash.
- If an animation is cancelled, remove transient DOM and leave exactly one stable entry open before processing a replacement selection.
- If a deep-linked entry is requested at load, open it without playing an arrival flip.
- If the viewport crosses below the desktop breakpoint during a turn, cancel the leaf, commit the requested destination, and return to native flow.
- Theme switching preserves the active project; no turn plays while the light notebook is hidden.

## Verification

### Static tests

- Existing notebook content, project facts, links, theme fragments, and no-generated-fact leak checks remain green.
- The journal stage is decorative and `aria-hidden`.
- CSS defines journal binding/page-depth tokens, stable spread layers, a two-faced leaf, `backface-visibility`, and directional transform origins.
- JavaScript contains one bounded flip controller, cleans up on finish/cancel, and does not add manual button roles to summaries.
- Reduced-motion, reduced-transparency, and increased-contrast rules include the new journal layers.

### Browser checks

- At 1440px in light mode, selecting note 01 → 02 → 03 turns left; 03 → 02 → 01 mirrors right.
- The journal base stays visually planted while the leaf moves.
- Rapidly select all three covers and confirm the latest choice wins, focus remains stable, and one entry is open.
- Activate every cover with pointer, Enter, and Space.
- Deep-link directly to every note and confirm no arrival flip.
- Resize through `56.25rem` during a turn and confirm clean fallback.
- At 768px and 375px, verify native disclosures, no large 3D motion, no horizontal overflow, and readable page content.
- Verify reduced motion, reduced transparency, and increased contrast in light mode.
- Verify dark-mode projects and filters are unchanged.

## Design Skills Applied

- `apple-design`: stable spatial origin, immediate press feedback, symmetric paths, cancellable animation, compositor-friendly properties, and accessibility preferences.
- `design-system`: semantic journal tokens, consistent typography and accent use, and component-state consistency.
- `frontend-design`: a memorable editorial journal metaphor executed through restrained material craft rather than generic card styling.
- `ckm:design`: integration with the existing brand palette, typography roles, and tokenized visual system.
