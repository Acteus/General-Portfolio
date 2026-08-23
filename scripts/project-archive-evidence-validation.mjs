export function validateEvidence(audit) {
  if (!audit || typeof audit !== 'object') throw new Error('Project Archive evidence must be an object.');
  if (!/^[a-f0-9]{40}$/.test(audit.sourceCommit ?? '')) throw new Error('Project Archive evidence requires a full commit SHA.');
  if (!Array.isArray(audit.claims) || audit.claims.length === 0) throw new Error('Project Archive evidence requires a non-empty claims array.');
  const claimIds = new Set();
  for (const claim of audit.claims) {
    if (!claim || typeof claim !== 'object' || typeof claim.id !== 'string' || claim.id.trim().length === 0) {
      throw new Error('Every Project Archive claim requires a non-empty id.');
    }
    if (claimIds.has(claim.id)) throw new Error(`Project Archive claim ids must be unique: ${claim.id}.`);
    claimIds.add(claim.id);
    if (!Array.isArray(claim.paths) || claim.paths.length === 0 || claim.paths.some((path) => typeof path !== 'string' || path.trim().length === 0)) {
      throw new Error(`Project Archive claim ${claim.id} requires non-empty source paths.`);
    }
  }
}
