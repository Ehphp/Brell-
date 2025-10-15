# README Landing Page - Brellò Sharing

## Architettura Informativa

### Gerarchia delle Sezioni

```
🏠 HERO SECTION
├── Value Proposition Duale (Cittadini + Sponsor)
├── CTA Primarie (Diventa Sponsor / Trova Ombrello)
└── Trust Indicators (Alatri Pilot Stats)

📊 SPONSOR BENEFITS  
├── OOH Urbano Innovativo
├── Misurabilità Totale (QR Code)
├── Alta Memorabilità
└── Pacchetti Scalabili

⚙️ COME FUNZIONA
├── Step 1: Prendi (Gratuito)
├── Step 2: Usa (Senza limiti)
└── Step 3: Riconsegna (Ovunque)

🗺️ DOVE SIAMO
├── Mappa Interattiva (Mapbox)
├── Pilot Alatri Details
└── Expansion Roadmap

📋 FORMS
├── Form Sponsor (Lead Generation)
└── Form Cittadini (Newsletter)

❓ FAQ
├── Return Policy
├── Quality/Resistance
├── No-Rain Scenarios
├── Booking System
└── Cleaning/Maintenance

🦶 FOOTER
├── Link Navigazione
├── Legal/Privacy
├── Social Links
└── Contact Info
```

## Design Tokens

### Colori

```css
:root {
  /* Brand Colors */
  --teal: #0E8C8F;     /* Primary brand */
  --yellow: #F3B300;   /* Accent/CTA */
  --red: #E2443A;      /* Secondary CTA */
  --viola: #422040;    /* Dark accent */
  --green: #04E824;    /* Success/Active */
  --rosa: #C33149;     /* Tertiary */
  --cream: #FFF1E3;    /* Text/Background */
  --ink: #0E1A1B;      /* Dark text */
  
  /* Functional Colors */
  --shadow: 0 10px 30px rgba(0, 0, 0, .16);
  --radius: 14px;
}
```

### Tipografia

```css
/* Typography Scale */
--fs-xs: 0.75rem;     /* 12px */
--fs-sm: 0.875rem;    /* 14px */  
--fs-base: 1rem;      /* 16px */
--fs-lg: 1.125rem;    /* 18px */
--fs-xl: 1.25rem;     /* 20px */
--fs-2xl: 1.5rem;     /* 24px */
--fs-3xl: 1.875rem;   /* 30px */
--fs-4xl: 2.25rem;    /* 36px */
--fs-5xl: 3rem;       /* 48px */

/* Font Stack */
font-family: "Nunito", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Spaziatura

```css
/* Spacing Scale */
--space-xs: 0.5rem;   /* 8px */
--space-sm: 1rem;     /* 16px */
--space-md: 1.5rem;   /* 24px */
--space-lg: 2rem;     /* 32px */
--space-xl: 3rem;     /* 48px */
--space-2xl: 4rem;    /* 64px */
```

## Componenti UI

### 1. Buttons

```css
/* Primary CTA - Sponsor */
.btn--light {
  background: var(--cream);
  color: var(--ink);
  border: 2px solid var(--cream);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius);
  transition: all 0.3s ease;
}

/* Secondary CTA - Citizens */
.btn--red {
  background: var(--red);
  color: var(--cream);
  border: 2px solid var(--red);
  font-weight: 600;
  padding: 12px 24px;
  border-radius: var(--radius);
  transition: all 0.3s ease;
}

