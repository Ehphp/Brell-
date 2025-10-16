// ========================================
// NAVIGATION - Mobile Menu & Scroll Effects
// ========================================

// Mobile Menu Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const nav = document.querySelector('.nav');
const body = document.body;
const mobileQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(max-width: 768px)')
  : null;
const isMobileView = () => (mobileQuery ? mobileQuery.matches : window.innerWidth <= 768);

if (navToggle && navMenu && nav) {
  const setMenuState = (isOpen) => {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navMenu.classList.toggle('active', isOpen);

    if (isMobileView()) {
      navMenu.setAttribute('aria-hidden', String(!isOpen));
      body.style.overflow = isOpen ? 'hidden' : '';

      if (isOpen) {
        const firstFocusable = navMenu.querySelector('a, button');
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }
    } else {
      navMenu.setAttribute('aria-hidden', 'false');
      body.style.overflow = '';
    }
  };

  const closeMenu = () => setMenuState(false);

  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    setMenuState(!isExpanded);
  });

  // Close menu when clicking on a link
  navMenu.querySelectorAll('.link, .cta').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });

  // Close on Escape for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
      navToggle.focus();
    }
  });

  const handleViewportChange = () => {
    if (isMobileView()) {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navMenu.setAttribute('aria-hidden', String(!isExpanded));
      if (!isExpanded) {
        navMenu.classList.remove('active');
        body.style.overflow = '';
      }
    } else {
      navMenu.classList.remove('active');
      navMenu.setAttribute('aria-hidden', 'false');
      navToggle.setAttribute('aria-expanded', 'false');
      body.style.overflow = '';
    }
  };
  if (mobileQuery && typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleViewportChange);
  } else if (mobileQuery && typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(handleViewportChange);
  } else {
    window.addEventListener('resize', handleViewportChange, { passive: true });
    mobileQuery.addListener(handleViewportChange);
  }

  handleViewportChange();
}

// Scroll Effect - Add class to nav when scrolling
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
}, { passive: true });

// ========================================
// SMOOTH SCROLL & CTA INTERACTIONS
// ========================================

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

      // Track CTA clicks
      if (typeof gtag !== 'undefined') {
        gtag('event', target === 'sponsor' ? 'click_cta_sponsor' : 'click_cta_citizens', {
          event_category: 'conversion',
          event_label: `cta_${target}_clicked`
        });
      }
    }
  });
});

// Track map interactions
document.addEventListener('DOMContentLoaded', function () {
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    mapContainer.addEventListener('click', function () {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'map_interaction', {
          event_category: 'engagement',
          event_label: 'map_clicked'
        });
      }
    });
  }

  // Lazy loading for images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for older browsers
    document.querySelectorAll('img[data-src]').forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }

  // Initialize 3D Editor enhancements
  initializeEditor();
});

// Track when map comes into view
const mapContainer = document.getElementById('map');
if (mapContainer) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && typeof gtag !== 'undefined') {
        gtag('event', 'view_map', {
          event_category: 'engagement',
          event_label: 'map_section_viewed'
        });
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(mapContainer);
}

// 3D Editor Enhancement Functions
function initializeEditor() {
  const uploadZone = document.getElementById('upload-drop-zone');
  const fileInput = document.getElementById('panel-input');
  const templateBtns = document.querySelectorAll('.template-btn');
  const scaleSlider = document.getElementById('logo-scale');
  const rotationSlider = document.getElementById('logo-rotation');
  const scaleValue = document.getElementById('scale-value');
  const rotationValue = document.getElementById('rotation-value');
  const previewBtn = document.getElementById('preview-button');

  // Drag and drop functionality
  if (uploadZone && fileInput) {
    uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadZone.classList.remove('dragover');

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    });

    uploadZone.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
      }
    });
  }

  // Template buttons
  templateBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      templateBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const template = btn.dataset.template;
      loadTemplate(template);

      // Track template usage
      if (typeof gtag !== 'undefined') {
        gtag('event', 'template_selected', {
          event_category: 'editor',
          event_label: template
        });
      }
    });
  });

  // Range sliders
  if (scaleSlider && scaleValue) {
    scaleSlider.addEventListener('input', (e) => {
      const value = Math.round(e.target.value * 100);
      scaleValue.textContent = `${value}%`;
      updateLogoScale(e.target.value);
    });
  }

  if (rotationSlider && rotationValue) {
    rotationSlider.addEventListener('input', (e) => {
      rotationValue.textContent = `${e.target.value}°`;
      updateLogoRotation(e.target.value);
    });
  }

  // Preview button
  if (previewBtn) {
    previewBtn.addEventListener('click', () => {
      showFullPreview();

      // Track preview usage
      if (typeof gtag !== 'undefined') {
        gtag('event', 'preview_full', {
          event_category: 'editor',
          event_label: 'preview_clicked'
        });
      }
    });
  }
}

