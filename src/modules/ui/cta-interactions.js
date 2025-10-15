/**
 * CTA Interactions Module
 * Gestisce le interazioni con i pulsanti CTA
 */

import { trackEvent } from '../../utils/analytics.js';

export function initCTAInteractions() {
    // CTA che aprono il form corretto con highlight
    document.querySelectorAll('[data-open]').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-open');
            const map = {
                sponsor: '#editorBrello',
                utente: '#chiSiamo'
            };

            const selector = map[target];
            if (!selector) return;

            // Scroll to section
            const section = document.querySelector(selector);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Highlight animation
                const card = section.querySelector('.card') || section;
                card.animate([
                    { boxShadow: '0 0 0 0 rgba(243,179,0,0)' },
                    { boxShadow: '0 0 0 10px rgba(243,179,0,.25)' }
                ], {
                    duration: 300,
                    direction: 'alternate',
                    iterations: 2
                });

                // Track CTA clicks
                trackEvent(
                    target === 'sponsor' ? 'click_cta_sponsor' : 'click_cta_citizens',
                    {
                        category: 'conversion',
                        label: `cta_${target}_clicked`
                    }
                );
            }
        });
    });
}
