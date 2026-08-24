export interface ChapterManifest {
  id: string;
  label: string;
  spreadCount: number;
}

export interface JournalState {
  chapterId: string;
  spread: number;
  phase: 'idle' | 'turning';
  direction: -1 | 0 | 1;
  requestId: number;
}

export type JournalAction =
  | { type: 'request'; chapterId: string; spread: number; requestId: number; direction: -1 | 1 }
  | { type: 'commit'; requestId: number }
  | { type: 'cancel'; chapterId: string; spread: number };

export function journalReducer(state: JournalState, action: JournalAction): JournalState {
  if (action.type === 'request') {
    return {
      chapterId: action.chapterId,
      spread: action.spread,
      phase: 'turning',
      direction: action.direction,
      requestId: action.requestId,
    };
  }
  if (action.type === 'commit' && action.requestId === state.requestId) {
    return { ...state, phase: 'idle', direction: 0 };
  }
  if (action.type === 'cancel') {
    return { chapterId: action.chapterId, spread: action.spread, phase: 'idle', direction: 0, requestId: state.requestId + 1 };
  }
  return state;
}
