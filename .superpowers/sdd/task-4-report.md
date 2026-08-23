# Task 4 Report: Interruptible journal island and Project Archive flagship

## Scope completed

- Added the typed `JournalState` reducer and one `client:load` React/Motion island.
- Added interruptible chapter/spread navigation, stale-request cancellation, inert temporary leaves, keyboard focus handling, live status announcements, media/theme/reduced-motion cleanup, and browser history restoration.
- Added five semantic Project Archive spreads with source-path captions and audited source commit `7b61ab2d4a9b62210684d08de35ed1e313d0e95c`.
- Added evidence, architecture, operations, and live-doorway artifacts plus the audited source-to-index SVG.
- Added the sibling-repository audit script and focused unit/E2E coverage.
- Corrected the Astro inline theme bootstrap so JavaScript enhancement actually removes `no-js`; preserved a semantic no-query fallback with all journal chapters readable/open.

## Evidence gate

The referenced Project Archive redesign task is still active and has not been reviewed. No product screenshots were captured or added. The three requested WebP files are intentionally absent. The flagship uses source-backed path, architecture, citation, operations, and status artifacts only. `LiveProjectDoorway.astro` requires both deployment and interface-review checks and currently renders exactly: `Project Archive is in active development; the public doorway is not being linked yet.`

The evidence audit records the current sibling repository HEAD and verifies every approved path at that commit:

```text
7b61ab2d4a9b62210684d08de35ed1e313d0e95c
Project Archive evidence audit passed.
```

## Verification

```text
ASTRO_TELEMETRY_DISABLED=1 npm run check
0 errors, 0 warnings, 0 hints

ASTRO_TELEMETRY_DISABLED=1 npm run build
static build succeeded; 1 page generated

ASTRO_TELEMETRY_DISABLED=1 npm run test
16 Vitest unit tests passed; 42 legacy node tests passed

node scripts/audit-project-archive-evidence.mjs
passed

npm run test:e2e -- parity responsive journal --project=chromium
13 passed

npm run test:e2e -- journal --project=chromium
7 passed (including rapid A→B→Back, keyboard focus, theme cancellation, and direct-spread clone regressions)
```

The local preview server required the approved local-listener escalation because sandbox binding returned `EPERM`; no external deployment or repository mutation occurred.

## Commit

`c099e22` — `feat: add Project Archive journal flagship`

Follow-up review fix: `f1083ac` — `fix: close Task 4 journal review findings`

## Concerns / follow-up

- Capture evidence remains blocked until the referenced redesign task reports reviewed implementation and green production build.
- History reserves only a same-URL committed-state guard while a turn is pending; destination entries are pushed after commit. Rapid A→B→Back therefore restores the last committed state without A/B destination entries.
- Requested turning state is assigned to the controller ref immediately; preference changes cancel that request, stop Motion, and remove the leaf before restoring the committed root. Destination headings use `tabindex="-1"` and receive focus only for keyboard navigation.
- Direct spread turns clone the currently visible committed spread, and operations captions now distinguish indexing/outbox delivery from catalog deletion and owner recovery.
- The pre-existing modified `docs/design-references/overhead-desk-project-notebook.png` was not touched.
