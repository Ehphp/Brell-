/**
 * Chi Siamo Card Interactions Module
 * Gestisce le interazioni con le card della sezione "Chi Siamo"
 */

export function initChiSiamoInteractions() {
    const chiSiamo = document.getElementById('chiSiamo');
    if (!chiSiamo) return;

    const circularCards = chiSiamo.querySelectorAll('.cardPag2');
    const textLabels = chiSiamo.querySelectorAll('.chiSiamo-steps_labels p');
    if (circularCards.length === 0 || textLabels.length === 0) return;

    circularCards.forEach(circularCard => {
        circularCard.addEventListener('mouseenter', () => {

            const col = circularCard.dataset.color;
            if (col) {
                chiSiamo.style.setProperty('--accent-color', col);
            }

            const cardIndex = parseInt(circularCard.dataset.card, 10) - 1;
            if (textLabels[cardIndex]) {
                textLabels[cardIndex].style.color = 'var(--yellow)';
                textLabels[cardIndex].style.transform = 'translateX(10px)';
            }
        });

        circularCard.addEventListener('mouseleave', () => {
            const cardIndex = parseInt(circularCard.dataset.card, 10) - 1;
            if (textLabels[cardIndex]) {
 
                textLabels[cardIndex].style.color = '';
                textLabels[cardIndex].style.transform = ''; 
            }
        });
    });

    textLabels.forEach((label, index) => {
        label.addEventListener('mouseenter', () => {
            label.style.color = 'var(--yellow)';
            label.style.transform = 'translateX(10px)';
        });

        label.addEventListener('mouseleave', () => {
            label.style.color = '';
            label.style.transform = '';
        });
    });
}
