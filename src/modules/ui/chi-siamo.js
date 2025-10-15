/**
 * Chi Siamo Card Interactions Module
 * Gestisce le interazioni con le card della sezione "Chi Siamo"
 */

export function initChiSiamoInteractions() {
    const chiSiamo = document.getElementById('chiSiamo');
    if (!chiSiamo) return;

    let selectedColor = null;

    chiSiamo.querySelectorAll('.cardPag2').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const col = card.dataset.color;
            if (col) {
                chiSiamo.style.setProperty('--accent-color', col);
            }
        });

        card.addEventListener('mouseleave', () => {
            if (selectedColor) {
                chiSiamo.style.setProperty('--accent-color', selectedColor);
            } else {
                chiSiamo.style.removeProperty('--accent-color');
            }
        });

        card.addEventListener('click', () => {
            const col = card.dataset.color;
            if (col) {
                selectedColor = col;
                chiSiamo.style.setProperty('--accent-color', col);
            }
        });
    });
}
