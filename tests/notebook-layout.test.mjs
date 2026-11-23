import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const css = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');

function rule(selector) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`^${escapedSelector}\\s*\\{([\\s\\S]*?)^\\}`, 'm'));
  assert.ok(match, `missing ${selector} rule`);
  return match[1];
}

test('keeps the open spread in the selector-relative coordinate system', () => {
  const spread = rule('.project-entry__spread');

  assert.match(spread, /top:\s*calc\(9rem - 12\.75rem\)/);
  assert.match(spread, /left:\s*calc\(100% \+ clamp\(2\.5rem, 4vw, 4rem\)\)/);
});

test('aligns the turn layer to the corrected spread origin', () => {
  const layer = rule('.project-journal__turn-layer');

  assert.match(layer, /top:\s*9rem/);
  assert.match(layer, /left:\s*calc\(clamp\(4rem, 11vw, 11rem\) \+ min\(19rem, 21vw\) \+ clamp\(2\.5rem, 4vw, 4rem\)\)/);
});
