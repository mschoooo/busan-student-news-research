import { animate, stagger } from 'animejs';
import './style.css';

const deck = document.querySelector('#deck');
const slides = [...document.querySelectorAll('.slide')];
const count = document.querySelector('#slide-count');
const progress = document.querySelector('#progress-fill');
const prev = document.querySelector('#prev');
const next = document.querySelector('#next');
let current = 0;
let touchStart = null;

function fitDeck() {
  const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
  deck.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function show(index, { updateHash = true, animateIn = true } = {}) {
  const target = Math.min(Math.max(index, 0), slides.length - 1);
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === target);
    slide.setAttribute('aria-hidden', i === target ? 'false' : 'true');
  });
  current = target;
  count.innerHTML = `${String(current + 1).padStart(2, '0')} <i>/</i> ${String(slides.length).padStart(2, '0')}`;
  progress.style.width = `${((current + 1) / slides.length) * 100}%`;
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

prev.addEventListener('click', () => show(current - 1));
next.addEventListener('click', () => show(current + 1));
document.addEventListener('keydown', (event) => {
  if (event.target.closest('a, button, input, textarea')) return;
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); show(current + 1); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); show(current - 1); }
  if (event.key === 'Home') show(0);
  if (event.key === 'End') show(slides.length - 1);
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
