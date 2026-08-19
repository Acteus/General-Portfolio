import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import test from 'node:test';

const require = createRequire(import.meta.url);
const {
  createJournalFlipController,
  getFlipDirection,
  getLeafFaces,
  shouldAnimateJournal,
} = require('../js/journal-flip.js');

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, handler) {
    const handlers = this.listeners.get(type) || new Set();
    handlers.add(handler);
    this.listeners.set(type, handlers);
  }

  removeEventListener(type, handler) {
    this.listeners.get(type)?.delete(handler);
  }

  dispatch(type, event = {}) {
    this.listeners.get(type)?.forEach(handler => handler({
      preventDefault() { this.defaultPrevented = true; },
      ...event,
      type,
      target: this,
    }));
  }
}

class FakeNode extends FakeEventTarget {
  constructor(documentRef, className = '') {
    super();
    this.ownerDocument = documentRef;
    this.className = className;
    this.classList = {
      values: new Set(className.split(/\s+/).filter(Boolean)),
      add: (...values) => values.forEach(value => this.classList.values.add(value)),
      remove: (...values) => values.forEach(value => this.classList.values.delete(value)),
      contains: value => this.classList.values.has(value),
    };
    this.children = [];
    this.parentNode = null;
    this.style = {
      values: new Map(),
      setProperty: (name, value) => this.style.values.set(name, value),
      removeProperty: name => this.style.values.delete(name),
    };
    this.dataset = {};
    this.attributes = new Map();
    this.textContent = '';
    this.open = false;
    this.id = '';
    this.removed = false;
  }

  append(...nodes) {
    nodes.forEach(node => {
      node.parentNode = this;
      this.children.push(node);
    });
  }

