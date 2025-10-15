# 🌂 Brellò Sharing

Piattaforma web per il servizio di umbrella sharing gratuito ad Alatri, finanziato da sponsor locali.

## 🎯 Caratteristiche

- 🌧️ **Servizio gratuito** per i cittadini
- 💼 **Pubblicità OOH** innovativa per sponsor
- 🗺️ **Mappa interattiva** con 10 stazioni
- 🎨 **Editor 3D** per personalizzazione ombrelli
- 📊 **Tracking QR code** per conversioni
- 🌍 **i18n** multilingua (IT/EN)

## 🚀 Quick Start

### Installazione

```bash
# Clona il repository
git clone https://github.com/Ehphp/Brell-.git

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

### Build per Produzione

```bash
# Crea build ottimizzata
npm run build

# Preview della build
npm run preview
```

## 📁 Struttura Progetto

```
Brell-/
├── src/                    # Codice sorgente modularizzato (NEW! ✨)
│   ├── main.js            # Entry point principale
│   ├── modules/           # Moduli funzionali
│   └── utils/             # Utility functions
├── public/                # Asset statici
├── i18n/                  # Traduzioni
├── docs/                  # Documentazione
├── index.html             # Pagina principale
├── scriptEditor.js        # Editor 3D Three.js
├── style.css              # Stili globali
└── package.json           # Dipendenze e script

```

### 🆕 Struttura Modularizzata v2.0

Il progetto è stato recentemente modularizzato per migliorare manutenibilità e scalabilità:

- **21 file modulari** invece di 1 monolitico
- **Pattern ES6** con import/export
- **Tree-shaking** automatico
- **Test-ready** architecture

📖 **Documentazione dettagliata:**
- [`src/README.md`](src/README.md) - Struttura moduli
- [`MIGRATION.md`](MIGRATION.md) - Guida migrazione
- [`MODULARIZATION-SUMMARY.md`](MODULARIZATION-SUMMARY.md) - Riepilogo completo

## 🛠️ Stack Tecnologico

- **Build Tool**: Vite 7.1.2
- **3D Engine**: Three.js
- **UI Framework**: Bootstrap 5.3.7
- **Map**: Mapbox GL JS
- **Modules**: ES6 Native Modules

## 📦 Dipendenze

```json
{
  "bootstrap": "^5.3.7",
  "express": "^5.1.0",
  "three": "^0.179.1",
  "vite": "^7.1.2"
}
```

## 🎨 Funzionalità Principali

### 1. Landing Page
- Hero section con animazione typing
- Pioggia di ombrelli animata
- CTA per sponsor e cittadini
- Sezione "Chi Siamo" interattiva

### 2. Editor 3D
- Upload logo sponsor
- Template pre-configurati
- Controlli scala/rotazione
- Preview 360° ombrello

### 3. Mappa Interattiva
- 10 stazioni umbrella sharing
- Geolocalizzazione utente
- Ricerca città
- Marker brand sponsor

### 4. Form Contatto
- Form sponsor (richiesta preventivo)
- Form cittadini (interesse servizio)
- Validazione client-side
- Tracking Google Analytics

## 🧪 Testing

```bash
# Unit tests (da implementare)
npm test

# E2E tests (da implementare)
npm run test:e2e
```

## 📊 Performance

- **Lighthouse Score**: 90+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size**: Ottimizzato con tree-shaking

## 🌍 Internazionalizzazione

Supporto per multiple lingue:
- 🇮🇹 Italiano (default)
- 🇬🇧 English

File di traduzione in `i18n/`.

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint: 768px, 1024px, 1440px
- Touch-friendly interactions
- Accessibilità WCAG 2.1

## 🔧 Configurazione

### Vite Config

Modifica `vite.config.js` per configurazioni build:

```javascript
export default {
  // Configurazione personalizzata
}
```

### Environment Variables

Crea `.env.local`:

```bash
VITE_MAPBOX_TOKEN=your_token_here
VITE_GA_TRACKING_ID=your_ga_id_here
```

## 🤝 Contributing

1. Fork il progetto
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit le modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

### Coding Standards

- ES6+ JavaScript
- Moduli ES6 (import/export)
- Commenti JSDoc per funzioni pubbliche
- Single Responsibility per moduli

## 📄 Licenza

Tutti i diritti riservati - Brellò Sharing © 2025

## 👥 Team

- **Development**: [Your Team]
- **Design**: [Your Designer]
- **Project Manager**: [Your PM]

## 📞 Contatti

- 🌐 Website: [brello-sharing.com](https://brello-sharing.com)
- 📧 Email: info@brello-sharing.com
- 📱 Social: [Links]

## 🎯 Roadmap

- [x] Landing page responsive
- [x] Editor 3D Three.js
- [x] Mappa interattiva
- [x] Modularizzazione codebase
- [ ] Backend API
- [ ] Sistema prenotazioni
- [ ] App mobile companion
- [ ] Dashboard admin
- [ ] Analytics avanzate

## 📝 Changelog

### v2.0.0 (Ottobre 2025)
- ✨ Modularizzazione completa codebase
- 📁 Struttura src/ con 21 moduli
- 🎨 Pattern ES6 modules
- 📚 Documentazione migliorata

### v1.0.0 (Precedente)
- 🎉 Release iniziale
- 🌂 Landing page
- 🎨 Editor 3D
- 🗺️ Mappa Mapbox

---

**Made with ☂️ and ❤️ in Alatri**