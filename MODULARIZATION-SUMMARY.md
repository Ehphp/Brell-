# Modularizzazione v2.0 - Brello Sharing

Questo documento riassume la ristrutturazione del codice front-end da approccio monolitico a modulare.

## Obiettivi principali
- Separare le responsabilita in moduli ES6 facilmente manutenibili
- Migliorare le prestazioni tramite lazy loading e tree-shaking
- Preparare il progetto a integrazioni future (testing, TypeScript, backend)
- Mantenere gli script legacy disponibili per consultazione

## Architettura attuale
```
src/
|-- main.js                Inizializzazione dei moduli
|-- style.css              Punto di ingresso per gli stili
|-- styles/                Blocchi CSS organizzati per area
|-- modules/
|   |-- animations/        Effetti di scrolling, typing, pioggia ombrelli
|   |-- editor/            Upload, templates, controlli, preview e integrazione Three.js
|   |   |-- three-legacy.js Caricamento scena Three.js (da rifattorizzare)
|   |-- forms/             Validazione e submit handler
|   |-- i18n/              Gestione lingue dinamiche
|   |-- map/               Inizializzazione mappa e marker
|   |-- navigation/        Menu mobile, effetti sticky
|   |-- ui/                Componenti UI (CTA, admin, notifiche, toast)
|-- utils/                 Analytics e costanti condivise
```

## Gestione stili
- Gli stili sono suddivisi per blocco funzionale in `src/styles/`
- `src/style.css` importa i blocchi in ordine logico
- `src/main.js` importa `./style.css` per includere i CSS nel bundle Vite

## Asset legacy
- `legacy/script.js`: versione storica dell'app (841 righe)
- `legacy/i18n.js`: implementazione originale della localizzazione
- Documentazione correlata: `MIGRATION.md`, `CHECKLIST.md`

## Convenzioni applicate
- Moduli con `initXXX()` esposti da file `index.js`
- Funzioni pure e helper raggruppati in `utils/`
- Notifiche UI centralizzate in `src/modules/ui/notifications.js`
- Eventi Analytics gestiti tramite `trackEvent` in `src/utils/analytics.js`

## Attivita future suggerite
1. Estrarre la logica di `three-legacy.js` in moduli (scene, materiali, controlli)
2. Portare la localizzazione legacy dentro `src/modules/i18n/`
3. Introdurre test automatici (unit ed end-to-end)
4. Valutare TypeScript per i moduli critici e definire interfacce comuni
5. Creare un pacchetto di componenti UI riutilizzabili

## Riferimenti utili
- `README.md`: panoramica progetto e comandi
- `MIGRATION.md`: timeline dei cambi principali
- `docs/` cartella con guide specifiche per sezioni (landing, chi siamo, ecc.)

Questa sintesi sostituisce il precedente report ricco di caratteri non ASCII, mantenendo solo le informazioni operative necessarie.