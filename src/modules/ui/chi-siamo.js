/**
 * Chi Siamo Card Interactions Module
 * Gestisce le interazioni con le card della sezione "Chi Siamo"
 */

export function initChiSiamoInteractions() {
    const chiSiamo = document.getElementById('chiSiamo');
    if (!chiSiamo) return;

    const circularCards = chiSiamo.querySelectorAll('.cardPag2');
    const descriptionCards = chiSiamo.querySelectorAll('.descriptionCardPag');
    const cardStack = chiSiamo.querySelector('.card-stack');

    if (!cardStack || circularCards.length === 0 || descriptionCards.length === 0) return;

    let currentExtracted = "1"; //--teal is default
    let selectedColor = null;
    let activeTimeout = null;
    let isAnimating = false;

    //no animation on first page load
    if (cardStack) {
        cardStack.setAttribute('data-extracted', '1');
    }

    circularCards.forEach(circularCard => {
        circularCard.addEventListener('mouseenter', () => {
            const cardNumber = circularCard.getAttribute('data-card');
            const targetCard = cardStack.querySelector(`.descriptionCardPag[data-card-id="${cardNumber}"]`);

            const col = circularCard.dataset.color;
            if (col) {
                chiSiamo.style.setProperty('--accent-color', col);
                selectedColor = col;
            }

            if (currentExtracted === cardNumber || !targetCard) return;

            //clear timeout for not messing order
            if (activeTimeout) {
                clearTimeout(activeTimeout);
                activeTimeout = null;
            }

            // Resetcard before applying animation
            descriptionCards.forEach(card => {
                card.classList.remove('extracting-step1', 'extracting-step2');
            });

            currentExtracted = cardNumber;
            if (cardStack) {
                cardStack.setAttribute('data-extracted', cardNumber);
            }

            isAnimating = true;

            targetCard.classList.add('extracting-step1');

            activeTimeout = setTimeout(() => {
                if (currentExtracted === cardNumber) {
                    targetCard.classList.remove('extracting-step1');
                    targetCard.classList.add('extracting-step2');
                    isAnimating = false;
                    activeTimeout = null;
                }
            }, 400);
        });
    });
}
