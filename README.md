# Brello Sharing

Applicazione web modulare per il servizio di umbrella sharing gratuito ad Alatri.

## Caratteristiche principali
- Servizio gratuito per i cittadini, finanziato dagli sponsor
- Landing page dinamica con animazioni e CTA per sponsor e cittadini
- Editor 3D Three.js per personalizzare gli ombrelli
- Mappa interattiva con le postazioni disponibili
- Sistema i18n con traduzioni IT/EN

## Avvio rapido
```bash
npm install
npm run dev
```

Build di produzione:
```bash
npm run build
npm run preview
```

## Stack
- Vite 7
- Bootstrap 5.3
- Three.js 0.179
- Mapbox GL JS

## Struttura progetto
```
.
|-- docs/                 Documentazione funzionale e tecnica
|-- i18n/                 File JSON con le traduzioni
|-- legacy/               Codice monolitico preservato per riferimento
|   |-- i18n.js
|   |-- script.js
|-- public/               Asset statici serviti da Vite
|-- src/
|   |-- main.js           Entry point Vite
|   |-- style.css         Aggregatore CSS
|   |-- styles/           Stili modulari
|   |-- modules/          Moduli funzionali (UI, editor, forms, mappe, ecc.)
|   |   |-- editor/three-legacy.js  Integrazione Three.js
|   |-- utils/            Costanti e helper analytics
|-- package.json          Configurazione npm
```

## Script npm
- `npm run dev`: avvia il server di sviluppo Vite
- `npm run build`: crea la build di produzione
- `npm run preview`: serve la build generata

## Note su legacy/
I file in `legacy/` non sono piu caricati dal bundle principale ma restano disponibili per riferimento storico.

## Documentazione
Consultare `MIGRATION.md`, `MODULARIZATION-SUMMARY.md` e `CHECKLIST.md` per dettagli sulla ristrutturazione.
