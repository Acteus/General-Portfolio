# Task 4 Report: Preference, Theme, and Responsive Fallbacks

## Scope

Implemented only the Task 4 preference, theme, and responsive fallback contract for the single-leaf journal flip.

## Changes

- Added theme-switch cancellation in `js/main.js`: when switching to dark mode, the active journal controller is cancelled before the theme attribute and themed content are updated.
- Added reduced-motion fallback in `css/style.css` to hide the journal turn layer.
- Added reduced-transparency fallback for opaque paper leaf faces and an unfiltered journal gutter.
- Added increased-contrast fallback for stronger leaf-face borders/shadows and an opaque journal gutter.
- Preserved the existing narrow-screen fallback that hides the turn layer below `56.24rem`.
- Added static assertions covering cancellation ordering and all explicit journal fallbacks in `tests/apple-material-refinement.test.mjs`.

## Verification

Red phase:

```text
node --test tests/apple-material-refinement.test.mjs
17 passed, 2 failed (the two new fallback assertions)
```

Green phase:

```text
node --test tests/journal-flip.test.mjs tests/apple-material-refinement.test.mjs
23 passed, 0 failed
```

Also ran `git diff --check` successfully.

## Commit

`fix: honor journal motion and contrast preferences`

## Review Fixes

- Confirmed the reduced-transparency journal leaf and gutter declarations are in the explicit global `@media (prefers-reduced-transparency: reduce)` block; the narrow-screen block contains only its responsive turn-layer fallback, so desktop users are covered.
- Strengthened `tests/apple-material-refinement.test.mjs` with balanced media-block extraction and scoped assertions, preventing declarations from matching across unrelated media queries.

## Review-Fix Verification

Commit: `43e589c` (`test: scope journal preference fallback assertions`)

```text
node --test tests/journal-flip.test.mjs tests/apple-material-refinement.test.mjs
23 passed, 0 failed

git diff --check
passed
```

Concerns: none identified; the CSS behavior was already correct in the reviewed implementation, and this fix makes the scope contract enforceable by the static test.
