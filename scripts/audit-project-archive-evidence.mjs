import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));

if (!/^[a-f0-9]{40}$/.test(audit.sourceCommit)) {
  throw new Error('Project Archive evidence requires a full commit SHA.');
}

const repository = process.env.PROJECT_ARCHIVE_REPO;
if (!repository) {
  console.log('Project Archive sibling audit skipped: PROJECT_ARCHIVE_REPO is not set; local evidence shape is valid.');
  process.exit(0);
}
if (!existsSync(repository)) {
  console.log(`Project Archive sibling audit skipped: PROJECT_ARCHIVE_REPO does not exist (${repository}); local evidence shape is valid.`);
  process.exit(0);
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
