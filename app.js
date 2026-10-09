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

const inlineOpen = new Set();

function setCardExpanded(card, expanded) {
  const id = card.dataset.open;
  const item = scrolls.find(s => s.id === id);
  if (!item) return;
  const slot = card.closest('.scroll-slot');
  if (expanded) inlineOpen.add(id);
  else inlineOpen.delete(id);
  card.classList.toggle('unrolled', expanded);
  slot.classList.toggle('is-unrolled', expanded);
  card.setAttribute('aria-expanded', String(expanded));
  card.setAttribute('aria-haspopup', expanded ? 'dialog' : 'false');
  card.setAttribute('aria-label', expanded ? `Enlarge ${item.title} in the center` : `Unroll ${item.title} scroll`);
  slot.querySelector('.roll-up-card').hidden = !expanded;
  if (expanded) slot.classList.remove('poofing');
  else if (effects) {
    slot.classList.remove('poofing');
    void slot.offsetWidth;
    slot.classList.add('poofing');
  }
  playScrollSound();
}

function renderCards() {
  const query = search.value.toLowerCase().trim();
  const matches = scrolls.filter(s => (filter === 'all' || s.category === filter) && `${s.title} ${s.label} ${s.subtitle} ${s.keywords}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map((s, i) => {
    const expanded = inlineOpen.has(s.id);
    return `<div class="scroll-slot ${expanded ? 'is-unrolled' : ''}">

      <button type="button" class="scroll-card ${expanded ? 'unrolled' : ''}" data-open="${s.id}" style="animation-delay:${i * 55}ms" aria-expanded="${expanded}" aria-haspopup="${expanded ? 'dialog' : 'false'}" aria-label="${expanded ? `Enlarge ${s.title} in the center` : `Unroll ${s.title} scroll`}">
        <div class="card-paper">
          <span class="scroll-art scroll-art-closed" aria-hidden="true"></span>
          <span class="scroll-art scroll-art-open" aria-hidden="true"></span>
          <div class="rolled-face">
            <span class="rolled-mark">${icon(s.icon)}</span>
            <span class="rolled-title">${s.title}</span>
            <span class="rolled-hint">TAP TO UNROLL</span>
          </div>
          <div class="unrolled-face">
            <div class="card-meta"><span>${s.label}</span><span class="card-number">${s.number}</span></div>
            <span class="card-seal">${icon('star')}</span>
            ${icon(s.icon, 'card-icon')}
            <h3>${s.title}</h3><p class="card-subtitle">${s.subtitle}</p>
            <div class="card-bottom"><span class="card-badge">${s.badge}</span>${icon('arrow')}</div>
            <span class="card-instruction">TAP AGAIN TO ENLARGE ${icon('arrow')}</span>
          </div>
        </div>
      </button>
      <button type="button" class="roll-up-card" data-roll-up="${s.id}" aria-label="Roll ${s.title} closed" ${expanded ? '' : 'hidden'}>${icon('close')}<span>Roll closed</span></button>
    </div>`;
  }).join('');
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
  if (document.getElementById('entrance')) return;
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
  // Place smoke above the modal's top layer, including during its exit.
  if (typeof stage.showPopover === 'function' && !stage.matches(':popover-open')) stage.showPopover();
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
    setTimeout(() => {
      puff.remove();
      if (!stage.childElementCount && typeof stage.hidePopover === 'function') stage.hidePopover();
    }, 1400);
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

document.addEventListener('click', function eventClick(event) {
  const rollButton = event.target.closest('[data-roll-up]');
  if (rollButton) {
    const card = Array.from(grid.querySelectorAll('.scroll-card')).find(el => el.dataset.open === rollButton.dataset.rollUp);
    if (card) {
      setCardExpanded(card, false);
      card.focus({ preventScroll: true });
    }
    return;
  }
  const opener = event.target.closest('[data-open]');
  if (opener) {
    if (opener.matches('.scroll-card')) {
      if (inlineOpen.has(opener.dataset.open)) openScroll(opener.dataset.open, opener);
      else setCardExpanded(opener, true);
    } else {
      openScroll(opener.dataset.open, opener);
    }
    return;
  }
  const filterButton = event.target.closest('[data-filter]');
  if (filterButton) setFilter(filterButton.dataset.filter);
});
$('#close-scroll').addEventListener('click', () => closeScroll());
$('#roll-away').addEventListener('click', () => closeScroll());
dialog.addEventListener('cancel', event => { event.preventDefault(); closeScroll(); });
let clickedOutside = false;
dialog.addEventListener('pointerdown', event => { clickedOutside = event.target === dialog; });
dialog.addEventListener('click', event => { if (clickedOutside && event.target === dialog) closeScroll(); clickedOutside = false; });
search.addEventListener('input', renderCards);
$('#reset-search').addEventListener('click', () => { search.value = ''; setFilter('all'); search.focus(); });
document.addEventListener('keydown', event => {
  if (event.key === '/' && !dialog.open && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    event.preventDefault(); search.focus(); search.scrollIntoView({ block: 'center', behavior: effects ? 'smooth' : 'instant' });
  }
});
function syncHash() {
  if (document.getElementById('entrance')) return;
  const id = window.location.hash.slice(1);
  if (scrolls.some(s => s.id === id)) {
    if (id !== currentScroll) openScroll(id, null, false);
  } else if (dialog.open) closeScroll(false);
}
window.addEventListener('hashchange', syncHash);
window.addEventListener('popstate', syncHash);
document.addEventListener('ninja:entered', syncHash);


/* Shinobi Radio — 12% volume on first visit, continuous track looping. */
const music = $('#site-music');
const musicPlayer = $('.music-player');
const musicPlay = $('#music-play');
const musicPlayIcon = $('#music-play-icon');
const musicMute = $('#music-mute');
const musicVolume = $('#music-volume');
const musicSeek = $('#music-seek');
const musicClock = $('#music-clock');
const musicStatus = $('#music-status');
let pendingMusicAutoplay = true;
const initialMusicVolume = (() => {
  try {
    const saved = localStorage.getItem('ninja-music-volume');
    return saved !== null && Number.isFinite(Number(saved)) ? Math.min(100, Math.max(0, Number(saved))) : 12;
  } catch { return 12; }
})();
music.volume = initialMusicVolume / 100;
musicVolume.value = String(initialMusicVolume);
music.loop = true;

function musicTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const n = Math.floor(seconds);
  return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
}
function updateMusicUI() {
  const playing = !music.paused && !music.ended;
  musicPlayer.classList.toggle('is-playing', playing);
  musicPlay.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  musicPlay.title = playing ? 'Pause background music' : 'Play background music';
  musicPlayIcon.innerHTML = playing
    ? '<rect x="7" y="5" width="3" height="14" rx="1"/><rect x="14" y="5" width="3" height="14" rx="1"/>'
    : '<path d="m8 5 11 7-11 7Z"/>';
  const silent = music.muted || music.volume === 0;
  musicMute.setAttribute('aria-label', silent ? 'Unmute music' : 'Mute music');
  musicMute.title = silent ? 'Unmute background music' : 'Mute background music';
  musicMute.classList.toggle('is-muted', silent);
  musicVolume.value = String(Math.round(music.volume * 100));
  musicVolume.style.setProperty('--fill', `${Math.round(music.volume * 100)}%`);
}
function updateMusicProgress() {
  const duration = Number.isFinite(music.duration) ? music.duration : 0;
  musicSeek.value = String(duration > 0 ? music.currentTime / duration * 100 : 0);
  musicSeek.style.setProperty('--fill', `${musicSeek.value}%`);
  musicClock.textContent = `${musicTime(music.currentTime)} / ${duration ? musicTime(duration) : '--:--'}`;
}
function startMusic() {
  // Never call play() while the entrance is waiting for its Begin click.
  if (window.ninjaEntranceUnlocked !== true) return;
  if (music.error) return;
  const result = music.play();
  if (result && typeof result.catch === 'function') {
    result.then(() => {
      pendingMusicAutoplay = false;
      musicStatus.textContent = 'Music playing on loop.';
    }).catch(() => {
      // Most browsers block audio until the visitor interacts with the page.
      musicStatus.textContent = 'Tap Play to start background music.';
    });
  }
}
// The button is the ONLY action allowed to start music from the entrance.
document.addEventListener('ninja:begin', () => {
  pendingMusicAutoplay = false;
  startMusic();
});
musicPlay.addEventListener('click', () => {
  pendingMusicAutoplay = false;
  if (music.paused) startMusic();
  else music.pause();
});
musicMute.addEventListener('click', () => {
  music.muted = !music.muted;
  updateMusicUI();
});
musicVolume.addEventListener('input', () => {
  music.volume = Number(musicVolume.value) / 100;
  if (music.volume > 0) music.muted = false;
  try { localStorage.setItem('ninja-music-volume', musicVolume.value); } catch {}
  updateMusicUI();
});
musicSeek.addEventListener('input', () => {
  if (Number.isFinite(music.duration) && music.duration > 0) {
    music.currentTime = Number(musicSeek.value) / 100 * music.duration;
    updateMusicProgress();
  }
});
music.addEventListener('play', updateMusicUI);
music.addEventListener('pause', updateMusicUI);
music.addEventListener('volumechange', updateMusicUI);
music.addEventListener('loadedmetadata', updateMusicProgress);
music.addEventListener('timeupdate', updateMusicProgress);
music.addEventListener('error', () => {
  pendingMusicAutoplay = false;
  musicStatus.textContent = 'Track unavailable: place the MP3 in the public folder.';
  musicPlayer.classList.add('music-missing');
  updateMusicUI();
});

/* Switch to the matching soundtrack when a theme changes. */
const themeToggle = $('#theme-toggle');
const themeColor = document.querySelector('meta[name="theme-color"]');
const musicTitle = $('.music-title');
const tracks = {
  normal: {
    src: '/naruto%20funk%20by%20altac0untb0y.mp3',
    title: 'naruto funk by altac0untb0y'
  },
  akatsuki: {
    src: '/Naruto_Shippuden_OST_-_Akatsuki_Theme_2_(mp3.pm).mp3',
    title: 'Akatsuki Theme 2'
  }
};
let activeTheme = document.documentElement.dataset.theme === 'akatsuki' ? 'akatsuki' : 'normal';

function applyTheme(nextTheme, switchSoundtrack = true) {
  const isNight = nextTheme === 'akatsuki';
  const next = isNight ? 'akatsuki' : 'normal';
  const wasPlaying = !music.paused && !music.ended;
  const shouldPlay = wasPlaying || (switchSoundtrack && pendingMusicAutoplay);
  const changed = next !== activeTheme || music.getAttribute('src') !== tracks[next].src;
  activeTheme = next;
  if (isNight) document.documentElement.dataset.theme = 'akatsuki';
  else delete document.documentElement.dataset.theme;
  themeColor.setAttribute('content', isNight ? '#090506' : '#07152b');

  themeToggle.setAttribute('aria-pressed', String(isNight));
  themeToggle.setAttribute('aria-label', isNight ? 'Return to the blue theme' : 'Activate red and black night mode');
  themeToggle.setAttribute('title', isNight ? 'Return to blue theme' : 'Activate night mode');
  themeToggle.querySelector('.theme-toggle-label').textContent = isNight ? 'BLUE MODE' : 'NIGHT MODE';
  musicTitle.textContent = tracks[next].title;

  if (changed) {
    music.pause();
    music.setAttribute('src', tracks[next].src);
    music.load();
    musicPlayer.classList.remove('music-missing');
    musicSeek.value = '0';
    musicSeek.style.setProperty('--fill', '0%');
    musicClock.textContent = '0:00 / --:--';
    musicStatus.textContent = 'Selected ' + tracks[next].title;
    if (switchSoundtrack && shouldPlay) startMusic();
    updateMusicUI();
  }
}

themeToggle.addEventListener('click', () => {
  const next = activeTheme === 'akatsuki' ? 'normal' : 'akatsuki';
  try { localStorage.setItem('ninja-theme', next); } catch { /* Private browsing. */ }
  applyTheme(next);
});
// Apply the stored theme's music before attempting startup playback.
applyTheme(activeTheme, false);

const tryMusicAfterGesture = event => {
  if (!pendingMusicAutoplay || event.target.closest('.music-player')) return;
  startMusic();
};
document.addEventListener('pointerdown', tryMusicAfterGesture, { passive: true });
document.addEventListener('keydown', event => {
  if (pendingMusicAutoplay && !event.repeat && !['Tab', 'Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) startMusic();
});
updateMusicUI();
updateMusicProgress();
// No automatic music on page load. Entrance click is required to start playback.

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
    const redNight = activeTheme === 'akatsuki';
    fog.addColorStop(0, redNight ? 'rgba(190,33,51,0.10)' : 'rgba(176,188,164,0.045)');
    fog.addColorStop(1, redNight ? 'rgba(190,33,51,0)' : 'rgba(176,188,164,0)');
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
