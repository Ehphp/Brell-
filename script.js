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
    const map = { sponsor: '#editorBrello', utente: '#chiSiamo' };
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

//#region ADMIN LOGIN
let admin = false;
let password = "";

function passwordInput(event) {
  password = event.target.value;
}

function checkAdmin() {
  console.log(password);
  if (password === "password") {
    admin = true;
    const panelInput = document.getElementById("panel-input")
    const passwordInput = document.getElementById("admin-password-input")

    panelInput.removeAttribute("disabled");

    passwordInput.value = "";

    const adminModalEl = document.getElementById('enableAdminModal');
    const adminModal = bootstrap.Modal.getInstance(adminModalEl);
    if (adminModal) {
      password = "";
      adminModal.hide();
    }
  }
}

document.getElementById('admin-password-input')?.addEventListener('input', passwordInput);
document.getElementById('admin-password-send')?.addEventListener('click', checkAdmin);

//#endregion

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

// Mappa dinamica
mapboxgl.accessToken = 'pk.eyJ1IjoiaHBocGhwaHAiLCJhIjoiY21lazB5MHhmMDB4eDJscXJ0NmlxMnFrMCJ9.Uqgp2euLBUrE1OrRCHq0EQ';
const mapEl = document.getElementById('map');
if (mapEl && window.mapboxgl) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hphphphp/cmek34twr001o01qt8yff8wlz',
  

  });

  map.addControl(new mapboxgl.NavigationControl());
  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
  }));

  const brands = [
    { coordinates: [12.4964, 41.9028], name: 'Brand A' },
    { coordinates: [9.19, 45.4642], name: 'Brand B' }
  ];

  brands.forEach(b => {
    const el = document.createElement('div');
    el.className = 'marker';
    el.textContent = b.name.charAt(0);
    new mapboxgl.Marker(el)
      .setLngLat(b.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(b.name))
      .addTo(map);
  });

  map.on('load', () => {
    if (brands.length > 1) {
      map.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: brands.map(b => b.coordinates) }
        }
      });
      map.addLayer({
        id: 'route',
        type: 'line',
        source: 'route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: { 'line-color': '#F3B300', 'line-width': 4 }
      });
    }
  });

  const cityInput = document.getElementById('city-search');
  cityInput?.addEventListener('change', () => {
    const q = cityInput.value.trim();
    if (!q) return;
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(q + ', Italia')}.json?access_token=${mapboxgl.accessToken}&limit=1`)
      .then(r => r.json())
      .then(res => {
        if (res.features && res.features.length) {
          const [lng, lat] = res.features[0].center;
          map.flyTo({ center: [lng, lat], zoom: 13 });
        } else {
          toast('Città non trovata');
        }
      });
  });
}

// Cambio gradiente sezione "chi siamo" in base alla card attiva
const chiSiamo = document.getElementById('chiSiamo');
let selectedColor = null;

if (chiSiamo) {
  chiSiamo.querySelectorAll('.cardPag2').forEach(card => {
    card.addEventListener('mouseenter', () => {
      const col = card.dataset.color;
      if (col) chiSiamo.style.setProperty('--accent-color', col);
    });

    card.addEventListener('mouseleave', () => {
      if (selectedColor) {
        chiSiamo.style.setProperty('--accent-color', selectedColor);
      } else {
        chiSiamo.style.removeProperty('--accent-color');
      }
    });

    card.addEventListener('click', () => {
      const col = card.dataset.color;
      if (col) {
        selectedColor = col;
        chiSiamo.style.setProperty('--accent-color', col);
      }
    });
  });
}

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
      const delay = Math.random() * 0.4;          // 0–0.8s
      const dur = 2.8 + Math.random() * 2.2;    // 2.8–5.0s
      const swayDur = 2 + Math.random() * 2;        // 2–4s
      const size = 32 + Math.random() * 16;      // 12–28px
      const sway = (Math.random() * 40 - 20) + 'px';
      const spinDeg = (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 180);
      const color = COLORS[i % COLORS.length];
      const leftvw = Math.random() * 100;

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




  // START Test sfondo animato 
  // util
  const BR_CLAMP = (n, a, b) => Math.max(a, Math.min(b, n));
  const BR_EASE_CUBIC = t =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function BR_progressFor(el, startRatio = 0.80, endRatio = 0.20) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const center = rect.top + rect.height / 2;
    const S = vh * startRatio;
    const R = vh * endRatio;
    let p = 1 - (center - S) / (R - S); // stessa direzione del tuo codice
    return BR_CLAMP(p, 0, 1);
  }

  // registrazione sezioni
  const BR_items = [];

  // #mapContainer → aggiorna --p
  const BR_elMap = document.querySelector('#mapContainer');
  if (BR_elMap) {
    BR_items.push({
      el: BR_elMap,
      startRatio: 0.80,
      endRatio: 0.20,
      apply: (el, p) => {
        const pe = BR_EASE_CUBIC(p);
        el.style.setProperty('--p', pe.toFixed(4));
      }
    });
  }

  // #editorBrello → muove il centro del conic-gradient lungo Y (—g-y)
  const BR_elEditor = document.querySelector('#editorBrello');
  if (BR_elEditor) {
    BR_items.push({
      el: BR_elEditor,
      startRatio: 0.80,
      endRatio: 0.20,
      xMin: 50,     // cambia se vuoi limitarne l’escursione (es. 20)
      xMax: 88,   // cambia se vuoi limitarne l’escursione (es. 80)
      apply: (el, p, cfg) => {
        const pe = BR_EASE_CUBIC(p);
        const x = cfg.xMin + (cfg.xMax - cfg.xMin) * pe;
        el.style.setProperty('--g-x', x.toFixed(2) + '%');
      }
    });
  }

  if (!BR_items.length) return;

  let BR_ticking = false;
  function BR_updateAll() {
    for (const item of BR_items) {
      const p = BR_progressFor(item.el, item.startRatio, item.endRatio);
      item.apply(item.el, p, item);
    }
  }

  function BR_onScroll() {
    if (!BR_ticking) {
      BR_ticking = true;
      requestAnimationFrame(() => {
        BR_updateAll();
        BR_ticking = false;
      });
    }
  }

  // init + listeners
  BR_updateAll();
  window.addEventListener('scroll', BR_onScroll, { passive: true });
  window.addEventListener('resize', BR_onScroll);

  // //655555555555555555555555555555555
  // Sezioni da animare + lettura di eventuali override da data-attr
  const targets = [...document.querySelectorAll('#top, #chiSiamo')]
    .map(el => ({
      el,
      start: parseFloat(el.dataset.rStart) || 800, // default
      end: parseFloat(el.dataset.rEnd) || 330  // default
    }))
    .filter(t => t.el);

  if (!targets.length) return;

  const clamp = (n, min, max) => Math.max(min, Math.min(n, max));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  let ticking = false;

  function updateAll() {
    const vh = window.innerHeight;

    for (const { el, start, end } of targets) {
      const rect = el.getBoundingClientRect();
      const total = vh + rect.height;                 // intero “passaggio” nel viewport
      const seen = clamp(vh - rect.top, 0, total);   // quanto è “entrata”
      const t = easeInOutCubic(seen / total);     // 0→1
      const r = lerp(start, end, t);

      el.style.setProperty('--r', `${r}px`);
    }
    ticking = false;
  }

  function onScrollOrResize() {
    if (!ticking) {
      requestAnimationFrame(updateAll);
      ticking = true;
    }
  }

  // init
  updateAll();
  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  // END testSfondo animato





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
