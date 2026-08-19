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

    const api = {
        DESKTOP_QUERY,
        REDUCED_MOTION_QUERY,
        TURN_DURATION,
        getFlipDirection,
        getLeafFaces,
        shouldAnimateJournal,
    };

    global.PortfolioJournal = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
}(typeof window !== 'undefined' ? window : globalThis));
