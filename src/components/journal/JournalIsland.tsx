import { animate, type AnimationPlaybackControlsWithThen } from 'motion';
import { useEffect, useReducer, useRef } from 'react';
import type { ChapterManifest, JournalState } from './state';
import { journalReducer } from './state';

interface JournalIslandProps {
  manifest: ChapterManifest[];
  initialChapterId: string;
  initialSpread: number;
}

const easing = [0.22, 1, 0.36, 1] as const;

function readLocation(manifest: ChapterManifest[], fallbackChapter: string, fallbackSpread: number) {
  const params = new URLSearchParams(window.location.search);
  const chapterId = manifest.some((entry) => entry.id === params.get('chapter')) ? params.get('chapter')! : fallbackChapter;
  const chapter = manifest.find((entry) => entry.id === chapterId);
  const requestedSpread = Number.parseInt(params.get('spread') ?? '', 10) - 1;
  const spread = Number.isFinite(requestedSpread) && chapter ? Math.min(Math.max(requestedSpread, 0), chapter.spreadCount - 1) : fallbackSpread;
  return { chapterId, spread, explicit: params.has('chapter') || params.has('spread') };
}

function chapterRoot(chapterId: string) {
  return document.querySelector<HTMLElement>(`[data-journal-chapter="${CSS.escape(chapterId)}"]`);
}

function setInert(root: HTMLElement, inert: boolean) {
  if (inert) root.setAttribute('inert', '');
  else root.removeAttribute('inert');
}

