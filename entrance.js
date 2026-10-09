// The entrance is intentionally shown on every fresh page visit.
// No site soundtrack or other automatic sound should play until Begin is pressed.
(() => {
  const entrance = document.getElementById('entrance');
  const begin = document.getElementById('entrance-begin');
  if (!entrance || !begin) {
    window.ninjaEntranceUnlocked = true;
    return;
  }

  window.ninjaEntranceUnlocked = false;
  document.documentElement.classList.add('entrance-locked');

  // Block focus and interaction with the wiki underneath the entrance screen.
  const background = [
    ...document.querySelectorAll('.skip-link, .site-header, main, footer, .music-player')
  ];
  const previousInert = background.map(element => [element, element.inert]);
  for (const element of background) element.inert = true;

  let begun = false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let effectsOff = false;
  try { effectsOff = localStorage.getItem('dojo-effects') === 'off'; } catch {}
  const transitionMs = reducedMotion || effectsOff ? 140 : 1310;

  function revealWiki() {
    entrance.remove();
    document.documentElement.classList.remove('entrance-locked');
    for (const [element, wasInert] of previousInert) {
      if (element.isConnected) element.inert = wasInert;
    }
    document.dispatchEvent(new Event('ninja:entered'));

    // Deep-linked scrolls manage focus inside their own modal.
    if (!document.querySelector('#scroll-dialog[open]')) {
      document.querySelector('.hero-cta')?.focus({ preventScroll: true });
    }
  }

  begin.addEventListener('click', () => {
    if (begun) return;
    begun = true;
    begin.disabled = true;

    // Unlock music and invoke playback synchronously with the real click.
    // Browsers block autoplay if it happens before user interaction.
    window.ninjaEntranceUnlocked = true;
    document.dispatchEvent(new Event('ninja:begin'));

    entrance.classList.add('is-revealing');
    window.setTimeout(revealWiki, transitionMs);
  });

  begin.focus({ preventScroll: true });
})();
