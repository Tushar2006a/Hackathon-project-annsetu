// Consumer Orders Dashboard — Tabbed
import { renderAppHeader, renderBottomNav, getUserRole } from '../components/navbar.js';
import { consumerOrders } from '../data/mock-data.js';

const statusProgress = {
  placed: 20,
  picked: 40,
  packed: 60,
  out_for_delivery: 80,
  delivered: 100,
};

export function renderConsumerDashboard() {
  const role = getUserRole();
  const activeOrders = consumerOrders.filter(o => o.status !== 'delivered');
  const pastOrders = consumerOrders.filter(o => o.status === 'delivered');

  return `
    ${renderAppHeader('My Orders', true)}
    <main class="page-content">
      <div class="tab-bar" id="order-tabs">
        <div class="tab-bar__item tab-bar__item--active" data-tab="active">Active (${activeOrders.length})</div>
        <div class="tab-bar__item" data-tab="past">Past Orders</div>
        <div class="tab-bar__item" data-tab="subs">Subscriptions</div>
      </div>

      <div id="tab-content">
        <!-- Active Orders -->
        <div id="tab-active">
          ${activeOrders.length > 0 ? `
            <div class="px" style="padding-top:var(--space-4);">
              ${activeOrders.map(o => `
                <a href="#/track/${o.id}" class="card" style="display:block;padding:var(--space-4);margin-bottom:var(--space-3);text-decoration:none;color:inherit;border-left:3px solid var(--green);">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-2);">
                    <div style="font-weight:var(--fw-bold);font-size:var(--fs-body);">🚚 ${o.id}</div>
                    <span class="badge ${o.statusClass}">${o.statusLabel}</span>
                  </div>
                  <div style="font-size:var(--fs-sm);color:var(--text-secondary);margin-bottom:var(--space-2);">${o.items.map(i => `${i.image} ${i.name}`).join(', ')}</div>
                  <div style="display:flex;justify-content:space-between;align-items:center;">
                    <div style="font-size:var(--fs-xs);color:var(--text-muted);">ETA: ${o.eta}</div>
                    <span style="font-size:var(--fs-sm);color:var(--green-700);font-weight:var(--fw-semibold);">Track →</span>
                  </div>
                  <div style="margin-top:var(--space-2);height:4px;background:var(--green-100);border-radius:2px;overflow:hidden;">
                    <div style="width:${statusProgress[o.status] || 40}%;height:100%;background:var(--green);border-radius:2px;"></div>
                  </div>
                </a>
              `).join('')}
            </div>
          ` : `
            <div class="empty-state"><div class="empty-state__icon">📦</div><p class="empty-state__text">No active orders</p></div>
          `}
        </div>

        <!-- Past Orders (hidden initially) -->
        <div id="tab-past" style="display:none;">
          ${pastOrders.map(o => `
            <a href="#/track/${o.id}" class="list-item" style="text-decoration:none;color:inherit;">
              <div style="width:44px;height:44px;border-radius:var(--radius-md);background:var(--green-100);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">✓</div>
              <div class="list-item__content" style="flex:1;">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <div class="list-item__title">${o.id}</div>
                  <span class="badge badge--success" style="font-size:10px;">Delivered</span>
                </div>
                <div class="list-item__subtitle">${o.items.map(i => `${i.image} ${i.name}`).join(', ')}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;">
                  <span style="font-size:var(--fs-xs);color:var(--text-muted);">${o.date}</span>
                  <div style="display:flex;gap:var(--space-2);">
                    <span style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);">₹${o.total}</span>
                    <span style="font-size:var(--fs-xs);color:var(--green);font-weight:var(--fw-semibold);cursor:pointer;">Reorder</span>
                  </div>
                </div>
              </div>
            </a>
          `).join('')}
        </div>

        <!-- Subscriptions Tab (hidden) -->
        <div id="tab-subs" style="display:none;">
          <div class="px" style="padding-top:var(--space-4);">
            <a href="#/subscriptions" class="card card--green" style="display:block;text-decoration:none;color:inherit;text-align:center;padding:var(--space-5);">
              <div style="font-size:2rem;margin-bottom:var(--space-2);">🔄</div>
              <div style="font-weight:var(--fw-bold);margin-bottom:var(--space-1);">Manage Subscriptions</div>
              <div style="font-size:var(--fs-sm);color:var(--text-muted);">Daily milk, weekly veggies & more</div>
            </a>
          </div>
        </div>
      </div>

      <div style="height:calc(var(--space-8) + 60px);"></div>
    </main>
    ${renderBottomNav('orders', role)}
  `;
}

export function initConsumerDashboard() {
  document.querySelectorAll('.tab-bar__item').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab-bar__item').forEach(t => t.classList.remove('tab-bar__item--active'));
      tab.classList.add('tab-bar__item--active');
      const tabName = tab.dataset.tab;
      document.getElementById('tab-active').style.display = tabName === 'active' ? '' : 'none';
      document.getElementById('tab-past').style.display = tabName === 'past' ? '' : 'none';
      document.getElementById('tab-subs').style.display = tabName === 'subs' ? '' : 'none';
    });
  });
}
