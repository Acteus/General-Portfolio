(function journalFlipModule(global) {
    'use strict';

    const DESKTOP_QUERY = '(min-width: 56.25rem)';
    const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
    const TURN_DURATION = 580;

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

    function pageLabel(entry, role) {
        return entry.querySelector(`.project-page--${role} summary strong`)?.textContent.trim()
            || (role === 'story' ? 'The story' : 'Under the hood');
    }

    function makeFace(documentRef, className, label) {
        const face = documentRef.createElement('div');
        face.className = className;

        const heading = documentRef.createElement('span');
        heading.className = 'project-journal__leaf-heading';
        heading.textContent = label;
        face.append(heading);

        const rule = documentRef.createElement('span');
        rule.className = 'project-journal__leaf-rule';
        face.append(rule);

        for (let index = 0; index < 6; index += 1) {
            const line = documentRef.createElement('span');
            line.className = 'project-journal__leaf-line';
            if (index === 2 || index === 5) line.classList.add('project-journal__leaf-line--short');
            face.append(line);
        }

        return face;
    }

    function buildLeaf(documentRef, fromEntry, toEntry, direction) {
        const { frontRole, backRole } = getLeafFaces(direction);
        const leaf = documentRef.createElement('div');
        leaf.className = 'project-journal__leaf';
        leaf.setAttribute('aria-hidden', 'true');
        leaf.append(
            makeFace(documentRef, 'project-journal__leaf-face project-journal__leaf-face--front', pageLabel(fromEntry, frontRole)),
            makeFace(documentRef, 'project-journal__leaf-face project-journal__leaf-face--back', pageLabel(toEntry, backRole)),
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
        const duration = options.duration || TURN_DURATION;
        const listeners = [];
        let activeFlip = null;
        let pendingFrame = 0;
        let requestedEntry = null;
        let destroyed = false;

        function getActiveEntry() {
            return entries.find(entry => entry.open) || entries[0] || null;
        }

        function replaceHash(entry) {
            if (!entry?.id || !historyRef?.replaceState) return;
            historyRef.replaceState(null, '', `#${entry.id}`);
        }

        function commitEntry(entry, { updateHash = true } = {}) {
            if (!entry || !entries.includes(entry)) return;
            entries.forEach(candidate => {
                if (candidate !== entry) candidate.open = false;
            });
            entry.open = true;
            if (updateHash) replaceHash(entry);
        }

        function supportsWAAPI() {
            return typeof documentRef.createElement('div').animate === 'function';
        }

        function canAnimateNow() {
            return Boolean(layer) && shouldAnimateJournal({
                isDesktop: desktopMedia.matches,
                reducedMotion: motionMedia.matches,
                supportsWAAPI: supportsWAAPI(),
                isLightTheme: getTheme() === 'light',
            });
        }

        function removeFlipVisual(flip) {
            if (!flip) return;
            global.clearTimeout(flip.midpointTimer);
            flip.animation.cancel();
            flip.leaf.remove();
            layer.removeAttribute('data-direction');
            layer.style.removeProperty('height');
            root.classList.remove('is-turning');
        }

        function clearActiveFlip({ commitTarget = false } = {}) {
            if (!activeFlip) return;
            const flip = activeFlip;
            activeFlip = null;
            removeFlipVisual(flip);
            if (commitTarget) commitEntry(flip.target);
        }

        function turnKeyframes(direction) {
            const midpoint = direction === 'forward' ? 'rotateY(-92deg)' : 'rotateY(92deg)';
            const finish = direction === 'forward' ? 'rotateY(-180deg)' : 'rotateY(180deg)';
            return [
                { transform: 'rotateY(0deg)', opacity: 1 },
                { transform: midpoint, opacity: 0.88, offset: 0.5 },
                { transform: finish, opacity: 1 },
            ];
        }

        function startTurn(target) {
            pendingFrame = 0;
            if (destroyed || !target) return;

            const fromEntry = getActiveEntry();
            const fromIndex = entries.indexOf(fromEntry);
            const toIndex = entries.indexOf(target);
            const direction = getFlipDirection(fromIndex, toIndex);

            if (direction === 'none') return;
            if (!canAnimateNow()) {
                commitEntry(target);
                return;
            }

            const spread = fromEntry.querySelector('.project-entry__spread');
            const leaf = buildLeaf(documentRef, fromEntry, target, direction);
            layer.dataset.direction = direction;
            layer.style.height = `${spread.getBoundingClientRect().height}px`;
            layer.append(leaf);
            root.classList.add('is-turning');

            const animation = leaf.animate(turnKeyframes(direction), {
                duration,
                easing: 'cubic-bezier(0.22, 0.76, 0.2, 1)',
                fill: 'forwards',
            });
            const flip = { animation, leaf, target, committed: false, midpointTimer: 0 };
            activeFlip = flip;

            flip.midpointTimer = global.setTimeout(() => {
                if (activeFlip !== flip) return;
                commitEntry(target);
                flip.committed = true;
            }, duration / 2);

            animation.finished.then(() => {
                if (activeFlip !== flip) return;
                if (!flip.committed) commitEntry(target);
                activeFlip = null;
                requestedEntry = null;
                removeFlipVisual(flip);
            }).catch(() => {});
        }

        function requestSelection(target) {
            requestedEntry = target;
            if (activeFlip) clearActiveFlip();
            if (pendingFrame) cancelFrame(pendingFrame);
            pendingFrame = requestFrame(() => startTurn(requestedEntry));
        }

        function onCoverClick(entry, event) {
            if (!canAnimateNow()) return;
            event.preventDefault();
            if (entry === getActiveEntry()) return;
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
        });

        if (locationRef.hash?.startsWith('#note-')) {
            const linkedEntry = entries.find(entry => `#${entry.id}` === locationRef.hash);
            if (linkedEntry) commitEntry(linkedEntry, { updateHash: false });
        }

        function cancelForEnvironmentChange() {
            if (pendingFrame) {
                cancelFrame(pendingFrame);
                pendingFrame = 0;
            }
            if (activeFlip) clearActiveFlip({ commitTarget: true });
            else if (requestedEntry) commitEntry(requestedEntry);
            requestedEntry = null;
        }

        function onEnvironmentChange() {
            if (!canAnimateNow()) cancelForEnvironmentChange();
        }

        desktopMedia.addEventListener('change', onEnvironmentChange);
        motionMedia.addEventListener('change', onEnvironmentChange);

        function destroy() {
            destroyed = true;
            cancelForEnvironmentChange();
            listeners.forEach(([target, type, handler]) => target.removeEventListener(type, handler));
            desktopMedia.removeEventListener('change', onEnvironmentChange);
            motionMedia.removeEventListener('change', onEnvironmentChange);
        }

        return { getActiveEntry, commitEntry, cancelForEnvironmentChange, destroy };
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
