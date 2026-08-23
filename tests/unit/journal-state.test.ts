import { describe, expect, it } from 'vitest';
import { journalReducer, type JournalState } from '../../src/components/journal/state';

const initial: JournalState = { chapterId: 'jobboard-devops', spread: 0, phase: 'idle', direction: 0, requestId: 0 };

describe('journalReducer', () => {
  it('lets a newer request supersede an active turn', () => {
    const first = journalReducer(initial, { type: 'request', chapterId: 'project-archive', spread: 1, requestId: 1, direction: 1 });
    const second = journalReducer(first, { type: 'request', chapterId: 'github-discord-bot', spread: 0, requestId: 2, direction: 1 });
    expect(journalReducer(second, { type: 'commit', requestId: 1 })).toEqual(second);
    expect(journalReducer(second, { type: 'commit', requestId: 2 })).toMatchObject({ chapterId: 'github-discord-bot', phase: 'idle', direction: 0 });
  });

  it('cancels directly for an environment change', () => {
    const turning = journalReducer(initial, { type: 'request', chapterId: 'project-archive', spread: 2, requestId: 1, direction: 1 });
    expect(journalReducer(turning, { type: 'cancel', chapterId: 'project-archive', spread: 2 })).toMatchObject({ phase: 'idle', direction: 0 });
  });
});
