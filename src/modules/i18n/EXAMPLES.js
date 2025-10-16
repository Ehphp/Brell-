/**
 * Esempio di utilizzo del modulo I18n
 */

// ============================================
// 1. HTML: Aggiungi elementi traducibili
// ============================================

/*
<!-- Selettore lingua nella navbar -->
<div class="language-selector">
  <button data-lang="it" class="active">🇮🇹 IT</button>
  <button data-lang="en">🇬🇧 EN</button>
</div>

<!-- Elementi con traduzioni -->
<h1 data-i18n="hero.title">Default Title</h1>
<p data-i18n="hero.subtitle">Default Subtitle</p>
<button data-i18n="nav.cta">Default CTA</button>
*/

// ============================================
// 2. JavaScript: Uso programmatico
// ============================================

import { t, setLanguage, getCurrentLanguage } from '../modules/i18n/index.js';

// Tradurre una singola chiave
function example1() {
    const welcomeText = t('hero.title');
    console.log(welcomeText); // "Piove?? C'è Brellò" (se lingua IT)
}

// Cambiare lingua e aggiornare UI
function example2() {
    // Cambia a inglese
    setLanguage('en');

    // Tutti gli elementi con data-i18n verranno aggiornati automaticamente
}

// Ottenere lingua corrente
function example3() {
    const currentLang = getCurrentLanguage();
    console.log(`Lingua attuale: ${currentLang}`);
}

// Ascoltare cambiamenti di lingua
function example4() {
    window.addEventListener('brello:languagechange', (event) => {
        const newLang = event.detail.language;
        console.log(`Lingua cambiata in: ${newLang}`);

        // Aggiorna componenti custom che non usano data-i18n
        updateCustomComponents(newLang);
    });
}

function updateCustomComponents(lang) {
    // Esempio: aggiorna un componente dinamico
    const dynamicElement = document.querySelector('.dynamic-content');
    if (dynamicElement) {
        dynamicElement.innerHTML = t('custom.dynamic.content');
    }
}

// ============================================
// 3. Accesso globale (retrocompatibilità)
// ============================================

function example5() {
    // Puoi anche usare l'istanza globale
    if (window.brelloI18n) {
        window.brelloI18n.setLanguage('en');
        const title = window.brelloI18n.translate('hero.title');
        console.log(title);
    }
}

// ============================================
// 4. Traduzioni annidate
// ============================================

/*
JSON:
{
  "forms": {
    "sponsor": {
      "title": "Diventa Sponsor",
      "fields": {
        "company": "Ragione sociale",
        "email": "Email"
      }
    }
  }
}

JavaScript:
*/
function example6() {
    const companyLabel = t('forms.sponsor.fields.company');
    console.log(companyLabel); // "Ragione sociale"
}

// ============================================
// 5. Traduzioni con HTML
// ============================================

/*
JSON:
{
  "hero": {
    "subtitle": "<strong>Per cittadini:</strong> Prendi un ombrello quando piove"
  }
}

HTML:
<p data-i18n="hero.subtitle"></p>

Il modulo rileverà automaticamente l'HTML e userà innerHTML invece di textContent
*/

// ============================================
// 6. CSS per il selettore lingua
// ============================================

/*
.language-selector {
  display: flex;
  gap: 0.5rem;
}

.language-selector button {
  padding: 0.5rem 1rem;
  border: 2px solid var(--yellow);
  background: transparent;
  color: var(--cream);
  cursor: pointer;
  transition: all 0.3s;
}

.language-selector button.active {
  background: var(--yellow);
  color: var(--dark);
}

.language-selector button:hover {
  background: var(--yellow);
  color: var(--dark);
}
*/

// ============================================
// 7. Testing traduzione
// ============================================

function testI18n() {
    console.log('=== Test I18n Module ===');

    // Test 1: Lingua corrente
    console.log('Lingua corrente:', getCurrentLanguage());

    // Test 2: Traduzione semplice
    console.log('Hero title:', t('hero.title'));

    // Test 3: Traduzione annidata
    console.log('Nav CTA:', t('nav.cta'));

    // Test 4: Chiave inesistente (ritorna la chiave stessa)
    console.log('Non esistente:', t('this.does.not.exist'));

    // Test 5: Cambio lingua
    setLanguage('en');
    console.log('Hero title (EN):', t('hero.title'));

    // Torna a italiano
    setLanguage('it');
}

// Esegui test in dev mode
if (import.meta.env?.DEV) {
    // Aspetta che i18n sia caricato
    setTimeout(testI18n, 2000);
}

export { example1, example2, example3, example4, example5, example6, testI18n };
