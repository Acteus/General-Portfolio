import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { validateEvidence } from './project-archive-evidence-validation.mjs';

const audit = JSON.parse(readFileSync('src/data/project-archive-evidence.json', 'utf8'));
validateEvidence(audit);

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
  for (const path of claim.paths) {
    execFileSync('git', ['-C', repository, 'cat-file', '-e', `${audit.sourceCommit}:${path}`]);
  }
}

console.log('Project Archive evidence audit passed.');
