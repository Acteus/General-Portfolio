import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
  getFlipDirection,
  getLeafFaces,
  shouldAnimateJournal,
} = require('../js/journal-flip.js');

test('maps later and earlier notes to symmetric turn directions', () => {
  assert.equal(getFlipDirection(0, 2), 'forward');
  assert.equal(getFlipDirection(2, 0), 'backward');
  assert.equal(getFlipDirection(1, 1), 'none');
});

test('animates only in a visible capable desktop light notebook', () => {
  const ready = {
    isDesktop: true,
    reducedMotion: false,
    supportsWAAPI: true,
    isLightTheme: true,
  };

  assert.equal(shouldAnimateJournal(ready), true);
  assert.equal(shouldAnimateJournal({ ...ready, isDesktop: false }), false);
  assert.equal(shouldAnimateJournal({ ...ready, reducedMotion: true }), false);
  assert.equal(shouldAnimateJournal({ ...ready, supportsWAAPI: false }), false);
  assert.equal(shouldAnimateJournal({ ...ready, isLightTheme: false }), false);
});

test('maps the moving leaf faces to the pages they physically reveal', () => {
  assert.deepEqual(getLeafFaces('forward'), {
    frontRole: 'technical',
    backRole: 'story',
  });
  assert.deepEqual(getLeafFaces('backward'), {
    frontRole: 'story',
    backRole: 'technical',
  });
});
