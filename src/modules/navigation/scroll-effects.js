/**
 * Scroll Effects Module
 * Gestisce effetto sticky della navbar
 */

export class ScrollEffects {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.isScrolled = false;
    }

    init() {
        if (!this.nav) return;

        this.isScrolled = this.nav.classList.contains('scrolled');

        const updateNavbar = () => {
            const shouldBeScrolled = window.pageYOffset > 50;

            if (shouldBeScrolled !== this.isScrolled) {
                this.isScrolled = shouldBeScrolled;
                this.nav.classList.toggle('scrolled', shouldBeScrolled);
            }
        };

        updateNavbar();
        window.addEventListener('scroll', updateNavbar, { passive: true });
    }
}
