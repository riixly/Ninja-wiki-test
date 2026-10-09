import { scrolls } from './content.js';

const $ = (selector) => document.querySelector(selector);
const grid = $('#scroll-grid');
const dialog = $('#scroll-dialog');
const search = $('#search');
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let filter = 'all';
let isClosing = false;
let lastTrigger = null;
let previousHash = '';
let currentScroll = null;
let preference = true;
let soundEnabled = true;
try { soundEnabled = localStorage.getItem('dojo-sound') !== 'off'; } catch { /* Optional preference. */ }
const scrollSound = new Audio('/scroll-sound.mp3');
scrollSound.preload = 'auto';
scrollSound.volume = .55;
function playScrollSound() {
  if (!soundEnabled) return;
  scrollSound.pause();
  scrollSound.currentTime = 0;
  scrollSound.play().catch(() => { /* Deep links may open before browser audio permission. */ });
}
function updateSoundButton() {
  $('#sound-toggle').textContent = soundEnabled ? 'Sound on' : 'Sound off';
  $('#sound-toggle').setAttribute('aria-pressed', String(soundEnabled));
}
$('#sound-toggle').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  try { localStorage.setItem('dojo-sound', soundEnabled ? 'on' : 'off'); } catch { /* Optional preference. */ }
  if (!soundEnabled) scrollSound.pause();
  updateSoundButton();
});
updateSoundButton();
try { preference = localStorage.getItem('dojo-effects') !== 'off'; } catch { /* Storage can be unavailable. */ }
let effects = preference && !motionQuery.matches;

const icon = (name, className = '') => `<svg class="${className}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

function renderCards() {
  const query = search.value.toLowerCase().trim();
  const matches = scrolls.filter(s => (filter === 'all' || s.category === filter) && `${s.title} ${s.label} ${s.subtitle} ${s.keywords}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map((s, i) => `<button class="scroll-card" data-open="${s.id}" style="animation-delay:${i * 55}ms" aria-haspopup="dialog" aria-label="Open ${s.title} scroll">
    <div class="scroll-rod"></div><div class="card-paper"><div class="card-meta"><span>${s.label}</span><span class="card-number">${s.number}</span></div><span class="card-seal">${icon('star')}</span>${icon(s.icon, 'card-icon')}<h3>${s.title}</h3><p class="card-subtitle">${s.subtitle}</p><div class="card-bottom"><span class="card-badge">${s.badge}</span>${icon('arrow')}</div></div><div class="scroll-rod"></div>
  </button>`).join('');
  $('#empty').hidden = matches.length > 0;
  $('#result-count').textContent = `${matches.length} ${matches.length === 1 ? 'scroll' : 'scrolls'} found.`;
}

function setFilter(next) {
  filter = next;
  document.querySelectorAll('[data-filter]').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderCards();
}

function openScroll(id, trigger = null, updateHistory = true) {
  const item = scrolls.find(s => s.id === id);
  if (!item || isClosing) return;
  playScrollSound();
  if (!dialog.open) {
    lastTrigger = trigger || document.activeElement;
    previousHash = window.location.hash;
  }
  currentScroll = id;
  $('#scroll-title').textContent = item.title;
  $('#scroll-category').textContent = item.label;
  $('#scroll-dek').textContent = item.dek;
  $('#article-emblem').innerHTML = icon(item.icon);
  $('#scroll-content').innerHTML = item.body;
  if (updateHistory) {
    const url = new URL(window.location.href);
    url.hash = id;
    if (dialog.open) window.history.replaceState(null, '', url);
    else window.history.pushState(null, '', url);
  }
  if (!dialog.open) {
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
  }
  dialog.scrollTop = 0;
  $('#close-scroll').focus({ preventScroll: true });
}

function smokeBurst(rect) {
  if (!effects) return;
  const stage = $('#smoke-stage');
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + Math.min(rect.height * .45, 330);
  const spread = Math.min(rect.width * .65, 320);
  for (let i = 0; i < 24; i++) {
    const puff = document.createElement('span');
    puff.className = 'smoke-puff';
    const angle = Math.PI * 2 * i / 24;
    const radius = 25 + Math.random() * spread;
    const size = 100 + Math.random() * 140;
    const values = {
      '--x': `${originX + Math.cos(angle) * radius * .58}px`,
      '--y': `${originY + Math.sin(angle) * radius * .44}px`,
      '--size': `${size}px`, '--dx': `${Math.cos(angle) * (80 + Math.random() * 140)}px`,
      '--dy': `${Math.sin(angle) * 70 - 60 - Math.random() * 80}px`,
      '--delay': `${Math.random() * 70}ms`, '--duration': `${800 + Math.random() * 450}ms`
    };
    for (const [key, value] of Object.entries(values)) puff.style.setProperty(key, value);
    stage.append(puff);
    setTimeout(() => puff.remove(), 1400);
  }
}

