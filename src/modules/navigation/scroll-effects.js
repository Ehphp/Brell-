/**
 * Scroll Effects Module
 * Gestisce effetti di scroll come navbar sticky e smooth scroll
 */

export class ScrollEffects {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.isScrolled = false;
    }

    initNavbarScroll() {
        if (!this.nav) return;

        this.isScrolled = this.nav.classList.contains('scrolled');

        const updateState = () => {
            const currentScroll = window.pageYOffset;
            const shouldBeScrolled = currentScroll > 50;

            if (shouldBeScrolled !== this.isScrolled) {
                this.isScrolled = shouldBeScrolled;
                this.nav.classList.toggle('scrolled', shouldBeScrolled);
            }
        };

        updateState();
        window.addEventListener('scroll', updateState, { passive: true });
    }

    resolveScrollTarget(element) {
        if (!element) return null;

        if (element.classList.contains('section-anchor')) {
            let next = element.nextElementSibling;

            while (next && next.classList.contains('section-anchor')) {
                next = next.nextElementSibling;
            }

            if (next) return next;

            if (element.parentElement) {
                return element.parentElement;
            }
        }

        return element;
    }

    initSmoothScroll() {
        // Smooth scroll per link e pulsanti con data-scroll
        document.querySelectorAll('[data-scroll], a[href^="#"]').forEach(el => {
            el.addEventListener('click', e => {
                const sel = el.getAttribute('data-scroll') || el.getAttribute('href');
                if (!sel || sel === '#') return;
                const tgt = document.querySelector(sel);
                const scrollTarget = this.resolveScrollTarget(tgt);
                if (scrollTarget) {
                    e.preventDefault();
                    scrollTarget.scrollIntoView({ block: 'start' });
                }
            });
        });
    }

    init() {
        this.initNavbarScroll();
        this.initSmoothScroll();
    }
}
