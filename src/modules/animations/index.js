/**
 * Animations Module - Barrel Export
 */

import { TypingAnimation } from './typing.js';
import { UmbrellaRain, initUmbrellaRain } from './umbrella-rain.js';
import { initScrollAnimations, initBorderRadiusAnimations } from './scroll-animations.js';

export { TypingAnimation } from './typing.js';
export { UmbrellaRain, initUmbrellaRain } from './umbrella-rain.js';
export { initScrollAnimations, initBorderRadiusAnimations } from './scroll-animations.js';

export function initAnimations() {
    // Typing animation
    const typing = new TypingAnimation();
    typing.start();

    // Umbrella rain
    // initUmbrellaRain();

    // Scroll-based animations
    initScrollAnimations();
    initBorderRadiusAnimations();
}
