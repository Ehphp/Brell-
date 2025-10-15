/**
 * Footer Module
 * Gestisce elementi dinamici del footer
 */

export function initFooter() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
