/**
 * Scroll Effects Module
 * Gestisce effetti di scroll come navbar sticky e smooth scroll
 */

export class ScrollEffects {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.lastScroll = 0;
        this.root = document.documentElement;
        this.currentOffset = null;
        this.extraOffset = 12;
        this.isScrolled = false;
        this.navObserver = null;
    }

    updateNavOffset() {
        if (!this.nav || !this.root) return;

        const navHeight = Math.ceil(this.nav.offsetHeight || 0);
        if (!navHeight) return;

        const offset = navHeight + this.extraOffset;
        if (this.currentOffset === offset) return;

        this.currentOffset = offset;
        this.root.style.setProperty('--nav-offset', `${offset}px`);
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
                requestAnimationFrame(() => this.updateNavOffset());
            }

            this.lastScroll = currentScroll;
        };

        this.updateNavOffset();
        updateState();

        window.addEventListener('scroll', updateState, { passive: true });
        window.addEventListener('resize', () => this.updateNavOffset());

        if (typeof ResizeObserver !== 'undefined') {
            this.navObserver = new ResizeObserver(() => this.updateNavOffset());
            this.navObserver.observe(this.nav);
        }
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
                    this.updateNavOffset();
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
