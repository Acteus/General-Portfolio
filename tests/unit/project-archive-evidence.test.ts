import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { validateEvidence } from '../../scripts/project-archive-evidence-validation.mjs';

describe('Project Archive evidence', () => {
  it('records a full source commit and five audited claim groups', () => {
    const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));
    expect(audit.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(audit.claims).toHaveLength(5);
  });

  it('rejects malformed evidence shape before checking sibling repository paths', () => {
    expect(() => validateEvidence({ sourceCommit: 'not-a-sha', claims: [] })).toThrow(/full commit SHA/);
    expect(() => validateEvidence({ sourceCommit: 'a'.repeat(40), claims: [{ id: 'claim', paths: [] }] })).toThrow(/source paths/);
    expect(() => validateEvidence({ sourceCommit: 'a'.repeat(40), claims: [{ id: '', paths: ['file'] }] })).toThrow(/non-empty id/);
    expect(() => validateEvidence({ sourceCommit: 'a'.repeat(40), claims: [{ id: 'claim', paths: ['file'] }, { id: 'claim', paths: ['other'] }] })).toThrow(/unique/);
  });

  it('validates locally and skips the optional sibling repository when unavailable', () => {
    const output = execFileSync('node', ['scripts/audit-project-archive-evidence.mjs'], { encoding: 'utf8' });
    expect(output).toMatch(/Project Archive (evidence audit passed|sibling audit skipped)/);
  });

  it('maps operations evidence to the indexing, outbox, catalog, and owner sources it describes', () => {
    const spread = readFileSync('src/components/journal/CaseStudySpread.astro', 'utf8');
    const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));
    expect(spread).toContain('sourceClaims');
    expect(spread).toContain("bind('durable-indexing', 'apps/api/src/project_archive/services/indexing.py')");
    expect(spread).toContain("bind('durable-indexing', 'apps/api/src/project_archive/adapters/cosmos/outbox.py')");
    expect(spread).toContain("bind('safe-deletion', 'apps/api/src/project_archive/services/catalog.py')");
    expect(spread).toContain("bind('owner-safe-operations', 'apps/web/src/owner/OwnerApp.tsx')");
    expect(spread).toContain("bind('owner-safe-operations', 'docs/stability-operations.md')");
    expect(audit.claims.flatMap((claim: { paths: string[] }) => claim.paths)).toHaveLength(10);
  });
});
