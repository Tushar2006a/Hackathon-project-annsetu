// Farmer Dashboard — Home screen for farmers
import { renderFarmerHeader, renderBottomNav } from '../components/navbar.js';
import { api } from '../data/api.js';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function renderFarmerDashboard() {
  const saved   = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  const name    = saved.name || 'Farmer';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const greeting = getGreeting();

  return `
    ${renderFarmerHeader()}

    <main class="page-content" style="padding-bottom:80px;">
      <!-- Profile Card -->
      <div class="px" style="padding-top:var(--space-4);padding-bottom:var(--space-4);">
        <div style="display:flex;align-items:center;gap:var(--space-3);">
          <div class="avatar avatar--olive" style="width:48px;height:48px;font-size:var(--fs-md);">${initials}</div>
          <div style="flex:1;">
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-md);">${greeting}, ${name} 👋</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);" id="farmer-location">Farmer · Loading...</div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-widget">
          <div class="stat-widget__label">Earnings</div>
          <div class="stat-widget__value" id="stat-earnings">₹0</div>
          <div class="stat-widget__change">Total revenue</div>
        </div>
        <div class="stat-widget">
          <div class="stat-widget__label">Orders</div>
          <div class="stat-widget__value" id="stat-orders">0</div>
          <div class="stat-widget__change">All time</div>
        </div>
        <div class="stat-widget">
          <div class="stat-widget__label">Pending</div>
          <div class="stat-widget__value" id="stat-pending" style="color:var(--warning);">0</div>
          <div style="font-size:var(--fs-xs);color:var(--text-muted);">Needs delivery</div>
        </div>
        <div class="stat-widget">
          <div class="stat-widget__label">Products</div>
          <div class="stat-widget__value" id="stat-products">0</div>
          <div style="font-size:var(--fs-xs);color:var(--text-muted);">Live listings</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="section-header" style="margin-top:var(--space-2);">
        <span class="section-header__title">Quick Actions</span>
      </div>
      <div class="px" style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-3);padding-bottom:var(--space-4);">
        <a href="#/my-products" class="card" style="text-align:center;padding:var(--space-4);text-decoration:none;color:inherit;">
          <div style="font-size:1.5rem;margin-bottom:var(--space-2);">📦</div>
          <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">My Products</div>
          <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">Manage inventory</div>
        </a>
        <div class="card" id="demand-card" style="text-align:center;padding:var(--space-4);">
          <div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.6px;">Demand</div>
          <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);margin-top:6px;" id="demand-product-name">Loading...</div>
          <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;" id="demand-product-meta">Analyzing recent orders</div>
        </div>
      </div>

      <hr class="divider" />

      <!-- Demand Insight -->
      <div class="section-header">
        <span class="section-header__title">Demand Insight</span>
      </div>
      <div id="demand-insight" class="px">
        <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">
          Loading demand data...
        </div>
      </div>

      <hr class="divider" style="margin-top:var(--space-5);" />

      <!-- Notifications -->
      <div class="section-header">
        <span class="section-header__title">Recent Alerts</span>
      </div>
      <div id="notifications-list">
        <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">
          No recent notifications.
        </div>
      </div>

      <div style="height:var(--space-4);"></div>
    </main>

    ${renderBottomNav('dashboard', 'farmer')}
  `;
}

