/**
 * Brellò Sharing - Main Application Entry Point
 * 
 * Questo è il punto di ingresso dell'applicazione che coordina
 * l'inizializzazione di tutti i moduli.
 */

// Import moduli
import { initNavigation } from './modules/navigation/index.js';
import { initEditor } from './modules/editor/index.js';
import { initMap } from './modules/map/index.js';
import { initForms } from './modules/forms/index.js';
import { initUI } from './modules/ui/index.js';
import { initAnimations } from './modules/animations/index.js';

/**
 * Inizializzazione dell'applicazione
 */
function initApp() {
    console.log('🎨 Brellò Sharing - Initializing...');

    // Inizializza navigazione (menu mobile, scroll effects)
    initNavigation();

    // Inizializza UI elements (lazy loading, CTA, admin, footer)
    initUI();

    // Inizializza forms (validazione, submit handlers)
    initForms();

    // Inizializza animazioni (typing, umbrella rain, scroll animations)
    initAnimations();

    console.log('✅ Brellò Sharing - Ready!');
}

/**
 * Inizializzazione moduli che richiedono il DOM completo
 */
function initDOMDependentModules() {
    // Inizializza editor 3D (upload, templates, controls)
    initEditor();

    // Inizializza mappa (Mapbox, markers, search)
    initMap();
}

// Avvia l'app al caricamento del DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initApp();
        initDOMDependentModules();
    });
} else {
    // DOM già caricato
    initApp();
    initDOMDependentModules();
}

// Export per debug (opzionale)
if (import.meta.env?.DEV) {
    window.__brello__ = {
        version: '2.0.0',
        modules: {
            navigation: 'loaded',
            editor: 'loaded',
            map: 'loaded',
            forms: 'loaded',
            ui: 'loaded',
            animations: 'loaded'
        }
    };
}
