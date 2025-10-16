# Guida alla Migrazione - Brello Sharing

Questa guida riassume i passaggi effettuati per passare dal codice monolitico alla struttura modulare attuale.

## Stato attuale
- Entry point: `src/main.js`
- Stili: `src/style.css` con import dei moduli in `src/styles/`
- Editor 3D: `src/modules/editor/three-legacy.js` (side-effect import)
- Asset legacy conservati in `legacy/`

## File originali conservati
- `legacy/script.js`: implementazione monolitica della landing page
- `legacy/i18n.js`: vecchio gestore traduzioni
- `src/modules/editor/three-legacy.js`: integrazione Three.js da rifattorizzare in moduli

## Passaggi completati
1. Porting di `script.js` in moduli ES6 all'interno di `src/modules/`
2. Configurazione Vite come orchestratore di build e dev server
3. Suddivisione degli stili in file dedicati e import centralizzato in `src/style.css`
4. Separazione delle utility condivise in `src/utils/`
5. Aggiornamento di `index.html` per caricare `src/main.js`

## Passaggi consigliati (futuri)
1. Rifattorizzare `src/modules/editor/three-legacy.js` in moduli piu piccoli
2. Portare la logica di localizzazione dal file legacy a moduli dedicati
3. Introdurre unit test ed E2E (vedi `CHECKLIST.md`)
4. Valutare l'adozione di TypeScript per i moduli critici

## Flusso di lavoro
```bash
npm install
npm run dev     # sviluppo
npm run build   # build produzione
npm run preview # anteprima build
```

## Supporto
Per dettagli aggiuntivi consultare `MODULARIZATION-SUMMARY.md` e i documenti nella cartella `docs/`.