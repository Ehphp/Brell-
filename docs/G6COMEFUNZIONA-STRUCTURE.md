# Documentazione Card `#g6ComeFunziona`

## 📋 Overview
La card **"Come funziona"** è un componente informativo che mostra i dettagli del servizio Brellò e permette la ricerca di città sulla mappa. È posizionata nella colonna destra della sezione `#chiSiamo`, sotto la mappa interattiva.

---

## 🏗️ Struttura HTML Completa

```html
<div class="card g6ComeFunziona" id="g6ComeFunziona">
  
  <!-- 1. HEADER: Titolo e sottotitolo -->
  <header class="howto__header">
    <h3>Come funziona</h3>
    <p class="howto__subtitle">Trova subito un ombrello gratuito Brellò.</p>
  </header>

  <!-- 2. INTRO: Testo introduttivo -->
  <div class="howto__intro">
    <p class="howto__intro-text">
      Seleziona la tua città o usa la posizione corrente per scoprire i punti attivi.
    </p>
  </div>

  <!-- 3. META: Statistiche + Form di ricerca -->
  <div class="howto__meta">
    
    <!-- 3A. STATS: Lista di statistiche (definition list) -->
    <dl class="howto__stats" aria-label="Dati sul servizio Brellò">
      
      <!-- Statistica 1: Stazioni attive -->
      <div class="howto__stat">
        <dt class="howto__stat-label">Stazioni attive</dt>
        <dd class="howto__stat-value" aria-live="polite">10</dd>
      </div>
      
      <!-- Statistica 2: Ombrelli disponibili -->
      <div class="howto__stat">
        <dt class="howto__stat-label">Ombrelli disponibili</dt>
        <dd class="howto__stat-value" aria-live="polite">300</dd>
      </div>
      
      <!-- Statistica 3: Costo per i cittadini -->
      <div class="howto__stat">
        <dt class="howto__stat-label">Costo per i cittadini</dt>
        <dd class="howto__stat-value">0&nbsp;€</dd>
      </div>
      
    </dl>

    <!-- 3B. SEARCH: Modulo di ricerca città -->
    <div class="howto__search" aria-label="Centra la mappa su una città">
      
      <!-- Form con input e bottone -->
      <form id="map-search-form" class="howto__search-form">
        <label for="city-search" class="howto__search-label">
          Centra la mappa su una città
        </label>
        <div class="howto__search-controls">
          <input 
            id="city-search" 
            name="city" 
            type="text" 
            placeholder="Es. Alatri" 
            autocomplete="off" 
            required
          >
          <button type="submit" class="howto__search-btn">Vai</button>
        </div>
      </form>
      
      <!-- Bottone geolocalizzazione -->
      <button type="button" id="map-locate-me" class="howto__locate-btn">
        Usa la mia posizione
      </button>
      
      <!-- Suggerimento -->
      <p class="howto__hint">
        Suggerimento: prova Frosinone, Ferentino o Sora per le prossime attivazioni.
      </p>
      
    </div>
    
  </div>
  
</div>
```

---

## 🎨 Architettura Visiva

```
┌─────────────────────────────────────────────┐
│  #g6ComeFunziona                            │
│  ┌─────────────────────────────────────┐   │
│  │ 📌 HEADER (.howto__header)          │   │
│  │   • h3: "Come funziona"             │   │
│  │   • p.howto__subtitle               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📝 INTRO (.howto__intro)            │   │
│  │   • p.howto__intro-text             │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📊 META (.howto__meta) - GRID       │   │
│  │  ┌────────────┬──────────────────┐  │   │
│  │  │ STATS      │ SEARCH           │  │   │
│  │  │ ┌────────┐ │ ┌──────────────┐ │  │   │
│  │  │ │Stat 1  │ │ │ Label        │ │  │   │
│  │  │ ├────────┤ │ │ Input + Btn  │ │  │   │
│  │  │ │Stat 2  │ │ │ Locate Btn   │ │  │   │
│  │  │ ├────────┤ │ │ Hint         │ │  │   │
│  │  │ │Stat 3  │ │ └──────────────┘ │  │   │
│  │  │ └────────┘ │                  │  │   │
│  │  └────────────┴──────────────────┘  │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 🔧 Componenti e Classi CSS

### 1️⃣ Container Principale: `#g6ComeFunziona`

