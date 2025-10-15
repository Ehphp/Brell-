/**
 * Scroll Animations Module
 * Gestisce le animazioni basate sullo scroll
 */

// Utility functions
const BR_CLAMP = (n, a, b) => Math.max(a, Math.min(b, n));
const BR_EASE_CUBIC = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function BR_progressFor(el, startRatio = 0.80, endRatio = 0.20) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = rect.top + rect.height / 2;
    const S = vh * startRatio;
    const R = vh * endRatio;
    let p = 1 - (center - S) / (R - S);
    return BR_CLAMP(p, 0, 1);
}

export function initScrollAnimations() {
    const BR_items = [];

    // #mapContainer → aggiorna --p
    const BR_elMap = document.querySelector('#mapContainer');
    if (BR_elMap) {
        BR_items.push({
            el: BR_elMap,
            startRatio: 0.80,
            endRatio: 0.20,
            apply: (el, p) => {
                const pe = BR_EASE_CUBIC(p);
                el.style.setProperty('--p', pe.toFixed(4));
            }
        });
    }

    // #editorBrello → muove il centro del conic-gradient lungo X
    const BR_elEditor = document.querySelector('#editorBrello');
    if (BR_elEditor) {
        BR_items.push({
            el: BR_elEditor,
            startRatio: 0.80,
            endRatio: 0.20,
            xMin: 50,
            xMax: 88,
            apply: (el, p, cfg) => {
                const pe = BR_EASE_CUBIC(p);
                const x = cfg.xMin + (cfg.xMax - cfg.xMin) * pe;
                el.style.setProperty('--g-x', x.toFixed(2) + '%');
            }
        });
    }

    if (!BR_items.length) return;

    let BR_ticking = false;

    function BR_updateAll() {
        for (const item of BR_items) {
            const p = BR_progressFor(item.el, item.startRatio, item.endRatio);
            item.apply(item.el, p, item);
        }
    }

    function BR_onScroll() {
        if (!BR_ticking) {
            BR_ticking = true;
            requestAnimationFrame(() => {
                BR_updateAll();
                BR_ticking = false;
            });
        }
    }

    // Init + listeners
    BR_updateAll();
    window.addEventListener('scroll', BR_onScroll, { passive: true });
    window.addEventListener('resize', BR_onScroll);
}

export function initBorderRadiusAnimations() {
    // Sezioni da animare con border-radius dinamico
    const targets = [...document.querySelectorAll('#top, #chiSiamo')]
        .map(el => ({
            el,
            start: parseFloat(el.dataset.rStart) || 800,
            end: parseFloat(el.dataset.rEnd) || 330
        }))
        .filter(t => t.el);

    if (!targets.length) return;

    const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    let ticking = false;

    function updateAll() {
        const vh = window.innerHeight;

        for (const { el, start, end } of targets) {
            const rect = el.getBoundingClientRect();
            const total = vh + rect.height;
            const seen = clamp(vh - rect.top, 0, total);
            const t = easeInOutCubic(seen / total);
            const r = lerp(start, end, t);

            el.style.setProperty('--r', `${r}px`);
        }
        ticking = false;
    }

    function onScrollOrResize() {
        if (!ticking) {
            requestAnimationFrame(updateAll);
            ticking = true;
        }
    }

    // Init
    updateAll();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
}
