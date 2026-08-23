import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const repository = process.env.PROJECT_ARCHIVE_REPO
  ?? '/Users/gdullas/Desktop/Projects/Project-Repository';
const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));

if (!/^[a-f0-9]{40}$/.test(audit.sourceCommit)) {
  throw new Error('Project Archive evidence requires a full commit SHA.');
}

execFileSync('git', ['-C', repository, 'cat-file', '-e', `${audit.sourceCommit}^{commit}`]);
for (const claim of audit.claims) {
  if (!claim.id || !Array.isArray(claim.paths) || claim.paths.length === 0) {
    throw new Error('Every Project Archive claim requires an id and source paths.');
  }
  for (const path of claim.paths) {
    execFileSync('git', ['-C', repository, 'cat-file', '-e', `${audit.sourceCommit}:${path}`]);
  }
}

console.log('Project Archive evidence audit passed.');
