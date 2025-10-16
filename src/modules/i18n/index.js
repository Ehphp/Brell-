/**
 * I18n Module - Internationalization
 * Sistema di traduzione multilingua per Brellò Sharing
 */

class BrelloI18n {
    constructor() {
        this.currentLang = 'it';
        this.translations = {};
        this.isLoaded = false;
    }

    async loadTranslations() {
        try {
            // Load Italian translations
            const itResponse = await fetch('/i18n/it.json');
            const itData = await itResponse.json();
            this.translations.it = itData;

            // Load English translations
            const enResponse = await fetch('/i18n/en.json');
            const enData = await enResponse.json();
            this.translations.en = enData;

            this.isLoaded = true;
            this.updateContent();
        } catch (error) {
            console.warn('⚠️ Failed to load translations:', error);
        }
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.updateContent();
            localStorage.setItem('brello-lang', lang);

            // Track language change
            if (typeof gtag !== 'undefined') {
                gtag('event', 'language_change', {
                    event_category: 'engagement',
                    event_label: `language_changed_to_${lang}`
                });
            }

            // Dispatch custom event for other modules
            window.dispatchEvent(new CustomEvent('brello:languagechange', {
                detail: { language: lang }
            }));
        }
    }

    translate(key) {
        if (!this.isLoaded) return key;

        const keys = key.split('.');
        let translation = this.translations[this.currentLang];

        for (const k of keys) {
            if (translation && translation[k]) {
                translation = translation[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        return translation;
    }

    updateContent() {
        if (!this.isLoaded) return;

        // Update meta tags
        const title = this.translate('meta.title');
        if (title) {
            document.title = title;
        }

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            const description = this.translate('meta.description');
            if (description) {
                metaDescription.content = description;
            }
        }

        // Update all elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.translate(key);
            if (translation !== key) {
                if (el.innerHTML.includes('<')) {
                    // Handle HTML content
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Update language selector
        this.updateLanguageSelector();
    }

    updateLanguageSelector() {
        const langSelector = document.querySelector('.language-selector');
        if (langSelector) {
            const buttons = langSelector.querySelectorAll('button');
            buttons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === this.currentLang);
            });
        }
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    isReady() {
        return this.isLoaded;
    }
}

// Create singleton instance
let i18nInstance = null;

export function initI18n() {
    if (i18nInstance) return i18nInstance;

    i18nInstance = new BrelloI18n();

    // Load saved language preference
    const savedLang = localStorage.getItem('brello-lang');
    if (savedLang && ['it', 'en'].includes(savedLang)) {
        i18nInstance.currentLang = savedLang;
    }

    // Load translations
    i18nInstance.loadTranslations();

    // Add language selector event listeners
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.language-selector button').forEach(btn => {
            btn.addEventListener('click', () => {
                i18nInstance.setLanguage(btn.dataset.lang);
            });
        });
    });

    // Export globally for backward compatibility
    if (typeof window !== 'undefined') {
        window.brelloI18n = i18nInstance;
    }

    return i18nInstance;
}

// Export the translate function for convenience
export function t(key) {
    if (!i18nInstance) {
        console.warn('i18n not initialized. Call initI18n() first.');
        return key;
    }
    return i18nInstance.translate(key);
}

export function setLanguage(lang) {
    if (!i18nInstance) {
        console.warn('i18n not initialized. Call initI18n() first.');
        return;
    }
    i18nInstance.setLanguage(lang);
}

export function getCurrentLanguage() {
    if (!i18nInstance) return 'it';
    return i18nInstance.getCurrentLanguage();
}
