/**
 * Forms Module - Barrel Export
 */

import { validateForm, collectFormData } from './validation.js';
import { SponsorForm, CitizenForm } from './handlers.js';

export { validateForm, collectFormData } from './validation.js';
export { SponsorForm, CitizenForm } from './handlers.js';

export function initForms() {
    const sponsorForm = new SponsorForm();
    sponsorForm.init();

    const citizenForm = new CitizenForm();
    citizenForm.init();
}
