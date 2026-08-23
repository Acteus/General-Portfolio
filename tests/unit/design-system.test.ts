import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const tokens = readFileSync('src/styles/tokens.css', 'utf8');
const preferences = readFileSync('src/styles/preferences.css', 'utf8');
const base = readFileSync('src/styles/base.css', 'utf8');
const recruiter = readFileSync('src/styles/recruiter.css', 'utf8');
const layout = readFileSync('src/layouts/PortfolioLayout.astro', 'utf8');
const journalPortfolio = readFileSync('src/components/journal/JournalPortfolio.astro', 'utf8');

describe('Illuminated Notebook design system', () => {
  it('defines the approved palettes and type roles', () => {
    for (const value of ['#F5EEDF', '#E8D8BF', '#2E2924', '#6A4B37', '#53634C', '#C57A3A', '#15191A', '#222A29', '#F0E7D6', '#D18A46']) {
      expect(tokens).toContain(value);
    }
    expect(tokens).toContain("'Fraunces Variable'");
    expect(tokens).toContain("'IBM Plex Sans'");
    expect(tokens).toContain("'IBM Plex Mono'");
  });

  it('defines reduced motion, reduced transparency, and increased contrast', () => {
    expect(preferences).toContain('prefers-reduced-motion: reduce');
    expect(preferences).toContain('prefers-reduced-transparency: reduce');
    expect(preferences).toContain('prefers-contrast: more');
  });

  it('keeps status, responsive, and no-JavaScript contracts explicit', () => {
    expect(base).toContain('.status-label, .verified-link--pending');
    expect(base).toContain('overflow-wrap: anywhere');
    expect(recruiter).toContain('@media (max-width: 47.99rem)');
    expect(recruiter).not.toContain('recruiter-project--flagship { grid-column: 1 / -1; }');
    expect(layout).toContain('<html lang="en" data-theme="light" class="no-js">');
    expect(journalPortfolio).not.toContain("aria-current={index === 0 ? 'true' : undefined}");
  });
});
