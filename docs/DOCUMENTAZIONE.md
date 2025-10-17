# Documentazione Progetto Brello Sharing

## Obiettivo del documento
- Offrire una vista unica e aggiornata dell'applicazione Brello Sharing.
- Descrivere in dettaglio struttura della pagina, temi comunicativi e funzionalita' implementate.
- Evidenziare stato corrente, dipendenze tra componenti e principali gap da colmare per evoluzioni future.

## Panoramica generale
- **Proposizione di valore**: servizio di umbrella sharing gratuito per i cittadini, finanziato da sponsor che ottengono visibilita' su ogni ombrello e tramite il configuratore 3D.
- **Target primari**: inserzionisti interessati a campagne OOH innovative e cittadini che cercano ombrelli gratuiti.
- **Esperienza utente**: landing page one-page con sezioni dedicate (hero, vantaggi sponsor, come funziona, editor 3D, lead form, FAQ) e interazioni avanzate (animazioni, mappa interattiva, configuratore 3D).

## Stack tecnico e organizzazione del codice
- **Build tooling**: Vite (scripts `dev`, `build`, `preview` in `package.json`).
- **Librerie principali**:
  - Bootstrap 5 per componenti base (accordion, grid, modal).
  - Three.js (+ add-ons) per il configuratore 3D (`src/modules/editor/three-legacy.js`).
  - Mapbox GL JS per la mappa interattiva (`src/modules/map/index.js`).
  - Express presente come dipendenza ma non ancora configurato in repo (da valutare per hosting/SSR).
- **Organizzazione JS**: pattern modulare con cartella `src/modules` suddivisa per domini funzionali (`navigation`, `ui`, `forms`, `editor`, `map`, `animations`, `i18n`).
- **Stili**: CSS modulare in `src/styles` (base + sottocartelle per componenti, editor, forms, sezioni).
- **Asset**: modelli 3D e texture in `public/3d_model`, immagini in `public/images`, pacchetto di localizzazioni JSON in `i18n/`.
- **Testing**: singolo test di integrazione/mapa (`tests/map-search.spec.js`) che simula il flusso di ricerca citta' sulla mappa.
- **Legacy**: codice storico in `legacy/` (vecchio engine 3D e i18n) mantenuto per riferimento ma non inizializzato nel percorso corrente.

## Struttura della pagina (`index.html`)
| Sezione | ID / Ancore | Contenuto chiave | Obiettivi principali | Dipendenze JS |
|---------|-------------|------------------|----------------------|---------------|
| Navigazione | `.nav`, `#primary-nav` | Logo, menu principale, CTA mobile | Accesso rapido alle sezioni, supporto mobile | `navigation/mobile-menu.js`, `navigation/scroll-effects.js` |
| Hero | `#top` | Titolo, subtitle duale (cittadini/sponsor), CTA primarie, indicatori di fiducia | Spiegare in un colpo d'occhio la value proposition e attivare le prime CTA | Animazioni typing (`animations/typing`), tracking CTA |
| Vantaggi sponsor | `#sponsor-benefits` | Grid di 4 card + risultati misurabili | Convincere gli inserzionisti con proof-of-value | Animazioni scroll/border radius |
| Come funziona | `#chiSiamo`, `#case-studies` (ancore) | Step-by-step per i cittadini, mappa interattiva, statistiche servizio | Educare i cittadini e mostrare copertura territoriale | `map/index.js`, `forms`, `animations/scroll-animations.js` |
| Mappa interattiva | `#mapContainer`, `#map` | Mapbox GL con marker brand, ricerca citta', geolocalizzazione | Permettere agli utenti di trovare stazioni e monitorare engagement | `map/MapManager`, Mapbox access token |
| Configuratore 3D | `#editorBrello`, `#hero2` | Canvas Three.js, upload logo, template rapidi, slider scala/rotazione, banner info | Far vedere agli sponsor l'impatto visivo della campagna | `editor/*`, Three.js, `ui/notifications`, `ui/toast` |
| Lead form sponsor | `#inserzionisti`, `#form-sponsor` | Form con azienda, email, telefono opzionale | Raccolta lead commerciali | `forms/handlers.js`, analytics |
| Lead form cittadini | `#utenti`, `#form-utente` | Form per join list | Attivare cittadinanza e misurare interesse | `forms/handlers.js`, analytics |
| FAQ | `#faq` | Accordion con 5 domande ricorrenti + tracking eventi | Ridurre friction e tracciare interessi | Bootstrap collapse + analytics custom |
| Footer | sezione finale + ancore legali | Link placeholder (supporto, press, privacy...) e copyright | Struttura informativa future policies | `ui/footer.js` per anno dinamico |
| Componenti globali | `#umbrella-rain`, modale admin, toast | Animazione introduttiva, pannello admin, messaggi feedback | Rafforzare brand e strumenti interni | `animations/umbrella-rain.js`, `ui/admin.js`, `ui/toast.js` |

