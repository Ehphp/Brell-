// Smooth scroll per link e pulsanti con data-scroll
document.querySelectorAll('[data-scroll], a[href^="#"]').forEach(el => {
  el.addEventListener('click', e => {
    const sel = el.getAttribute('data-scroll') || el.getAttribute('href');
    if (!sel || sel === '#') return;
    const tgt = document.querySelector(sel);
    if (tgt) {
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// CTA che aprono il form corretto con highlight
document.querySelectorAll('[data-open]').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-open');
    const map = { sponsor: '#inserzionisti', utente: '#utenti' };
    const sel = map[target];
    if (sel) {
      document.querySelector(sel).scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Highlight visivo sulla card
      const card = document.querySelector(sel + ' .card') || document.querySelector(sel);
      (card || document.querySelector(sel)).animate([
        { boxShadow: '0 0 0 0 rgba(243,179,0,0)' },
        { boxShadow: '0 0 0 10px rgba(243,179,0,.25)' }
      ], { duration: 300, direction: 'alternate', iterations: 2 });
    }
  });
});

// Animazione "type-in" del titolo (loop)
const headline = document.getElementById('headline');
const full = headline.textContent.trim();
headline.textContent = '';

let i = 0;
const type = () => {
  if (i <= full.length) {
    headline.textContent = full.slice(0, i++);
    // Velocità: primi caratteri leggermente più rapidi
    requestAnimationFrame(() => setTimeout(type, i < 8 ? 40 : 60));
  } else {
    // Pausa a fine riga, poi reset e ripartenza
    setTimeout(() => {
      i = 0;
      headline.textContent = '';
      requestAnimationFrame(type);
    }, 2700); // pausa di 1s prima di ricominciare
  }
};

window.addEventListener('load', type);

// Funzione toast
function toast(msg) {
  const box = document.getElementById('toast');
  box.textContent = msg;
  box.parentElement.classList.add('toast--show');
  setTimeout(() => box.parentElement.classList.remove('toast--show'), 2600);
}

// Validazione semplice
function validate(form) {
  let ok = true;
  form.querySelectorAll('[required]').forEach(inp => {
    if (!inp.value.trim()) {
      ok = false;
      inp.style.outline = '3px solid #ff9a8b';
    } else {
      inp.style.outline = 'none';
    }
    if (inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim())) {
      ok = false;
      inp.style.outline = '3px solid #ff9a8b';
    }
  });
  return ok;
}

// Raccolta dati form
function collect(form) {
  return [...new FormData(form).entries()].reduce((o, [k, v]) => (o[k] = v, o), {});
}

// Invio form sponsor
document.getElementById('form-sponsor').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validate(form)) {
    toast('Controlla i campi evidenziati');
    return;
  }
  const data = collect(form);
  console.log('Sponsor lead:', data); // Qui si integra API o backend
  form.reset();
  toast('Richiesta inviata! Ti scriviamo presto.');
});

// Invio form utente
document.getElementById('form-utente').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validate(form)) {
    toast('Controlla i campi evidenziati');
    return;
  }
  const data = collect(form);
  console.log('Utente lead:', data); // Qui si integra API o backend
  form.reset();
  toast('Fatto! Ti avviseremo quando arriviamo.');
});

// Anno dinamico nel footer
document.getElementById('year').textContent = new Date().getFullYear();


