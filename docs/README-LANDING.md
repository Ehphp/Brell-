# Brellò — Landing Page

## Scopo
Landing di conversione per due audience:
- Cittadini: servizio di umbrella sharing gratuito (Prendi–Usa–Riporta).
- Sponsor/Enti: medium OOH urbano misurabile (QR, KPI, pacchetti).

## Architettura informativa
1. Hero (claim + CTA “Diventa sponsor” / “Trova stazioni”)
2. How it works (3 step, gratuità, nessun tempo imposto, restituzione)
3. Why sponsors (benefici, QR tracking, KPI, tier pacchetti)
4. Where we are (Alatri — mappa stazioni, ~300 ombrelli; roadmap)
5. Social proof (partner, loghi, numeri)
6. FAQ (restituzione, resistenza vento, no-rain, pulizia, costi)
7. CTA finale + form lead sponsor
8. Footer (contatti, privacy, cookie, press kit)

## Standard UX/A11y
- WCAG 2.2 AA: contrasti ≥ 4.5:1, focus visibile, landmark semantici, aria-* su nav/accordion.
- Touch target ≥ 44px; stati hover/focus/disabled; error handling form con ARIA live.

## Performance Budget
- Lighthouse Mobile ≥ 90; LCP ≤ 2.5s; CLS < 0.1; TBT < 200ms.
- Immagini: WebP/AVIF + dimensioni corrette + `<img loading="lazy">`.
- Preload font critici WOFF2; code-splitting; rimozione asset non usati.

## SEO & Dati strutturati
- Meta title/description specifici; H1 unico; OG/Twitter card.
- JSON-LD: Organization + (Service/LocalBusiness) + FAQPage.
- Sitemap/robots se previste.

## i18n
- IT (default) → EN (file di locale). No copy hardcoded nei componenti.

## Tracking Plan
Eventi (dataLayer):
- `view_hero`, `click_cta_sponsor`, `click_cta_citizens`
- `submit_form_sponsor`, `submit_form_citizen`, `form_validation_error`
- `view_map`, `map_interaction`, `faq_toggle`
- `outbound_qr_click`, `media_kit_request`

Params comuni: `page`, `locale`, `device`, `referrer`.
Documentare mapping → GA4 (o tool usato).

## Struttura progetto (esempio)
- `/pages` o route principale (Hero, SEO head)
- `/components`
  - `Hero`, `Steps`, `SponsorBenefits`, `StationsMap`, `LogoWall`, `KPIStrip`, `FAQ`, `LeadForm`, `Footer`
- `/i18n` (it.json, en.json)
- `/public` (immagini ottimizzate)
- `/styles` (tokens: palette, tipografia, spacing)

## Checklist PR
- [ ] Lighthouse Mobile ≥ 90 (screenshot)
- [ ] Contrasto e focus OK (tool report)
- [ ] Schema.org validato (Rich Results)
- [ ] Eventi dataLayer testati (console)
- [ ] i18n base IT/EN
- [ ] Immagini responsive/lazy + preload font
- [ ] FAQ + Why Sponsors + CTA finale presenti

## Roadmap
- P0: SEO/A11y/Perf/Analytics base
- P1: sezioni mancanti, i18n, proof
- P2: A/B test CTA, micro-animazioni, press kit avanzato
