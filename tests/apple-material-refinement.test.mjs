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
