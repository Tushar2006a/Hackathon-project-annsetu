// Splash Screen
export function renderSplash() {
  return `
    <div class="splash-screen" id="splash">
      <div class="splash-logo">
        <img src="/images/logo-icon.svg" alt="Annsetu" class="splash-logo__img" />
      </div>
      <div class="splash-title">Annsetu</div>
      <div class="splash-subtitle">From Farms to Families</div>
      <div class="splash-loader">
        <div class="splash-loader__bar"></div>
      </div>
    </div>
  `;
}

export function initSplash(onComplete) {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.classList.add('exit');
      setTimeout(() => onComplete(), 600);
    }
  }, 2800);
}
