import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('project content', () => {
  it('contains the complete named project inventory', () => {
    const files = readdirSync('src/data/projects').filter((file) => file.endsWith('.json'));
    expect(files).toHaveLength(13);
    expect(files).toContain('project-archive.json');
    expect(files).toContain('jobboard-devops.json');
    expect(files).toContain('iot-sensor-monitor.json');
  });

  it('never publishes an inactive URL', () => {
    for (const file of readdirSync('src/data/projects')) {
      if (!file.endsWith('.json')) continue;
      const data = JSON.parse(readFileSync(`src/data/projects/${file}`, 'utf8'));
      for (const link of data.links) expect(link.href).not.toContain('example.com');
      if (['private', 'in-progress', 'link-pending'].includes(data.status)) {
        expect(data.links).toHaveLength(0);
      }
    }
  });

  it('passes Astro content validation', () => {
    expect(() => execFileSync('npx', ['astro', 'sync'], { stdio: 'pipe', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } })).not.toThrow();
  });
});
