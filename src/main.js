import { animate, stagger } from 'animejs';
import './style.css';

const deck = document.querySelector('#deck');
const slides = [...document.querySelectorAll('.slide')];
const count = document.querySelector('#slide-count');
const progressBar = document.querySelector('#progress-bar');
const progress = document.querySelector('#progress-fill');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
const pageTabs = [...document.querySelectorAll('.page-tab')];
const tocToggle = document.querySelector('#toc-toggle');
const tocPanel = document.querySelector('#toc-panel');
const tocClose = document.querySelector('#toc-close');
const tocItems = [...document.querySelectorAll('#toc-list button')];
const fullscreenToggle = document.querySelector('#fullscreen-toggle');

let current = 0;
let touchStart = null;

function fitDeck() {
  const barHeight = 46;
  const availH = Math.max(window.innerHeight - barHeight, 200);
  const scale = Math.min(window.innerWidth / 1600, availH / 900);
  deck.style.top = `${availH / 2}px`;
  deck.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function toggleToc(forceState) {
  const willOpen = typeof forceState === 'boolean' ? forceState : tocPanel.hidden;
  tocPanel.hidden = !willOpen;
  tocToggle.setAttribute('aria-expanded', String(willOpen));
  tocToggle.classList.toggle('active', willOpen);
}

function show(index, { updateHash = true, animateIn = true } = {}) {
  const target = Math.min(Math.max(index, 0), slides.length - 1);
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === target);
    slide.setAttribute('aria-hidden', i === target ? 'false' : 'true');
  });
  current = target;
  if (count) {
    count.innerHTML = `${String(current + 1).padStart(2, '0')} <i>/</i> ${String(slides.length).padStart(2, '0')}`;
  }
  if (progress) {
    progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  }
  pageTabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === current);
    tab.setAttribute('aria-current', i === current ? 'page' : 'false');
  });
  tocItems.forEach((item, i) => {
    item.classList.toggle('active', i === current);
  });
  prev.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  if (updateHash) history.replaceState(null, '', `#${current + 1}`);
  if (animateIn && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animate(slides[current].querySelectorAll('.reveal'), {
      opacity: [0, 1], y: [18, 0],
      delay: stagger(70), duration: 560, ease: 'outCubic'
    });
  }
}

async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch {
    // Ignore fullscreen permission errors in restricted contexts
  }
}

document.addEventListener('fullscreenchange', () => {
  const isFull = Boolean(document.fullscreenElement);
  fullscreenToggle.textContent = isFull ? '⛶화면종료' : '⛶ 전체화면';
  fullscreenToggle.classList.toggle('active', isFull);
  fitDeck();
});

prev.addEventListener('click', () => show(current - 1));
next.addEventListener('click', () => show(current + 1));

pageTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    show(Number(tab.dataset.slide));
  });
});

tocToggle.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleToc();
});

if (count) {
  count.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleToc();
  });
}

tocClose.addEventListener('click', () => toggleToc(false));

tocItems.forEach((item) => {
  item.addEventListener('click', () => {
    show(Number(item.dataset.slide));
    toggleToc(false);
  });
});

if (progressBar) {
  progressBar.addEventListener('click', (event) => {
    const rect = progressBar.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 0.999);
    const targetSlide = Math.floor(ratio * slides.length);
    show(targetSlide);
  });
}

fullscreenToggle.addEventListener('click', toggleFullscreen);

document.addEventListener('click', (event) => {
  if (!tocPanel.hidden && !event.target.closest('#toc-panel, #toc-toggle, #slide-count')) {
    toggleToc(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !tocPanel.hidden) {
    event.preventDefault();
    toggleToc(false);
    return;
  }
  if (event.target.closest('a, button, input, textarea')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
  if (event.key === 'Home') show(0);
  if (event.key === 'End') show(slides.length - 1);
  if (event.key === 'f' || event.key === 'F') { event.preventDefault(); toggleFullscreen(); }
  if (event.key === 't' || event.key === 'T' || event.key === 'm' || event.key === 'M') { event.preventDefault(); toggleToc(); }
});

deck.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
deck.addEventListener('touchend', (event) => {
  if (touchStart === null) return;
  const delta = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(delta) > 70) show(current + (delta < 0 ? 1 : -1));
  touchStart = null;
}, { passive: true });

window.addEventListener('resize', fitDeck);
window.addEventListener('hashchange', () => {
  const index = Number(location.hash.slice(1)) - 1;
  if (Number.isInteger(index) && index >= 0 && index < slides.length) show(index, { updateHash: false });
});

fitDeck();
const initial = Number(location.hash.slice(1)) - 1;
show(Number.isInteger(initial) ? initial : 0, { updateHash: false });
