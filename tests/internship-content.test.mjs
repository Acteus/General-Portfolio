import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
test('all resume controls serve the current internship PDF', () => {
 const links = [...html.matchAll(/href="([^"]+\.pdf)"/g)].map(match => match[1]);
 assert.equal(links.length, 4);
 assert.ok(links.every(link => link === 'output/pdf/Garren-Dullas-Intern-Resume.pdf'));
 assert.ok(existsSync(new URL('../output/pdf/Garren-Dullas-Intern-Resume.pdf', import.meta.url)));
});
test('lead internship projects have their own notes and updated project facts', () => {
 const notes = [...html.matchAll(/<details class="project-entry" id="([^"]+)"/g)].map(match => match[1]);
 assert.deepEqual(notes.slice(0, 3), ['note-laborwise', 'note-jobboard', 'note-jru-atlas']);
 assert.match(html, /Completed November 2026/);
 assert.match(html, /Migrated from DigitalOcean to AWS/);
 assert.match(html, /Seeking a cloud or DevOps internship/);
 assert.doesNotMatch(html, /running on DigitalOcean|workspace on DigitalOcean|two private systems in active development/i);
});