/* Outline Button */
.btn-outline-light {
  background: transparent;
  color: var(--cream);
  border: 2px solid var(--cream);
  padding: 12px 24px;
  border-radius: var(--radius);
}
```

### 2. Cards

```css
/* Benefit Card */
.benefit-card {
  text-align: center;
  padding: var(--space-lg);
  border: 1px solid rgba(255, 241, 227, .18);
  border-radius: var(--radius);
  backdrop-filter: saturate(120%) blur(2px);
  background: rgba(255, 241, 227, .05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* Form Card */
.card {
  border: 1px solid rgba(255, 241, 227, .18);
  border-radius: var(--radius);
  backdrop-filter: saturate(120%) blur(2px);
  padding: var(--space-lg);
  background: rgba(255, 241, 227, .05);
}
```

### 3. Navigation

```css
/* Main Navigation */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-lg);
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(14, 26, 27, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
}

/* Nav Links */
.link {
  color: var(--cream);
  text-decoration: none;
  margin: 0 var(--space-sm);
  font-weight: 600;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}
```

## Analytics & Tracking

### Eventi Implementati

```javascript
// Hero Section
gtag('event', 'view_hero', {
  event_category: 'engagement',
  event_label: 'hero_section_viewed'
});

// CTA Clicks
gtag('event', 'click_cta_sponsor', {
  event_category: 'conversion', 
  event_label: 'hero_sponsor_cta'
});

gtag('event', 'click_cta_citizens', {
  event_category: 'conversion',
  event_label: 'hero_citizens_cta'
});

// Form Submissions
gtag('event', 'submit_form_sponsor', {
  event_category: 'conversion',
  event_label: 'sponsor_form_completed',
  value: 1
});

gtag('event', 'submit_form_citizen', {
  event_category: 'conversion', 
  event_label: 'citizen_form_completed',
  value: 1
});

// Map Interactions
gtag('event', 'view_map', {
  event_category: 'engagement',
  event_label: 'map_section_viewed'
});

gtag('event', 'map_interaction', {
  event_category: 'engagement',
  event_label: 'map_clicked'
});

// FAQ Engagement
gtag('event', 'faq_toggle', {
  event_category: 'engagement',
  event_label: 'faq_question_opened'
});

// Validation Errors
gtag('event', 'form_validation_error', {
  event_category: 'user_experience',
  event_label: 'form_error_encountered'
});
```

### KPI da Monitorare

- **Conversion Rate Sponsor**: `submit_form_sponsor` / `click_cta_sponsor`
- **Conversion Rate Cittadini**: `submit_form_citizen` / `click_cta_citizens`
- **Map Engagement**: `map_interaction` / `view_map`
- **FAQ Effectiveness**: `faq_toggle` / Page Views
- **Bounce Rate**: Target <60%
- **Form Completion Rate**: Target >15%

## SEO Implementation

### Meta Tags

```html
<!-- Basic SEO -->
<title>Brellò Sharing - Ombrelli Gratis per Cittadini, Pagati da Sponsor</title>
<meta name="description" content="Umbrella sharing gratuito ad Alatri: 10 stazioni, 300 ombrelli gratis per i cittadini. Sponsor pagano per pubblicità OOH innovativa e misurabile con QR code.">

<!-- Open Graph -->
<meta property="og:title" content="Brellò Sharing - Ombrelli Gratis per Cittadini, Pagati da Sponsor">
<meta property="og:description" content="Umbrella sharing gratuito ad Alatri: 10 stazioni, 300 ombrelli gratis per i cittadini.">
<meta property="og:image" content="https://brello-sharing.com/og-image.jpg">

<!-- Twitter Card -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="Brellò Sharing - Ombrelli Gratis per Cittadini, Pagati da Sponsor">
```

### Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Brellò Sharing",
  "serviceType": "Umbrella Sharing Service",
  "areaServed": {"@type": "City", "name": "Alatri"},
  "offers": {
    "@type": "Offer",
    "name": "Umbrella Sharing Gratuito",
    "price": "0",
    "priceCurrency": "EUR"
  }
}
```

## Accessibility (WCAG 2.2 AA)

### Implementazioni

- ✅ **Contrasto**: Ratio ≥ 4.5:1 per tutti i testi
- ✅ **Focus Visible**: Outline 2px solid var(--yellow)
- ✅ **Keyboard Navigation**: Tutti gli elementi interattivi navigabili
- ✅ **ARIA Labels**: Navigation, buttons, form labels
- ✅ **Semantic HTML**: H1-H6 hierarchy, landmark roles
- ✅ **Alt Text**: Immagini descrittive (da implementare)
- ✅ **Screen Reader**: Skip links, live regions

### Test di Accessibilità

```bash
# Lighthouse Accessibility Audit
npm run lighthouse --accessibility

# aXe Core Testing
npm run axe-test

# Keyboard Navigation Test
# Tab attraverso tutti gli elementi interattivi
```

## Performance Optimization

### Core Web Vitals Target

- **LCP** (Largest Contentful Paint): ≤ 2.5s
- **FID** (First Input Delay): ≤ 100ms  
- **CLS** (Cumulative Layout Shift): < 0.1

### Implementazioni

```html
<!-- Font Loading Optimization -->
<link rel="preload" href="fonts/nunito.woff2" as="font" type="font/woff2" crossorigin>

<!-- Lazy Loading -->
<img loading="lazy" src="hero-image.webp" alt="Brellò umbrella sharing">

<!-- Resource Hints -->
<link rel="preconnect" href="https://api.mapbox.com">
<link rel="dns-prefetch" href="https://fonts.googleapis.com">
```

## Content Guidelines

### Tono di Voce

- **Friendly**: Approccio caldo e accogliente
- **Clear**: Linguaggio semplice e diretto
- **Confident**: Sicurezza nel value proposition
- **Trustworthy**: Trasparenza su gratuità e funzionamento

### Messaging Framework

```
Per Cittadini:
- Primary: "Ombrelli gratis quando piove"
- Secondary: "Nessun costo, nessun limite di tempo"
- Trust: "Completamente gratuito, sostenuto da sponsor"

Per Sponsor:
- Primary: "Pubblicità OOH innovativa e misurabile"  
- Secondary: "QR code tracking, alta memorabilità"
- Trust: "Pilot attivo ad Alatri, risultati verificabili"
```

### Call-to-Action Copy

```
Sponsor:
- Primary: "🎯 Diventa sponsor"
- Secondary: "📄 Richiedi Media Kit"
- Tertiary: "📈 Case Studies"

Cittadini:
- Primary: "☂️ Trova ombrello"
- Secondary: "🔔 Avvisami quando attivo"
- Tertiary: "📍 Scopri le stazioni"
```

## Internazionalizzazione (i18n)

### Struttura File

```
/locales
  /it
    common.json
    homepage.json
    forms.json
  /en  
    common.json
    homepage.json
    forms.json
```

### Implementazione

```javascript
// i18n Setup (da implementare)
const translations = {
  it: {
    hero: {
      title: "Ombrelli gratis per cittadini, pagati da sponsor",
      cta_sponsor: "🎯 Diventa sponsor",
      cta_citizens: "☂️ Trova ombrello"
    }
  },
  en: {
    hero: {
      title: "Free umbrellas for citizens, paid by sponsors", 
      cta_sponsor: "🎯 Become sponsor",
      cta_citizens: "☂️ Find umbrella"
    }
  }
};
```

## Deployment & Testing

### Build Process

```bash
# Development
npm run dev

# Production Build  
npm run build

# Preview Build
npm run preview

# Lighthouse Audit
npm run lighthouse

# Accessibility Test
npm run a11y-test
```

### Testing Checklist

- [ ] **Performance**: Lighthouse Score ≥90 (Mobile)
- [ ] **Accessibility**: WCAG 2.2 AA Compliant
- [ ] **SEO**: Meta tags, Schema.org, sitemap
- [ ] **Analytics**: All events firing correctly
- [ ] **Forms**: Validation, submission, error handling
- [ ] **Responsive**: Mobile, tablet, desktop
- [ ] **Cross-browser**: Chrome, Firefox, Safari, Edge

---

*README tecnico aggiornato al 15 Ottobre 2025*
*Per domande: tech@brello-sharing.com*