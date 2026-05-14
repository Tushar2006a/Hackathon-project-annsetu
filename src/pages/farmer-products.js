// Farmer Products Management — with live camera upload
import { renderFarmerHeader, renderBottomNav } from '../components/navbar.js';
import { api } from '../data/api.js';

export function renderFarmerProducts() {
  return `
    ${renderFarmerHeader('My Products', true)}

    <main class="page-content" style="padding-bottom:80px;">
      <!-- Header row -->
      <div class="px" style="padding-top:var(--space-4);padding-bottom:var(--space-3);display:flex;justify-content:space-between;align-items:center;">
        <div>
          <h2 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">My Listings</h2>
          <p style="font-size:var(--fs-xs);color:var(--text-muted);" id="listing-count">Loading...</p>
        </div>
        <button class="btn btn-primary btn-sm" id="add-product-btn" style="gap:4px;">
          📸 Add Produce
        </button>
      </div>

      <!-- Product List -->
      <div id="farmer-product-list" style="padding-bottom:var(--space-4);">
        <div style="text-align:center;padding:var(--space-8);color:var(--text-muted);">
          <div style="font-size:2rem;margin-bottom:var(--space-2);">🌱</div>
          <p style="font-size:var(--fs-sm);">Loading your listings...</p>
        </div>
      </div>
    </main>

    ${renderBottomNav('my-products', 'farmer')}

    <!-- Add Product Sheet -->
    <div id="add-product-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200;overscroll-behavior:contain;">
      <div style="position:absolute;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:var(--bg-card);border-radius:20px 20px 0 0;display:flex;flex-direction:column;max-height:92dvh;">
        
        <!-- Sheet handle + title (fixed) -->
        <div style="padding:var(--space-3) var(--space-5) var(--space-2);flex-shrink:0;">
          <div style="width:40px;height:4px;background:var(--border-light);border-radius:2px;margin:0 auto var(--space-3);"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">List New Produce</h3>
            <button id="close-modal-btn" style="background:var(--bg-secondary);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>
          </div>
        </div>

        <!-- Scrollable form body -->
        <div style="overflow-y:auto;-webkit-overflow-scrolling:touch;padding:0 var(--space-5) var(--space-6);flex:1;">
          <form onsubmit="event.preventDefault();" id="add-product-form">

            <!-- 📸 Photo Capture -->
            <div style="margin-bottom:var(--space-4);">
              <label style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);color:var(--text-secondary);display:block;margin-bottom:var(--space-2);">Product Photo</label>
              <div id="photo-preview" style="width:100%;height:160px;border-radius:var(--radius-lg);border:2px dashed var(--border-light);background:var(--bg-secondary);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:var(--space-2);cursor:pointer;overflow:hidden;position:relative;">
                <div id="photo-placeholder" style="text-align:center;">
                  <div style="font-size:2rem;">📷</div>
                  <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:4px;">Tap to take/choose photo</div>
                </div>
                <img id="photo-img" src="" alt="Preview" style="display:none;width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />
              </div>
              <input type="file" id="photo-input" accept="image/*" capture="environment" style="display:none;" />
              <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);">
                <button type="button" class="btn btn-secondary btn-sm" id="camera-btn" style="flex:1;">📷 Camera</button>
                <button type="button" class="btn btn-secondary btn-sm" id="gallery-btn" style="flex:1;">🖼️ Gallery</button>
                <button type="button" class="btn btn-ghost btn-sm" id="remove-photo-btn" style="flex:1;display:none;color:var(--error);">✕ Remove</button>
              </div>
            </div>

            <div class="input-group">
              <label>Product Name *</label>
              <input type="text" class="input" placeholder="e.g. Organic Tomatoes" id="new-product-name" />
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
              <div class="input-group">
                <label>Price (₹) *</label>
                <input type="number" class="input" placeholder="45" id="new-product-price" inputmode="numeric" />
              </div>
              <div class="input-group">
                <label>Unit</label>
                <select class="input" id="new-product-unit">
                  <option value="kg">kg</option>
                  <option value="bunch">bunch</option>
                  <option value="dozen">dozen</option>
                  <option value="piece">piece</option>
                  <option value="litre">litre</option>
                  <option value="g">gram</option>
                </select>
              </div>
            </div>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
              <div class="input-group">
                <label>Category</label>
                <select class="input" id="new-product-category">
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Leafy Greens">Leafy Greens</option>
                  <option value="Grains">Grains</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>
              <div class="input-group">
                <label>Stock (qty)</label>
                <input type="number" class="input" placeholder="50" id="new-product-stock" inputmode="numeric" />
              </div>
            </div>

            <div class="input-group">
              <label>Description</label>
              <textarea class="input" rows="2" placeholder="Tell customers about your produce..." id="new-product-desc" style="resize:none;"></textarea>
            </div>

            <div class="input-group">
              <label>📍 Delivery Hub <span style="color:var(--text-muted);font-size:var(--fs-xs);"> — where you'll drop off</span></label>
              <select class="input" id="new-product-hub">
                <option value="">Loading hubs...</option>
              </select>
            </div>

            <!-- Hub Profile Preview -->
            <div id="hub-profile-preview" style="display:none;margin-bottom:var(--space-4);border-radius:var(--radius-lg);border:1px solid var(--border-light);overflow:hidden;background:var(--bg-card);">
              <div id="hub-preview-banner" style="height:56px;background:linear-gradient(135deg,var(--green-600),var(--green-800));position:relative;">
                <div id="hub-preview-avatar" style="position:absolute;bottom:-16px;left:12px;width:40px;height:40px;border-radius:var(--radius-md);border:2px solid var(--bg-card);background:var(--bg-secondary);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:var(--fw-bold);color:var(--text-secondary);">HB</div>
              </div>
              <div style="padding:24px 12px 12px;">
                <div style="font-weight:var(--fw-bold);font-size:var(--fs-body);" id="hub-preview-name">—</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:2px;" id="hub-preview-address">—</div>
                <div style="font-size:10px;color:var(--text-muted);margin-top:1px;" id="hub-preview-hours"></div>
                <div id="hub-preview-desc" style="font-size:10px;color:var(--text-secondary);margin-top:var(--space-1);line-height:1.4;display:none;"></div>
                <div id="hub-preview-specialties" style="display:flex;flex-wrap:wrap;gap:3px;margin-top:var(--space-1);"></div>
                <div style="display:flex;gap:var(--space-2);margin-top:var(--space-1);">
                  <span id="hub-preview-phone" style="font-size:9px;color:var(--green-600);display:none;"></span>
                  <span id="hub-preview-email" style="font-size:9px;color:var(--green-600);display:none;"></span>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-lg btn-ripple" id="submit-product-btn" style="margin-top:var(--space-4);">
              <span id="submit-text">🌿 List Produce</span>
              <div class="dots-loading" id="submit-loader" style="display:none;"><span></span><span></span><span></span></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initFarmerProducts() {
  const modal      = document.getElementById('add-product-modal');
  const addBtn     = document.getElementById('add-product-btn');
  const closeBtn   = document.getElementById('close-modal-btn');
  const photoInput = document.getElementById('photo-input');
  const photoPreview = document.getElementById('photo-preview');
  const photoImg   = document.getElementById('photo-img');
  const photoPlaceholder = document.getElementById('photo-placeholder');
  const cameraBtn  = document.getElementById('camera-btn');
  const galleryBtn = document.getElementById('gallery-btn');
  const removePhotoBtn = document.getElementById('remove-photo-btn');

  const user    = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  const userId  = localStorage.getItem('annsetu_userId') || '';
  const farmerName = user.name || 'Farmer';

  let capturedImageData = null; // base64 data URL

  // ── Load existing listings ──
  loadListings();

  async function loadListings() {
    if (!userId) { renderEmpty(); return; }
    const res = await api.getMyListings(userId);
    const listings = res?.listings || [];
    document.getElementById('listing-count').textContent =
      `${listings.length} produce listed`;
    const container = document.getElementById('farmer-product-list');
    if (!listings.length) { renderEmpty(container); return; }
    container.innerHTML = listings.map(renderListingCard).join('');
    // Attach delete handlers
    container.querySelectorAll('.delete-listing-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Remove this listing?')) return;
        await api.deleteListing(btn.dataset.id);
        loadListings();
      });
    });
  }

  function renderEmpty(container) {
    const el = container || document.getElementById('farmer-product-list');
    el.innerHTML = `
      <div style="text-align:center;padding:var(--space-8) var(--space-4);color:var(--text-muted);">
        <div style="font-size:3rem;margin-bottom:var(--space-3);">🌾</div>
        <p style="font-weight:var(--fw-semibold);margin-bottom:4px;">No listings yet</p>
        <p style="font-size:var(--fs-xs);">Tap "Add Produce" to list your first product</p>
      </div>`;
  }

  function renderListingCard(p) {
    const timeAgo = getTimeAgo(p.listedAt);
    const imgHtml = p.imageData
      ? `<img src="${p.imageData}" alt="${p.name}" style="width:56px;height:56px;border-radius:var(--radius-md);object-fit:cover;flex-shrink:0;" />`
      : `<div style="width:56px;height:56px;border-radius:var(--radius-md);background:var(--bg-secondary);display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;">🌿</div>`;
    return `
      <div style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3) var(--space-4);border-bottom:1px solid var(--border-light);">
        ${imgHtml}
        <div style="flex:1;min-width:0;">
          <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);">${p.name}</div>
          <div style="font-size:var(--fs-xs);color:var(--text-muted);">${p.category} · ₹${p.price}/${p.unit} · Stock: ${p.stock}</div>
          ${p.hubName ? `<div style="font-size:10px;color:var(--green-600);margin-top:1px;">📍 ${p.hubName}</div>` : ''}
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">✅ Listed ${timeAgo}</div>
        </div>
        <button class="delete-listing-btn" data-id="${p.id}" style="background:none;border:none;color:var(--error);font-size:1.1rem;cursor:pointer;padding:var(--space-1);">🗑</button>
      </div>`;
  }

  function getTimeAgo(iso) {
    if (!iso) return 'just now';
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  // ── Modal open/close ──
  addBtn?.addEventListener('click', async () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    await loadHubsIntoDropdown();
  });

  let hubsCache = [];

  async function loadHubsIntoDropdown() {
    const hubSelect = document.getElementById('new-product-hub');
    if (!hubSelect) return;
    const res = await api.getHubs().catch(() => null);
    hubsCache = res?.hubs || res || [];
    if (!hubsCache.length) {
      hubSelect.innerHTML = '<option value="">No hubs available</option>';
      return;
    }
    hubSelect.innerHTML = hubsCache.map(h =>
      `<option value="${h.id}" data-name="${h.name}">${h.name}${h.city ? ' · ' + h.city : ''}</option>`
    ).join('');
    // Attach change listener
    hubSelect.removeEventListener('change', onHubChange);
    hubSelect.addEventListener('change', onHubChange);
    // Show first hub profile
    onHubChange();
  }

  async function onHubChange() {
    const hubSelect = document.getElementById('new-product-hub');
    const hubId = hubSelect?.value;
    const preview = document.getElementById('hub-profile-preview');
    if (!hubId || !preview) { if (preview) preview.style.display = 'none'; return; }

    // Try cached localStorage first, then API
    let hub = null;
    const cached = localStorage.getItem('annsetu_hub_profile_' + hubId);
    if (cached) { try { hub = JSON.parse(cached); } catch {} }
    if (!hub) {
      const local = hubsCache.find(h => h.id === hubId);
      if (local) hub = local;
    }
    if (!hub) {
      const res = await api.getHub(hubId).catch(() => null);
      hub = res?.hub;
    }
    if (!hub) { preview.style.display = 'none'; return; }

    // Populate preview card
    preview.style.display = 'block';
    const nameEl = document.getElementById('hub-preview-name');
    const addrEl = document.getElementById('hub-preview-address');
    const hoursEl = document.getElementById('hub-preview-hours');
    const descEl = document.getElementById('hub-preview-desc');
    const specEl = document.getElementById('hub-preview-specialties');
    const phoneEl = document.getElementById('hub-preview-phone');
    const emailEl = document.getElementById('hub-preview-email');
    const avatarEl = document.getElementById('hub-preview-avatar');

    if (nameEl) nameEl.textContent = hub.name || 'Hub';
    if (addrEl) {
      const parts = [hub.location, hub.city, hub.pincode].filter(Boolean);
      addrEl.textContent = parts.length ? '📍 ' + parts.join(', ') : '';
    }
    if (hoursEl) {
      const h = hub.hours;
      hoursEl.textContent = h ? '🕐 ' + (h.open || '06:00') + ' – ' + (h.close || '21:00') : '';
    }
    if (descEl) {
      if (hub.description) { descEl.textContent = hub.description; descEl.style.display = 'block'; }
      else descEl.style.display = 'none';
    }
    if (specEl) {
      specEl.innerHTML = (hub.specialties || []).map(s =>
        `<span style="background:var(--green-50);color:var(--green-700);font-size:9px;padding:1px 6px;border-radius:var(--radius-sm);">${s}</span>`
      ).join('');
    }
    if (phoneEl) {
      if (hub.phone) { phoneEl.textContent = '📞 ' + hub.phone; phoneEl.style.display = 'inline'; }
      else phoneEl.style.display = 'none';
    }
    if (emailEl) {
      if (hub.email) { emailEl.textContent = '✉️ ' + hub.email; emailEl.style.display = 'inline'; }
      else emailEl.style.display = 'none';
    }
    if (avatarEl) {
      if (hub.imageData) {
        avatarEl.innerHTML = `<img src="${hub.imageData}" style="width:100%;height:100%;object-fit:cover;" />`;
      } else {
        const ini = (hub.name || 'HB').trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
        avatarEl.textContent = ini;
      }
    }
  }

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  modal?.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // ── Photo capture ──
  function openCamera(useCapture) {
    photoInput.removeAttribute('capture');
    if (useCapture) photoInput.setAttribute('capture', 'environment');
    photoInput.click();
  }

  cameraBtn?.addEventListener('click', () => openCamera(true));
  galleryBtn?.addEventListener('click', () => openCamera(false));
  photoPreview?.addEventListener('click', () => {
    if (!capturedImageData) openCamera(true);
  });

  photoInput?.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      capturedImageData = e.target.result;
      photoImg.src = capturedImageData;
      photoImg.style.display = 'block';
      photoPlaceholder.style.display = 'none';
      removePhotoBtn.style.display = '';
    };
    reader.readAsDataURL(file);
  });

  removePhotoBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    capturedImageData = null;
    photoImg.style.display = 'none';
    photoPlaceholder.style.display = '';
    removePhotoBtn.style.display = 'none';
    photoInput.value = '';
  });

  // ── Form submit ──
  document.getElementById('add-product-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name  = document.getElementById('new-product-name')?.value.trim();
    const price = document.getElementById('new-product-price')?.value;
    if (!name || !price) {
      alert('Please fill in Product Name and Price.');
      return;
    }

    const submitBtn  = document.getElementById('submit-product-btn');
    const submitText = document.getElementById('submit-text');
    const submitLoader = document.getElementById('submit-loader');
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoader.style.display = 'flex';

    const hubSelect = document.getElementById('new-product-hub');
    const selectedOption = hubSelect.options[hubSelect.selectedIndex];

    const payload = {
      userId,
      farmerName,
      name,
      price,
      unit:        document.getElementById('new-product-unit')?.value,
      category:    document.getElementById('new-product-category')?.value,
      stock:       document.getElementById('new-product-stock')?.value || 0,
      description: document.getElementById('new-product-desc')?.value || '',
      imageData:   capturedImageData || null,
      hubId:       hubSelect.value,
      hubName:     selectedOption?.dataset.name || ''
    };

    const res = await api.addFarmerProduct(payload);

    submitBtn.disabled = false;
    submitText.style.display = '';
    submitLoader.style.display = 'none';

    if (res?.success) {
      closeModal();
      // Reset form
      document.getElementById('add-product-form').reset();
      capturedImageData = null;
      photoImg.style.display = 'none';
      photoPlaceholder.style.display = '';
      removePhotoBtn.style.display = 'none';
      // Reload listings
      loadListings();
      // Toast
      showToast(`✅ ${name} listed successfully!`);
    } else {
      alert('Failed to list produce. Please try again.');
    }
  });
}

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
