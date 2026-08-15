# Apple Material Refinement

## Goal

Refine the existing cloud-engineering portfolio into a calm, precise interface whose floating material communicates navigation and action hierarchy without turning every content block into glass.

## Direction

- Keep translucent, blurred material for the fixed navigation and mobile navigation sheet: these are floating controls over page content.
- Convert skills, projects, and contact content panels to quiet, mostly solid surfaces with a small elevation and a consistent border. These are reading surfaces, not floating chrome.
- Preserve the cyan accent for primary actions, focus, and meaningful status only.
- Remove mouse-tracking card tilt, cursor-driven highlights, and the unused SVG liquid-refraction definitions. Hover remains a subtle border/elevation response and pressing remains immediate.
- Shorten initial content entrance motion and make it opacity-first. The layout must not depend on animation to be understood.

## Interaction and accessibility

- Buttons and filters retain their current immediate `:active` scale response.
- Links and controls retain visible keyboard focus.
- `prefers-reduced-motion` replaces entrance movement with an immediate/static presentation and disables nonessential transitions.
- `prefers-reduced-transparency` changes floating material to opaque surfaces, while `prefers-contrast: more` retains strong borders.

## Implementation

1. Introduce separate surface tokens for content cards and use them through a new panel class in the existing markup.
2. Keep `.glass` exclusively for floating material and remove decorative pseudo-element shimmer from content cards.
3. Remove unused liquid-glass SVG definitions and all related JavaScript pointer-tracking logic.
4. Reduce entrance durations to 360ms and use a small opacity/fade transition instead of theatrical translated reveals.
5. Add a lightweight static verification script that checks the intended material boundaries and removed interaction hooks.

## Verification

- The static check must fail before the cleanup because legacy card-tilt and liquid-refraction hooks remain.
- After the change it must confirm that the unused hooks are absent, navigation remains materialized, and reduced-preference media queries remain present.
- A CSS syntax parse will be run after the stylesheet update.
