import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Astro foundation', () => {
  it('is static, includes the sitemap integration, and avoids server adapters', () => {
    const config = readFileSync('astro.config.mjs', 'utf8');
    expect(config).toContain("output: 'static'");
    expect(config).toContain("import sitemap from '@astrojs/sitemap';");
    expect(config).toContain('integrations: [react(), sitemap()]');
    expect(config).not.toContain('@astrojs/vercel');
  });

  it('keeps the legacy portfolio as a non-shipping parity fixture', () => {
    expect(readFileSync('tests/fixtures/legacy-index.html', 'utf8')).toContain('Garren Dullas');
    expect(readFileSync('tests/fixtures/legacy-facts.json', 'utf8')).toContain('JobBoard-DevOps');
  });

  it('has an Astro page with the existing public identity', () => {
    expect(readFileSync('src/pages/index.astro', 'utf8')).toContain('Garren Dullas');
  });
});
