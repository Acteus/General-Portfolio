import { readFileSync, readdirSync } from 'node:fs';

const legacy = readFileSync('tests/fixtures/legacy-index.html', 'utf8');
const fixture = JSON.parse(readFileSync('tests/fixtures/legacy-facts.json', 'utf8'));
const records = readdirSync('src/data/projects')
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(`src/data/projects/${file}`, 'utf8')));
const migrated = `${JSON.stringify(records)}\n${readFileSync('src/data/site.ts', 'utf8')}`;

for (const [group, values] of Object.entries(fixture)) {
  for (const value of values) {
    if (!legacy.includes(value)) throw new Error(`${group}: legacy source missing ${value}`);
    if (!migrated.includes(value)) throw new Error(`${group}: migrated content missing ${value}`);
  }
}

console.log('Legacy content audit passed.');
