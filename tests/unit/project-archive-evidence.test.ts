import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Project Archive evidence', () => {
  it('records a full source commit and five audited claim groups', () => {
    const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));
    expect(audit.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(audit.claims).toHaveLength(5);
  });

  it('validates locally and skips the optional sibling repository when unavailable', () => {
    const output = execFileSync('node', ['scripts/audit-project-archive-evidence.mjs'], { encoding: 'utf8' });
    expect(output).toMatch(/Project Archive (evidence audit passed|sibling audit skipped)/);
  });

  it('maps operations evidence to the indexing, outbox, catalog, and owner sources it describes', () => {
    const spread = readFileSync('src/components/journal/CaseStudySpread.astro', 'utf8');
    expect(spread).toContain("'apps/api/src/project_archive/services/indexing.py'");
    expect(spread).toContain("'apps/api/src/project_archive/adapters/cosmos/outbox.py'");
    expect(spread).toContain("'apps/api/src/project_archive/services/catalog.py'");
    expect(spread).toContain("'apps/web/src/owner/OwnerApp.tsx'");
    expect(spread).toMatch(/operations:\s*\[[\s\S]*indexing\.py[\s\S]*outbox\.py/);
  });
});
