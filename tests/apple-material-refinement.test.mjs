import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');
const journalCss = readFileSync(new URL('../css/journal.css', import.meta.url), 'utf8');
const journalJs = readFileSync(new URL('../js/journal-flip.js', import.meta.url), 'utf8');

function mediaBlock(source, query) {
  const marker = `@media (${query})`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing ${marker}`);
  const open = source.indexOf('{', start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }
  assert.fail(`unterminated ${marker}`);
}

function cssRuleBlock(source, selector) {
  const marker = `${selector} {`;
  const start = source.indexOf(marker);
  assert.notEqual(start, -1, `missing ${selector}`);
  const open = source.indexOf('{', start);
  const close = source.indexOf('}', open);
  assert.notEqual(close, -1, `unterminated ${selector}`);
  return source.slice(open + 1, close);
}

test('uses panels for reading content and no liquid cursor effect', () => {
  assert.match(html, /class="skill-card panel cloud-priority"/);
  assert.match(html, /class="project-card panel/);
  assert.match(html, /class="contact-form-panel panel"/);
  assert.match(css, /\.panel\s*\{/);
  assert.doesNotMatch(html, /id="lg-svg-defs"/);
  assert.doesNotMatch(js, /LIQUID GLASS|rotateX\(|--mouse-x/);
});

test('keeps accessibility preference queries', () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)/);
  assert.match(css, /@media \(prefers-contrast: more\)/);
});

test('uses a restrained canvas particle field in the hero', () => {
  assert.match(html, /<canvas class="hero-particles" id="hero-particles" aria-hidden="true"><\/canvas>/);
  assert.match(css, /\.hero-particles\s*\{[\s\S]*?pointer-events:\s*none/);
  assert.match(js, /const MAX_FIELD_DRIFT = 10/);
  assert.match(js, /prefers-reduced-motion/);
  assert.doesNotMatch(html, /hero-atmosphere|hero-topology/);
});

test('defines a warm café light theme without changing the theme contract', () => {
  assert.match(css, /\[data-theme="light"\][\s\S]*?--clr-bg:\s*#f5ead8/);
  assert.match(css, /\[data-theme="light"\][\s\S]*?--clr-accent:\s*#748b67/);
  assert.match(css, /\.hero-field-note\s*\{/);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*?\.hero-field-note\s*\{\s*display:\s*none/);
  assert.match(js, /getComputedStyle\(document\.documentElement\)[\s\S]*?\.getPropertyValue\('--particle-rgb'\)/);
  assert.match(html, /<section id="home" class="hero-section cafe-workspace">/);
  assert.doesNotMatch(js, /isLightTheme\s*=|8,145,178/);
});

test('ships dark content as fallback and light workspace copy as an alternate view', () => {
  assert.match(html, /data-content-theme="dark"/);
  assert.match(html, /data-content-theme="light" hidden/);
  assert.match(html, /Cloud &amp; platform engineering/);
  assert.match(html, /I build and operate containerized backend systems/);
  assert.match(html, /<h2 class="section-title">Now<\/h2>/);
  assert.match(html, /Making repositories explain themselves/);
  assert.match(html, /Pull up a chair/);
});

test('synchronizes themed content without duplicating shared controls', () => {
  assert.match(js, /function syncThemeContent\(theme\)/);
  assert.match(js, /const normalizedTheme = theme === 'light' \? 'light' : 'dark'/);
  assert.match(js, /fragment\.hidden = fragment\.dataset\.contentTheme !== normalizedTheme/);
  assert.match(css, /\[hidden\]\s*\{\s*display:\s*none\s*!important/);
  assert.equal((html.match(/id="contact-form"/g) || []).length, 1);
  assert.equal((html.match(/id="current-work-grid"/g) || []).length, 1);
});

test('authors a native light-mode project notebook with both perspectives', () => {
  assert.match(html, /data-content-theme="light" hidden[\s\S]*?class="project-notebook"/);
  assert.equal((html.match(/class="project-entry"/g) || []).length, 5);
  assert.match(html, /<details class="project-entry"[^>]*name="portfolio-project"[^>]*open/);
  assert.equal((html.match(/<strong>The story<\/strong>/g) || []).length, 5);
  assert.equal((html.match(/<strong>Under the hood<\/strong>/g) || []).length, 5);
  assert.match(html, /Making repositories explain themselves/);
  assert.match(html, /Accreditation evidence, migrated to AWS/);
  assert.match(html, /Keeping a small cloud service alive/);
});

test('keeps the desk reference visual-only and preserves dark projects', () => {
  assert.doesNotMatch(html, /overhead-desk-project-notebook\.png/);
  assert.doesNotMatch(css, /overhead-desk-project-notebook\.png/);
  assert.match(html, /data-content-theme="dark"[\s\S]*?class="filter-bar"/);
  assert.match(html, /id="current-work-grid"/);
  assert.match(html, /id="filter-cloud"/);
});

test('defines accessible light notebook materials and optional enhancement', () => {
  assert.match(css, /--desk-wood:\s*#d8b98f/i);
  assert.match(css, /--paper:\s*#fff9ed/i);
  assert.match(css, /\.project-entry__cover:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.project-entry__cover/);
  assert.match(js, /function enhanceProjectNotebook\(root\)/);
  assert.doesNotMatch(html, /<summary[^>]*role="button"/);
});

test('deep-links notebook entries without competing with generic hash scrolling', () => {
  assert.match(journalJs, /entry\.addEventListener\('toggle', toggleHandler\)/);
  assert.match(journalJs, /locationRef\.hash\?\.startsWith\('#note-'\)/);
  assert.match(journalJs, /commitEntry\(linkedEntry, \{ updateHash: false \}\)/);
  assert.match(js, /const hash = this\.getAttribute\('href'\);\s*if \(hash\.startsWith\('#note-'\)\) return;/);
});

test('loads the journal controller before the main initializer', () => {
  assert.match(html, /<script src="js\/journal-flip\.js"><\/script>\s*<script src="js\/main\.js"><\/script>/);
  assert.match(js, /PortfolioJournal\.createJournalFlipController/);
  assert.match(journalJs, /function createJournalFlipController\(root, options = \{\}\)/);
});

test('creates an inert temporary leaf from real page content and cleans every exit path', () => {
  assert.match(journalJs, /leaf\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(journalJs, /leaf\.setAttribute\('inert', ''\)/);
  assert.match(journalJs, /leaf\.animate\(/);
  assert.match(journalJs, /clearActiveFlip/);
  assert.match(journalJs, /leaf\.remove\(\)/);
  assert.match(journalJs, /sourcePage\.cloneNode\(true\)/);
  assert.doesNotMatch(journalJs, /innerHTML\s*=/);
});

test('lays out the light notebook as an accessible responsive desk spread', () => {
  assert.match(css, /Instrument\+Serif/);
  assert.match(css, /\[data-theme="light"\]\s*#projects\s*\{[\s\S]*?linear-gradient\(135deg, var\(--desk-wood\), var\(--desk-wood-deep\)\)/);
  assert.match(css, /\.project-entry:not\(\[open\]\) \.project-entry__spread\s*\{\s*display:\s*none/);
  assert.match(css, /\.project-entry__spread\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\[data-theme="light"\]\s*#projects::before/);
  assert.match(css, /\[data-theme="light"\]\s*#projects::after/);
  const narrowSpread = mediaBlock(css, 'max-width: 74.99rem');
  assert.match(narrowSpread, /\.project-entry\s*>\s*\.project-entry__cover\s*\{[\s\S]*?position:\s*relative[\s\S]*?z-index:\s*2/);
  assert.match(narrowSpread, /\.project-entry__spread\s*\{[\s\S]*?position:\s*static/);
  const narrowNotebook = mediaBlock(css, 'max-width: 40rem');
  assert.match(narrowNotebook, /\.project-entry__spread\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(narrowNotebook, /\.project-entry__spread::before\s*\{\s*display:\s*none/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*?\.project-entry__spread/);
  assert.match(css, /@media \(prefers-contrast: more\)[\s\S]*?\.project-entry__spread/);
});

test('uses a sunlit paper wall behind the light workspace hero', () => {
  assert.match(css, /\[data-theme="light"\]\s*\.hero-section\.cafe-workspace\s*\{[\s\S]*?--hero-paper:\s*#fff8ea[\s\S]*?radial-gradient\(ellipse at 84% 12%[\s\S]*?repeating-linear-gradient\(/);
  assert.match(css, /\[data-theme="light"\]\s*\.hero-particles\s*\{\s*opacity:\s*0\.28/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*?\.hero-section\.cafe-workspace\s*\{\s*background:\s*var\(--hero-paper\)/);
});

test('replaces the light hero illustration with a current-focus field note', () => {
  assert.match(html, /data-content-theme="light" hidden[\s\S]*?<aside class="hero-field-note"[\s\S]*?Currently building[\s\S]*?Cloud \/ platform systems[\s\S]*?Azure[\s\S]*?Containers[\s\S]*?DevOps/);
  assert.match(css, /\.hero-field-note\s*\{[\s\S]*?background:\s*var\(--paper\)/);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*?\.hero-field-note\s*\{\s*display:\s*none/);
  assert.doesNotMatch(css, /linear-gradient\(#c5e0d7/);
});

test('authors one persistent decorative journal turn layer', () => {
  assert.equal((html.match(/class="project-notebook__workspace"/g) || []).length, 1);
  assert.equal((html.match(/class="project-journal__turn-layer" aria-hidden="true"/g) || []).length, 1);
  assert.match(html, /project-notebook__workspace[\s\S]*?project-notebook__index[\s\S]*?project-journal__turn-layer/);
});

test('keeps the reference book decorative behind authored content', () => {
  assert.match(css, /journal-open-book\.webp/);
  assert.doesNotMatch(html, /<img[^>]+journal-open-book/);
  assert.equal((html.match(/data-spread-title=/g) || []).length, 10);
});

test('cancels journal motion before hiding light content', () => {
  assert.match(js, /if \(next === 'dark'\) projectJournalController\?\.cancelForEnvironmentChange\(\)/);
  assert.match(js, /cancelForEnvironmentChange\(\);[\s\S]*?html\.setAttribute\('data-theme', next\)/);
});

test('defines explicit journal accessibility preference fallbacks', () => {
  assert.match(mediaBlock(css, 'prefers-reduced-motion: reduce'), /\.project-journal__turn-layer\s*\{\s*display:\s*none/);
  const reducedTransparency = mediaBlock(css, 'prefers-reduced-transparency: reduce');
  assert.match(reducedTransparency, /\.project-journal__leaf-face\s*\{[\s\S]*?opacity:\s*1\s*!important[\s\S]*?background:\s*var\(--paper\)/);
  assert.match(reducedTransparency, /\.project-journal__leaf\s*\{[\s\S]*?opacity:\s*1\s*!important/);
  assert.match(reducedTransparency, /\.project-architecture__node[\s\S]*?background:\s*var\(--paper\)/);
  assert.match(reducedTransparency, /\.project-entry__spread::before\s*\{[\s\S]*?filter:\s*none/);
  const increasedContrast = mediaBlock(css, 'prefers-contrast: more');
  assert.match(increasedContrast, /\.project-entry\[open\]\s*>\s*\.project-entry__cover\s*\{[\s\S]*?box-shadow:[\s\S]*?var\(--clr-text\)/);
  assert.match(increasedContrast, /\.project-entry__cover:focus-visible[\s\S]*?\.project-page\s*>\s*summary:focus-visible[\s\S]*?outline-color:\s*var\(--clr-text\)/);
  assert.match(increasedContrast, /\.project-page__content[\s\S]*?\.project-role\s*\{[\s\S]*?color:\s*var\(--clr-text\)/);
  assert.match(increasedContrast, /\.project-architecture__node[\s\S]*?border-color:\s*var\(--clr-text\)/);
  assert.match(increasedContrast, /\.project-technical-label[\s\S]*?color:\s*var\(--clr-text\)/);
  assert.match(increasedContrast, /\.project-journal__leaf-face\s*\{/);
  assert.match(mediaBlock(css, 'max-width: 74.99rem'), /\.project-journal__turn-layer\s*\{\s*display:\s*none/);
});

test('does not leak fictional visual-reference facts into shipped source', () => {
  const shippedSource = `${html}\n${css}\n${js}\n${journalJs}`;
  const fictionalTerms = [
    'GreenTrack',
    'CafeConnect',
    'ECS Fargate',
    'MongoDB Atlas',
    'CloudWatch',
    'Terraform',
    'your-username',
  ];

  fictionalTerms.forEach(term => {
    assert.equal(shippedSource.includes(term), false, `${term} must remain visual-reference-only`);
  });
});

test('authors a consistent semantic technical page for every journal note', () => {
  assert.equal((html.match(/<figure class="project-architecture/g) || []).length, 5);
  assert.equal((html.match(/<dl class="project-details">/g) || []).length, 4);
  assert.equal((html.match(/class="project-source(?:\s|\")/g) || []).length, 5);
  assert.equal((html.match(/class="project-technical-label"/g) || []).length >= 5, true);

  assert.match(html, /Vercel[\s\S]*?Azure[\s\S]*?Indexing[\s\S]*?Repository/);
  assert.match(html, /JRU Atlas[\s\S]*?Laravel[\s\S]*?FastAPI[\s\S]*?AWS/);
  assert.match(html, /LaborWise[\s\S]*?FastAPI[\s\S]*?Container Apps[\s\S]*?FAISS/);
  assert.match(html, /GitHub event[\s\S]*?Caddy HTTPS[\s\S]*?Podman bot[\s\S]*?Discord/);

  assert.match(html, /Private repository/);
  assert.match(html, /https:\/\/github\.com\/Acteus\/github-discord-bot/);
  assert.match(html, /Open Project Archive/);
  assert.doesNotMatch(html, /<table[\s>]/);
});

test('preserves all project facts across two authored spreads per entry', () => {
  for (const id of ['note-laborwise', 'note-jobboard', 'note-jru-atlas', 'note-project-archive', 'note-discord-bot']) {
    const entry = html.slice(html.indexOf(`id="${id}"`)).split('</li>\n')[0];
    assert.match(entry, /data-spread-title="Story &amp; architecture"/);
  }
  assert.equal((html.match(/data-spread-title="Details &amp; evidence"/g) || []).length, 4);
  assert.equal((html.match(/data-journal-position role="status"/g) || []).length, 5);
  assert.doesNotMatch(css, /:has\(#note-private-work\[open\]\)/);
});

test('keeps pagination optional and provides named previous and next controls', () => {
  assert.equal((html.match(/class="journal-pager"[^>]+hidden/g) || []).length, 5);
  assert.equal((html.match(/data-journal-prev aria-label="Previous spread/g) || []).length, 5);
  assert.equal((html.match(/data-journal-next aria-label="Next spread/g) || []).length, 5);
  assert.match(journalCss, /:not\(\.journal-paginated\)/);
});

test('uses editorial serif headings and sans-serif reading text', () => {
  assert.match(cssRuleBlock(css, '.project-entry__cover strong'), /font-family:\s*var\(--font-serif\)/);
  assert.match(cssRuleBlock(journalCss, '.project-notebook .project-page > summary'), /font-family:\s*var\(--font-serif\)/);
  assert.match(cssRuleBlock(css, '.project-page__content'), /font-family:\s*var\(--font-sans\)/);
});

test('renders real journal content on the moving paper instead of placeholder bars', () => {
  assert.match(css, /\.project-journal__leaf-page\s*\{[\s\S]*?height:\s*100%/);
  assert.doesNotMatch(css, /\.project-journal__leaf-line(?:\s|\{|--)/);
  assert.doesNotMatch(css, /\.project-journal__leaf-rule\s*\{/);
});

test('uses a typed technical-journal system for diagrams and metadata', () => {
  assert.match(css, /\.project-technical-label\s*\{[\s\S]*?font-family:\s*var\(--font-mono\)[\s\S]*?text-transform:\s*uppercase/);
  assert.match(css, /\.project-architecture\s*\{[\s\S]*?border-top:\s*1px solid var\(--paper-line\)/);
  assert.match(css, /\.project-architecture__flow\s*\{[\s\S]*?display:\s*flex/);
  assert.match(css, /\.project-architecture__node\s*\{[\s\S]*?border:\s*1px solid var\(--paper-edge\)/);
  assert.match(css, /\.project-architecture__boundary\s*\{[\s\S]*?border-style:\s*dashed/);
  assert.match(css, /\.project-details\s*\{[\s\S]*?grid-template-columns:\s*max-content minmax\(0, 1fr\)/);
  assert.match(css, /\.project-details dt\s*\{[\s\S]*?font-family:\s*var\(--font-mono\)/);

  const mobile = mediaBlock(css, 'max-width: 40rem');
  assert.match(mobile, /\.project-architecture__flow\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
  assert.match(mobile, /\.project-details\s*\{[\s\S]*?grid-template-columns:\s*1fr/);
});
