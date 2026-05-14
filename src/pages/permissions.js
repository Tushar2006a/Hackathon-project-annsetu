// Permissions Request Screen
export function renderPermissions() {
  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
      <div style="flex:1;padding:var(--space-6);display:flex;flex-direction:column;justify-content:center;">
        <div style="text-align:center;margin-bottom:var(--space-8);">
          <div style="font-size:2.5rem;margin-bottom:var(--space-3);">🔐</div>
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-2);">Allow Access</h1>
          <p style="font-size:var(--fs-body);color:var(--text-muted);max-width:260px;margin:0 auto;">We need a few permissions for the best experience</p>
        </div>

        <div style="padding:0 var(--space-2);">
          <div class="permission-card" id="perm-location">
            <div class="permission-card__icon" style="background:var(--cta-amber-light);">📍</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Location</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Find nearby hubs & delivery</div>
            </div>
            <div class="permission-card__toggle" data-perm="location"></div>
          </div>

          <div class="permission-card" id="perm-camera">
            <div class="permission-card__icon" style="background:var(--accent-olive-light);">📷</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Camera</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Scan QR codes & take photos</div>
            </div>
            <div class="permission-card__toggle" data-perm="camera"></div>
          </div>

          <div class="permission-card" id="perm-storage">
            <div class="permission-card__icon" style="background:var(--accent-clay-light);">📂</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Storage</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Save invoices & receipts</div>
            </div>
            <div class="permission-card__toggle" data-perm="storage"></div>
          </div>

          <div class="permission-card" id="perm-notifications">
            <div class="permission-card__icon" style="background:var(--success-light);">🔔</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">Notifications</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">Order updates & offers</div>
            </div>
            <div class="permission-card__toggle" data-perm="notifications"></div>
          </div>
        </div>
      </div>

      <div style="padding:var(--space-4) var(--space-6) calc(var(--space-6) + var(--safe-bottom));">
        <button class="btn btn-primary btn-full btn-lg" id="perm-continue">Allow & Continue</button>
        <button class="btn btn-ghost btn-full" id="perm-skip" style="margin-top:var(--space-2);font-size:var(--fs-sm);color:var(--text-muted);">Maybe Later</button>
      </div>
    </div>
  `;
}

export function initPermissions(onComplete) {
  const toggles = document.querySelectorAll('.permission-card__toggle');

  // Toggle handler — request real browser permission when toggled on
  toggles.forEach(toggle => {
    toggle.addEventListener('click', async () => {
      const perm = toggle.dataset.perm;
      const isOn = toggle.classList.contains('on');

      if (isOn) {
        // Just turn off visually
        toggle.classList.remove('on');
        return;
      }

      // Request real browser permission
      let granted = false;
      try {
        if (perm === 'location' && navigator.geolocation) {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              () => { granted = true; resolve(); },
              () => { granted = true; resolve(); }, // Accept denial too — just show we asked
              { timeout: 5000 }
            );
          });
        } else if (perm === 'camera') {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true }).catch(() => null);
          if (stream) {
            stream.getTracks().forEach(t => t.stop());
            granted = true;
          } else {
            granted = true; // Still mark as toggled even if denied
          }
        } else if (perm === 'notifications' && 'Notification' in window) {
          await Notification.requestPermission();
          granted = true;
        } else {
          granted = true; // Storage doesn't need a prompt
        }
      } catch {
        granted = true; // Toggle on anyway
      }

      toggle.classList.add('on');
    });
  });

  // Auto-enable location with a slight delay
  setTimeout(() => {
    const locationToggle = document.querySelector('[data-perm="location"]');
    if (locationToggle && !locationToggle.classList.contains('on')) {
      locationToggle.click();
    }
  }, 800);

  document.getElementById('perm-continue')?.addEventListener('click', () => {
    const granted = {};
    toggles.forEach(t => { granted[t.dataset.perm] = t.classList.contains('on'); });
    onComplete(granted);
  });

  document.getElementById('perm-skip')?.addEventListener('click', () => {
    onComplete({});
  });
}