## Funzionalita' implementate (per modulo)
- **Navigazione (`src/modules/navigation`)**
  - `MobileMenu`: gestione menu responsive con focus management, aria attributes e chiusura su esc/click fuori.
  - `ScrollEffects`: stato sticky della navbar, aggiornamento offset CSS custom property, smooth scroll su anchor e compensazione elementi `section-anchor`.
- **UI (`src/modules/ui`)**
  - Lazy loading immagini via `IntersectionObserver` con fallback.
  - CTA contestuali che scrollano e mettono in evidenza le sezioni target con animazione e tracking.
  - Gestione admin (password statica) che abilita input editor; modale bootstrap supportata.
  - Notifiche temporanee (`showNotification`) e toast inline (`toast`).
  - Footer con anno dinamico, interazioni cromatiche per card "Chi siamo".
- **Forms (`src/modules/forms`)**
  - Validazione client-side (required, email format) con feedback visuale.
  - Raccolta dati con `FormData` e logging per integrazione futura.
  - Handler dedicati per sponsor e cittadini, con tracking eventi e toast conferma. Attualmente nessuna persistenza lato server.
- **Editor 3D (`src/modules/editor` + `three-legacy.js`)**
  - Caricamento modello GLTF, cache locale opzionale, texture normals/roughness.
  - Upload drag&drop con validazione tipo/dimensione e fallback per drag globali.
  - Template preconfigurati (ristorante, bar, shop, servizi) che popolano logo, colore, icona.
  - Slider di scala/rotazione collegati a funzioni globali (`window.updateLogoScale`/`updateLogoRotation`).
  - Modalita' preview full-screen generata runtime con CTA interna.
  - Integrazione (da completare) con funzioni `window.applyCustomTexture`/`applyTemplate` implementate nel file legacy.
- **Mappa (`src/modules/map`)**
  - Inizializzazione Mapbox con token/tema dedicati, marker brand, linea di collegamento tra punti.
  - Ricerca citta' con geocoding Mapbox e gestione stato loading/busy.
  - Bottone "Usa la mia posizione" collegato al controllo geolocate con gestione errori user-friendly.
  - Tracking view/interaction via analytics wrapper.
- **Animazioni (`src/modules/animations`)**
  - Digitazione hero loop, con reset e velocita' dinamica.
  - Effetto "pioggia di ombrelli" gestito via DOM + CSS dinamico, limitato una volta per sessione salvo override.
  - Animazioni on-scroll su mappa/editor (custom properties CSS) e border-radius dinamico per hero e sezione "Chi siamo".
- **Internazionalizzazione (`src/modules/i18n`)**
  - Caricamento asincrono delle traduzioni da `/i18n/it.json` e `/i18n/en.json`.
  - Persistenza lingua in `localStorage`, dispatch evento `brello:languagechange`.
  - Aggiornamento di meta tag, testo dinamico e language selector. Richiede che server esponga `/i18n/*.json`.
- **Utils**
  - `analytics.js`: wrapper gtag per tracciare eventi e pageview (fail-safe se GA non disponibile).
  - `constants.js`: breakpoint, durate animazioni, token Mapbox centralizzato, palette colori.
- **Testing**
  - `tests/map-search.spec.js`: test Node che verifica flusso di ricerca mappa, stato `isSearching`, abilitazione/disabilitazione pulsante e chiamata fetch. Usa stub DOM semplice.