export default function JournalIsland({ manifest, initialChapterId, initialSpread }: JournalIslandProps) {
  const initialState = {
    chapterId: initialChapterId,
    spread: initialSpread,
    phase: 'idle',
    direction: 0,
    requestId: 0,
  } satisfies JournalState;
  const [, dispatch] = useReducer(journalReducer, initialState);
  const stateRef = useRef<JournalState>(initialState);
  const committedRef = useRef<JournalState>(initialState);
  const animationRef = useRef<AnimationPlaybackControlsWithThen | null>(null);
  const leafRef = useRef<HTMLElement | null>(null);
  const requestRef = useRef(0);
  const historyGuardRef = useRef(false);
  const keyboardRef = useRef(false);

  useEffect(() => {
    const roots = manifest.map((entry) => chapterRoot(entry.id)).filter((root): root is HTMLElement => Boolean(root));
    const status = document.createElement('p');
    status.className = 'journal-island__status';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    status.id = 'journal-navigation-status';
    const controls = document.createElement('div');
    controls.className = 'journal-island__controls';
    controls.setAttribute('aria-label', 'Journal spread controls');
    controls.innerHTML = '<button type="button" data-journal-previous>Previous spread</button><button type="button" data-journal-next>Next spread</button>';
    const host = document.querySelector<HTMLElement>('.journal-spread-column');
    const interactionRoot = host?.parentElement;
    host?.append(status, controls);

    function updateStatus(next: JournalState) {
      const chapter = manifest.find((entry) => entry.id === next.chapterId);
      if (chapter) status.textContent = `${chapter.label}, spread ${next.spread + 1} of ${chapter.spreadCount}`;
    }

    function applyCommitted(next: JournalState, isolate = true) {
      for (const root of roots) {
        const active = !isolate || root === chapterRoot(next.chapterId);
        root.hidden = !active;
        setInert(root, !active);
        if (active && root instanceof HTMLDetailsElement) root.open = true;
        root.querySelectorAll<HTMLElement>('[data-case-study-spread]').forEach((spread) => {
          const activeSpread = !isolate || Number(spread.dataset.caseStudySpread) === next.spread;
          spread.hidden = !activeSpread;
          setInert(spread, !activeSpread);
        });
      }
      updateStatus(next);
    }

    function removeLeaf() {
      animationRef.current?.stop();
      animationRef.current = null;
      leafRef.current?.remove();
      leafRef.current = null;
      host?.classList.remove('is-turning');
    }

    function commit(next: JournalState, push: boolean, focus: boolean) {
      removeLeaf();
      applyCommitted(next);
      dispatch({ type: 'commit', requestId: next.requestId });
      stateRef.current = next;
      committedRef.current = next;
      if (push) {
        const url = new URL(window.location.href);
        url.searchParams.set('mode', 'journal');
        url.searchParams.set('chapter', next.chapterId);
        url.searchParams.set('spread', String(next.spread + 1));
        window.history.pushState({}, '', url);
        historyGuardRef.current = false;
      }
      if (focus) chapterRoot(next.chapterId)?.querySelector<HTMLElement>('h2, h3')?.focus({ preventScroll: true });
    }

    function destination(chapterId: string, spread: number) {
      const chapter = manifest.find((entry) => entry.id === chapterId);
      if (!chapter) return null;
      return { chapterId, spread: Math.min(Math.max(spread, 0), chapter.spreadCount - 1) };
    }

    function cancelPending() {
      requestRef.current += 1;
      removeLeaf();
      const committed = committedRef.current;
      const cancelled = journalReducer(committed, { type: 'cancel', chapterId: committed.chapterId, spread: committed.spread });
      stateRef.current = cancelled;
      dispatch({ type: 'cancel', chapterId: committed.chapterId, spread: committed.spread });
      applyCommitted(committed);
    }

    function reserveCommittedHistory() {
      if (historyGuardRef.current) return;
      window.history.pushState({}, '', window.location.href);
      historyGuardRef.current = true;
    }

    function transitionTo(chapterId: string, spread: number, push = true, keyboard = false) {
      const nextDestination = destination(chapterId, spread);
      if (!nextDestination) return;
      const current = committedRef.current;
      if (current.chapterId === nextDestination.chapterId && current.spread === nextDestination.spread && stateRef.current.phase === 'turning') {
        cancelPending();
        return;
      }
      if (current.chapterId === nextDestination.chapterId && current.spread === nextDestination.spread) {
        requestRef.current += 1;
        removeLeaf();
        applyCommitted(current);
        return;
      }
      removeLeaf();
      const requestId = ++requestRef.current;
      const direction: -1 | 1 = nextDestination.chapterId === current.chapterId && nextDestination.spread < current.spread ? -1 : 1;
      const requested = journalReducer(current, { type: 'request', ...nextDestination, requestId, direction });
      stateRef.current = requested;
      dispatch({ type: 'request', ...nextDestination, requestId, direction });
      if (push) {
        reserveCommittedHistory();
      }

      const desktop = window.matchMedia('(min-width: 48rem)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lightMode = document.documentElement.dataset.theme !== 'dark';
      const source = chapterRoot(current.chapterId)?.querySelector<HTMLElement>('[data-case-study-spread]:not([hidden])') ?? chapterRoot(current.chapterId)?.querySelector<HTMLElement>('.journal-chapter__body');
      if (!desktop || reducedMotion || !lightMode || !source || !host) {
        commit({ ...requested, phase: 'idle', direction: 0 }, push, keyboard);
        return;
      }

      const leaf = source.cloneNode(true) as HTMLElement;
      leaf.classList.add('journal-leaf');
      leaf.removeAttribute('id');
      leaf.setAttribute('aria-hidden', 'true');
      leaf.setAttribute('inert', '');
      leaf.style.position = 'absolute';
      leaf.style.inset = '0';
      leaf.style.transformOrigin = direction > 0 ? 'left center' : 'right center';
      leaf.style.zIndex = '2';
      host.append(leaf);
      leafRef.current = leaf;
      host.classList.add('is-turning');
      animationRef.current = animate(leaf, { transform: ['rotateY(0deg)', `rotateY(${direction > 0 ? '-180deg' : '180deg'})`] }, {
        duration: 0.48,
        ease: easing,
        onComplete: () => {
          if (requestRef.current !== requestId) return;
          commit({ ...requested, phase: 'idle', direction: 0 }, push, keyboard);
        },
      });
    }

    const initial = readLocation(manifest, initialChapterId, initialSpread);
    const resolvedInitial: JournalState = { chapterId: initial.chapterId, spread: initial.spread, phase: 'idle', direction: 0, requestId: 0 };
    stateRef.current = resolvedInitial;
    committedRef.current = resolvedInitial;
    applyCommitted(resolvedInitial, initial.explicit);
    if (initial.chapterId !== initialChapterId || initial.spread !== initialSpread) {
      dispatch({ type: 'request', ...resolvedInitial, requestId: 0, direction: 1 });
      dispatch({ type: 'commit', requestId: 0 });
    }

    const clickHandler = (event: Event) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-journal-target]') : null;
      if (!target) return;
      event.preventDefault();
      transitionTo(target.dataset.journalTarget ?? '', Number(target.dataset.journalSpread ?? '0'), true, keyboardRef.current);
      keyboardRef.current = false;
    };
    const keyHandler = (event: KeyboardEvent) => {
      if ((event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.closest('[data-journal-target]')) keyboardRef.current = true;
    };
    const previousHandler = () => transitionTo(stateRef.current.chapterId, stateRef.current.spread - 1, true, false);
    const nextHandler = () => transitionTo(stateRef.current.chapterId, stateRef.current.spread + 1, true, false);
    const popHandler = () => {
      const next = readLocation(manifest, stateRef.current.chapterId, stateRef.current.spread);
      transitionTo(next.chapterId, next.spread, false, false);
    };
    const environmentHandler = () => {
      if (stateRef.current.phase === 'turning') {
        cancelPending();
      }
    };

    interactionRoot?.addEventListener('click', clickHandler);
    interactionRoot?.addEventListener('keydown', keyHandler);
    controls.querySelector('[data-journal-previous]')?.addEventListener('click', previousHandler);
    controls.querySelector('[data-journal-next]')?.addEventListener('click', nextHandler);
    window.addEventListener('popstate', popHandler);
    const media = window.matchMedia('(min-width: 48rem)');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    media.addEventListener('change', environmentHandler);
    motion.addEventListener('change', environmentHandler);
    const observer = new MutationObserver(environmentHandler);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      removeLeaf();
      observer.disconnect();
      media.removeEventListener('change', environmentHandler);
      motion.removeEventListener('change', environmentHandler);
      window.removeEventListener('popstate', popHandler);
      interactionRoot?.removeEventListener('click', clickHandler);
      interactionRoot?.removeEventListener('keydown', keyHandler);
      controls.querySelector('[data-journal-previous]')?.removeEventListener('click', previousHandler);
      controls.querySelector('[data-journal-next]')?.removeEventListener('click', nextHandler);
      status.remove();
      controls.remove();
    };
  }, [manifest, initialChapterId, initialSpread]);

  return null;
}
