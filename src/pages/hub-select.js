// Select Nearest Hub
export function renderHubSelect() {
  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
      <div style="flex:1;padding:var(--space-6);display:flex;flex-direction:column;">
        <div style="margin-bottom:var(--space-6);">
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-2);">Select Your Hub</h1>
          <p style="font-size:var(--fs-body);color:var(--text-muted);">Choose the nearest hub for faster deliveries</p>
        </div>

        <!-- Map Placeholder -->
        <div style="background:var(--bg-secondary);border-radius:var(--radius-lg);height:160px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-bottom:var(--space-5);position:relative;overflow:hidden;">
          <div style="font-size:2rem;">📍</div>
          <div style="font-size:var(--fs-sm);color:var(--text-muted);margin-top:var(--space-2);">Finding hubs near you...</div>
          <div class="dots-loading" style="margin-top:var(--space-2);" id="map-loader"><span></span><span></span><span></span></div>
          <div id="map-found" style="display:none;font-size:var(--fs-sm);color:var(--success);font-weight:var(--fw-semibold);margin-top:var(--space-2);">✓ 4 hubs found nearby</div>
        </div>

        <!-- Hub Cards -->
        <div id="hub-list" style="opacity:0;transition:opacity 0.4s ease;">
          <div class="hub-card" data-hub="1">
            <div class="hub-card__dot"></div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Pune Central Hub</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">0.8 km away · Open now</div>
            </div>
            <span class="badge badge--success" style="font-size:10px;">Nearest</span>
          </div>

          <div class="hub-card" data-hub="2">
            <div class="hub-card__dot" style="background:var(--success);"></div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Kothrud Hub</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">2.3 km away · Open now</div>
            </div>
          </div>

          <div class="hub-card" data-hub="3">
            <div class="hub-card__dot" style="background:var(--success);"></div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Baner Fresh Hub</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">3.1 km away · Open now</div>
            </div>
          </div>

          <div class="hub-card" data-hub="4">
            <div class="hub-card__dot" style="background:var(--warning);"></div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Hadapsar Hub</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">5.7 km away · Closes at 8 PM</div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding:var(--space-4) var(--space-6) calc(var(--space-6) + var(--safe-bottom));">
        <button class="btn btn-primary btn-full btn-lg" id="hub-continue" disabled style="opacity:0.6;">Select Hub</button>
      </div>
    </div>
  `;
}

export function initHubSelect(onSelected) {
  const hubCards = document.querySelectorAll('.hub-card');
  const continueBtn = document.getElementById('hub-continue');
  const mapLoader = document.getElementById('map-loader');
  const mapFound = document.getElementById('map-found');
  const hubList = document.getElementById('hub-list');
  let selectedHub = null;

  // Simulate finding hubs
  setTimeout(() => {
    mapLoader.style.display = 'none';
    mapFound.style.display = 'block';
    hubList.style.opacity = '1';
    // Auto-select nearest hub
    hubCards[0]?.click();
  }, 2000);

  hubCards.forEach(card => {
    card.addEventListener('click', () => {
      hubCards.forEach(c => c.classList.remove('hub-card--selected'));
      card.classList.add('hub-card--selected');
      selectedHub = card.dataset.hub;
      continueBtn.disabled = false;
      continueBtn.style.opacity = '1';
    });
  });

  continueBtn.addEventListener('click', () => {
    if (!selectedHub) return;
    onSelected(selectedHub);
  });
}