function closeScroll(updateHistory = true) {
  if (!dialog.open || isClosing) return;
  isClosing = true;
  playScrollSound();
  smokeBurst($('.open-scroll').getBoundingClientRect());
  dialog.classList.add('closing');
  setTimeout(() => {
    dialog.close();
    dialog.classList.remove('closing');
    document.documentElement.style.overflow = '';
    currentScroll = null;
    isClosing = false;
    if (updateHistory) {
      const url = new URL(window.location.href);
      const oldHashIsScroll = scrolls.some(s => `#${s.id}` === previousHash);
      url.hash = oldHashIsScroll ? '' : previousHash;
      window.history.replaceState(null, '', url);
    }
    if (lastTrigger?.isConnected && typeof lastTrigger.focus === 'function') lastTrigger.focus({ preventScroll: true });
  }, effects ? 230 : 0);
}

document.addEventListener('click', (event) => {
  const opener = event.target.closest('[data-open]');
  if (opener) openScroll(opener.dataset.open, opener);
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) setFilter(filterButton.dataset.filter);
});
$('#close-scroll').addEventListener('click', () => closeScroll());
$('#roll-away').addEventListener('click', () => closeScroll());
$('#checkpoint-open').addEventListener('click', event => openScroll('chunin-exams', event.currentTarget));
dialog.addEventListener('cancel', event => { event.preventDefault(); closeScroll(); });
let clickedOutside = false;
dialog.addEventListener('pointerdown', event => { clickedOutside = event.target === dialog; });
dialog.addEventListener('click', event => { if (clickedOutside && event.target === dialog) closeScroll(); clickedOutside = false; });
search.addEventListener('input', renderCards);
$('#reset-search').addEventListener('click', () => { search.value = ''; setFilter('all'); search.focus(); });
for (const [selector, category] of [['#nav-guides', 'guides'], ['#nav-tools', 'tools']]) {
  $(selector).addEventListener('click', () => {
    search.value = '';
    setFilter(category);
    $('#scroll-library').scrollIntoView({ behavior: effects ? 'smooth' : 'instant' });
  });
}
document.addEventListener('keydown', event => {
  if (event.key === '/' && !dialog.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    event.preventDefault(); search.focus(); search.scrollIntoView({ block: 'center', behavior: effects ? 'smooth' : 'instant' });
  }
});
function syncHash() {
  const id = window.location.hash.slice(1);
  if (scrolls.some(s => s.id === id)) {
    if (id !== currentScroll) openScroll(id, null, false);
  } else if (dialog.open) closeScroll(false);
}
window.addEventListener('hashchange', syncHash);
window.addEventListener('popstate', syncHash);

// Low-cost drifting mist: capped DPR, 30 fps, paused in background tabs.
const canvas = $('#mist');
const context = canvas.getContext('2d');
let width = 0, height = 0, frame = 0, lastTime = 0;
const wisps = Array.from({ length: 12 }, (_, i) => ({ x: i / 12, y: .26 + Math.random() * .56, r: 90 + Math.random() * 110, speed: .006 + Math.random() * .01 }));
function resizeMist() {
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
  width = Math.min(window.innerWidth, 2200); height = 920;
  canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
  context?.setTransform(ratio, 0, 0, ratio, 0, 0);
}
function drawMist(time) {
  if (!effects || document.hidden || !context) { frame = 0; return; }
  const delta = lastTime ? Math.min((time - lastTime) / 1000, .1) : 0;
  if (lastTime && delta < 1 / 30) { frame = requestAnimationFrame(drawMist); return; }
  lastTime = time;
  context.clearRect(0, 0, width, height);
  for (const wisp of wisps) {
    wisp.x += delta * wisp.speed;
    if (wisp.x > 1.25) wisp.x = -.25;
    const x = wisp.x * width, y = wisp.y * height + Math.sin(time / 6500 + wisp.y * 8) * 20;
    const fog = context.createRadialGradient(x, y, 0, x, y, wisp.r);
    fog.addColorStop(0, 'rgba(176,188,164,0.045)'); fog.addColorStop(1, 'rgba(176,188,164,0)');
    context.fillStyle = fog;
    context.beginPath(); context.ellipse(x, y, wisp.r * 1.6, wisp.r * .42, 0, 0, Math.PI * 2); context.fill();
  }
  frame = requestAnimationFrame(drawMist);
}
function updateEffects() {
  effects = preference && !motionQuery.matches;
  document.body.classList.toggle('effects-off', !effects);
  const toggle = $('#motion-toggle');
  toggle.textContent = motionQuery.matches ? 'Reduced motion' : effects ? 'Effects on' : 'Effects off';
  toggle.setAttribute('aria-pressed', String(effects));
  toggle.disabled = motionQuery.matches;
  toggle.title = motionQuery.matches ? 'Follows your device’s reduced motion setting' : 'Toggle smoke, mist, and scroll animations';
  if (frame) cancelAnimationFrame(frame);
  frame = 0; lastTime = 0;
  if (effects && !document.hidden && context) frame = requestAnimationFrame(drawMist);
}
$('#motion-toggle').addEventListener('click', () => {
  preference = !preference;
  try { localStorage.setItem('dojo-effects', preference ? 'on' : 'off'); } catch { /* Optional preference. */ }
  updateEffects();
});
motionQuery.addEventListener('change', updateEffects);
document.addEventListener('visibilitychange', updateEffects);
window.addEventListener('resize', resizeMist);
resizeMist(); updateEffects(); renderCards(); syncHash();
