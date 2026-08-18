# Café Workspace Theme Design

## Goal

Personalize the portfolio through two intentional visual modes while preserving its cloud and platform-engineering focus. Dark mode remains a cool technical workspace; light mode becomes a warm, clean café workspace that evokes coffee, morning light, and a calm place to work.

## Scope

- Keep all existing content, navigation, filtering, contact behavior, and saved theme preference.
- Refine the shared theme tokens and theme-specific component styling.
- Add an optional decorative light-mode hero scene built only with CSS.
- Tune the existing particle field so each mode uses an appropriate palette.
- Preserve responsive layout and motion/accessibility preferences.

The work does not add pages, change project claims, introduce external images, or alter the portfolio information architecture.

## Visual Direction

### Dark: Build Mode

- Retain the near-black background, cyan signal color, concise sans/mono typography, and ambient particle network.
- Continue using cyan for meaningful interaction, focus, active state, and technical status emphasis.
- Maintain the existing higher-contrast, systems-oriented personality.

### Light: Café Workspace

- Replace neutral gray surfaces with a warm ivory/paper background.
- Use cocoa-brown primary text, softer warm-brown secondary text, and low-contrast cream panels.
- Use soft sage green as the supporting accent for interactive and selected states. It should be present in small, deliberate cues rather than large fills.
- Use warm sunlit-tan details sparingly as an atmospheric complement, not as a second competing accent.
- The hero may include a CSS-only, `aria-hidden` vignette such as a small window, a leafy plant, and a coffee cup. It appears only at layouts where it has enough room and does not obstruct copy or actions.

## Components and Behavior

1. The existing `data-theme` attribute remains the single source for theme styling. No duplicate markup or parallel layouts are introduced.
2. Shared CSS tokens provide semantic colors for background, surface, text, border, accent, focus, and decorative elements. The light theme overrides the semantic values; individual components consume tokens rather than hard-coded light colors.
3. The theme toggle continues to save the setting in `localStorage` and updates its label/icon. Its focus ring and hover styles inherit the active theme accent.
4. Navigation, panels, project filters, buttons, tags, forms, and scrollbar styling inherit the new warm/sage palette in light mode. Existing dark-mode behavior remains intact.
5. The hero particle field keeps its current movement and reduced-motion behavior. Its light-theme color becomes a restrained sage/teal tone that remains visible against ivory without competing with the hero vignette.

## Accessibility and Responsive Rules

- All actionable text, focus rings, and selected states must maintain clear contrast in both modes.
- Decorative hero elements are non-interactive and hidden from assistive technologies.
- The light-mode illustration is reduced or hidden on narrow layouts before it crowds the hero copy.
- `prefers-reduced-motion` continues to remove particle motion and nonessential animation.
- Existing `prefers-reduced-transparency` and `prefers-contrast: more` support remains in place.

## Verification

- Static checks confirm the existing dark/light persistence and required preference queries remain present.
- Add coverage for light-theme café tokens and the decorative element's assistive-technology treatment.
- Inspect the site at desktop and mobile widths in both modes.
- Confirm keyboard focus, theme changes, project filtering, and mobile navigation continue to work.
