/**
 * Editor Templates Module
 * Gestisce i template pre-configurati per l'editor
 */

import { showNotification } from '../ui/notifications.js';
import { trackEvent } from '../../utils/analytics.js';

const TEMPLATES = {
    restaurant: {
        text: 'Ristorante Da Mario',
        color: '#e74c3c',
        icon: '🍕'
    },
    bar: {
        text: 'Café Central',
        color: '#8b4513',
        icon: '☕'
    },
    shop: {
        text: 'Boutique Milano',
        color: '#9b59b6',
        icon: '🛍️'
    },
    service: {
        text: 'Tech Solutions',
        color: '#3498db',
        icon: '🔧'
    }
};

export class EditorTemplates {
    constructor() {
        this.templateBtns = document.querySelectorAll('.template-btn');
    }

    loadTemplate(templateType) {
        const template = TEMPLATES[templateType];
        if (!template) return;

        showNotification(`📋 Template "${template.text}" caricato`, 'info');

        // Apply the template to the 3D model
        if (typeof window.applyTemplate === 'function') {
            window.applyTemplate(template);
        }
    }

    init() {
        this.templateBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                this.templateBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const template = btn.dataset.template;
                this.loadTemplate(template);

                // Track template usage
                trackEvent('template_selected', {
                    category: 'editor',
                    label: template
                });
            });
        });
    }
}

export { TEMPLATES };
