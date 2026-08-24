export type Theme = 'light' | 'dark';

export const deepLinkMap: Record<string, string> = {
  '#note-jobboard': 'jobboard-devops',
  '#note-private-work': 'jru-atlas',
  '#note-discord-bot': 'github-discord-bot',
};

export function resolveTheme(url: URL, stored: string | null, prefersDark: boolean): Theme {
  const requested = url.searchParams.get('mode');
  if (requested === 'journal') return 'light';
  if (requested === 'recruiter') return 'dark';
  if (stored === 'light' || stored === 'dark') return stored;
  return prefersDark ? 'dark' : 'light';
}

export function portfolioUrl(current: URL, theme: Theme, chapter?: string, spread?: number): URL {
  const next = new URL(current);
  next.searchParams.set('mode', theme === 'light' ? 'journal' : 'recruiter');
  if (chapter) next.searchParams.set('chapter', chapter);
  if (typeof spread === 'number') next.searchParams.set('spread', String(spread));
  return next;
}
