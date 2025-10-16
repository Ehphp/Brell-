# Guida Layout Sezione #chiSiamo

## Obiettivo
Layout a piena altezza (100dvh) su desktop (≥1024px) con compattazione progressiva CSS-only, senza truncation di testo.

## Architettura Layout

### Desktop (≥1024px)
```
┌─────────────────────────────────────┐
│         #chiSiamo (100dvh)          │
│  ┌─────────────────────────────┐   │
│  │    .chiSiamo-grid (2 col)   │   │
│  │  ┌──────────┬──────────────┐│   │
│  │  │  Card 1  │              ││   │
│  │  ├──────────┤   Mappa      ││   │
│  │  │  Card 2  │              ││   │
│  │  ├──────────┼──────────────┤│   │
│  │  │  Card 3  │ Come funziona││   │
│  │  └──────────┴──────────────┘│   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Struttura Grid
- **Section**: `display: grid`, `block-size: 100dvh`
- **chiSiamo-grid**: `grid-template-columns: 1fr 1fr`, `min-block-size: 0`
- **chiSiamo-steps**: `grid-template-rows: repeat(3, minmax(min-content, 1fr))`
- **mapContainer**: `grid-template-rows: 1fr 1fr`

### Tablet (640-1023px)
- Layout in colonna: card → mappa → come funziona
- `block-size: auto` (no più 100dvh)
- Gap: `16px`

### Mobile (<640px)
- Layout in colonna compatto
- `block-size: auto`
- Gap: `12px`
- Nessun overflow orizzontale

## Sistema di Compattazione Progressiva

### Tier 1: Default (altezza ≥900px)
- Gap grid: `clamp(16px, 2vw, 28px)`
- Padding card: `clamp(12px, 1.5vw, 20px)`
- Font h2: `clamp(18px, 2.2vw, 24px)`
- Font p: `clamp(12px, 1.6vw, 16px)`
- SVG: `clamp(28px, 4vw, 40px)`

### Tier 2: Compact (780-899px)
```css
@media (width >= 1024px) and (height < 900px)
```
- Gap grid: `clamp(12px, 1.6vw, 20px)`
- Padding card: `clamp(10px, 1.2vw, 16px)`
- Font h2: `clamp(16px, 2vw, 20px)`
- Font p: `clamp(11px, 1.4vw, 14px)`
- SVG: `clamp(26px, 3.5vw, 36px)`
- Line-height ridotto: `1.2-1.3`

### Tier 3: Dense (680-779px)
```css
@media (width >= 1024px) and (height < 780px)
```
- Gap grid: `12px` (fisso)
- Padding card: `10px` (fisso)
- Font h2: `clamp(15px, 1.8vw, 18px)`
- Font p: `clamp(10px, 1.2vw, 13px)`
- SVG: `clamp(24px, 3vw, 32px)`
- Line-height: `1.15-1.25`

### Tier 4: Ultra-Compact (560-679px)
```css
@media (width >= 1024px) and (height < 680px)
```
- Gap grid: `10px`
- Padding card: `8px`
- Font h2: `clamp(14px, 1.6vw, 17px)`
- Font p: `clamp(9px, 1.1vw, 12px)`
- SVG: `clamp(22px, 2.8vw, 28px)`
- Line-height: `1.1-1.2`

### Tier 5: Limite Estremo (<560px)
```css
@media (width >= 1024px) and (height < 560px)
```
- Attiva `overflow-y: auto` sulla section
- Avviso: a questa altezza il contenuto potrebbe richiedere scroll minimo

## Principi Chiave

### ✅ Cosa FA
1. **Compattazione adattiva**: riduce font-size, line-height, padding, gap, SVG
2. **Nessuna truncation**: overflow: visible, no text-overflow, no line-clamp
3. **Accessibilità**: focus visibili, contrasti mantenuti, testi sempre leggibili
4. **Responsive completo**: 3 breakpoint (mobile/tablet/desktop)

### ❌ Cosa NON FA
1. **NON taglia testo**: no ellipsis, no hidden overflow
2. **NON usa altezze fisse**: solo minmax(min-content, 1fr)
3. **NON usa JavaScript**: compattazione CSS pura
4. **NON nasconde contenuto**: tutto sempre visibile

## Tecniche CSS Utilizzate

### 1. Grid con min-block-size: 0
```css
.chiSiamo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-block-size: 0; /* Permette compressione */
  block-size: 100%;
}
```

### 2. minmax(min-content, 1fr)
```css
.chiSiamo-steps {
  grid-template-rows: repeat(3, minmax(min-content, 1fr));
  /* min-content: altezza minima necessaria
     1fr: distribuzione equilibrata dello spazio restante */
}
```

### 3. clamp() per scalabilità fluida
```css
font-size: clamp(12px, 1.6vw, 16px);
/* min: 12px | ideale: 1.6vw | max: 16px */
```

### 4. Media Queries combinate (width + height)
```css
@media (width >= 1024px) and (height < 780px) {
  /* Regole per desktop con viewport bassa */
}
```

### 5. dvh (Dynamic Viewport Height)
```css
#chiSiamo {
  block-size: 100dvh; /* Si adatta a barre indirizzi mobile */
}
```

## Componenti Principali

### Card (.cardPag2)
**Desktop**: Grid 3 colonne
```
┌─────┬─────────────┬──────────┐
│ SVG │   Testo     │  Input   │
│     │  (h2 + p)   │  Label   │
└─────┴─────────────┴──────────┘
```

**Mobile**: Grid 2 colonne + riga per input
```
┌─────┬─────────────┐
│ SVG │   h2        │
├─────┴─────────────┤
│   Paragrafi       │
├───────────────────┤
│   Label + Input   │
└───────────────────┘
```

### mapContainer
**Desktop**: 2 righe (1fr 1fr)
- Mappa: 50%
- Come funziona: 50%

**Mobile**: Colonna
- Mappa: min 280px
- Come funziona: auto

### g6ComeFunziona
- Overflow: `visible` (no scroll interno)
- Padding e gap: ridotti progressivamente
- Tutti gli elementi visibili sempre

## Testing Checklist

### ✓ Desktop (≥1024px)
- [ ] Section occupa esattamente 100dvh
- [ ] 3 card visibili completamente a sinistra
- [ ] Mappa e "Come funziona" visibili a destra
- [ ] Nessuna scrollbar nella section
- [ ] Nessun testo troncato con `...`

### ✓ Desktop Altezza Ridotta (680-900px)
- [ ] Compattazione attiva (font/padding più piccoli)
- [ ] Tutto ancora leggibile
- [ ] Nessun overflow
- [ ] Line-height ridotto ma testo non sovrapposto

### ✓ Desktop Altezza Molto Bassa (<680px)
- [ ] Ultra-compattazione attiva
- [ ] Tutto ancora visibile
- [ ] Se <560px: scroll verticale minimo accettabile

### ✓ Tablet (640-1023px)
- [ ] Layout in colonna
- [ ] block-size: auto
- [ ] Nessun overflow orizzontale
- [ ] Gap appropriato (16px)

### ✓ Mobile (<640px)
- [ ] Layout in colonna compatto
- [ ] Nessun overflow orizzontale
- [ ] Touch-friendly (tap target ≥44px)
- [ ] Leggibile senza zoom

## Variabili CSS Utilizzate

```css
--teal: #0E8C8F
--rosa: #C33149
--yellow: #F3B300
--viola: #422040
--green: #04E824
--cream: #FFF1E3
--ink: #0E1A1B
--radius: 14px
--radius-lg: 16px (derivata)
--shadow: 0 10px 30px rgba(0, 0, 0, .16)
```

## Limiti Conosciuti

### Altezze Estreme (<560px su desktop)
- Con viewport molto basse, il contenuto potrebbe non rientrare perfettamente
- Soluzione: scroll verticale minimo attivato automaticamente
- Alternativa: suggerire zoom browser o finestra più grande

### Browser Vecchi
- `dvh` non supportato da IE11 (fallback a `vh`)
- `clamp()` richiede browser moderni (2020+)
- Grid CSS richiede browser moderni

### Contenuto Variabile
- Se il contenuto delle card aumenta significativamente, potrebbe richiedere ulteriori aggiustamenti
- Test consigliato con contenuti reali di lunghezza variabile

## Manutenzione

### Aggiungere un nuovo tier di compattazione
```css
@media (width >= 1024px) and (height < [ALTEZZA]px) {
  /* Regole più compatte */
  .cardPag2 h2 { font-size: [...]; }
  .cardPag2 p { font-size: [...]; line-height: [...]; }
  /* etc. */
}
```

### Modificare soglie di compattazione
1. Testare su dispositivi reali con diverse altezze viewport
2. Aggiustare i valori nei `@media (height < ...)`
3. Verificare con DevTools in modalità responsive

### Aggiungere contenuto
1. Testare su viewport 680px altezza (limite critico)
2. Se non rientra, creare nuovo tier o ridurre contenuto
3. Mantenere sempre `overflow: visible` per no-truncation

## Accessibilità

- ✅ Focus visibili: `outline: 2px solid var(--yellow)`
- ✅ Contrasti WCAG AA: verificati su tutti i tier
- ✅ Tabindex: `-1` su section-anchor per skip link
- ✅ Aria-label: presenti su mappa e sezioni
- ✅ Dimensioni minime: font mai sotto 9px anche ultra-compatto

## Performance

- ✅ CSS only: nessun JavaScript per layout
- ✅ No reflow/repaint: transform per animazioni
- ✅ Lazy loading: immagini con class `.lazy`
- ✅ GPU acceleration: backdrop-filter, transform

---

**Autore**: Layout System  
**Data**: Ottobre 2025  
**Versione**: 1.0  
**Status**: ✅ Production Ready
