/**
 * Mobile Menu Module
 * Gestisce apertura/chiusura menu mobile e accessibilità
 */

export class MobileMenu {
    constructor() {
        this.navToggle = document.querySelector('.nav-toggle');
        this.navMenu = document.querySelector('.nav-menu');
        this.nav = document.querySelector('.nav');
        this.body = document.body;

        this.mobileQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
            ? window.matchMedia('(max-width: 768px)')
            : null;
    }

    isMobileView() {
        return this.mobileQuery ? this.mobileQuery.matches : window.innerWidth <= 768;
    }

    setMenuState(isOpen) {
        this.navToggle.setAttribute('aria-expanded', String(isOpen));
        this.navMenu.classList.toggle('active', isOpen);

        if (this.isMobileView()) {
            this.navMenu.setAttribute('aria-hidden', String(!isOpen));
            this.body.style.overflow = isOpen ? 'hidden' : '';

            if (isOpen) {
                const firstFocusable = this.navMenu.querySelector('a, button');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        } else {
            this.navMenu.setAttribute('aria-hidden', 'false');
            this.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.setMenuState(false);
    }

    handleViewportChange() {
        if (this.isMobileView()) {
            const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
            this.navMenu.setAttribute('aria-hidden', String(!isExpanded));
            if (!isExpanded) {
                this.navMenu.classList.remove('active');
                this.body.style.overflow = '';
            }
        } else {
            this.navMenu.classList.remove('active');
            this.navMenu.setAttribute('aria-hidden', 'false');
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.body.style.overflow = '';
        }
    }

    init() {
        if (!this.navToggle || !this.navMenu || !this.nav) return;

        // Toggle menu on button click
        this.navToggle.addEventListener('click', () => {
            const isExpanded = this.navToggle.getAttribute('aria-expanded') === 'true';
            this.setMenuState(!isExpanded);
        });

        // Close menu when clicking on a link
        this.navMenu.querySelectorAll('.link, .cta').forEach(link => {
            link.addEventListener('click', () => {
                if (this.navMenu.classList.contains('active')) {
                    this.closeMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.nav.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });

        // Close on Escape for keyboard users
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.closeMenu();
                this.navToggle.focus();
            }
        });

        // Handle viewport changes
        if (this.mobileQuery && typeof this.mobileQuery.addEventListener === 'function') {
            this.mobileQuery.addEventListener('change', () => this.handleViewportChange());
        } else if (this.mobileQuery && typeof this.mobileQuery.addListener === 'function') {
            this.mobileQuery.addListener(() => this.handleViewportChange());
        } else {
            window.addEventListener('resize', () => this.handleViewportChange(), { passive: true });
        }

        this.handleViewportChange();
    }
}
