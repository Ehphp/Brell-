// Simple i18n implementation for Brellò
class BrelloI18n {
    constructor() {
        this.currentLang = 'it';
        this.translations = {};
        this.loadTranslations();
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

            this.updateContent();
        } catch (error) {
            console.warn('Failed to load translations:', error);
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
        }
    }

    translate(key) {
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
        // Update meta tags
        document.title = this.translate('meta.title');
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.translate('meta.description');
        }

        // Update navigation
        const navElements = document.querySelectorAll('[data-i18n]');
        navElements.forEach(el => {
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
}

// Initialize i18n
const i18n = new BrelloI18n();

// Load saved language preference
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('brello-lang');
    if (savedLang && ['it', 'en'].includes(savedLang)) {
        i18n.setLanguage(savedLang);
    }

    // Add language selector event listeners
    document.querySelectorAll('.language-selector button').forEach(btn => {
        btn.addEventListener('click', () => {
            i18n.setLanguage(btn.dataset.lang);
        });
    });
});