import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');

test('builds book depth from cover, stacked page edges, and a center ribbon', () => {
  assert.match(css, /\.project-entry__spread::after[\s\S]*?--journal-cover/);
  assert.match(css, /\.project-page--story::after[\s\S]*?repeating-linear-gradient/);
  assert.match(css, /\.project-page--technical::after[\s\S]*?repeating-linear-gradient/);
  assert.match(css, /\.project-entry__spread \.project-journal__bookmark/);
});
