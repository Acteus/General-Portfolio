import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Project Archive evidence', () => {
  it('records a full source commit and five audited claim groups', () => {
    const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));
    expect(audit.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(audit.claims).toHaveLength(5);
  });

  it('passes the sibling repository audit', () => {
    expect(() => execFileSync('node', ['scripts/audit-project-archive-evidence.mjs'], { stdio: 'pipe' })).not.toThrow();
  });
});