## Stato attuale e copertura funzionale
- **Interfaccia utente**: tutte le sezioni principali della landing sono prototipate e collegate ai relativi moduli JS. Animazioni e CTA sono operative.
- **Configuratore 3D**: pipeline di caricamento modello funzionante; tuttavia alcune funzioni chiave (`applyCustomTexture`, `applyTemplate`, `updateLogoScale`, `updateLogoRotation`) dipendono ancora da implementazione globale nel legacy script. Serve verificare se la build Vite include correttamente `three-legacy.js` e se le funzioni vengono esposte.
- **Lead forms**: validazione client attiva e tracking eventi completato; manca integrazione server/API per persistenti e feedback reali (attualmente console log).
- **Internazionalizzazione**: logica pronta ma non vi e' un selettore visibile nel markup (button `.language-selector` non presente in `index.html`). Traduzioni non vengono caricate se i file JSON non sono serviti dal web server.
- **Mappa**: funzionale con dataset brand statico; route tra brand predisposta ma alimentata da array hardcoded.
- **Analytics**: gtag invocato in vari punti (CTA, FAQ, mappa) ma necessita snippet GA completo lato index (solo `dataLayer` e `gtag` stub, mancano script remote).
- **Accessibilita'**: presente attenzione a aria-label, focus e preferenze di movimento. Da validare con audit completo (es. contrasto, tasti).
- **Testing**: copertura minima (1 test). Non ci sono test per editor, animazioni, forms.
- **Documentazione**: la presente e' l'unica fonte centralizzata dopo rimozione dei documenti precedenti.

## Debito tecnico e rischi individuati
- Password admin hardcoded `"password"` e log in chiaro su console (`console.log(password)`) → rischio sicurezza.
- Token Mapbox in chiaro nel codice client (`constants.js` e `MapManager`). Necessario rotazione/regole rate limit se usato in produzione.
- Dipendenza da funzioni globali per editor 3D: coupling elevato, difficile da testare e mantenere.
- Nessuna gestione errori per fetch traduzioni/mappa lato UI (solo toast generici); manca fallback offline.
- Form submission priva di integrazione server: rischio perdita lead se utenti pensano di aver inviato richiesta.
- Mancanza di pipeline CI/test o lint: eventuali regressioni non intercettate.
- Assenza di loader di stato per geolocate failure/permessi negati oltre al toast generico.
- Dipendenza da assets in `public/3d_model` senza verifica integrita'/versioning.

## Opportunita' e possibili feature aggiuntive
1. **Integrazione backend per lead**: endpoint REST o servizio esterno (es. Airtable, HubSpot) con conferma email e tracking conversioni reali.
2. **Gestione template editor lato UI**: pannello salvataggio configurazioni (slot, palette, testo) e download asset (immagine/render).
3. **Dashboard sponsor**: sezione riservata (autenticazione admin sicura) con statistiche campagne e gestione slot.
4. **Sincronizzazione inventario ombrelli**: API per mostrare disponibilita' in tempo reale per ogni stazione, con update dinamici sulla mappa.
5. **Potenziamento i18n**: inserire language switcher visibile, aggiungere ulteriori lingue e fallback server-side.
6. **Modal FAQ dinamica**: caricare domande da CMS o file JSON per gestire aggiornamenti rapidi senza deploy.
7. **Estensione test**: integrare Playwright/Cypress per flussi principali (CTA sponsor, upload editor, ricerca mappa) e aggiungere test unitari su moduli UI/animazioni.
8. **Ottimizzazione performance**: lazy load del bundle Three.js solo quando la sezione editor entra in viewport; pre-render degli assets Mapbox con dati aggiornabili.
9. **Compliance legale**: completare sezioni placeholder (privacy, GDPR, cookies) con contenuti reali e cookie banner conforme.
10. **Analytics avanzato**: collegare gtag a GA4 reale, definire eventi personalizzati e misurazioni (tempo nella sezione editor, conversioni form).

## Percorsi e file di riferimento
- Entrypoint JS: `src/main.js`
- Moduli principali: `src/modules/**`
- Stili base: `src/styles/base.css` + sottocartelle
- Editor 3D engine: `src/modules/editor/three-legacy.js`
- Traduzioni: `i18n/it.json`, `i18n/en.json`
- Test automatizzati: `tests/map-search.spec.js`
- Asset 3D: `public/3d_model/*`

## Prossimi passi consigliati
- Definire owner per ciascuna area (frontend landing, editor 3D, backend/lead).
- Pianificare sprint di hardening (chiusura debiti tecnici: sicurezza admin, token Mapbox, integrazione API).
- Estendere copertura test e impostare pipeline CI/CD.
- Validare accessibilita' e performance con strumenti Lighthouse e manual testing multi-device.

