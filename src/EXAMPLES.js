/**
 * ESEMPIO: Come creare un nuovo modulo
 * 
 * Questo file mostra come aggiungere una nuova funzionalità al progetto
 * seguendo la struttura modulare.
 */

// ============================================
// STEP 1: Crea il modulo
// File: src/modules/newsletter/newsletter.js
// ============================================

export class Newsletter {
    constructor() {
        this.form = document.getElementById('newsletter-form');
        this.emailInput = document.getElementById('newsletter-email');
    }

    async subscribe(email) {
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (!response.ok) throw new Error('Subscription failed');

            return { success: true };
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            return { success: false, error };
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const email = this.emailInput.value.trim();
        if (!email) return;

        this.subscribe(email)
            .then(result => {
                if (result.success) {
                    // Show success message
                    this.showMessage('✅ Iscrizione completata!', 'success');
                    this.form.reset();
                } else {
                    this.showMessage('❌ Errore durante l\'iscrizione', 'error');
                }
            });
    }

    showMessage(message, type) {
        // Importa showNotification dal modulo UI
        import('../ui/notifications.js').then(({ showNotification }) => {
            showNotification(message, type);
        });
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

// ============================================
// STEP 2: Crea il barrel export
// File: src/modules/newsletter/index.js
// ============================================

export { Newsletter } from './newsletter.js';

export function initNewsletter() {
    const newsletter = new Newsletter();
    newsletter.init();
}

// ============================================
// STEP 3: Aggiungi al main.js
// File: src/main.js
// ============================================

/*
import { initNewsletter } from './modules/newsletter/index.js';

function initApp() {
  // ... altri moduli
  initNewsletter();
}
*/

// ============================================
// STEP 4: Aggiungi l'HTML
// File: index.html
// ============================================

/*
<form id="newsletter-form" class="newsletter-form">
  <input 
    id="newsletter-email" 
    type="email" 
    placeholder="La tua email"
    required
  />
  <button type="submit">Iscriviti</button>
</form>
*/

// ============================================
// ESEMPIO CON TEST UNITARIO
// File: tests/unit/newsletter.test.js
// ============================================

/*
import { describe, it, expect, vi } from 'vitest';
import { Newsletter } from '../../src/modules/newsletter/newsletter.js';

describe('Newsletter', () => {
  it('should validate email before submitting', () => {
    const newsletter = new Newsletter();
    const result = newsletter.validateEmail('test@example.com');
    expect(result).toBe(true);
  });

  it('should reject invalid emails', () => {
    const newsletter = new Newsletter();
    const result = newsletter.validateEmail('invalid-email');
    expect(result).toBe(false);
  });
});
*/

// ============================================
// ESEMPIO: Modulo con configurazione
// ============================================

export class FeatureWithConfig {
    constructor(config = {}) {
        this.options = {
            enabled: config.enabled ?? true,
            timeout: config.timeout ?? 3000,
            retries: config.retries ?? 3,
            ...config
        };
    }

    init() {
        if (!this.options.enabled) {
            console.log('Feature disabled via config');
            return;
        }

        // Implementazione feature
    }
}

// Uso:
// const feature = new FeatureWithConfig({
//   enabled: true,
//   timeout: 5000
// });

// ============================================
// ESEMPIO: Modulo con eventi custom
// ============================================

export class EventEmitterModule extends EventTarget {
    constructor() {
        super();
        this.data = [];
    }

    addData(item) {
        this.data.push(item);

        // Emetti evento custom
        this.dispatchEvent(new CustomEvent('dataAdded', {
            detail: { item, total: this.data.length }
        }));
    }

    init() {
        // Altri moduli possono ascoltare gli eventi
        this.addEventListener('dataAdded', (e) => {
            console.log('Data added:', e.detail);
        });
    }
}

// Uso:
// const module = new EventEmitterModule();
// module.addEventListener('dataAdded', (e) => {
//   console.log('New item:', e.detail.item);
// });
// module.addData({ name: 'Test' });

// ============================================
// ESEMPIO: Singleton Pattern
// ============================================

class SingletonModule {
    static instance = null;

    constructor() {
        if (SingletonModule.instance) {
            return SingletonModule.instance;
        }

        this.data = new Map();
        SingletonModule.instance = this;
    }

    set(key, value) {
        this.data.set(key, value);
    }

    get(key) {
        return this.data.get(key);
    }
}

// Sempre la stessa istanza
export const dataStore = new SingletonModule();

// ============================================
// ESEMPIO: Factory Pattern
// ============================================

class BaseNotification {
    show(message) {
        console.log(message);
    }
}

class ToastNotification extends BaseNotification {
    show(message) {
        // Show toast
    }
}

class ModalNotification extends BaseNotification {
    show(message) {
        // Show modal
    }
}

export class NotificationFactory {
    static create(type) {
        switch (type) {
            case 'toast':
                return new ToastNotification();
            case 'modal':
                return new ModalNotification();
            default:
                return new BaseNotification();
        }
    }
}

// Uso:
// const notification = NotificationFactory.create('toast');
// notification.show('Hello!');

// ============================================
// BEST PRACTICES SUMMARY
// ============================================

/*
1. ✅ Una classe/funzionalità per file
2. ✅ Usa barrel exports (index.js)
3. ✅ Commenta il codice complesso
4. ✅ Gestisci gli errori con try/catch
5. ✅ Valida gli input
6. ✅ Usa async/await per operazioni asincrone
7. ✅ Emetti eventi per comunicazione tra moduli
8. ✅ Configura i moduli tramite costruttore
9. ✅ Pulisci le risorse in un metodo destroy()
10. ✅ Scrivi test per logica complessa
*/
