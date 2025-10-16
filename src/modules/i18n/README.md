# Modulo I18n - Internazionalizzazione

Sistema di traduzione multilingua per Brellò Sharing.

## Caratteristiche

- ✅ Supporto multilingua (IT/EN)
- ✅ Caricamento asincrono delle traduzioni
- ✅ Salvataggio preferenza lingua in localStorage
- ✅ Aggiornamento dinamico dei contenuti
- ✅ Event tracking per Google Analytics
- ✅ API semplice e intuitiva

## Utilizzo Base

### 1. Inizializzazione

Il modulo viene inizializzato automaticamente in `src/main.js`:

```javascript
import { initI18n } from './modules/i18n/index.js';

initI18n();
```

### 2. Markup HTML con traduzioni

Aggiungi l'attributo `data-i18n` agli elementi da tradurre:

```html
<h1 data-i18n="hero.title">Testo di default</h1>
<p data-i18n="hero.subtitle">Sottotitolo di default</p>
```

### 3. Selettore lingua

Aggiungi un selettore di lingua nell'HTML:

```html
<div class="language-selector">
  <button data-lang="it">IT</button>
  <button data-lang="en">EN</button>
</div>
```

### 4. Uso programmatico

```javascript
import { t, setLanguage, getCurrentLanguage } from './modules/i18n/index.js';

// Tradurre una chiave
const title = t('hero.title');

// Cambiare lingua
setLanguage('en');

// Ottenere lingua corrente
const lang = getCurrentLanguage(); // 'it' o 'en'
```

## Struttura File di Traduzione

I file di traduzione sono in formato JSON nella cartella `/i18n/`:

```json
{
  "meta": {
    "title": "Titolo della pagina",
    "description": "Descrizione meta"
  },
  "nav": {
    "how_it_works": "Come funziona",
    "for_sponsors": "Per sponsor"
  },
  "hero": {
    "title": "Titolo hero",
    "subtitle": "Sottotitolo hero"
  }
}
```

## Eventi

Il modulo emette eventi personalizzati:

```javascript
// Ascolta cambiamenti di lingua
window.addEventListener('brello:languagechange', (e) => {
  console.log('Nuova lingua:', e.detail.language);
});
```

## Accesso Globale

Per retrocompatibilità, l'istanza è disponibile globalmente:

```javascript
window.brelloI18n.setLanguage('en');
window.brelloI18n.translate('hero.title');
```

## Note

- La lingua di default è **italiano** (it)
- La preferenza viene salvata in `localStorage` con chiave `brello-lang`
- Se le traduzioni non sono caricate, viene restituita la chiave originale
- I cambiamenti di lingua vengono tracciati in Google Analytics

## Aggiungere Nuove Lingue

1. Crea un nuovo file JSON in `/i18n/` (es: `fr.json`)
2. Aggiungi il caricamento in `src/modules/i18n/index.js`:

```javascript
const frResponse = await fetch('/i18n/fr.json');
const frData = await frResponse.json();
this.translations.fr = frData;
```

3. Aggiorna il controllo delle lingue valide:

```javascript
if (savedLang && ['it', 'en', 'fr'].includes(savedLang)) {
  // ...
}
```
