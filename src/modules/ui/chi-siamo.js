/**
 * Chi Siamo Card Interactions Module
 * Gestisce le interazioni con le card della sezione "Chi Siamo"
 */

export function initChiSiamoInteractions() {
    const chiSiamo = document.getElementById('chiSiamo');
    if (!chiSiamo) return;

    const circularCards = chiSiamo.querySelectorAll('.cardPag2');

    if (circularCards.length === 0) return;

    circularCards.forEach(circularCard => {
        circularCard.addEventListener('mouseenter', () => {

            const col = circularCard.dataset.color;
            if (col) {
                chiSiamo.style.setProperty('--accent-color', col);
            }
        });
    });
}
