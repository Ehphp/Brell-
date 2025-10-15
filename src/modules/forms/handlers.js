/**
 * Form Handlers Module
 * Gestisce l'invio dei form sponsor e utente
 */

import { validateForm, collectFormData } from './validation.js';
import { toast } from '../ui/toast.js';
import { trackEvent } from '../../utils/analytics.js';

export class SponsorForm {
    constructor() {
        this.form = document.getElementById('form-sponsor');
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!validateForm(this.form)) {
            toast('Controlla i campi evidenziati');
            return;
        }

        const data = collectFormData(this.form);
        console.log('Sponsor lead:', data); // TODO: Integrate with API or backend

        // Track form submission
        trackEvent('submit_form_sponsor', {
            category: 'conversion',
            label: 'sponsor_form_completed',
            value: 1
        });

        this.form.reset();
        toast('Richiesta inviata! Ti scriviamo presto.');
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

export class CitizenForm {
    constructor() {
        this.form = document.getElementById('form-utente');
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!validateForm(this.form)) {
            toast('Controlla i campi evidenziati');

            // Track validation errors
            trackEvent('form_validation_error', {
                category: 'user_experience',
                label: 'citizen_form_error'
            });
            return;
        }

        const data = collectFormData(this.form);
        console.log('Utente lead:', data); // TODO: Integrate with API or backend

        // Track form submission
        trackEvent('submit_form_citizen', {
            category: 'conversion',
            label: 'citizen_form_completed',
            value: 1
        });

        this.form.reset();
        toast('Fatto! Ti avviseremo quando arriviamo.');
    }

    init() {
        if (!this.form) return;
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
}
