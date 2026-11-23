import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('renders the journal desk as live decorative layers instead of a bitmap', () => {
  assert.doesNotMatch(html, /class="project-notebook__desk"/);
  assert.match(html, /class="project-notebook__props" aria-hidden="true"/);
  assert.match(html, /journal-prop--coffee/);
  assert.match(html, /journal-prop--branch/);
  assert.match(html, /journal-prop--paperclip/);
  assert.match(html, /journal-prop--note/);
  assert.match(html, /journal-prop--pencil/);
});
