import { animate, type AnimationPlaybackControlsWithThen } from 'motion';
import { useEffect, useReducer, useRef } from 'react';
import type { ChapterManifest, JournalState } from './state';
import { journalReducer } from './state';
import { readTurnProgress, turnKeyframes } from './motion';

interface JournalIslandProps {
  manifest: ChapterManifest[];
  initialChapterId: string;
  initialSpread: number;
}

const easing = [0.22, 1, 0.36, 1] as const;

function readLocation(manifest: ChapterManifest[], fallbackChapter: string, fallbackSpread: number) {
  const params = new URLSearchParams(window.location.search);
  const chapterParam = params.get('chapter');
  const chapterId = manifest.some((entry) => entry.id === chapterParam) ? chapterParam! : fallbackChapter;
  const chapter = manifest.find((entry) => entry.id === chapterId);
  const requestedSpread = Number.parseInt(params.get('spread') ?? '', 10) - 1;
  const spread = Number.isFinite(requestedSpread) && chapter ? Math.min(Math.max(requestedSpread, 0), chapter.spreadCount - 1) : fallbackSpread;
  return { chapterId, spread, explicit: params.has('chapter') || params.has('spread') };
}

function transitionDirection(manifest: ChapterManifest[], current: JournalState, next: { chapterId: string; spread: number }): -1 | 1 {
  const currentChapter = manifest.findIndex((entry) => entry.id === current.chapterId);
  const nextChapter = manifest.findIndex((entry) => entry.id === next.chapterId);
  if (nextChapter !== currentChapter) return nextChapter > currentChapter ? 1 : -1;
  return next.spread >= current.spread ? 1 : -1;
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
  const keyboardRef = useRef(false);
  const isDesktop = () => window.matchMedia('(min-width: 48rem)').matches;

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

    function focusMobileChapter(chapterId: string) {
      const target = chapterRoot(chapterId);
      if (target instanceof HTMLDetailsElement) target.open = true;
      target?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
      target?.querySelector<HTMLElement>('h2, h3')?.focus({ preventScroll: true });
    }

    function applyCommitted(next: JournalState, isolate = true) {
      for (const root of roots) {
        const active = root === chapterRoot(next.chapterId);
        if (isolate) {
          root.hidden = !active;
          setInert(root, !active);
          if (active && root instanceof HTMLDetailsElement) root.open = true;
        } else {
          root.hidden = false;
          setInert(root, false);
          if (active && root instanceof HTMLDetailsElement) root.open = true;
        }
        root.querySelectorAll<HTMLElement>('[data-case-study-spread]').forEach((spread) => {
          if (isolate) {
            const activeSpread = active && Number(spread.dataset.caseStudySpread) === next.spread;
            spread.hidden = !activeSpread;
            setInert(spread, !activeSpread);
          } else {
            spread.hidden = false;
            setInert(spread, false);
          }
        });
      }
      interactionRoot?.querySelectorAll<HTMLElement>('.journal-index [data-journal-target]').forEach((control) => {
        if (control.dataset.journalTarget === next.chapterId) control.setAttribute('aria-current', 'true');
        else control.removeAttribute('aria-current');
      });
      const previous = controls.querySelector<HTMLButtonElement>('[data-journal-previous]');
      const nextControl = controls.querySelector<HTMLButtonElement>('[data-journal-next]');
      const chapter = manifest.find((entry) => entry.id === next.chapterId);
      if (previous) previous.disabled = next.spread <= 0;
      if (nextControl) nextControl.disabled = !chapter || next.spread >= chapter.spreadCount - 1;
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
      applyCommitted(next, isDesktop());
      dispatch({ type: 'commit', requestId: next.requestId });
      stateRef.current = next;
      committedRef.current = next;
      if (push) {
        const url = new URL(window.location.href);
        url.searchParams.set('mode', 'journal');
        url.searchParams.set('chapter', next.chapterId);
        url.searchParams.set('spread', String(next.spread + 1));
        window.history.pushState({ ...(window.history.state ?? {}), mode: 'journal', chapter: next.chapterId, spread: next.spread + 1 }, '', url);
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
      applyCommitted(committed, isDesktop());
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
        applyCommitted(current, isDesktop());
        if (!isDesktop()) focusMobileChapter(current.chapterId);
        return;
      }
      const carriedProgress = leafRef.current ? readTurnProgress(getComputedStyle(leafRef.current).transform, getComputedStyle(leafRef.current).transformOrigin) : null;
      removeLeaf();
      const requestId = ++requestRef.current;
      const direction = transitionDirection(manifest, current, nextDestination);
      const requested = journalReducer(current, { type: 'request', ...nextDestination, requestId, direction });
      stateRef.current = requested;
      dispatch({ type: 'request', ...nextDestination, requestId, direction });

      // History navigation is a state restoration, not a new user-initiated turn.
      // Commit immediately so Back/Forward never leaves the semantic chapter
      // hidden while a browser-specific animation frame is pending.
      if (!push) {
        commit({ ...requested, phase: 'idle', direction: 0 }, false, false);
        return;
      }

      const desktop = isDesktop();
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lightMode = document.documentElement.dataset.theme !== 'dark';
      const source = chapterRoot(current.chapterId)?.querySelector<HTMLElement>('[data-case-study-spread]:not([hidden])') ?? chapterRoot(current.chapterId)?.querySelector<HTMLElement>('.journal-chapter__body');
      if (!desktop || reducedMotion || !lightMode || !source || !host) {
        commit({ ...requested, phase: 'idle', direction: 0 }, push, keyboard);
        if (!desktop) {
          const target = chapterRoot(nextDestination.chapterId);
          if (target instanceof HTMLDetailsElement) target.open = true;
          target?.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
        }
        return;
      }

      let settled = false;
      const finish = () => {
        if (settled || requestRef.current !== requestId) return;
        settled = true;
        commit({ ...requested, phase: 'idle', direction: 0 }, push, keyboard);
      };
      try {
        const leaf = source.cloneNode(true) as HTMLElement;
        leaf.classList.add('journal-leaf');
        leaf.removeAttribute('id');
        leaf.removeAttribute('aria-labelledby');
        leaf.removeAttribute('aria-describedby');
        leaf.removeAttribute('aria-controls');
        leaf.removeAttribute('aria-owns');
        leaf.removeAttribute('aria-activedescendant');
        leaf.removeAttribute('for');
        leaf.querySelectorAll<HTMLElement>('[id], [aria-labelledby], [aria-describedby], [aria-controls], [aria-owns], [aria-activedescendant], [for]').forEach((node) => {
          node.removeAttribute('id');
          node.removeAttribute('aria-labelledby');
          node.removeAttribute('aria-describedby');
          node.removeAttribute('aria-controls');
          node.removeAttribute('aria-owns');
          node.removeAttribute('aria-activedescendant');
          node.removeAttribute('for');
        });
        leaf.setAttribute('aria-hidden', 'true');
        leaf.setAttribute('inert', '');
        leaf.style.position = 'absolute';
        leaf.style.inset = '0';
        leaf.style.transformOrigin = carriedProgress?.transformOrigin ?? (direction > 0 ? 'left center' : 'right center');
        leaf.style.zIndex = '2';
        const keyframes = turnKeyframes(carriedProgress, direction);
        if (carriedProgress) leaf.dataset.journalCarriedTransform = 'true';
        host.append(leaf);
        leafRef.current = leaf;
        host.classList.add('is-turning');
        animationRef.current = animate(leaf, { transform: keyframes }, {
          duration: 0.48,
          ease: easing,
          onComplete: finish,
        });
        animationRef.current.then(finish).catch(finish);
      } catch {
        removeLeaf();
        finish();
      }
    }

    const initial = readLocation(manifest, initialChapterId, initialSpread);
    const resolvedInitial: JournalState = { chapterId: initial.chapterId, spread: initial.spread, phase: 'idle', direction: 0, requestId: 0 };
    stateRef.current = resolvedInitial;
    committedRef.current = resolvedInitial;
    const desktop = window.matchMedia('(min-width: 48rem)');
    applyCommitted(resolvedInitial, isDesktop());
    const initialMode = new URL(window.location.href).searchParams.get('mode') ?? (document.documentElement.dataset.theme === 'dark' ? 'recruiter' : 'journal');
    window.history.replaceState({ ...(window.history.state ?? {}), mode: initialMode, chapter: resolvedInitial.chapterId, spread: resolvedInitial.spread + 1 }, '', window.location.href);
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
      const urlMode = new URL(window.location.href).searchParams.get('mode');
      const resolvedMode = urlMode ?? (document.documentElement.dataset.theme === 'dark' ? 'recruiter' : 'journal');
      if (resolvedMode === 'recruiter') {
        cancelPending();
        return;
      }
      const next = readLocation(manifest, initialChapterId, initialSpread);
      transitionTo(next.chapterId, next.spread, false, false);
    };
    const environmentHandler = () => {
      if (stateRef.current.phase === 'turning') {
        cancelPending();
      }
      applyCommitted(committedRef.current, isDesktop());
    };

    interactionRoot?.addEventListener('click', clickHandler);
    interactionRoot?.addEventListener('keydown', keyHandler);
    controls.querySelector('[data-journal-previous]')?.addEventListener('click', previousHandler);
    controls.querySelector('[data-journal-next]')?.addEventListener('click', nextHandler);
    window.addEventListener('popstate', popHandler);
    const media = desktop;
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
