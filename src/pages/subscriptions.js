// Subscription Management Page
import { renderAppHeader, renderBottomNav } from '../components/navbar.js';
import { subscriptionPlans } from '../data/mock-data.js';

export function renderSubscriptions() {
  return `
    ${renderAppHeader('Subscriptions', true)}
    <main class="page-content">
      <!-- Savings Banner -->
      <div class="px" style="padding-top:var(--space-4);">
        <div class="card card--green" style="text-align:center;padding:var(--space-5);">
          <div style="font-size:2rem;margin-bottom:var(--space-2);">🎉</div>
          <div style="font-family:var(--font-heading);font-weight:var(--fw-extrabold);font-size:var(--fs-xl);color:var(--green-800);margin-bottom:var(--space-1);">₹320 saved this month</div>
          <div style="font-size:var(--fs-sm);color:var(--text-muted);">with your active subscriptions</div>
        </div>
      </div>

      <div class="section-header" style="padding-bottom:0;">
        <span class="section-header__title">Your Plans</span>
        <a href="#/products" class="section-header__link">+ New</a>
      </div>

      <div class="stack" style="padding-top:var(--space-2);padding-bottom:var(--space-4);">
        ${subscriptionPlans.map(plan => `
          <div class="sub-card" data-sub-id="${plan.id}">
            <div class="sub-card__header">
              <div style="width:48px;height:48px;border-radius:var(--radius-md);background:var(--green-100);display:flex;align-items:center;justify-content:center;font-size:1.6rem;flex-shrink:0;">${plan.image}</div>
              <div style="flex:1;">
                <div style="font-weight:var(--fw-bold);font-size:var(--fs-body);">${plan.name}</div>
                <div style="font-size:var(--fs-xs);color:var(--text-muted);">${plan.frequency} · ₹${plan.price}/${plan.frequency === 'Daily' ? 'day' : 'week'}</div>
              </div>
              <span class="badge ${plan.paused ? 'badge--warning' : 'badge--success'}">${plan.paused ? 'Paused' : 'Active'}</span>
            </div>

            <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:var(--space-2);">
              <span style="color:var(--text-muted);">Next delivery</span>
              <span style="font-weight:var(--fw-medium);">${plan.nextDelivery}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:var(--space-2);">
              <span style="color:var(--text-muted);">Slot</span>
              <span style="font-weight:var(--fw-medium);">${plan.slot}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:var(--space-2);">
              <span style="color:var(--text-muted);">Address</span>
              <span style="font-weight:var(--fw-medium);">${plan.address}</span>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);">
              <span style="color:var(--text-muted);">Monthly savings</span>
              <span style="font-weight:var(--fw-semibold);color:var(--green);">${plan.savings}</span>
            </div>

            <div class="sub-card__actions">
              <button class="btn ${plan.paused ? 'btn-primary' : 'btn-secondary'} btn-sm sub-toggle" data-id="${plan.id}" style="flex:1;">${plan.paused ? '▶ Resume' : '⏸ Pause'}</button>
              <button class="btn btn-secondary btn-sm sub-skip" data-id="${plan.id}" style="flex:1;">⏭ Skip Next</button>
              <button class="btn btn-secondary btn-sm" style="flex:1;">🗓 Schedule</button>
              <button class="btn btn-ghost btn-sm" style="color:var(--error);flex-shrink:0;">Cancel</button>
            </div>
          </div>
        `).join('')}
      </div>

      <hr class="divider" />

      <!-- Explore -->
      <div class="px" style="padding:var(--space-4);">
        <div class="card" style="text-align:center;padding:var(--space-5);background:var(--orange-50);border-color:var(--orange-100);">
          <div style="font-size:1.5rem;margin-bottom:var(--space-2);">🛒</div>
          <div style="font-weight:var(--fw-bold);margin-bottom:var(--space-1);">Explore More Plans</div>
          <div style="font-size:var(--fs-sm);color:var(--text-muted);margin-bottom:var(--space-3);">Weekly fruits, organic baskets, festival specials & more</div>
          <a href="#/products" class="btn btn-primary btn-sm">Browse Products</a>
        </div>
      </div>

      <div style="height:var(--space-8);"></div>
    </main>
    ${renderBottomNav('orders', 'consumer')}
  `;
}

export function initSubscriptions() {
  document.querySelectorAll('.sub-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const isPaused = btn.textContent.includes('Resume');
      btn.textContent = isPaused ? '⏸ Pause' : '▶ Resume';
      btn.className = `btn ${isPaused ? 'btn-secondary' : 'btn-primary'} btn-sm sub-toggle`;
      const badge = btn.closest('.sub-card')?.querySelector('.badge');
      if (badge) { badge.textContent = isPaused ? 'Active' : 'Paused'; badge.className = `badge ${isPaused ? 'badge--success' : 'badge--warning'}`; }
      showToast(isPaused ? 'Subscription resumed ✓' : 'Subscription paused');
    });
  });

  document.querySelectorAll('.sub-skip').forEach(btn => {
    btn.addEventListener('click', () => { showToast('Next delivery skipped ✓'); });
  });
}

function showToast(msg) {
  let t = document.getElementById('app-toast');
  if (!t) { t = document.createElement('div'); t.id = 'app-toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
