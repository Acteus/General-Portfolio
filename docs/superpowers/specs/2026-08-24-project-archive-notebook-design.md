# Project Archive Notebook Design

## Goal

Present Project Archive as the first, live flagship inside the portfolio's existing light-mode notebook while retaining the recovered static site and its dark-mode project list.

## Visual direction

The light-mode Projects section uses one decorative, responsive desk photograph beneath semantic HTML: three field-note selectors and an open paper spread. Warm timber, cream paper, deep ink, and muted olive are the only visual system. The surface stays open and editorial rather than becoming a dashboard.

## Interaction

Selecting a note responds immediately. On desktop, the notebook transitions from its displayed state with a short depth-aware page turn: perspective, page-edge shading, and cast shadow communicate material without continuously animating the background. The same selection works with keyboard controls. Reduced-motion and mobile users receive an immediate, stable content change.

## Flagship content

Project Archive is Field Note 01. Its spread explains the public archive, evidence conversation, Vercel frontend, Azure Container Apps API and worker, and links to the live application. It does not embed or duplicate the owner workspace.

## Performance and accessibility

The desk is a non-interactive local image loaded only in the light-mode Projects section. Motion changes only `transform` and `opacity`; filters, background movement, and animated blur are excluded. The photo is decorative, controls remain native summaries/links, focus is visible, and interactions work at reduced motion and narrow widths.