function handleFileUpload(file) {
  // Validate file
  if (!file.type.startsWith('image/')) {
    showNotification('⚠️ Seleziona un file immagine valido', 'warning');
    return;
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    showNotification('⚠️ Il file è troppo grande (max 5MB)', 'warning');
    return;
  }

  showNotification('✅ Logo caricato con successo!', 'success');

  // Track file upload
  if (typeof gtag !== 'undefined') {
    gtag('event', 'logo_uploaded', {
      event_category: 'editor',
      event_label: 'file_uploaded',
      value: Math.round(file.size / 1024) // Size in KB
    });
  }

  // Here you would integrate with the 3D editor to apply the texture
  // This connects with scriptEditor.js functionality
  if (typeof window.applyCustomTexture === 'function') {
    window.applyCustomTexture(file);
  }
}

function loadTemplate(templateType) {
  const templates = {
    restaurant: {
      text: 'Ristorante Da Mario',
      color: '#e74c3c',
      icon: '🍕'
    },
    bar: {
      text: 'Café Central',
      color: '#8b4513',
      icon: '☕'
    },
    shop: {
      text: 'Boutique Milano',
      color: '#9b59b6',
      icon: '🛍️'
    },
    service: {
      text: 'Tech Solutions',
      color: '#3498db',
      icon: '🔧'
    }
  };

  const template = templates[templateType];
  if (template) {
    showNotification(`📋 Template "${template.text}" caricato`, 'info');

    // Here you would apply the template to the 3D model
    if (typeof window.applyTemplate === 'function') {
      window.applyTemplate(template);
    }
  }
}

function updateLogoScale(scale) {
  // Connect with 3D editor to update logo scale
  if (typeof window.updateLogoScale === 'function') {
    window.updateLogoScale(scale);
  }
}

function updateLogoRotation(rotation) {
  // Connect with 3D editor to update logo rotation
  if (typeof window.updateLogoRotation === 'function') {
    window.updateLogoRotation(rotation);
  }
}

function showFullPreview() {
  // Create preview modal or fullscreen view
  const modal = document.createElement('div');
  modal.className = 'preview-modal';
  modal.innerHTML = `
    <div class="preview-content">
      <div class="preview-header">
        <h3>🎯 Anteprima Ombrello Brellò</h3>
        <button class="close-preview">&times;</button>
      </div>
      <div class="preview-body">
        <div class="preview-360">
          <!-- 3D preview would be rendered here -->
          <p>Visualizzazione 360° del tuo ombrello personalizzato</p>
        </div>
        <div class="preview-info">
          <h4>Dettagli pubblicità:</h4>
          <ul>
            <li>✅ Logo applicato su 18 spazi</li>
            <li>✅ Visibilità garantita 3-4 mesi</li>
            <li>✅ Copertura mobile cittadina</li>
            <li>✅ QR code per tracking conversioni</li>
          </ul>
          <button class="btn btn--yellow">📧 Richiedi preventivo</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal functionality
  modal.querySelector('.close-preview').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;

  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    zIndex: '10000',
    animation: 'slideIn 0.3s ease-out',
    backgroundColor: type === 'success' ? '#27ae60' :
      type === 'warning' ? '#f39c12' :
        type === 'error' ? '#e74c3c' : '#3498db'
  });

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

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

  // Track form submission
  if (typeof gtag !== 'undefined') {
    gtag('event', 'submit_form_sponsor', {
      event_category: 'conversion',
      event_label: 'sponsor_form_completed',
      value: 1
    });
  }

  form.reset();
  toast('Richiesta inviata! Ti scriviamo presto.');
});

// Invio form utente
document.getElementById('form-utente').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validate(form)) {
    toast('Controlla i campi evidenziati');

    // Track validation errors
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_validation_error', {
        event_category: 'user_experience',
        event_label: 'citizen_form_error'
      });
    }
    return;
  }
  const data = collect(form);
  console.log('Utente lead:', data); // Qui si integra API o backend

  // Track form submission
  if (typeof gtag !== 'undefined') {
    gtag('event', 'submit_form_citizen', {
      event_category: 'conversion',
      event_label: 'citizen_form_completed',
      value: 1
    });
  }

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

// Drag and drop handlers for 3D editor
window.dropHandler = function (ev) {
  console.log('File(s) dropped');
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        console.log(`File ${i}:`, file.name);

        // Trigger file input change for 3D editor
        const fileInput = document.getElementById('panel-input');
        if (fileInput) {
          const dt = new DataTransfer();
          dt.items.add(file);
          fileInput.files = dt.files;
          fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
  }
};

window.dragoverHandler = function (ev) {
  console.log('File(s) in drop zone');
  ev.preventDefault();
};
