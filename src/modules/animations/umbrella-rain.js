/**
 * Umbrella Rain Animation Module
 * Gestisce l'animazione pioggia di ombrelli
 */

export class UmbrellaRain {
    constructor(config = {}) {
        this.config = {
            count: config.count || 360,
            oncePerSession: config.oncePerSession !== false,
            colors: config.colors || ['var(--yellow)', 'var(--viola)', 'var(--teal)', 'var(--red)', 'var(--green)'],
            path: "M32 6c-12.7 0-22.9 8.9-25.2 21.1-.3 1.7 1.7 2.8 3.1 1.7C14 24.8 19.4 22 26 22c5.8 0 9.8 2.1 12.9 5.1 1.3 1.2 3.5.2 3.2-1.6C40.5 14.6 36.7 6 32 6zM30 28v21.2c0 2-1.6 3.6-3.6 3.6-2.2 0-3.9-1.9-3.6-4.1.2-1.6 1.6-2.8 3.2-2.9 1-.1 1.8-.9 1.8-1.9V28h2.2z"
        };
        this.cssInjected = false;
    }

    injectCSS() {
        if (this.cssInjected) return;
        this.cssInjected = true;

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

    play({ force = false } = {}) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        if (!force && this.config.oncePerSession && sessionStorage.getItem('brelloIntroDone')) return;

        this.injectCSS();

        // Se è già in corso, riavvia pulito
        const existing = document.getElementById('umbrella-rain');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'umbrella-rain';
        document.body.appendChild(overlay);

        let maxEnd = 0;

        for (let i = 0; i < this.config.count; i++) {
            const delay = Math.random() * 0.4;
            const dur = 2.8 + Math.random() * 2.2;
            const swayDur = 2 + Math.random() * 2;
            const size = 32 + Math.random() * 16;
            const sway = (Math.random() * 40 - 20) + 'px';
            const spinDeg = (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 180);
            const color = this.config.colors[i % this.config.colors.length];
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
            path.setAttribute('d', this.config.path);

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
            if (!force && this.config.oncePerSession) {
                sessionStorage.setItem('brelloIntroDone', '1');
            }
        }, (maxEnd + 0.8) * 1000);
    }
}

export function initUmbrellaRain() {
    const rain = new UmbrellaRain();

    // Autoplay al load (una volta per sessione)
    window.addEventListener('load', () => rain.play());

    // Trigger anche su click di CTA e logo
    document.addEventListener('click', (e) => {
        if (e.target.closest('.cta, .brand')) {
            rain.play({ force: true });
        }
    });

    // Export globale per trigger manuale
    window.brelloRain = () => rain.play({ force: true });
}
