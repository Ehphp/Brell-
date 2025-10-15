/**
 * Typing Animation Module
 * Gestisce l'animazione "type-in" del titolo
 */

export class TypingAnimation {
    constructor(elementId = 'headline') {
        this.element = document.getElementById(elementId);
        if (!this.element) return;

        this.fullText = this.element.textContent.trim();
        this.element.textContent = '';
        this.index = 0;
    }

    type() {
        if (!this.element) return;

        if (this.index <= this.fullText.length) {
            this.element.textContent = this.fullText.slice(0, this.index++);
            // Velocità: primi caratteri leggermente più rapidi
            requestAnimationFrame(() => {
                setTimeout(() => this.type(), this.index < 8 ? 40 : 60);
            });
        } else {
            // Pausa a fine riga, poi reset e ripartenza
            setTimeout(() => {
                this.index = 0;
                this.element.textContent = '';
                requestAnimationFrame(() => this.type());
            }, 2700);
        }
    }

    start() {
        window.addEventListener('load', () => this.type());
    }
}
