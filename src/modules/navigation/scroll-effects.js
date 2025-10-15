/**
 * Scroll Effects Module
 * Gestisce effetti di scroll come navbar sticky e smooth scroll
 */

export class ScrollEffects {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.lastScroll = 0;
    }

    initNavbarScroll() {
        if (!this.nav) return;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                this.nav.classList.add('scrolled');
            } else {
                this.nav.classList.remove('scrolled');
            }

            this.lastScroll = currentScroll;
        }, { passive: true });
    }

    initSmoothScroll() {
        // Smooth scroll per link e pulsanti con data-scroll
        document.querySelectorAll('[data-scroll], a[href^="#"]').forEach(el => {
            el.addEventListener('click', e => {
                const sel = el.getAttribute('data-scroll') || el.getAttribute('href');
                if (!sel || sel === '#') return;
                const tgt = document.querySelector(sel);
                if (tgt) {
                    e.preventDefault();
                    tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    init() {
        this.initNavbarScroll();
        this.initSmoothScroll();
    }
}