// =======================
// Intro: pioggia di ombrelli (con trigger su click .cta e .brand)
// =======================
(() => {
  // --- Config ---
  const COUNT = 360;                 // quante icone totali
  const ONCE_PER_SESSION = true;    // mostralo una volta per sessione al load
  const COLORS = ['var(--yellow)', 'var(--viola)', 'var(--teal)', 'var(--red)', 'var(--green)'];
  const PATH = "M32 6c-12.7 0-22.9 8.9-25.2 21.1-.3 1.7 1.7 2.8 3.1 1.7C14 24.8 19.4 22 26 22c5.8 0 9.8 2.1 12.9 5.1 1.3 1.2 3.5.2 3.2-1.6C40.5 14.6 36.7 6 32 6zM30 28v21.2c0 2-1.6 3.6-3.6 3.6-2.2 0-3.9-1.9-3.6-4.1.2-1.6 1.6-2.8 3.2-2.9 1-.1 1.8-.9 1.8-1.9V28h2.2z";

  let cssInjected = false;

  function injectCSS() {
    if (cssInjected) return;
    cssInjected = true;
    const css = `
#umbrella-rain{position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden;opacity:1;transition:opacity .6s ease}
#umbrella-rain.hidden{opacity:0}
#umbrella-rain .drop{position:absolute;top:-12vh;will-change:transform;animation-name:fall;animation-timing-function:linear;animation-fill-mode:forwards}
#umbrella-rain .sway{will-change:transform;animation-name:sway;animation-timing-function:ease-in-out;animation-iteration-count:infinite}
#umbrella-rain .spin{will-change:transform;animation-name:spin;animation-fill-mode:both}
#umbrella-rain svg{display:block;width:var(--size,18px);height:var(--size,18px);color:var(--col,var(--yellow));filter:drop-shadow(0 2px 2px rgba(0,0,0,.15))}
@keyframes fall{from{transform:translateY(-120px)}to{transform:translateY(110vh)}}
@keyframes sway{0%,100%{transform:translateX(0)}50%{transform:translateX(var(--sway,18px))}}
@keyframes spin{to{transform:rotate(var(--spin,180deg))}}
@media (prefers-reduced-motion: reduce){#umbrella-rain{display:none!important}}
    `.trim();
    const tag = document.createElement('style');
    tag.setAttribute('data-umbrella-rain', '1');
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  function playRain({ force = false } = {}) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!force && ONCE_PER_SESSION && sessionStorage.getItem('brelloIntroDone')) return;

    injectCSS();

    // Se è già in corso, riavvia pulito
    const existing = document.getElementById('umbrella-rain');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'umbrella-rain';
    document.body.appendChild(overlay);

    let maxEnd = 0;

    for (let i = 0; i < COUNT; i++) {
      const delay   = Math.random() * 0.4;          // 0–0.8s
      const dur     = 2.8 + Math.random() * 2.2;    // 2.8–5.0s
      const swayDur = 2 + Math.random() * 2;        // 2–4s
      const size    = 32 + Math.random() * 16;      // 12–28px
      const sway    = (Math.random()*40 - 20) + 'px';
      const spinDeg = (Math.random()<0.5?-1:1) * (120 + Math.random()*180);
      const color   = COLORS[i % COLORS.length];
      const leftvw  = Math.random() * 100;

      const drop = document.createElement('div');
      drop.className = 'drop';
      drop.style.left = leftvw + 'vw';
      drop.style.animationDuration = dur + 's';
      drop.style.animationDelay = delay + 's';

      const swayWrap = document.createElement('div');
      swayWrap.className = 'sway';
      swayWrap.style.setProperty('--sway', sway);
      swayWrap.style.animationDuration = swayDur + 's';
      swayWrap.style.animationDelay = delay + 's';

      const spinWrap = document.createElement('div');
      spinWrap.className = 'spin';
      spinWrap.style.setProperty('--spin', spinDeg + 'deg');
      spinWrap.style.animationDuration = dur + 's';
      spinWrap.style.animationDelay = delay + 's';

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 64 64');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.setProperty('--size', size + 'px');
      svg.style.setProperty('--col', color);

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('fill', 'currentColor');
      path.setAttribute('d', PATH);

      svg.appendChild(path);
      spinWrap.appendChild(svg);
      swayWrap.appendChild(spinWrap);
      drop.appendChild(swayWrap);
      overlay.appendChild(drop);

      maxEnd = Math.max(maxEnd, delay + dur);
    }

    // Fade-out e cleanup
    setTimeout(() => {
      overlay.classList.add('hidden');
      overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
      if (!force && ONCE_PER_SESSION) sessionStorage.setItem('brelloIntroDone', '1');
    }, (maxEnd + 0.8) * 1000);
  }

  // Autoplay al load (una volta per sessione)
  window.addEventListener('load', () => playRain());

  // Trigger anche su click di CTA e logo (non blocco i comportamenti esistenti)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.cta, .brand')) {
      playRain({ force: true });
    }
  });

  // Export opzionale, se vuoi triggerarlo manualmente: window.brelloRain()
  window.brelloRain = () => playRain({ force: true });
})();
