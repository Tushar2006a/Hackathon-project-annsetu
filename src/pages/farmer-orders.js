// Farmer Demand Insights
import { renderFarmerHeader, renderBottomNav } from '../components/navbar.js';
import { api } from '../data/api.js';

export function renderFarmerOrders() {
  return `
    ${renderFarmerHeader('Demand Insights', true)}

    <main class="page-content" style="padding-bottom:80px;">
      <div class="px" style="padding-top:var(--space-4);padding-bottom:var(--space-3);">
        <h2 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">Demand Insights</h2>
        <p style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:4px;">Order requests are handled by your hub manager.</p>
        <p style="font-size:var(--fs-xs);color:var(--text-muted);" id="demand-count">Loading demand...</p>
      </div>

      <div id="demand-top" class="px">
        <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">
          Loading top product...
        </div>
      </div>

      <div class="section-header" style="margin-top:var(--space-4);">
        <span class="section-header__title">Trending Products</span>
      </div>
      <div id="demand-list" class="px">
        <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">
          Loading trend data...
        </div>
      </div>
    </main>

    ${renderBottomNav('farmer-orders', 'farmer')}
  `;
}

export function initFarmerOrders() {
  const userId = localStorage.getItem('annsetu_userId');
  if (!userId) return;

  loadDemand();

  async function loadDemand() {
    const res = await api.getFarmerOrders(userId).catch(() => null);
    const orders = res?.orders || [];
    renderDemand(orders);
  }

  function renderDemand(orders) {
    const countEl = document.getElementById('demand-count');
    const topEl = document.getElementById('demand-top');
    const listEl = document.getElementById('demand-list');

    if (countEl) countEl.textContent = `${orders.length} orders analyzed`;

    const summary = buildDemandSummary(orders);
    if (!summary.length) {
      if (topEl) {
        topEl.innerHTML = `
          <div style="text-align:center;padding:var(--space-6);color:var(--text-muted);font-size:var(--fs-sm);">
            No demand data available yet.
          </div>`;
      }
      if (listEl) listEl.innerHTML = '';
      return;
    }

    const top = summary[0];
    const topQty = top.quantity > 0 ? `${top.quantity} ${top.unit}` : 'Qty varies';
    const topImage = top.imageData
      ? `<img src="${top.imageData}" style="width:100%;height:100%;object-fit:cover;" />`
      : `<div style="width:100%;height:100%;background:var(--border-light);"></div>`;

    if (topEl) {
      topEl.innerHTML = `
        <div class="card" style="padding:var(--space-4);display:flex;align-items:center;gap:var(--space-3);">
          <div style="width:56px;height:56px;border-radius:var(--radius-md);overflow:hidden;background:var(--bg-secondary);">
            ${topImage}
          </div>
          <div style="flex:1;">
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">${top.productName}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">${top.orderCount} orders · ${topQty}</div>
            <div style="font-size:10px;color:var(--green-600);margin-top:4px;">Top demand product</div>
          </div>
          <a href="#/my-products" class="badge badge--success" style="text-decoration:none;">List more</a>
        </div>`;
    }

    if (listEl) {
      listEl.innerHTML = summary.slice(0, 5).map(renderDemandRow).join('');
    }
  }

  function buildDemandSummary(orders) {
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
    list.sort((a, b) => b.orderCount - a.orderCount || b.quantity - a.quantity);
    return list;
  }

  function renderDemandRow(item) {
    const qtyLabel = item.quantity > 0 ? `${item.quantity} ${item.unit}` : 'Qty varies';
    return `
      <div class="card" style="padding:var(--space-3);margin-bottom:var(--space-3);display:flex;align-items:center;gap:var(--space-3);">
        <div style="width:40px;height:40px;border-radius:var(--radius-sm);overflow:hidden;background:var(--bg-secondary);">
          ${item.imageData ? `<img src="${item.imageData}" style="width:100%;height:100%;object-fit:cover;" />` : `<div style="width:100%;height:100%;background:var(--border-light);"></div>`}
        </div>
        <div style="flex:1;">
          <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">${item.productName}</div>
          <div style="font-size:10px;color:var(--text-muted);">${item.orderCount} orders · ${qtyLabel}</div>
        </div>
        <span class="badge badge--success">High</span>
      </div>`;
  }
}
