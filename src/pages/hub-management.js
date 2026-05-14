// Mobile Hub Management — with Profile Editor
import { renderAppHeader, renderBottomNav } from '../components/navbar.js';
import { api } from '../data/api.js';

function getInitials(name) {
  if (!name) return 'HB';
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function renderHubManagement() {
  const saved = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  const name = saved.name || 'Hub Owner';
  const initials = getInitials(name);

  return `
    ${renderAppHeader('Hub Dashboard', true)}
    <main class="page-content">

      <!-- Hub Profile Card -->
      <div class="px" style="padding-top:var(--space-4);padding-bottom:var(--space-3);">
        <div id="hub-profile-card" style="background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-light);overflow:hidden;">
          <div id="hub-profile-banner" style="height:80px;background:linear-gradient(135deg,var(--green-600),var(--green-800));position:relative;">
            <div id="hub-profile-img-wrap" style="position:absolute;bottom:-24px;left:16px;width:56px;height:56px;border-radius:var(--radius-md);border:3px solid var(--bg-card);background:var(--bg-secondary);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.2rem;font-weight:var(--fw-bold);color:var(--text-secondary);">
              <span id="hub-profile-avatar">${initials}</span>
            </div>
            <button id="edit-hub-profile-btn" style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.35);border:none;color:#fff;font-size:var(--fs-xs);padding:4px 10px;border-radius:var(--radius-sm);cursor:pointer;backdrop-filter:blur(4px);">✏️ Edit Profile</button>
          </div>
          <div style="padding:32px 16px 16px;">
            <div style="font-weight:var(--fw-bold);font-size:var(--fs-md);" id="hub-profile-name">Loading...</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;" id="hub-profile-address">—</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;" id="hub-profile-hours">—</div>
            <div id="hub-profile-desc" style="font-size:var(--fs-xs);color:var(--text-secondary);margin-top:var(--space-2);line-height:1.4;display:none;"></div>
            <div id="hub-profile-specialties" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:var(--space-2);"></div>
            <div style="display:flex;gap:var(--space-2);margin-top:var(--space-2);">
              <span id="hub-profile-phone" style="font-size:10px;color:var(--green-600);display:none;"></span>
              <span id="hub-profile-email" style="font-size:10px;color:var(--green-600);display:none;"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid" style="grid-template-columns:1fr 1fr 1fr;">
        <div class="stat-widget" style="text-align:center;">
          <div class="stat-widget__value" style="font-size:var(--fs-xl);">12</div>
          <div class="stat-widget__label">Deliveries</div>
        </div>
        <div class="stat-widget" style="text-align:center;">
          <div class="stat-widget__value" style="font-size:var(--fs-xl);">348</div>
          <div class="stat-widget__label">In Stock</div>
        </div>
        <div class="stat-widget" style="text-align:center;">
          <div class="stat-widget__value" style="font-size:var(--fs-xl);">₹18.4K</div>
          <div class="stat-widget__label">Revenue</div>
        </div>
      </div>

      <hr class="divider" style="margin-top:var(--space-5);" />

      <!-- Order Requests -->
      <div class="section-header">
        <span class="section-header__title">Order Requests</span>
        <span class="section-header__link" id="hub-order-count">Loading...</span>
      </div>
      <div class="px" style="display:flex;gap:var(--space-2);margin-bottom:var(--space-4);overflow-x:auto;scrollbar-width:none;">
        <button class="filter-chip filter-chip--active" data-status="all">All</button>
        <button class="filter-chip" data-status="placed">New</button>
        <button class="filter-chip" data-status="accepted">Accepted</button>
        <button class="filter-chip" data-status="out_for_delivery">In Transit</button>
        <button class="filter-chip" data-status="delivered">Delivered</button>
      </div>
      <div id="hub-orders-list" class="px">
        <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">Loading orders...</div>
      </div>

      <hr class="divider" style="margin-top:var(--space-4);" />

      <!-- Inventory -->
      <div class="section-header">
        <span class="section-header__title">Inventory</span>
        <span class="section-header__link">Manage</span>
      </div>
      <div class="list-item">
        <div class="list-item__icon" style="background:var(--bg-secondary);">🍅</div>
        <div class="list-item__content">
          <div class="list-item__title">Tomatoes</div>
          <div class="list-item__subtitle">42 kg available</div>
        </div>
        <span class="badge badge--success">Good</span>
      </div>
      <div class="list-item">
        <div class="list-item__icon" style="background:var(--bg-secondary);">🥬</div>
        <div class="list-item__content">
          <div class="list-item__title">Spinach</div>
          <div class="list-item__subtitle">8 bunches left</div>
        </div>
        <span class="badge badge--warning">Low</span>
      </div>
      <div class="list-item">
        <div class="list-item__icon" style="background:var(--bg-secondary);">🥕</div>
        <div class="list-item__content">
          <div class="list-item__title">Carrots</div>
          <div class="list-item__subtitle">25 kg available</div>
        </div>
        <span class="badge badge--success">Good</span>
      </div>

      <div style="height:var(--space-4);"></div>
    </main>

    ${renderBottomNav('hub-dash', 'hub')}

    <!-- Edit Profile Modal -->
    <div id="hub-edit-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:200;">
      <div style="position:absolute;bottom:0;left:0;right:0;max-width:480px;margin:0 auto;background:var(--bg-card);border-radius:20px 20px 0 0;display:flex;flex-direction:column;max-height:92dvh;">
        <div style="padding:var(--space-3) var(--space-5) var(--space-2);flex-shrink:0;">
          <div style="width:40px;height:4px;background:var(--border-light);border-radius:2px;margin:0 auto var(--space-3);"></div>
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">Edit Hub Profile</h3>
            <button id="close-hub-edit" style="background:var(--bg-secondary);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center;">✕</button>
          </div>
        </div>
        <div style="overflow-y:auto;padding:0 var(--space-5) var(--space-6);flex:1;">
          <form id="hub-edit-form" onsubmit="event.preventDefault();">
            <div style="margin-bottom:var(--space-4);">
              <label style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);display:block;margin-bottom:var(--space-2);">Hub Photo</label>
              <div id="hub-photo-area" style="width:100%;height:120px;border-radius:var(--radius-lg);border:2px dashed var(--border-light);background:var(--bg-secondary);display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;position:relative;">
                <div id="hub-photo-placeholder" style="text-align:center;">
                  <div style="font-size:2rem;">🏪</div>
                  <div style="font-size:var(--fs-xs);color:var(--text-muted);">Tap to add hub photo</div>
                </div>
                <img id="hub-photo-img" src="" style="display:none;width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" />
              </div>
              <input type="file" id="hub-photo-input" accept="image/*" style="display:none;" />
            </div>
            <div class="input-group">
              <label>Hub Name *</label>
              <input type="text" class="input" id="edit-hub-name" placeholder="My Fresh Hub" />
            </div>
            <div class="input-group">
              <label>Description</label>
              <textarea class="input" id="edit-hub-desc" rows="2" placeholder="Tell farmers & customers about your hub..." style="resize:none;"></textarea>
            </div>
            <div class="input-group">
              <label>Address</label>
              <input type="text" class="input" id="edit-hub-address" placeholder="Full address" />
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
              <div class="input-group">
                <label>City</label>
                <input type="text" class="input" id="edit-hub-city" placeholder="Pune" />
              </div>
              <div class="input-group">
                <label>Pincode</label>
                <input type="text" class="input" id="edit-hub-pincode" placeholder="411001" />
              </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
              <div class="input-group">
                <label>Phone</label>
                <input type="tel" class="input" id="edit-hub-phone" placeholder="+91..." />
              </div>
              <div class="input-group">
                <label>Email</label>
                <input type="email" class="input" id="edit-hub-email" placeholder="hub@email.com" />
              </div>
            </div>
            <div class="input-group">
              <label>Operating Hours</label>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);">
                <input type="time" class="input" id="edit-hub-open" value="06:00" />
                <input type="time" class="input" id="edit-hub-close" value="21:00" />
              </div>
            </div>
            <div class="input-group">
              <label>Specialties</label>
              <div style="display:flex;flex-wrap:wrap;gap:var(--space-2);" id="edit-hub-specialties">
                <button type="button" class="filter-chip" data-spec="Vegetables">🥬 Vegetables</button>
                <button type="button" class="filter-chip" data-spec="Fruits">🍎 Fruits</button>
                <button type="button" class="filter-chip" data-spec="Dairy">🥛 Dairy</button>
                <button type="button" class="filter-chip" data-spec="Grains">🌾 Grains</button>
                <button type="button" class="filter-chip" data-spec="Organic">🌿 Organic</button>
              </div>
            </div>
            <div class="input-group">
              <label>Delivery Radius (km)</label>
              <input type="number" class="input" id="edit-hub-radius" placeholder="5" />
            </div>
            <button type="submit" class="btn btn-primary btn-full btn-lg" id="save-hub-btn" style="margin-top:var(--space-4);">
              <span id="save-hub-text">💾 Save Profile</span>
              <div class="dots-loading" id="save-hub-loader" style="display:none;"><span></span><span></span><span></span></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
}

export function initHubManagement() {
  const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  let hubId = user.hub || '';
  const container = document.getElementById('hub-orders-list');
  const countEl = document.getElementById('hub-order-count');

  // ── Load Hub Profile ──
  loadHubProfile();

  async function loadHubProfile() {
    if (!hubId) {
      // Auto-create a hub for this hub user
      const nameEl = document.getElementById('hub-profile-name');
      const addrEl = document.getElementById('hub-profile-address');
      if (nameEl) nameEl.textContent = 'Creating your hub...';
      if (addrEl) addrEl.textContent = 'Please wait';

      const res = await api.createHub({
        userId: user.id,
        name: user.name ? `${user.name}'s Hub` : 'My Hub',
        location: '',
        city: '',
        pincode: '',
        radius: 5,
        hours: { open: '06:00', close: '21:00' },
      }).catch(() => null);

      if (res?.hub) {
        hubId = res.hub.id;
        user.hub = hubId;
        localStorage.setItem('annsetu_user', JSON.stringify(user));
        // Also update the user on server
        await api.updateUser(user.id, { hub: hubId }).catch(() => null);
        displayHubProfile(res.hub);
      } else {
        if (nameEl) nameEl.textContent = 'No Hub Linked';
        if (addrEl) addrEl.textContent = 'Please try again later';
      }
      return;
    }
    const res = await api.getHub(hubId).catch(() => null);
    const hub = res?.hub;
    if (!hub) {
      document.getElementById('hub-profile-name').textContent = user.name ? `${user.name}'s Hub` : 'My Hub';
      return;
    }
    // Also cache in localStorage for farmer-products to read
    localStorage.setItem('annsetu_hub_profile_' + hubId, JSON.stringify(hub));
    displayHubProfile(hub);
  }

  function displayHubProfile(hub) {
    const nameEl = document.getElementById('hub-profile-name');
    const addrEl = document.getElementById('hub-profile-address');
    const hoursEl = document.getElementById('hub-profile-hours');
    const descEl = document.getElementById('hub-profile-desc');
    const specEl = document.getElementById('hub-profile-specialties');
    const phoneEl = document.getElementById('hub-profile-phone');
    const emailEl = document.getElementById('hub-profile-email');
    const avatarEl = document.getElementById('hub-profile-avatar');
    const imgWrap = document.getElementById('hub-profile-img-wrap');

    if (nameEl) nameEl.textContent = hub.name || 'My Hub';
    if (addrEl) {
      const parts = [hub.location, hub.city, hub.pincode].filter(Boolean);
      addrEl.textContent = parts.length ? `📍 ${parts.join(', ')}` : '📍 Address not set';
    }
    if (hoursEl) {
      const h = hub.hours;
      hoursEl.textContent = h ? `🕐 ${h.open || '06:00'} – ${h.close || '21:00'}` : '';
    }
    if (descEl && hub.description) { descEl.textContent = hub.description; descEl.style.display = 'block'; }
    if (specEl && hub.specialties?.length) {
      specEl.innerHTML = hub.specialties.map(s => `<span style="background:var(--green-50);color:var(--green-700);font-size:10px;padding:2px 8px;border-radius:var(--radius-sm);">${s}</span>`).join('');
    }
    if (phoneEl && hub.phone) { phoneEl.textContent = `📞 ${hub.phone}`; phoneEl.style.display = 'inline'; }
    if (emailEl && hub.email) { emailEl.textContent = `✉️ ${hub.email}`; emailEl.style.display = 'inline'; }
    if (hub.imageData && imgWrap) {
      imgWrap.innerHTML = `<img src="${hub.imageData}" style="width:100%;height:100%;object-fit:cover;" />`;
    } else if (avatarEl) {
      avatarEl.textContent = getInitials(hub.name);
    }
  }

  // ── Edit Profile Modal ──
  const modal = document.getElementById('hub-edit-modal');
  const editBtn = document.getElementById('edit-hub-profile-btn');
  const closeBtn = document.getElementById('close-hub-edit');
  let hubImageData = null;

  editBtn?.addEventListener('click', async () => {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    // Pre-fill form
    if (hubId) {
      const res = await api.getHub(hubId).catch(() => null);
      const hub = res?.hub;
      if (hub) {
        document.getElementById('edit-hub-name').value = hub.name || '';
        document.getElementById('edit-hub-desc').value = hub.description || '';
        document.getElementById('edit-hub-address').value = hub.location || '';
        document.getElementById('edit-hub-city').value = hub.city || '';
        document.getElementById('edit-hub-pincode').value = hub.pincode || '';
        document.getElementById('edit-hub-phone').value = hub.phone || '';
        document.getElementById('edit-hub-email').value = hub.email || '';
        document.getElementById('edit-hub-radius').value = hub.radius || '';
        if (hub.hours) {
          document.getElementById('edit-hub-open').value = hub.hours.open || '06:00';
          document.getElementById('edit-hub-close').value = hub.hours.close || '21:00';
        }
        if (hub.imageData) {
          hubImageData = hub.imageData;
          const img = document.getElementById('hub-photo-img');
          img.src = hub.imageData; img.style.display = 'block';
          document.getElementById('hub-photo-placeholder').style.display = 'none';
        }
        if (hub.specialties?.length) {
          document.querySelectorAll('#edit-hub-specialties .filter-chip').forEach(c => {
            if (hub.specialties.includes(c.dataset.spec)) c.classList.add('filter-chip--active');
          });
        }
      }
    }
  });

  closeBtn?.addEventListener('click', () => { modal.style.display = 'none'; document.body.style.overflow = ''; });
  modal?.addEventListener('click', e => { if (e.target === modal) { modal.style.display = 'none'; document.body.style.overflow = ''; } });

  // Photo upload
  const photoArea = document.getElementById('hub-photo-area');
  const photoInput = document.getElementById('hub-photo-input');
  photoArea?.addEventListener('click', () => photoInput?.click());
  photoInput?.addEventListener('change', () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      hubImageData = e.target.result;
      const img = document.getElementById('hub-photo-img');
      img.src = hubImageData; img.style.display = 'block';
      document.getElementById('hub-photo-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
  });

  // Specialty chips
  document.getElementById('edit-hub-specialties')?.addEventListener('click', e => {
    const chip = e.target.closest('.filter-chip');
    if (chip) chip.classList.toggle('filter-chip--active');
  });

  // Save profile
  document.getElementById('hub-edit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!hubId) { alert('No hub linked to your account.'); return; }
    const btn = document.getElementById('save-hub-btn');
    const text = document.getElementById('save-hub-text');
    const loader = document.getElementById('save-hub-loader');
    btn.disabled = true; text.style.display = 'none'; loader.style.display = 'flex';

    const specialties = [...document.querySelectorAll('#edit-hub-specialties .filter-chip--active')].map(c => c.dataset.spec);
    const payload = {
      name: document.getElementById('edit-hub-name').value.trim() || 'My Hub',
      description: document.getElementById('edit-hub-desc').value.trim(),
      location: document.getElementById('edit-hub-address').value.trim(),
      city: document.getElementById('edit-hub-city').value.trim(),
      pincode: document.getElementById('edit-hub-pincode').value.trim(),
      phone: document.getElementById('edit-hub-phone').value.trim(),
      email: document.getElementById('edit-hub-email').value.trim(),
      radius: Number(document.getElementById('edit-hub-radius').value) || 5,
      hours: { open: document.getElementById('edit-hub-open').value, close: document.getElementById('edit-hub-close').value },
      imageData: hubImageData || null,
      specialties,
    };

    const res = await api.updateHub(hubId, payload);
    btn.disabled = false; text.style.display = ''; loader.style.display = 'none';

    if (res?.success) {
      localStorage.setItem('annsetu_hub_profile_' + hubId, JSON.stringify(res.hub));
      displayHubProfile(res.hub);
      modal.style.display = 'none'; document.body.style.overflow = '';
      showToast('✅ Hub profile updated!');
    } else {
      alert('Failed to save. Try again.');
    }
  });

  // ── Orders ──
  if (!hubId) {
    if (countEl) countEl.textContent = 'No hub assigned';
    if (container) container.innerHTML = `<div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">No hub selected.</div>`;
    return;
  }

  let allOrders = [];
  let currentFilter = 'all';
  loadOrders();

  async function loadOrders() {
    const res = await api.getHubOrders(hubId).catch(() => null);
    allOrders = res?.orders || [];
    renderOrders();
  }

  function renderOrders() {
    if (!container || !countEl) return;
    const filtered = currentFilter === 'all' ? allOrders : allOrders.filter(o => o.status === currentFilter);
    countEl.textContent = `${filtered.length} orders`;
    if (!filtered.length) { container.innerHTML = `<div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">No orders in this category.</div>`; return; }
    container.innerHTML = filtered.map(renderOrderCard).join('');
    attachActionListeners();
  }

  function renderOrderCard(o) {
    const timeAgo = getTimeAgo(o.placedAt);
    const sl = { placed: { t:'New Order', c:'var(--warning)', b:'var(--warning-light)' }, accepted: { t:'Accepted', c:'var(--info)', b:'var(--info-light)' }, out_for_delivery: { t:'Out for Delivery', c:'var(--primary)', b:'var(--primary-light)' }, delivered: { t:'Delivered', c:'var(--success)', b:'var(--success-light)' } };
    const s = sl[o.status] || { t:o.status, c:'var(--text-muted)', b:'var(--bg-secondary)' };
    const img = o.imageData ? `<img src="${o.imageData}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="width:100%;height:100%;background:var(--border-light);"></div>`;
    return `<div class="card" style="margin-bottom:var(--space-3);padding:var(--space-4);border-left:4px solid ${s.c};">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-3);">
        <div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">${timeAgo}</div><div style="font-weight:var(--fw-bold);font-size:var(--fs-md);margin-top:2px;">${o.productName}</div></div>
        <span class="badge" style="background:${s.b};color:${s.c};">${s.t}</span>
      </div>
      <div style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);background:var(--bg-secondary);padding:var(--space-2);border-radius:var(--radius-sm);">
        <div style="width:40px;height:40px;border-radius:var(--radius-sm);overflow:hidden;">${img}</div>
        <div style="flex:1;"><div style="font-size:var(--fs-xs);font-weight:var(--fw-semibold);">${o.quantity} ${o.unit}</div><div style="font-size:10px;color:var(--text-muted);">Total: ₹${o.total}</div></div>
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">Farmer: <span style="color:var(--green-700);font-weight:var(--fw-semibold);">${o.farmerName}</span></div>
      <div style="font-size:10px;color:var(--text-muted);margin-bottom:var(--space-3);">Customer: ${o.consumerName}</div>
      <div style="display:flex;gap:var(--space-2);">${renderActions(o)}</div>
    </div>`;
  }

  function renderActions(o) {
    if (o.status === 'placed') return `<button class="btn btn-primary btn-sm btn-action" data-id="${o.id}" data-status="accepted" style="flex:1;">Accept</button><button class="btn btn-ghost btn-sm btn-action" data-id="${o.id}" data-status="cancelled" style="color:var(--error);">Reject</button>`;
    if (o.status === 'accepted') return `<button class="btn btn-primary btn-sm btn-action" data-id="${o.id}" data-status="out_for_delivery" style="flex:1;">Start Delivery</button>`;
    if (o.status === 'out_for_delivery') return `<button class="btn btn-success btn-sm btn-action" data-id="${o.id}" data-status="delivered" style="flex:1;background:var(--success);">Confirm Drop-off</button>`;
    return `<div style="font-size:var(--fs-xs);color:var(--success);font-weight:var(--fw-bold);">Order completed</div>`;
  }

  function attachActionListeners() {
    document.querySelectorAll('.btn-action').forEach(btn => {
      btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = 'Updating...';
        const res = await api.updateOrderStatus(btn.dataset.id, btn.dataset.status);
        if (res?.success) loadOrders();
        else { btn.disabled = false; btn.textContent = 'Retry'; alert('Failed to update.'); }
      });
    });
    document.querySelectorAll('.filter-chip[data-status]').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-chip[data-status]').forEach(t => t.classList.remove('filter-chip--active'));
        tab.classList.add('filter-chip--active');
        currentFilter = tab.dataset.status;
        renderOrders();
      });
    });
  }
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

function showToast(msg) {
  let toast = document.getElementById('app-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'app-toast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = msg; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}
