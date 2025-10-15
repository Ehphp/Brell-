/**
 * UI Module - Barrel Export
 */

import { showNotification } from './notifications.js';
import { toast } from './toast.js';
import { initLazyLoading } from './lazy-loading.js';
import { initCTAInteractions } from './cta-interactions.js';
import { initAdmin, admin, password } from './admin.js';
import { initFooter } from './footer.js';
import { initChiSiamoInteractions } from './chi-siamo.js';

export { showNotification } from './notifications.js';
export { toast } from './toast.js';
export { initLazyLoading } from './lazy-loading.js';
export { initCTAInteractions } from './cta-interactions.js';
export { initAdmin, admin, password } from './admin.js';
export { initFooter } from './footer.js';
export { initChiSiamoInteractions } from './chi-siamo.js';

export function initUI() {
    initLazyLoading();
    initCTAInteractions();
    initAdmin();
    initFooter();
    initChiSiamoInteractions();
}
