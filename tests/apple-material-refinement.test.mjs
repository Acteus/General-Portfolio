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
