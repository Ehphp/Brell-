# 🚀 Quick Reference - Brellò Sharing

Comandi e riferimenti rapidi per sviluppatori.

## 📦 NPM Scripts

```bash
# Development
npm run dev              # Avvia server dev (porta 5173 o successive)

# Build
npm run build           # Build per produzione (output in dist/)

# Preview
npm run preview         # Preview della build di produzione
```

## 📁 Struttura Rapida

```
src/
├── main.js                      # 👈 START HERE
├── modules/
│   ├── navigation/             # Menu, scroll
│   ├── editor/                 # 3D editor controls
│   ├── map/                    # Mapbox
│   ├── forms/                  # Validation, submit
│   ├── ui/                     # Notifiche, toast, lazy
│   └── animations/             # Typing, rain, scroll
└── utils/
    ├── analytics.js            # GA tracking
    └── constants.js            # Costanti globali
```

## 🎯 Import Patterns

### ✅ DO - Usa barrel exports

```javascript
// Pulito e organizzato
import { initNavigation } from './modules/navigation/index.js';
import { initEditor } from './modules/editor/index.js';
```

### ❌ DON'T - Import diretti

```javascript
// Evita questo
import { MobileMenu } from './modules/navigation/mobile-menu.js';
import { ScrollEffects } from './modules/navigation/scroll-effects.js';
```

## 🧩 Aggiungere un Modulo

### 1. Crea il file

```bash
src/modules/nuovo-modulo/feature.js
```

### 2. Implementa la classe/funzione

```javascript
export class MyFeature {
  constructor() { }
  init() { }
}
```

### 3. Crea barrel export

```javascript
// src/modules/nuovo-modulo/index.js
export { MyFeature } from './feature.js';

export function initNuovoModulo() {
  const feature = new MyFeature();
  feature.init();
}
```

### 4. Aggiungi a main.js

```javascript
import { initNuovoModulo } from './modules/nuovo-modulo/index.js';

function initApp() {
  initNuovoModulo();
  // ...
}
```

## 🔧 Utility Functions

### Analytics

```javascript
import { trackEvent } from '../../utils/analytics.js';

trackEvent('button_clicked', {
  category: 'engagement',
  label: 'cta_sponsor',
  value: 1
});
```

### Notifications

```javascript
import { showNotification } from '../ui/notifications.js';

showNotification('✅ Success!', 'success');
showNotification('⚠️ Warning!', 'warning');
showNotification('❌ Error!', 'error');
showNotification('ℹ️ Info!', 'info');
```

### Toast

```javascript
import { toast } from '../ui/toast.js';

toast('Messaggio breve');
```

## 🎨 Pattern Comuni

### Class Module

```javascript
export class MyModule {
  constructor(config = {}) {
    this.options = { ...defaults, ...config };
  }

  init() {
    this.setupEventListeners();
  }

  setupEventListeners() {
    // ...
  }

  destroy() {
    // Cleanup
  }
}
```

### Functional Module

```javascript
export function myFunction() {
  // Pure function logic
  return result;
}

export function initMyModule() {
  myFunction();
}
```

### Singleton

```javascript
class SingletonModule {
  static instance = null;

  constructor() {
    if (SingletonModule.instance) {
      return SingletonModule.instance;
    }
    SingletonModule.instance = this;
  }
}

export const instance = new SingletonModule();
```

## 🐛 Debug

### Development Mode

```javascript
// Check module status
console.log(window.__brello__);
// Output: { version: '2.0.0', modules: {...} }
```

### Console Logging

```javascript
// Use in development only
if (import.meta.env?.DEV) {
  console.log('Debug info:', data);
}
```

## 📝 Naming Conventions

### Files
```
kebab-case.js          ✅ mobile-menu.js
camelCase.js           ❌ mobileMenu.js
PascalCase.js          ❌ MobileMenu.js
```

### Variables & Functions
```javascript
const myVariable = 'value';        // ✅ camelCase
function myFunction() {}           // ✅ camelCase
const MY_CONSTANT = 'value';       // ✅ UPPER_SNAKE_CASE
```

### Classes
```javascript
class MyClass {}                   // ✅ PascalCase
class myClass {}                   // ❌ camelCase
```

## 🔍 Find in Project

### Cerca un modulo
```bash
# PowerShell
Get-ChildItem -Path src -Filter "*navigation*" -Recurse

# Alternativa
tree /F /A src
```

### Cerca codice
```bash
# Cerca una funzione
grep -r "functionName" src/

# Cerca un import
grep -r "from.*module" src/
```

