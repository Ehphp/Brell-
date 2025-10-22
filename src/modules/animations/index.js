/**
 * Animations Module - Barrel Export
 */

import { TypingAnimation } from './typing.js';
import { initScrollAnimations, initBorderRadiusAnimations } from './scroll-animations.js';

export { TypingAnimation } from './typing.js';
export { initScrollAnimations, initBorderRadiusAnimations } from './scroll-animations.js';

export function initAnimations() {
    // Typing animation
    const typing = new TypingAnimation();
    typing.start();

    // Scroll-based animations
    initScrollAnimations();
    initBorderRadiusAnimations();
}
