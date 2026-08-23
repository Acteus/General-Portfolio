import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Astro foundation', () => {
  it('is static and hydrates React only through the configured integration', () => {
    const config = readFileSync('astro.config.mjs', 'utf8');
    expect(config).toContain("output: 'static'");
    expect(config).toContain('integrations: [react()]');
    expect(config).not.toContain('@astrojs/vercel');
  });

  it('keeps the legacy portfolio as a non-shipping parity fixture', () => {
    expect(readFileSync('tests/fixtures/legacy-index.html', 'utf8')).toContain('Garren Dullas');
    expect(readFileSync('legacy/index.html', 'utf8')).toContain('note-jobboard');
  });

  it('has an Astro page with the existing public identity', () => {
    expect(readFileSync('src/pages/index.astro', 'utf8')).toContain('Garren Dullas');
  });
});