## 🎯 Hot Spots (File più modificati)

1. **`src/main.js`** - Aggiungi nuovi moduli
2. **`src/modules/ui/notifications.js`** - Notifiche
3. **`src/modules/forms/handlers.js`** - Form logic
4. **`src/modules/editor/upload.js`** - Upload files
5. **`src/utils/constants.js`** - Costanti

## 📚 Documentation Links

### Internal
- [Struttura Moduli](src/README.md)
- [Guida Migrazione](MIGRATION.md)
- [Esempi Pattern](src/EXAMPLES.js)
- [Riepilogo Completo](MODULARIZATION-SUMMARY.md)
- [Checklist](CHECKLIST.md)

### External
- [Vite Docs](https://vitejs.dev/)
- [Three.js Docs](https://threejs.org/docs/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Bootstrap 5](https://getbootstrap.com/docs/5.3/)

## 🔥 Common Tasks

### Add new animation
```bash
1. Create: src/modules/animations/my-animation.js
2. Export in: src/modules/animations/index.js
3. Auto-initialized by: initAnimations()
```

### Add new form
```bash
1. Create: src/modules/forms/my-form.js
2. Export in: src/modules/forms/index.js
3. Call in: initForms()
```

### Add new UI component
```bash
1. Create: src/modules/ui/my-component.js
2. Export in: src/modules/ui/index.js
3. Call in: initUI()
```

## ⚡ Performance Tips

### Lazy Import
```javascript
// Carica solo quando necessario
button.addEventListener('click', async () => {
  const { heavyModule } = await import('./heavy-module.js');
  heavyModule.init();
});
```

### Debounce
```javascript
let timeout;
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    // Heavy operation
  }, 250);
});
```

### RequestAnimationFrame
```javascript
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateUI();
      ticking = false;
    });
    ticking = true;
  }
});
```

## 🎨 CSS Custom Properties

```javascript
// Leggi
const color = getComputedStyle(element).getPropertyValue('--accent-color');

// Scrivi
element.style.setProperty('--accent-color', '#F3B300');

// Rimuovi
element.style.removeProperty('--accent-color');
```

## 🔐 Environment Variables

```javascript
// Usa in development
const apiKey = import.meta.env.VITE_API_KEY;

// Check environment
if (import.meta.env.DEV) {
  console.log('Development mode');
}

if (import.meta.env.PROD) {
  console.log('Production mode');
}
```

## 📱 Responsive Utilities

```javascript
// Check mobile
const isMobile = window.matchMedia('(max-width: 768px)').matches;

// Watch changes
const mq = window.matchMedia('(max-width: 768px)');
mq.addEventListener('change', (e) => {
  if (e.matches) {
    // Mobile view
  } else {
    // Desktop view
  }
});
```

## 🛠️ VS Code Tips

### Recommended Extensions
- ESLint
- Prettier
- Vite
- Path Intellisense
- Auto Import

### Shortcuts
- `Ctrl+P` - Quick file open
- `Ctrl+Shift+F` - Search in files
- `F12` - Go to definition
- `Ctrl+Click` - Follow import

## 🚨 Common Errors

### "Cannot find module"
✅ **Fix**: Check import path
```javascript
// Relativo alla posizione corrente
import { x } from './file.js';     // ✅
import { x } from '../folder/file.js'; // ✅
```

### "Unexpected token 'export'"
✅ **Fix**: Usa `type="module"` in HTML
```html
<script type="module" src="/src/main.js"></script>
```

### "Module not found"
✅ **Fix**: Path assoluto da root
```javascript
import { x } from '/src/modules/x/index.js'; // ✅
```

## 💡 Pro Tips

1. **Usa barrel exports** per import puliti
2. **Mantieni file sotto 100 righe** quando possibile
3. **Commenta codice complesso** con JSDoc
4. **Valida input** sempre
5. **Gestisci errori** con try/catch
6. **Usa const** di default, let solo se necessario
7. **Evita var** (deprecated)
8. **Async/await** invece di promise chains
9. **Arrow functions** per callbacks
10. **Destructuring** per import multipli

## 🎯 Quick Actions

```bash
# Pulisci node_modules
rm -rf node_modules; npm install

# Pulisci cache Vite
rm -rf node_modules/.vite

# Check outdated packages
npm outdated

# Update packages
npm update

# Audit security
npm audit

# Fix security issues
npm audit fix
```

---

**Keep this handy! 📌**