**HTML:**
```html
<div class="card g6ComeFunziona" id="g6ComeFunziona">
```

**CSS:**
```css
#g6ComeFunziona {
  position: relative;
  isolation: isolate;
  background: rgba(255, 241, 227, 0.92);
  border: 1px solid rgba(255, 241, 227, 0.45);
  color: #431a40;
  border-radius: calc(var(--radius) * 1.2);
  display: flex;
  flex-direction: column;
  width: 100%;
  box-shadow:
    inset 0 1px 12px rgba(66, 32, 64, 0.08),
    0 20px 35px rgba(14, 26, 27, 0.18);
  overflow: visible;
  box-sizing: border-box;
}

/* Desktop */
@media (width >= 1024px) {
  #g6ComeFunziona {
    padding: clamp(12px, 1.5vw, 20px);
    gap: clamp(6px, 1vw, 12px);
    min-block-size: 0;
  }
}

/* Mobile/Tablet */
@media (width < 1024px) {
  #g6ComeFunziona {
    padding: clamp(16px, 2vh, 24px);
    gap: 12px;
    min-block-size: auto;
  }
}
```

**Caratteristiche:**
- ✅ Background semi-trasparente crema (#FFF1E3 @ 92%)
- ✅ Bordo soft con ombra interna ed esterna
- ✅ Layout Flexbox in colonna
- ✅ `overflow: visible` per evitare truncation
- ✅ Pseudo-elemento `::before` per effetto gradiente colorato

**Effetto Decorativo (::before):**
```css
#g6ComeFunziona::before {
  content: "";
  position: absolute;
  inset: -40% -55% auto auto;  /* Posizionato in alto a destra */
  width: 110%;
  height: 110%;
  background:
    radial-gradient(circle at 20% 20%, rgba(4, 232, 36, 0.18), transparent 60%),
    radial-gradient(circle at 80% 30%, rgba(226, 68, 58, 0.32), transparent 70%),
    radial-gradient(circle at 50% 90%, rgba(14, 140, 143, 0.24), transparent 75%);
  transform: rotate(-6deg);
  z-index: -1;
  filter: saturate(120%);
}
```
- 🎨 Tre gradient radiali colorati (verde, rosso, teal)
- 🔄 Ruotato di -6 gradi
- 🌈 Saturazione aumentata del 20%
- 📍 Posizionato dietro il contenuto (z-index: -1)

---

### 2️⃣ Header: `.howto__header`

**HTML:**
```html
<header class="howto__header">
  <h3>Come funziona</h3>
  <p class="howto__subtitle">Trova subito un ombrello gratuito Brellò.</p>
</header>
```

**CSS:**
```css
#g6ComeFunziona .howto__header {
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.5vw, 6px);
}

/* h3 */
#g6ComeFunziona h2 {  /* Nota: nel CSS è h2, nell'HTML è h3 */
  color: #431a40;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: clamp(1.15, 1.3, 1.35);
}

@media (width >= 1024px) {
  #g6ComeFunziona h2 {
    font-size: clamp(16px, 2vw, 22px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona h2 {
    font-size: clamp(20px, 2.5vw, 28px);
  }
}

/* Subtitle */
#g6ComeFunziona .howto__subtitle {
  margin: 0;
  color: rgba(67, 32, 64, 0.75);
  font-weight: 600;
  max-width: 32ch;
  line-height: clamp(1.2, 1.35, 1.5);
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__subtitle {
    font-size: clamp(12px, 1.6vw, 15px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__subtitle {
    font-size: clamp(14px, 1.8vw, 17px);
  }
}
```

**Caratteristiche:**
- 📱 Layout verticale con piccolo gap
- 🔤 Heading con letter-spacing negativo (-0.02em) per compattezza
- 📏 Sottotitolo limitato a max 32 caratteri per riga (max-width: 32ch)
- 🎨 Colore viola scuro (#431a40) con opacità 75% per il subtitle

---

### 3️⃣ Intro: `.howto__intro`

**HTML:**
```html
<div class="howto__intro">
  <p class="howto__intro-text">
    Seleziona la tua città o usa la posizione corrente per scoprire i punti attivi.
  </p>
</div>
```

**CSS:**
```css
#g6ComeFunziona .howto__intro {
  padding: clamp(3px, 0.5vw, 6px) 0 clamp(4px, 0.7vw, 8px);
}

#g6ComeFunziona .howto__intro-text {
  margin: 0;
  color: rgba(67, 32, 64, 0.78);
  font-weight: 600;
  line-height: clamp(1.2, 1.35, 1.5);
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__intro-text {
    font-size: clamp(12px, 1.6vw, 15px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__intro-text {
    font-size: clamp(14px, 1.8vw, 17px);
  }
}
```

**Caratteristiche:**
- 📝 Testo esplicativo con peso 600 (semi-bold)
- 🎨 Colore viola scuro con opacità 78%
- 📏 Line-height adattivo per leggibilità

---

### 4️⃣ Meta Container: `.howto__meta`

**HTML:**
```html
<div class="howto__meta">
  <dl class="howto__stats">...</dl>
  <div class="howto__search">...</div>
</div>
```

**CSS:**
```css
#g6ComeFunziona .howto__meta {
  display: grid;
  gap: clamp(6px, 1vw, 12px);
}

/* Desktop: 2 colonne (stats | search) */
@media (min-width: 768px) {
  #g6ComeFunziona .howto__meta {
    grid-template-columns: minmax(220px, 0.85fr) minmax(260px, 1.15fr);
    align-items: start;
  }
}
```

**Caratteristiche:**
- 🏗️ Grid Layout con 2 colonne su tablet/desktop
- 📊 Colonna sinistra: statistiche (85% dello spazio)
- 🔍 Colonna destra: form di ricerca (115% dello spazio)
- 📱 Mobile: layout in colonna singola

---

### 5️⃣ Stats: `.howto__stats`

**HTML (Definition List Semantica):**
```html
<dl class="howto__stats" aria-label="Dati sul servizio Brellò">
  <div class="howto__stat">
    <dt class="howto__stat-label">Stazioni attive</dt>
    <dd class="howto__stat-value" aria-live="polite">10</dd>
  </div>
  <!-- Ripetuto per ogni statistica -->
</dl>
```

**CSS:**
```css
#g6ComeFunziona .howto__stats {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(5px, 0.8vw, 10px);
}

/* Singola statistica */
#g6ComeFunziona .howto__stat {
  flex: 1 1 90px;  /* Min width 90px, poi espande */
  background: rgba(67, 32, 64, 0.08);
  border-radius: calc(var(--radius) * 0.9);
  padding: clamp(5px, 0.8vw, 8px) clamp(7px, 1vw, 10px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Valore (numero) */
#g6ComeFunziona .howto__stat-value {
  display: block;
  font-weight: 800;
  color: #2c0f28;  /* Viola molto scuro */
  line-height: 1.1;
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__stat-value {
    font-size: clamp(16px, 1.8vw, 20px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__stat-value {
    font-size: clamp(18px, 2.2vw, 24px);
  }
}

/* Etichetta */
#g6ComeFunziona .howto__stat-label {
  display: block;
  margin-top: 2px;
  letter-spacing: 0.01em;
  color: rgba(67, 32, 64, 0.7);
  line-height: 1.3;
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__stat-label {
    font-size: clamp(11px, 1.4vw, 13px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__stat-label {
    font-size: clamp(12px, 1.5vw, 14px);
  }
}
```

**Caratteristiche:**
- ♿ Semanticamente corretta: `<dl>` (Definition List)
- 🔢 Valori grandi e in evidenza (font-weight: 800)
- 🏷️ Etichette più piccole e sfumate
- 📦 Background viola chiaro (8% opacity)
- ✨ Ombra interna per effetto "incassato"
- 📱 Layout flessibile: wrap automatico su schermi piccoli
- ♿ `aria-live="polite"` per aggiornamenti dinamici accessibili

---

### 6️⃣ Search: `.howto__search`

**HTML:**
```html
<div class="howto__search" aria-label="Centra la mappa su una città">
  <form id="map-search-form" class="howto__search-form">
    <label for="city-search" class="howto__search-label">
      Centra la mappa su una città
    </label>
    <div class="howto__search-controls">
      <input id="city-search" name="city" type="text" placeholder="Es. Alatri" autocomplete="off" required>
      <button type="submit" class="howto__search-btn">Vai</button>
    </div>
  </form>
  <button type="button" id="map-locate-me" class="howto__locate-btn">
    Usa la mia posizione
  </button>
  <p class="howto__hint">
    Suggerimento: prova Frosinone, Ferentino o Sora per le prossime attivazioni.
  </p>
</div>
```

**CSS:**

#### Form Container
```css
#g6ComeFunziona .howto__search-form {
  display: flex;
  flex-direction: column;
  gap: clamp(3px, 0.5vw, 6px);
}
```

#### Label
```css
#g6ComeFunziona .howto__search-label {
  font-weight: 800;
  letter-spacing: 0.01em;
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__search-label {
    font-size: clamp(12px, 1.5vw, 14px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__search-label {
    font-size: 14px;
  }
}
```

#### Controlli (Input + Button)
```css
#g6ComeFunziona .howto__search-controls {
  display: flex;
  gap: clamp(6px, 1vw, 12px);
}
```

#### Input
```css
#g6ComeFunziona input {
  flex: 1;  /* Espande per occupare spazio disponibile */
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(14, 26, 27, 0.08);
  border-radius: calc(var(--radius) * 0.8);
  font-weight: 700;
  color: rgba(14, 26, 27, 0.8);
  box-shadow: inset 0 2px 8px rgba(14, 26, 27, 0.12);
}

@media (width >= 1024px) {
  #g6ComeFunziona input {
    padding: clamp(6px, 1vw, 10px) clamp(8px, 1.2vw, 12px);
    font-size: clamp(12px, 1.6vw, 15px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona input {
    padding: 10px 12px;
    font-size: 15px;
  }
}

#g6ComeFunziona input::placeholder {
  color: rgba(14, 26, 27, 0.55);
}
```

#### Button "Vai"
```css
#g6ComeFunziona .howto__search-btn {
  border-radius: calc(var(--radius) * 0.8);
  background: linear-gradient(140deg, var(--yellow) 0%, #ffd66b 100%);
  border: none;
  font-weight: 800;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__search-btn {
    padding: 0 clamp(8px, 1.2vw, 12px);
    font-size: clamp(12px, 1.6vw, 15px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__search-btn {
    padding: 10px 16px;
    font-size: 15px;
  }
}

/* Hover/Focus */
#g6ComeFunziona .howto__search-btn:hover,
#g6ComeFunziona .howto__search-btn:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px rgba(224, 162, 26, 0.25);
}

/* Stato busy (durante caricamento) */
#g6ComeFunziona .howto__search-btn.is-busy {
  opacity: 0.65;
  pointer-events: none;
}
```

#### Button "Usa la mia posizione"
```css
#g6ComeFunziona .howto__locate-btn {
  border-radius: calc(var(--radius) * 0.8);
  border: 1px solid rgba(67, 32, 64, 0.25);
  background: rgba(255, 255, 255, 0.45);
  font-weight: 700;
  color: rgba(67, 32, 64, 0.85);
  transition: border-color 0.2s ease, background 0.2s ease;
}

@media (width >= 1024px) {
  #g6ComeFunziona .howto__locate-btn {
    margin-top: clamp(3px, 0.5vw, 6px);
    padding: clamp(6px, 1vw, 10px) clamp(8px, 1.2vw, 12px);
    font-size: clamp(11px, 1.4vw, 13px);
  }
}

@media (width < 1024px) {
  #g6ComeFunziona .howto__locate-btn {
    margin-top: 6px;
    padding: 8px 12px;
    font-size: 13px;
  }
}

#g6ComeFunziona .howto__locate-btn:hover,
#g6ComeFunziona .howto__locate-btn:focus-visible {
  border-color: rgba(67, 32, 64, 0.45);
  background: rgba(255, 255, 255, 0.7);
}
```

#### Hint (suggerimento)
```css
#g6ComeFunziona .howto__hint {
  margin: var(--space-xs) 0 0;  /* var(--space-xs) = 0.5rem */
  font-size: var(--fs-sm);       /* var(--fs-sm) = 0.875rem */
  color: rgba(67, 32, 64, 0.65);
}
```

**Caratteristiche:**
- 🎨 Button giallo con gradiente (var(--yellow) → #ffd66b)
- 🔼 Animazione hover: solleva di 2px con ombra
- 🔒 Stato `.is-busy` per disabilitare durante caricamento
- 📍 Button geolocalizzazione con stile secondario (bordo, background trasparente)
- 💡 Hint testuale sfumato (65% opacity)
- ♿ Label associata correttamente con `for="city-search"`

---

## 📊 Tabella Riepilogativa Componenti

| Componente | Classe/ID | Tipo HTML | Funzione |
|------------|-----------|-----------|----------|
| **Container** | `#g6ComeFunziona` | `<div>` | Wrapper principale della card |
| **Header** | `.howto__header` | `<header>` | Titolo e sottotitolo |
| **Heading** | `h3` (nessuna classe) | `<h3>` | "Come funziona" |
| **Subtitle** | `.howto__subtitle` | `<p>` | Descrizione breve |
| **Intro** | `.howto__intro` | `<div>` | Container testo intro |
| **Intro Text** | `.howto__intro-text` | `<p>` | Testo esplicativo |
| **Meta** | `.howto__meta` | `<div>` | Grid container stats + search |
| **Stats** | `.howto__stats` | `<dl>` | Lista statistiche (definition list) |
| **Stat** | `.howto__stat` | `<div>` | Singola statistica wrapper |
| **Stat Label** | `.howto__stat-label` | `<dt>` | Etichetta statistica |
| **Stat Value** | `.howto__stat-value` | `<dd>` | Valore numerico statistica |
| **Search** | `.howto__search` | `<div>` | Container ricerca + geoloc |
| **Search Form** | `.howto__search-form` | `<form>` | Form ricerca città |
| **Search Label** | `.howto__search-label` | `<label>` | "Centra la mappa..." |
| **Search Controls** | `.howto__search-controls` | `<div>` | Flex container input + btn |
| **Input** | `#city-search` | `<input>` | Campo testo città |
| **Search Button** | `.howto__search-btn` | `<button>` | Button "Vai" |
| **Locate Button** | `.howto__locate-btn` | `<button>` | "Usa la mia posizione" |
| **Hint** | `.howto__hint` | `<p>` | Suggerimento testo |

---

## 🎨 Palette Colori

| Elemento | Colore | Valore |
|----------|--------|--------|
| **Background card** | Crema trasparente | `rgba(255, 241, 227, 0.92)` |
| **Bordo card** | Crema soft | `rgba(255, 241, 227, 0.45)` |
| **Testo principale** | Viola scuro | `#431a40` |
| **Testo subtitle** | Viola 75% | `rgba(67, 32, 64, 0.75)` |
| **Testo intro** | Viola 78% | `rgba(67, 32, 64, 0.78)` |
| **Stat value** | Viola molto scuro | `#2c0f28` |
| **Stat label** | Viola 70% | `rgba(67, 32, 64, 0.7)` |
| **Stat background** | Viola 8% | `rgba(67, 32, 64, 0.08)` |
| **Input background** | Bianco 70% | `rgba(255, 255, 255, 0.7)` |
| **Input text** | Ink 80% | `rgba(14, 26, 27, 0.8)` |
| **Button "Vai"** | Yellow gradient | `linear-gradient(140deg, #F3B300, #ffd66b)` |
| **Button "Locate"** | Bianco 45% | `rgba(255, 255, 255, 0.45)` |
| **Hint text** | Viola 65% | `rgba(67, 32, 64, 0.65)` |

---

## 📐 Sistema di Spaziature

### Desktop (≥1024px)
```css
padding: clamp(12px, 1.5vw, 20px);
gap: clamp(6px, 1vw, 12px);
```

### Mobile/Tablet (<1024px)
```css
padding: clamp(16px, 2vh, 24px);
gap: 12px;
```

### Gap tra componenti
- Header elements: `clamp(3px, 0.5vw, 6px)`
- Meta grid: `clamp(6px, 1vw, 12px)`
- Stats: `clamp(5px, 0.8vw, 10px)`
- Search controls: `clamp(6px, 1vw, 12px)`

---

## ♿ Accessibilità

### ARIA Labels
```html
<dl class="howto__stats" aria-label="Dati sul servizio Brellò">
<dd class="howto__stat-value" aria-live="polite">10</dd>
<div class="howto__search" aria-label="Centra la mappa su una città">
```

### Semantica HTML
- ✅ `<header>` per intestazione
- ✅ `<dl>`, `<dt>`, `<dd>` per statistiche (definition list)
- ✅ `<form>` con `<label>` associata correttamente
- ✅ `<button type="submit">` vs `<button type="button">`
- ✅ `required` e `autocomplete="off"` su input

### Focus Visibili
```css
*:focus {
  outline: 2px solid var(--yellow);
  outline-offset: 2px;
}
```

### Live Regions
```html
<dd class="howto__stat-value" aria-live="polite">10</dd>
```
- Screen reader viene notificato quando il valore cambia dinamicamente

---

## 🔄 Stati Interattivi

### Button "Vai"
```css
/* Default */
background: linear-gradient(140deg, var(--yellow) 0%, #ffd66b 100%);

/* Hover/Focus */
transform: translateY(-2px);
box-shadow: 0 12px 20px rgba(224, 162, 26, 0.25);

/* Busy (caricamento) */
.is-busy {
  opacity: 0.65;
  pointer-events: none;
}
```

### Button "Usa la mia posizione"
```css
/* Default */
border: 1px solid rgba(67, 32, 64, 0.25);
background: rgba(255, 255, 255, 0.45);

/* Hover/Focus */
border-color: rgba(67, 32, 64, 0.45);
background: rgba(255, 255, 255, 0.7);
```

---

## 📱 Breakpoint Responsivi

### Desktop Large (≥1024px)
- Meta grid: 2 colonne (0.85fr | 1.15fr)
- Font-size heading: `clamp(16px, 2vw, 22px)`
- Padding card: `clamp(12px, 1.5vw, 20px)`

### Tablet (768-1023px)
- Meta grid: 2 colonne (minmax)
- Font-size heading: `clamp(20px, 2.5vw, 28px)`
- Padding card: `clamp(16px, 2vh, 24px)`

### Mobile (<768px)
- Meta grid: 1 colonna (stack verticale)
- Stats: wrap automatico
- Font-size aumentato per leggibilità touch

---

## 🧪 Testing Checklist

### ✅ Visual
- [ ] Background gradient decorativo visibile ma non invadente
- [ ] Bordi arrotondati coerenti (calc(var(--radius) * 0.9))
- [ ] Ombra interna ed esterna corrette
- [ ] Statistiche allineate e ben spaziati

### ✅ Funzionale
- [ ] Form submit funziona correttamente
- [ ] Button geolocalizzazione attiva API
- [ ] Stato `.is-busy` disabilita button durante caricamento
- [ ] Placeholder visibile nell'input
- [ ] Validation `required` attiva

### ✅ Accessibilità
- [ ] Screen reader legge statistiche correttamente (dl/dt/dd)
- [ ] Label associata all'input (for/id)
- [ ] `aria-live` aggiorna valori dinamicamente
- [ ] Focus visibile su tutti gli elementi interattivi
- [ ] Button type corretto (submit vs button)

### ✅ Responsive
- [ ] Layout desktop: 2 colonne (stats | search)
- [ ] Layout mobile: colonna singola
- [ ] Font-size scala correttamente
- [ ] Padding adattivo tra desktop/mobile
- [ ] Stats wrap su schermi piccoli

---

## 📝 Note di Implementazione

### Variabili CSS Utilizzate
```css
--radius: 14px
--yellow: #F3B300
--ink: #0E1A1B
--space-xs: 0.5rem
--fs-sm: 0.875rem
```

### Calcoli Dinamici
```css
border-radius: calc(var(--radius) * 1.2)  /* 16.8px */
border-radius: calc(var(--radius) * 0.9)  /* 12.6px */
border-radius: calc(var(--radius) * 0.8)  /* 11.2px */
```

### Font Weights
- 600 (Semi-bold): subtitle, intro text
- 700 (Bold): input, locate button
- 800 (Extra-bold): label, search button, stat value

### Transizioni
- Transform: 0.2s ease
- Box-shadow: 0.2s ease
- Opacity: 0.2s ease
- Border-color: 0.2s ease
- Background: 0.2s ease

---

## 🚀 Performance

### CSS Ottimizzato
- ✅ `will-change` non usato (evita layer inutili)
- ✅ Transform per animazioni (GPU-accelerated)
- ✅ `box-sizing: border-box` per calcoli semplificati
- ✅ `isolation: isolate` per stacking context pulito

### HTML Semantico
- ✅ Definition list per dati strutturati
- ✅ Form nativo per UX migliore
- ✅ ARIA solo dove necessario (non overuse)

---

**Versione**: 1.0  
**Data**: Ottobre 2025  
**Autore**: Layout System  
**Status**: ✅ Production Ready
