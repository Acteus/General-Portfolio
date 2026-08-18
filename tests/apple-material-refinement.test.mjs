import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
const js = readFileSync(new URL('../js/main.js', import.meta.url), 'utf8');

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
  assert.match(css, /\.hero-section\.cafe-workspace::before/);
  assert.match(css, /@media \(max-width: 768px\)[\s\S]*?\.hero-section\.cafe-workspace::before/);
  assert.match(js, /getComputedStyle\(document\.documentElement\)[\s\S]*?\.getPropertyValue\('--particle-rgb'\)/);
  assert.match(html, /<section id="home" class="hero-section cafe-workspace">/);
  assert.doesNotMatch(js, /isLightTheme\s*=|8,145,178/);
});

test('ships dark content as fallback and light workspace copy as an alternate view', () => {
  assert.match(html, /data-content-theme="dark"/);
  assert.match(html, /data-content-theme="light" hidden/);
  assert.match(html, /Personal workspace · learning in public/);
  assert.match(html, /A quiet corner for the systems I’m building/);
  assert.match(html, /<h2 class="section-title">Now<\/h2>/);
  assert.match(html, /Moving a system, not just its files/);
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
  assert.equal((html.match(/class="project-entry"/g) || []).length, 3);
  assert.match(html, /<details class="project-entry"[^>]*name="portfolio-project"[^>]*open/);
  assert.equal((html.match(/<strong>The story<\/strong>/g) || []).length, 3);
  assert.equal((html.match(/<strong>Under the hood<\/strong>/g) || []).length, 3);
  assert.match(html, /Moving a system, not just its files/);
  assert.match(html, /Showing private work responsibly/);
  assert.match(html, /Keeping a small service alive/);
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
  assert.match(js, /entry\.addEventListener\('toggle', \(\) => \{[\s\S]*?history\.replaceState\(null, '', `#\$\{entry\.id\}`\);/);
  assert.match(js, /if \(!location\.hash\.startsWith\('#note-'\)\) return;/);
  assert.match(js, /linkedEntry instanceof HTMLDetailsElement/);
  assert.match(js, /const hash = this\.getAttribute\('href'\);\s*if \(hash\.startsWith\('#note-'\)\) return;/);
});

test('lays out the light notebook as an accessible responsive desk spread', () => {
  assert.match(css, /Instrument\+Serif/);
  assert.match(css, /\[data-theme="light"\]\s*#projects\s*\{[\s\S]*?linear-gradient\(135deg, var\(--desk-wood\), var\(--desk-wood-deep\)\)/);
  assert.match(css, /\.project-entry:not\(\[open\]\) \.project-entry__spread\s*\{\s*display:\s*none/);
  assert.match(css, /\.project-entry__spread\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /\[data-theme="light"\]\s*#projects::before/);
  assert.match(css, /\[data-theme="light"\]\s*#projects::after/);
  assert.match(css, /@media \(max-width: 56\.24rem\)[\s\S]*?\.project-entry__spread\s*\{[\s\S]*?position:\s*static/);
  assert.match(css, /@media \(max-width: 40rem\)[\s\S]*?\.project-entry__spread\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)[\s\S]*?\.project-entry__spread/);
  assert.match(css, /@media \(prefers-contrast: more\)[\s\S]*?\.project-entry__spread/);
});
