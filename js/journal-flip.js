(function journalFlipModule(global) {
    'use strict';

    const DESKTOP_QUERY = '(min-width: 75rem)';
    const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
    const TURN_DURATION = 500;

    function getFlipDirection(fromIndex, toIndex) {
        if (toIndex === fromIndex) return 'none';
        return toIndex > fromIndex ? 'forward' : 'backward';
    }

    function shouldAnimateJournal({
        isDesktop,
        reducedMotion,
        supportsWAAPI,
        isLightTheme,
    }) {
        return isDesktop && !reducedMotion && supportsWAAPI && isLightTheme;
    }

    function getLeafFaces(direction) {
        return direction === 'backward'
            ? { frontRole: 'story', backRole: 'technical' }
            : { frontRole: 'technical', backRole: 'story' };
    }

    function clonePage(entry, role) {
        const sourcePage = entry.querySelector(`.project-page--${role}`);
        if (!sourcePage) throw new Error(`missing ${role} journal page`);

        const page = sourcePage.cloneNode(true);
        page.classList.add('project-journal__leaf-page');
        page.open = true;
        page.setAttribute('open', '');
        // Carry the printed chapter number into the detached animation copy.
        if (typeof global.getComputedStyle === 'function') {
            page.style.setProperty('--leaf-number', global.getComputedStyle(sourcePage, '::before').content);
        }
        page.removeAttribute('id');
        page.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
        return page;
    }

    function makeFace(documentRef, className, page) {
        const face = documentRef.createElement('div');
        face.className = className;
        face.append(page);
        return face;
    }

    function buildLeaf(documentRef, fromEntry, toEntry, direction) {
        const { frontRole, backRole } = getLeafFaces(direction);
        const leaf = documentRef.createElement('div');
        leaf.className = 'project-journal__leaf';
        leaf.setAttribute('aria-hidden', 'true');
        leaf.setAttribute('inert', '');
        leaf.append(
            makeFace(documentRef, 'project-journal__leaf-face project-journal__leaf-face--front', clonePage(fromEntry, frontRole)),
            makeFace(documentRef, 'project-journal__leaf-face project-journal__leaf-face--back', clonePage(toEntry, backRole)),
        );
        return leaf;
    }

    function createJournalFlipController(root, options = {}) {
        const documentRef = root.ownerDocument;
        const entries = Array.from(root.querySelectorAll('.project-entry'));
        const layer = root.querySelector('.project-journal__turn-layer');
        const desktopMedia = options.desktopMedia || global.matchMedia(DESKTOP_QUERY);
        const motionMedia = options.motionMedia || global.matchMedia(REDUCED_MOTION_QUERY);
        const historyRef = options.history || global.history;
        const locationRef = options.location || global.location;
        const getTheme = options.getTheme || (() => documentRef.documentElement.dataset.theme);
        const requestFrame = options.requestFrame || global.requestAnimationFrame.bind(global);
        const cancelFrame = options.cancelFrame || global.cancelAnimationFrame.bind(global);
        const setTimeoutRef = options.setTimeout || global.setTimeout.bind(global);
        const clearTimeoutRef = options.clearTimeout || global.clearTimeout.bind(global);
        const duration = options.duration || TURN_DURATION;
        const listeners = [];
        let activeFlip = null;
        let pendingFrame = 0;
        let requestedEntry = null;
        let requestedSpread = 0;
        let destroyed = false;

        const spreads = new Map(entries.map(entry => {
            const authored = Array.from(entry.querySelectorAll('.project-entry__spread'));
            return [entry, authored.length ? authored : [entry]];
        }));
        const positions = new Map(entries.map(entry => [entry, 0]));

        function isPagedLayout() {
            const fontSize = typeof global.getComputedStyle === 'function'
                ? parseFloat(global.getComputedStyle(documentRef.documentElement).fontSize) : 16;
            return desktopMedia.matches && (!global.innerWidth || global.innerWidth / fontSize >= 75);
        }

        function refreshLayout() {
            const paged = isPagedLayout();
            root.classList.add('journal-enhanced');
            if (paged) root.classList.add('journal-paginated');
            else root.classList.remove('journal-paginated');
            entries.forEach(entry => {
                const pages = spreads.get(entry);
                const position = positions.get(entry);
                pages.forEach((spread, index) => {
                    if (spread !== entry) spread.hidden = paged && index !== position;
                });
                const pager = entry.querySelector('.journal-pager');
                if (!pager) return;
                pager.hidden = !paged;
                const previous = pager.querySelector('[data-journal-prev]');
                const next = pager.querySelector('[data-journal-next]');
                const focused = documentRef.activeElement;
                previous.disabled = position === 0;
                next.disabled = position === pages.length - 1;
                pager.querySelector('[data-journal-position]').textContent =
                    `Spread ${position + 1} of ${pages.length} · ${pages[position].dataset.spreadTitle}`;
                // A disabled boundary button must not strand keyboard focus.
                if (focused === previous && previous.disabled) next.focus({ preventScroll: true });
                if (focused === next && next.disabled) previous.focus({ preventScroll: true });
            });
        }

        function getActiveEntry() {
            return entries.find(entry => entry.open) || entries[0] || null;
        }

        function replaceHash(entry) {
            if (!entry?.id || !historyRef?.replaceState) return;
            historyRef.replaceState(null, '', `#${entry.id}`);
        }

        function commitEntry(entry, { updateHash = true, spreadIndex = 0 } = {}) {
            if (!entry || !entries.includes(entry)) return;
            entries.forEach(candidate => {
                if (candidate !== entry) candidate.open = false;
            });
            entry.open = true;
            positions.set(entry, spreadIndex);
            refreshLayout();
            if (updateHash) replaceHash(entry);
        }

        function supportsWAAPI() {
            try {
                return typeof documentRef.createElement('div').animate === 'function';
            } catch (error) {
                return false;
            }
        }

        function canAnimateNow() {
            return Boolean(layer) && shouldAnimateJournal({
                isDesktop: isPagedLayout(),
                reducedMotion: motionMedia.matches,
                supportsWAAPI: supportsWAAPI(),
                isLightTheme: getTheme() === 'light',
            });
        }

        function removeFlipVisual(flip) {
            if (!flip) return;
            clearTimeoutRef(flip.midpointTimer);
            try { flip.animation?.cancel(); } catch (error) { /* best-effort cleanup */ }
            try {
                if (flip.leaf) flip.leaf.remove();
            } catch (error) { /* best-effort cleanup */ }
            layer?.removeAttribute('data-direction');
            layer?.style.removeProperty('height');
            layer?.style.removeProperty('--turn-duration');
            root.classList.remove('is-turning');
        }

        function clearActiveFlip({ commitTarget = false } = {}) {
            if (!activeFlip) return;
            const flip = activeFlip;
            activeFlip = null;
            removeFlipVisual(flip);
            if (commitTarget) commitEntry(flip.target, { spreadIndex: flip.spreadIndex });
        }

        function turnKeyframes(direction) {
            const sign = direction === 'forward' ? -1 : 1;
            // Symmetric timing keeps the edge-on frame aligned with the content swap.
            // A small skew and compression suggest paper flex while the spine stays fixed.
            return [
                { transform: 'rotateY(0deg) translateZ(0)', offset: 0 },
                { transform: `rotateY(${sign * 12}deg) skewY(${sign * 0.45}deg) scaleX(0.998)`, offset: 0.16 },
                { transform: `rotateY(${sign * 58}deg) skewY(${sign * 1.1}deg) scaleX(0.975)`, offset: 0.36 },
                { transform: `rotateY(${sign * 90}deg) skewY(0deg) scaleX(0.965)`, offset: 0.5 },
                { transform: `rotateY(${sign * 122}deg) skewY(${-sign * 0.8}deg) scaleX(0.975)`, offset: 0.64 },
                { transform: `rotateY(${sign * 168}deg) skewY(${-sign * 0.3}deg) scaleX(0.998)`, offset: 0.84 },
                { transform: `rotateY(${sign * 180}deg) translateZ(0)`, offset: 1 },
            ];
        }

        function startTurn(target, spreadIndex = 0) {
            pendingFrame = 0;
            if (destroyed || !target) return;

            const fromEntry = getActiveEntry();
            const fromIndex = entries.indexOf(fromEntry);
            const toIndex = entries.indexOf(target);
            const direction = fromEntry === target
                ? getFlipDirection(positions.get(fromEntry), spreadIndex)
                : getFlipDirection(fromIndex, toIndex);

            if (direction === 'none') return;
            if (!canAnimateNow()) {
                commitEntry(target, { spreadIndex });
                return;
            }

            let leaf = null;
            let animation = null;
            try {
                const source = spreads.get(fromEntry)[positions.get(fromEntry)];
                const spread = source === fromEntry ? fromEntry.querySelector('.project-entry__spread') : source;
                if (!spread || !layer) throw new Error('journal turn setup unavailable');
                leaf = buildLeaf(documentRef, source, spreads.get(target)[spreadIndex], direction);
                layer.dataset.direction = direction;
                layer.style.height = `${spread.getBoundingClientRect().height}px`;
                layer.style.setProperty('--turn-duration', `${duration}ms`);
                layer.append(leaf);
                root.classList.add('is-turning');

                animation = leaf.animate(turnKeyframes(direction), {
                    duration,
                    easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
                    fill: 'forwards',
                });
            } catch (error) {
                removeFlipVisual({ animation, leaf, midpointTimer: 0 });
                commitEntry(target, { spreadIndex });
                return;
            }
            const flip = { animation, leaf, target, spreadIndex, committed: false, midpointTimer: 0 };
            activeFlip = flip;

            try {
                flip.midpointTimer = setTimeoutRef(() => {
                    if (activeFlip !== flip) return;
                    commitEntry(target, { spreadIndex });
                    flip.committed = true;
                }, duration / 2);
            } catch (error) {
                activeFlip = null;
                removeFlipVisual(flip);
                commitEntry(target, { spreadIndex });
                return;
            }

            try {
                animation.finished.then(() => {
                    if (activeFlip !== flip) return;
                    if (!flip.committed) commitEntry(target, { spreadIndex });
                    activeFlip = null;
                    requestedEntry = null;
                    removeFlipVisual(flip);
                }).catch(() => {
                    if (activeFlip !== flip) return;
                    activeFlip = null;
                    removeFlipVisual(flip);
                    commitEntry(target, { spreadIndex });
                });
            } catch (error) {
                activeFlip = null;
                removeFlipVisual(flip);
                commitEntry(target, { spreadIndex });
            }
        }

        function requestSelection(target, spreadIndex = 0) {
            if (destroyed || !target) return;
            requestedEntry = target;
            requestedSpread = spreadIndex;
            if (target === getActiveEntry() && positions.get(target) === spreadIndex) {
                if (activeFlip) clearActiveFlip();
                if (pendingFrame) cancelFrame(pendingFrame);
                pendingFrame = 0;
                requestedEntry = null;
                commitEntry(target);
                return;
            }
            if (activeFlip) clearActiveFlip();
            if (pendingFrame) cancelFrame(pendingFrame);
            try {
                pendingFrame = requestFrame(() => {
                    const nextEntry = requestedEntry;
                    requestedEntry = null;
                    startTurn(nextEntry, requestedSpread);
                });
            } catch (error) {
                pendingFrame = 0;
                requestedEntry = null;
                commitEntry(target, { spreadIndex });
            }
        }

        function onCoverClick(entry, event) {
            event.preventDefault();
            if (entry === getActiveEntry() && !activeFlip && !pendingFrame && !requestedEntry) return;
            if (!canAnimateNow()) {
                requestSelection(entry);
                return;
            }
            if (entry === getActiveEntry() && !activeFlip && !pendingFrame && !requestedEntry) return;
            requestSelection(entry);
        }

        entries.forEach(entry => {
            const cover = entry.querySelector(':scope > .project-entry__cover');
            const clickHandler = event => onCoverClick(entry, event);
            const toggleHandler = () => {
                if (entry.open && !activeFlip) replaceHash(entry);
            };
            cover.addEventListener('click', clickHandler);
            entry.addEventListener('toggle', toggleHandler);
            listeners.push([cover, 'click', clickHandler], [entry, 'toggle', toggleHandler]);
            for (const [selector, step] of [['[data-journal-prev]', -1], ['[data-journal-next]', 1]]) {
                const button = entry.querySelector(selector);
                if (!button) continue;
                const handler = () => {
                    const current = requestedEntry === entry ? requestedSpread
                        : activeFlip?.target === entry ? activeFlip.spreadIndex : positions.get(entry);
                    const destination = Math.max(0, Math.min(spreads.get(entry).length - 1, current + step));
                    requestSelection(entry, destination);
                };
                button.addEventListener('click', handler);
                listeners.push([button, 'click', handler]);
            }
        });

        function findLinkedEntry() {
            const hash = locationRef.hash === '#note-private-work' ? '#note-jru-atlas' : locationRef.hash;
            return entries.find(entry => `#${entry.id}` === hash);
        }

        if (locationRef.hash?.startsWith('#note-')) {
            const linkedEntry = findLinkedEntry();
            if (linkedEntry) commitEntry(linkedEntry, { updateHash: false });
        }

        function cancelForEnvironmentChange() {
            if (pendingFrame) {
                cancelFrame(pendingFrame);
                pendingFrame = 0;
            }
            if (activeFlip) clearActiveFlip({ commitTarget: true });
            else if (requestedEntry) commitEntry(requestedEntry, { spreadIndex: requestedSpread });
            requestedEntry = null;
        }

        function onEnvironmentChange() {
            if (!canAnimateNow()) cancelForEnvironmentChange();
            refreshLayout();
        }

        function onHashChange() {
            const target = findLinkedEntry();
            if (!target) return;
            cancelForEnvironmentChange();
            commitEntry(target, { updateHash: false });
        }
        if (typeof global.addEventListener === 'function') {
            global.addEventListener('hashchange', onHashChange);
            global.addEventListener('resize', onEnvironmentChange);
            listeners.push([global, 'hashchange', onHashChange], [global, 'resize', onEnvironmentChange]);
        }
        const layoutObserver = typeof global.ResizeObserver === 'function'
            ? new global.ResizeObserver(onEnvironmentChange) : null;
        layoutObserver?.observe(documentRef.documentElement);
        refreshLayout();
        desktopMedia.addEventListener('change', onEnvironmentChange);
        motionMedia.addEventListener('change', onEnvironmentChange);

        function destroy() {
            destroyed = true;
            layoutObserver?.disconnect();
            cancelForEnvironmentChange();
            listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
            desktopMedia.removeEventListener('change', onEnvironmentChange);
            motionMedia.removeEventListener('change', onEnvironmentChange);
        }

        return { getActiveEntry, commitEntry, cancelForEnvironmentChange, refreshLayout, destroy };
    }

    const api = {
        DESKTOP_QUERY,
        REDUCED_MOTION_QUERY,
        TURN_DURATION,
        createJournalFlipController,
        getFlipDirection,
        getLeafFaces,
        shouldAnimateJournal,
    };

    global.PortfolioJournal = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis));
