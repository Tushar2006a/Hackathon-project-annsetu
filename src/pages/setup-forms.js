// Farmer Setup / Hub Creation Pages
export function renderFarmerSetup() {
  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
      <div style="flex:1;padding:var(--space-6);display:flex;flex-direction:column;">
        <div style="margin-bottom:var(--space-6);">
          <div style="width:140px;height:48px;margin-bottom:var(--space-4);border-radius:var(--radius-md);overflow:hidden;background:#1a2332;display:flex;align-items:center;justify-content:center;padding:8px 12px;">
            <img src="/images/logo-full.svg" alt="AnnSetu" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-2);">Set Up Your Farm</h1>
          <p style="font-size:var(--fs-body);color:var(--text-muted);">Tell us about your farm to get started</p>
        </div>

        <form onsubmit="event.preventDefault();" id="farmer-form">
          <div class="input-group">
            <label>Farm Name</label>
            <input type="text" class="input" placeholder="Patel Organic Farm" id="farm-name" />
          </div>
          <div class="input-group">
            <label>Your Name</label>
            <input type="text" class="input" placeholder="Ramesh Patel" id="farmer-name" />
          </div>
          <div class="input-group">
            <label>Address</label>
            <div style="position:relative;">
              <input type="text" class="input" placeholder="Village, District, State" style="padding-right:40px;" id="farm-address" />
              <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:1.2rem;">📍</span>
            </div>
          </div>
          <div class="input-group">
            <label>What do you grow?</label>
            <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);margin-top:var(--space-1);" id="crop-tags">
              <button type="button" class="filter-chip" data-crop="Vegetables">🥬 Vegetables</button>
              <button type="button" class="filter-chip" data-crop="Fruits">🍎 Fruits</button>
              <button type="button" class="filter-chip" data-crop="Grains">🌾 Grains</button>
              <button type="button" class="filter-chip" data-crop="Dairy">🥛 Dairy</button>
              <button type="button" class="filter-chip" data-crop="Spices">🌶️ Spices</button>
            </div>
          </div>
          <div class="input-group">
            <label>Farm Size (acres)</label>
            <input type="number" class="input" placeholder="5" id="farm-size" />
          </div>
        </form>
      </div>

      <div style="padding:var(--space-4) var(--space-6) calc(var(--space-6) + var(--safe-bottom));">
        <button class="btn btn-primary btn-full btn-lg" id="farmer-continue">Create Farm Profile</button>
      </div>
    </div>
  `;
}

export function renderHubCreate() {
  return `
    <div class="page-content" style="padding-top:0;display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;">
      <div style="flex:1;padding:var(--space-6);display:flex;flex-direction:column;">
        <div style="margin-bottom:var(--space-6);">
          <div style="width:140px;height:48px;margin-bottom:var(--space-4);border-radius:var(--radius-md);overflow:hidden;background:#1a2332;display:flex;align-items:center;justify-content:center;padding:8px 12px;">
            <img src="/images/logo-full.svg" alt="AnnSetu" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-bold);margin-bottom:var(--space-2);">Create Your Hub</h1>
          <p style="font-size:var(--fs-body);color:var(--text-muted);">Set up your distribution point</p>
        </div>

        <form onsubmit="event.preventDefault();">
          <div class="input-group">
            <label>Hub Name</label>
            <input type="text" class="input" placeholder="Pune Central Hub" id="hub-name" />
          </div>
          <div class="input-group">
            <label>Owner Name</label>
            <input type="text" class="input" placeholder="Your name" id="hub-owner-name" />
          </div>
          <div class="input-group">
            <label>Hub Address</label>
            <input type="text" class="input" placeholder="Full address" id="hub-address" />
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
            <div class="input-group">
              <label>City</label>
              <input type="text" class="input" placeholder="Pune" id="hub-city" />
            </div>
            <div class="input-group">
              <label>Pincode</label>
              <input type="text" class="input" placeholder="411001" id="hub-pincode" />
            </div>
          </div>
          <div class="input-group">
            <label>Delivery Radius (km)</label>
            <input type="number" class="input" placeholder="5" id="hub-radius" />
          </div>
          <div class="input-group">
            <label>Operating Hours</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
              <input type="time" class="input" value="06:00" id="hub-open" />
              <input type="time" class="input" value="21:00" id="hub-close" />
            </div>
          </div>
        </form>
      </div>

      <div style="padding:var(--space-4) var(--space-6) calc(var(--space-6) + var(--safe-bottom));">
        <button class="btn btn-primary btn-full btn-lg" id="hub-create-continue">Create Hub</button>
      </div>
    </div>
  `;
}

export function initFarmerSetup(onComplete) {
  // Crop tags toggle
  const cropTags = document.getElementById('crop-tags');
  cropTags?.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (chip) chip.classList.toggle('filter-chip--active');
  });

  document.getElementById('farmer-continue')?.addEventListener('click', () => {
    const name     = document.getElementById('farmer-name')?.value.trim()  || '';
    const farmName = document.getElementById('farm-name')?.value.trim()    || '';
    const location = document.getElementById('farm-address')?.value.trim() || '';
    const farmSize = document.getElementById('farm-size')?.value           || 0;
    const crops    = [...document.querySelectorAll('.filter-chip--active')]
                       .map(c => c.dataset.crop);
    onComplete('farmer', name, { farmName, location, crops, farmSize: Number(farmSize) });
  });
}

export function initHubCreate(onComplete) {
  document.getElementById('hub-create-continue')?.addEventListener('click', () => {
    const name    = document.getElementById('hub-owner-name')?.value.trim() || '';
    const hubData = {
      name:     document.getElementById('hub-name')?.value.trim()    || 'My Hub',
      location: document.getElementById('hub-address')?.value.trim() || '',
      city:     document.getElementById('hub-city')?.value.trim()    || '',
      pincode:  document.getElementById('hub-pincode')?.value.trim() || '',
      radius:   Number(document.getElementById('hub-radius')?.value)  || 5,
      hours: {
        open:  document.getElementById('hub-open')?.value  || '06:00',
        close: document.getElementById('hub-close')?.value || '21:00',
      },
    };
    onComplete('hub', name, hubData);
  });
}