  remove() {
    this.removed = true;
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter(child => child !== this);
    this.parentNode = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  removeAttribute(name) {
    this.attributes.delete(name);
  }

  getBoundingClientRect() {
    return { height: 320 };
  }

  querySelector(selector) {
    if (selector === '.project-entry__spread') return this.spread || null;
    if (selector === ':scope > .project-entry__cover') return this.cover || null;
    const pageMatch = selector.match(/^\.project-page--(story|technical) summary strong$/);
    if (pageMatch) return this.labels?.[pageMatch[1]] || null;
    return null;
  }

  querySelectorAll(selector) {
    if (selector === '.project-entry') return this.entries || [];
    return [];
  }
}

function makeFakeJournal({
  initialIndex = 0,
  animationThrows = false,
  setupThrows = false,
  hash = '',
} = {}) {
  let createCount = 0;
  const documentRef = {
    documentElement: { dataset: { theme: 'light' } },
    createElement() {
      createCount += 1;
      if (setupThrows && createCount > 1) throw new Error('leaf setup failed');
      const node = new FakeNode(documentRef);
      node.animate = () => {
        if (animationThrows) throw new Error('animation failed');
        let resolveFinished;
        const finished = new Promise(resolve => { resolveFinished = resolve; });
        const animation = {
          cancelCalls: 0,
          cancel() { this.cancelCalls += 1; },
          finished,
          finish() { resolveFinished(); },
        };
        node.animation = animation;
        return animation;
      };
      return node;
    },
  };
  const root = new FakeNode(documentRef);
  const layer = new FakeNode(documentRef, 'project-journal__turn-layer');
  root.layer = layer;
  root.querySelector = selector => selector === '.project-journal__turn-layer' ? layer : null;
  root.classList = {
    values: new Set(),
    add(value) { this.values.add(value); },
    remove(value) { this.values.delete(value); },
    contains(value) { return this.values.has(value); },
  };

  const entries = [0, 1, 2].map(index => {
    const entry = new FakeNode(documentRef, 'project-entry');
    entry.id = `note-${index + 1}`;
    entry.cover = new FakeNode(documentRef, 'project-entry__cover');
    entry.spread = new FakeNode(documentRef, 'project-entry__spread');
    entry.labels = {
      story: Object.assign(new FakeNode(documentRef), { textContent: `Story ${index + 1}` }),
      technical: Object.assign(new FakeNode(documentRef), { textContent: `Technical ${index + 1}` }),
    };
    entry.open = index === initialIndex;
    return entry;
  });
  root.entries = entries;
  root.querySelectorAll = selector => selector === '.project-entry' ? entries : [];

  const desktopMedia = new FakeEventTarget();
  desktopMedia.matches = true;
  const motionMedia = new FakeEventTarget();
  motionMedia.matches = false;
  const frameQueue = new Map();
  let frameId = 0;
  const timers = new Map();
  let timerId = 0;
  const history = { calls: [], replaceState(_state, _title, url) { this.calls.push(url); } };
  const location = { hash };
  const controller = createJournalFlipController(root, {
    desktopMedia,
    motionMedia,
    history,
    location,
    getTheme: () => documentRef.documentElement.dataset.theme,
    requestFrame(callback) {
      const id = ++frameId;
      frameQueue.set(id, callback);
      return id;
    },
    cancelFrame(id) { frameQueue.delete(id); },
    setTimeout(callback) {
      const id = ++timerId;
      timers.set(id, callback);
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
  });

  return {
    controller,
    documentRef,
    desktopMedia,
    motionMedia,
    entries,
    layer,
    root,
    history,
    location,
    flushFrame() {
      const next = frameQueue.entries().next().value;
      if (!next) return;
      frameQueue.delete(next[0]);
      next[1]();
    },
    flushTimer() {
      const next = timers.entries().next().value;
      if (!next) return;
      timers.delete(next[0]);
      next[1]();
    },
  };
}

function clickCover(journal, index) {
  journal.entries[index].cover.dispatch('click');
}

function openIndex(journal) {
  return journal.entries.findIndex(entry => entry.open);
}

function assertExactlyOneOpen(journal) {
  assert.equal(journal.entries.filter(entry => entry.open).length, 1);
}

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

test('exports the controller factory without requiring a browser DOM', () => {
  assert.equal(typeof createJournalFlipController, 'function');
});

test('commits the destination at midpoint, updates hash then, and cleans the leaf on finish', async () => {
  const journal = makeFakeJournal();
  clickCover(journal, 1);
  journal.flushFrame();
  assert.equal(openIndex(journal), 0);
  assert.equal(journal.history.calls.length, 0);
  assert.equal(journal.layer.children.length, 1);

  journal.flushTimer();
  assert.equal(openIndex(journal), 1);
  assert.deepEqual(journal.history.calls, ['#note-2']);
  assertExactlyOneOpen(journal);

  journal.layer.children[0].animation.finish();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(journal.layer.children.length, 0);
  assert.equal(journal.root.classList.contains('is-turning'), false);
});

test('interrupts before midpoint from the stable entry and latest destination wins', () => {
  const journal = makeFakeJournal();
  clickCover(journal, 1);
  journal.flushFrame();
  clickCover(journal, 2);
  journal.flushFrame();
  assert.equal(openIndex(journal), 0);
  assert.equal(journal.layer.children.length, 1);
  journal.flushTimer();
  assert.equal(openIndex(journal), 2);
  assertExactlyOneOpen(journal);
});

test('interrupts after midpoint from the newly committed stable entry', () => {
  const journal = makeFakeJournal();
  clickCover(journal, 1);
  journal.flushFrame();
  journal.flushTimer();
  clickCover(journal, 2);
  journal.flushFrame();
  assert.equal(openIndex(journal), 1);
  journal.flushTimer();
  assert.equal(openIndex(journal), 2);
  assertExactlyOneOpen(journal);
});

test('latest current selection cancels a pending turn without leaving requested state', () => {
  const journal = makeFakeJournal();
  clickCover(journal, 2);
  clickCover(journal, 0);
  journal.flushFrame();
  assert.equal(openIndex(journal), 0);
  assert.equal(journal.layer.children.length, 0);
  assert.equal(journal.root.classList.contains('is-turning'), false);
  assertExactlyOneOpen(journal);
});

test('latest current selection after midpoint cancels the in-flight turn and preserves it', () => {
  const journal = makeFakeJournal();
  clickCover(journal, 2);
  journal.flushFrame();
  journal.flushTimer();
  clickCover(journal, 2);
  journal.flushFrame();
  assert.equal(openIndex(journal), 2);
  assert.equal(journal.layer.children.length, 0);
  assertExactlyOneOpen(journal);
});

test('cancels and commits the requested entry when the environment can no longer animate', () => {
  for (const change of [
    journal => { journal.desktopMedia.matches = false; journal.desktopMedia.dispatch('change'); },
    journal => { journal.motionMedia.matches = true; journal.motionMedia.dispatch('change'); },
    journal => {
      journal.documentRef.documentElement.dataset.theme = 'dark';
      journal.desktopMedia.dispatch('change');
    },
  ]) {
    const journal = makeFakeJournal();
    clickCover(journal, 1);
    journal.flushFrame();
    change(journal);
    assert.equal(openIndex(journal), 1);
    assert.equal(journal.layer.children.length, 0);
    assertExactlyOneOpen(journal);
  }
});

test('opens a deep-linked entry without an arrival flip or hash write', () => {
  const linked = makeFakeJournal({ hash: '#note-3' });
  assert.equal(openIndex(linked), 2);
  assert.equal(linked.history.calls.length, 0);
  assert.equal(linked.layer.children.length, 0);
});

test('commits immediately and leaves no partial state when setup or animation throws', () => {
  for (const options of [{ setupThrows: true }, { animationThrows: true }]) {
    const journal = makeFakeJournal(options);
    clickCover(journal, 1);
    journal.flushFrame();
    assert.equal(openIndex(journal), 1);
    assert.equal(journal.layer.children.length, 0);
    assert.equal(journal.root.classList.contains('is-turning'), false);
    assertExactlyOneOpen(journal);
  }
});
