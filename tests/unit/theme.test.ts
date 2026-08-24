import { describe, expect, it } from 'vitest';
import { deepLinkMap, portfolioUrl, resolveTheme } from '../../src/scripts/theme';

describe('theme and portfolio URLs', () => {
  it('gives an explicit URL mode precedence over storage and media', () => {
    expect(resolveTheme(new URL('https://portfolio.test/?mode=journal'), 'dark', true)).toBe('light');
  });

  it('preserves chapter context across mode changes', () => {
    const next = portfolioUrl(new URL('https://portfolio.test/?chapter=project-archive&spread=2'), 'dark', 'project-archive', 2);
    expect(next.searchParams.get('mode')).toBe('recruiter');
    expect(next.searchParams.get('chapter')).toBe('project-archive');
    expect(next.searchParams.get('spread')).toBe('2');
  });

  it('maps every existing journal hash', () => {
    expect(deepLinkMap).toEqual({
      '#note-jobboard': 'jobboard-devops',
      '#note-private-work': 'jru-atlas',
      '#note-discord-bot': 'github-discord-bot',
    });
  });
});