export async function initFarmerDashboard() {
  const userId = localStorage.getItem('annsetu_userId');
  if (!userId) return;

  // 1. Load Farmer Profile for location
  const profileRes = await api.getFarmProfile(userId).catch(() => null);
  if (profileRes?.farmProfile) {
    document.getElementById('farmer-location').textContent = 
      `${profileRes.farmProfile.farmName || 'Farmer'} · ${profileRes.farmProfile.location || 'Unknown'}`;
  }

  // 2. Load Stats & Orders
  const ordersRes = await api.getFarmerOrders(userId).catch(() => null);
  const orders = ordersRes?.orders || [];
  
  const productsRes = await api.getMyListings(userId).catch(() => null);
  const productsCount = productsRes?.listings?.length || 0;

  const pendingOrders = orders.filter(o => o.status === 'placed');
  const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  document.getElementById('stat-earnings').textContent = `₹${totalEarnings.toLocaleString()}`;
  document.getElementById('stat-orders').textContent = orders.length;
  document.getElementById('stat-pending').textContent = pendingOrders.length;
  document.getElementById('stat-products').textContent = productsCount;
  // 3. Render Demand Insight
  const demandTop = getTopDemandProduct(orders);
  const demandNameEl = document.getElementById('demand-product-name');
  const demandMetaEl = document.getElementById('demand-product-meta');
  const demandInsight = document.getElementById('demand-insight');

  if (demandTop) {
    const qtyLabel = demandTop.quantity > 0
      ? `${demandTop.quantity} ${demandTop.unit}`
      : 'Qty varies';

    if (demandNameEl) demandNameEl.textContent = demandTop.productName;
    if (demandMetaEl) demandMetaEl.textContent = `${demandTop.orderCount} orders · ${qtyLabel}`;

    const imageHtml = demandTop.imageData
      ? `<img src="${demandTop.imageData}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<div style="width:100%;height:100%;background:var(--border-light);"></div>`;

    if (demandInsight) {
      demandInsight.innerHTML = `
        <div class="card" style="padding:var(--space-4);display:flex;align-items:center;gap:var(--space-3);">
          <div style="width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;background:var(--bg-secondary);">
            ${imageHtml}
          </div>
          <div style="flex:1;">
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">${demandTop.productName}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">${demandTop.orderCount} orders · ${qtyLabel}</div>
            <div style="font-size:10px;color:var(--green-600);margin-top:4px;">Based on recent orders</div>
          </div>
          <a href="#/my-products" class="badge badge--success" style="text-decoration:none;">List more</a>
        </div>`;
    }
  } else {
    if (demandNameEl) demandNameEl.textContent = 'No demand yet';
    if (demandMetaEl) demandMetaEl.textContent = 'Check back after first orders';
    if (demandInsight) {
      demandInsight.innerHTML = `
        <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">
          No demand data available yet.
        </div>`;
    }
  }

  // 4. Load Notifications
  const notifsRes = await api.getNotifications(userId).catch(() => null);
  const notifications = (notifsRes?.notifications || []).filter(n => n.type !== 'new_order');
  const notifList = document.getElementById('notifications-list');
  
  if (notifications.length > 0) {
    notifList.innerHTML = notifications.slice(0, 5).map(n => `
      <div class="list-item" style="opacity: ${n.read ? '0.6' : '1'}">
        <div class="list-item__icon" style="background:${n.read ? 'var(--bg-secondary)' : 'var(--green-50)'};">
          ${n.type === 'new_order' ? '🛒' : '🔔'}
        </div>
        <div class="list-item__content">
          <div class="list-item__title" style="font-weight:${n.read ? 'normal' : 'bold'}">${n.title}</div>
          <div class="list-item__subtitle">${n.body}</div>
          <div style="font-size:9px;color:var(--text-muted);margin-top:2px;">${getTimeAgo(n.createdAt)}</div>
        </div>
      </div>
    `).join('');
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

function getTopDemandProduct(orders) {
  const summary = {};
  orders.forEach(o => {
    const name = (o.productName || '').trim();
    if (!name) return;
    if (!summary[name]) {
      summary[name] = {
        productName: name,
        orderCount: 0,
        quantity: 0,
        unit: o.unit || '',
        imageData: o.imageData || ''
      };
    }
    summary[name].orderCount += 1;
    summary[name].quantity += Number(o.quantity) || 0;
    if (!summary[name].imageData && o.imageData) {
      summary[name].imageData = o.imageData;
    }
  });

  const list = Object.values(summary);
  if (!list.length) return null;
  list.sort((a, b) => b.orderCount - a.orderCount || b.quantity - a.quantity);
  return list[0];
}
