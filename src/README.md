# 📁 Struttura Modularizzata - Brellò Sharing

## 🎯 Panoramica

Il progetto è stato ristrutturato in moduli ES6 per migliorare la manutenibilità e l'organizzazione del codice.

## 📂 Struttura delle Cartelle

```
src/
├── main.js                      # Entry point principale
├── modules/
│   ├── navigation/              # Navigazione e menu
│   │   ├── mobile-menu.js       # Gestione menu mobile
│   │   ├── scroll-effects.js    # Effetti scroll navbar
│   │   └── index.js             # Barrel export
│   │
│   ├── editor/                  # Editor 3D
│   │   ├── upload.js            # Upload e drag&drop file
│   │   ├── templates.js         # Template pre-configurati
│   │   ├── controls.js          # Slider scala/rotazione
│   │   ├── preview.js           # Preview full-screen
│   │   └── index.js             # Barrel export
│   │
│   ├── map/                     # Mappa interattiva
│   │   └── index.js             # Gestione Mapbox
│   │
│   ├── forms/                   # Gestione form
│   │   ├── validation.js        # Validazione input
│   │   ├── handlers.js          # Submit handlers
│   │   └── index.js             # Barrel export
│   │
│   ├── ui/                      # Elementi UI
│   │   ├── notifications.js     # Notifiche temporanee
│   │   ├── toast.js             # Toast messages
│   │   ├── lazy-loading.js      # Lazy loading immagini
│   │   ├── cta-interactions.js  # Interazioni CTA
│   │   ├── admin.js             # Login admin
│   │   ├── footer.js            # Footer dinamico
│   │   ├── chi-siamo.js         # Interazioni sezione
│   │   └── index.js             # Barrel export
│   │
│   └── animations/              # Animazioni
│       ├── typing.js            # Effetto typing titolo
│       ├── umbrella-rain.js     # Pioggia ombrelli
│       ├── scroll-animations.js # Animazioni scroll
│       └── index.js             # Barrel export
│
└── utils/                       # Utility functions
    ├── analytics.js             # Google Analytics wrapper
    └── constants.js             # Costanti applicazione
```

## 🚀 Come Funziona

### Entry Point

Il file `src/main.js` è il punto di ingresso che coordina l'inizializzazione di tutti i moduli:

```javascript
import { initNavigation } from './modules/navigation/index.js';
import { initEditor } from './modules/editor/index.js';
import { initMap } from './modules/map/index.js';
import { initForms } from './modules/forms/index.js';
import { initUI } from './modules/ui/index.js';
import { initAnimations } from './modules/animations/index.js';
```

### Barrel Exports

Ogni modulo ha un file `index.js` che funge da **barrel export**, esportando tutte le funzionalità del modulo:

```javascript
// modules/navigation/index.js
export { MobileMenu } from './mobile-menu.js';
export { ScrollEffects } from './scroll-effects.js';

export function initNavigation() {
  const mobileMenu = new MobileMenu();
  mobileMenu.init();
  // ...
}
```

## 📝 Convenzioni di Codice

### Classi

Le funzionalità complesse sono organizzate in **classi ES6**:

```javascript
export class MobileMenu {
  constructor() {
    // Inizializzazione
  }

  init() {
    // Setup event listeners
  }
}
```

### Funzioni Pure

Le utility sono organizzate come **funzioni pure**:

```javascript
export function validateForm(form) {
  // Logica di validazione
  return isValid;
}
```

### Naming Convention

- **PascalCase**: Classi (`MobileMenu`, `EditorUpload`)
- **camelCase**: Funzioni e variabili (`initNavigation`, `showNotification`)
- **UPPER_SNAKE_CASE**: Costanti (`MAPBOX_TOKEN`, `ANIMATION_DURATIONS`)

## 🔧 Vantaggi della Modularizzazione

### ✅ Separazione delle Responsabilità

Ogni modulo ha una responsabilità specifica e ben definita.

### ✅ Riutilizzabilità

I moduli possono essere riutilizzati o testati indipendentemente.

### ✅ Manutenibilità

Trovare e modificare il codice è molto più semplice.

### ✅ Tree-Shaking

Vite elimina automaticamente il codice non utilizzato.

### ✅ Testabilità

Ogni modulo può essere testato in isolamento.

## 🔄 Migrazione da script.js

Il vecchio `script.js` (841 righe) è stato diviso in:

- **Navigation**: 2 file (~150 righe)
- **Editor**: 4 file (~250 righe)
- **Map**: 1 file (~120 righe)
- **Forms**: 2 file (~100 righe)
- **UI**: 7 file (~200 righe)
- **Animations**: 3 file (~250 righe)
- **Utils**: 2 file (~50 righe)

**Totale: ~1120 righe** ben organizzate in **21 file modulari**

## 🛠️ Aggiungere Nuove Funzionalità

### Esempio: Aggiungere un nuovo modulo

1. Crea la cartella: `src/modules/nuovo-modulo/`
2. Crea i file necessari: `feature.js`, `index.js`
3. Esporta le funzionalità in `index.js`
4. Importa e inizializza in `src/main.js`

```javascript
// src/modules/nuovo-modulo/index.js
export function initNuovoModulo() {
  // Logica di inizializzazione
}

// src/main.js
import { initNuovoModulo } from './modules/nuovo-modulo/index.js';

function initApp() {
  initNuovoModulo();
  // ...
}
```

## 🧪 Testing (Futuro)

La struttura modulare facilita l'aggiunta di test:

```
tests/
├── unit/
│   ├── forms/
│   │   └── validation.test.js
│   └── ui/
│       └── notifications.test.js
└── integration/
    └── editor.test.js
```

## 📦 Build e Development

### Development

```bash
npm run dev
```

Vite carica automaticamente i moduli ES6.

### Production Build

```bash
npm run build
```

Vite ottimizza e bundla tutti i moduli.

## 🎨 Prossimi Passi Consigliati

1. **TypeScript**: Aggiungere types per maggiore type safety
2. **Testing**: Implementare unit test con Vitest
3. **Storybook**: Documentare i componenti UI
4. **Linting**: Configurare ESLint per standard di codice
5. **Pre-commit hooks**: Aggiungere Husky per validazione

## 📚 Risorse

- [ES6 Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [Vite Guide](https://vitejs.dev/guide/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

---

**Versione**: 2.0.0  
**Data**: Ottobre 2025  
**Autore**: Refactoring Team
