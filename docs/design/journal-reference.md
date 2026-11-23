# Journal reference implementation

The September reference applies to the light-mode Selected projects section. Existing project claims, URLs, dark content, and native disclosure/page-turn interactions remain authored in the static portfolio.

## Reference analysis

The generated composition uses a narrow left index (roughly one quarter of the content width), an open two-page book, a pale oak surface, and restrained corner props. Ivory paper (#f5f1e7), dark ink (#24251d), olive (#606239), and fine warm rules (#c5bdab) establish hierarchy. Instrument Serif headings contrast with Inter body copy. Selectors use short project names, descriptive subtitles, and an inset olive selection outline. Pages have generous margins, fine architecture diagrams, compact detail tables, and a separated takeaway. Page edges, a gutter, and a ribbon provide book depth.

The reference's generated project examples are visual guidance only. Implementation retains the actual Project Archive, JRU Atlas/LaborWise, and GitHub → Discord content and technology claims. On small screens, the notebook becomes a vertical reading flow. Long entries grow to fit their evidence rather than clipping the pages.

## Image generation

Both images were made using the built-in image generation tool with the user-supplied image as the composition reference. The design reference is `journal-reference.png`; the separately generated text-free background is `../../assets/journal-oak-desk.webp`. The latter was encoded as WebP with Sharp, without cropping.

Reference prompt: Generate one large readable desktop portfolio Selected projects section reference, faithfully adapting the attached journal on pale oak desk image. Preserve overhead flat lay composition, coffee upper left, olive branch upper right, pencil lower right, three cream paper selectors at left, large open cream notebook across right with two equal pages and olive ribbon, restrained realistic material depth. Refined editorial serif headings and readable dark sans body. Warm ivory paper, olive thin rules, ample padding. Preserve the attached composition closely. Use Project Archive as the selected entry, with The story, Under the hood, architecture, project details, technologies, and live application link.

Background prompt: Create a standalone photographic background asset for a website, landscape 1536x1024. Match attached reference's pale natural oak desk, soft morning daylight, overhead flat lay. Remove ALL notebook, selectors, paper cards, writing, text, UI, book and ribbon. Leave the entire central 80 percent empty uninterrupted pale fine-grained oak for live HTML content. Keep ONLY cropped ceramic black coffee cup and wood coaster at extreme top-left, natural olive branch along extreme top-right edge, slim dark olive pencil angled at extreme bottom-right, small brass paperclip at extreme bottom-left. No text anywhere, no notebook, no large shadows over center. Faithful photorealistic warm quiet material palette of attached reference. This is a newly generated standalone desk asset, not a crop.

## Validation

- All 20 focused journal tests pass.
- The full suite has seven pre-existing failures, reproduced against the files as they existed before this pass. They assert earlier project copy, horizontal selectors, old fixed layout rules, and sans-serif headings.
- Browser checks cover all three entries at 1440, 1024, 768, and 375 pixels, plus keyboard selection, reduced motion, and initial deep links.

## Notebook fidelity refinement

The notebook now uses a dedicated transparent photographic material (`../../assets/journal-open-book.webp`) under live HTML on desktop. This replaces the visibly flat CSS cover and page edge approximation. Outer page curvature, subtle grain, fine binding, and a straight woven ribbon come from the generated asset. The default spread follows the reference’s approximately 1.26:1 book proportions, with a small chapter number, wider serif headings, and reference-aligned text margins. Longer factual entries expand to fit. Mobile retains the readable native stacked pages.

Built-in image-generation prompt: Create a precise isolated asset of ONLY the open notebook in this reference. Transparent background. Match notebook 1:1: directly overhead, two blank warm ivory paper pages, very gently curved top and bottom edges near center fold, rounded outer corners, subtle fine paper grain, thin tightly stacked cream page edges, dark olive-brown cloth cover barely visible around perimeter, short straight olive woven ribbon extending down from center. Natural soft contact shadow. Remove ALL text, diagrams, lines, icons and printing from pages. Remove desk, cup, cards, branch and pencil entirely. The book should fill image with only 3 percent transparent safety margin at sides and top, 11 percent below for ribbon. Landscape aspect ratio approximately 1.18:1. No perspective tilt. Match original material and silhouette faithfully; not a stylized illustration. This is a new standalone notebook asset for overlaying live HTML text.

## Desk contact correction

The desk background is now `../../assets/journal-oak-desk-grounded.webp`. The pencil lies horizontally along the bottom-right margin, clear of the book. Two tight, low-offset alpha-following shadows beneath the book material add contact with the wood without producing a broad floating-card shadow.

Built-in image edit prompt: Edit this desk background. Preserve the pale oak surface, coffee at upper left, olive leaves at upper right, brass paperclip at lower left, lighting and exact overhead framing. Change ONLY the pencil: remove the current diagonal pencil entirely and restore matching uninterrupted wood beneath its former position. Place a short dark olive wooden pencil lying almost horizontally along the very bottom-right edge, from 73% to 96% of image width and centered at 97% image height. It must be fully confined to the bottom 5% of the image, so a notebook above it can lie flat on the desk without overlapping it. No other objects or text. Photorealistic matching natural contact shadow, no floating pencil.
