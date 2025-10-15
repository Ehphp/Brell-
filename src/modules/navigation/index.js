/**
 * Navigation Module - Barrel Export
 */

import { MobileMenu } from './mobile-menu.js';
import { ScrollEffects } from './scroll-effects.js';

export { MobileMenu } from './mobile-menu.js';
export { ScrollEffects } from './scroll-effects.js';

export function initNavigation() {
    const mobileMenu = new MobileMenu();
    mobileMenu.init();

    const scrollEffects = new ScrollEffects();
    scrollEffects.init();
}
