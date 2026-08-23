import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('accessibility preference CSS contracts', () => {
  it('keeps reduced-transparency materials opaque and solid', () => {
    const css = readFileSync('src/styles/preferences.css', 'utf8');
    const block = css.match(/@media \(prefers-reduced-transparency: reduce\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(block).toContain('.journal-book, .evidence-artifact, .site-header');
    expect(block).toContain('background: var(--surface) !important');
    expect(block).toContain('backdrop-filter: none !important');
  });
});
