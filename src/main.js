import './style.css';

import { initNavigation } from './modules/navigation/index.js';
import { initForms } from './modules/forms/index.js';
import { initUI } from './modules/ui/index.js';
import { initAnimations } from './modules/animations/index.js';
import { initI18n } from './modules/i18n/index.js';

let editorLoaded = false;
let mapLoaded = false;

const loadStartTime = Date.now();
const MIN_LOADING_TIME = 8000;

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    const elapsed = Date.now() - loadStartTime;
    const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsed);

    setTimeout(() => {
        loadingScreen.classList.add('hidden');

        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, remainingTime);
}

function initApp() {

    // Inizializza i18n (internazionalizzazione)
    initI18n();

    // Inizializza navigazione (menu mobile, scroll effects)
    initNavigation();

    // Inizializza UI elements (lazy loading, CTA, admin, footer)
    initUI();

    // Inizializza forms (validazione, submit handlers)
    initForms();

    // Inizializza animazioni (typing, umbrella rain, scroll animations)
    initAnimations();

    console.log('✅ Brellò Sharing - Ready! (Critical modules loaded)');

    hideLoadingScreen();
}

function lazyLoadEditor() {
    if (editorLoaded) return;

    const editorSection = document.getElementById('editorBrello');
    if (!editorSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !editorLoaded) {
                editorLoaded = true;
                console.log('📦 Lazy loading Editor 3D...');

                Promise.all([
                    import('./modules/editor/index.js'),
                    import('./modules/editor/three-legacy.js')
                ]).then(([{ initEditor }, { init3DEditor }]) => {
                    initEditor();
                    init3DEditor();
                    console.log('✅ Editor 3D loaded!');
                }).catch(err => {
                    console.error('❌ Error loading Editor:', err);
                });

                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '300px'
    });

    observer.observe(editorSection);
}


function lazyLoadMap() {
    if (mapLoaded) return;

    const mapSection = document.getElementById('chiSiamo');
    if (!mapSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !mapLoaded) {
                mapLoaded = true;
                console.log('📦 Lazy loading Map...');

                // Carica Mapbox script e CSS se non già presenti
                if (!window.mapboxgl) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
                    document.head.appendChild(link);

                    const script = document.createElement('script');
                    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
                    script.onload = () => {
                        import('./modules/map/index.js').then(({ initMap }) => {
                            initMap();
                            console.log('✅ Map loaded!');
                        }).catch(err => {
                            console.error('❌ Error loading Map:', err);
                        });
                    };
                    script.onerror = () => {
                        console.error('❌ Error loading Mapbox script');
                    };
                    document.head.appendChild(script);
                } else {
                    // Mapbox già caricato, carica solo il modulo
                    import('./modules/map/index.js').then(({ initMap }) => {
                        initMap();
                        console.log('✅ Map loaded!');
                    }).catch(err => {
                        console.error('❌ Error loading Map:', err);
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '200px'
    });

    observer.observe(mapSection);
}

function initLazyModules() {
    lazyLoadEditor();
    lazyLoadMap();
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initLazyModules();
});

if (import.meta.env?.DEV) {
    window.__brello__ = {
        version: '2.0.0',
        modules: {
            i18n: 'loaded',
            navigation: 'loaded',
            editor: 'lazy',
            map: 'lazy',
            forms: 'loaded',
            ui: 'loaded',
            animations: 'loaded'
        }
    };
}
