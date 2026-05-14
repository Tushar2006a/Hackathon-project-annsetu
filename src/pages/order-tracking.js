// Live Order Tracking Page
import { renderAppHeader } from '../components/navbar.js';
import { consumerOrders, orderStages, hubs } from '../data/mock-data.js';
import { getActiveHub } from '../utils/ops.js';

export function renderOrderTracking(orderId) {
  const id = orderId || 'AN-2847';
  const order = consumerOrders.find(o => o.id === id) || consumerOrders[0];
  const activeHub = hubs.find(h => h.id === order.hubId) || getActiveHub(hubs);
  const progressMap = { placed: 20, picked: 40, packed: 60, out_for_delivery: 80, delivered: 100 };
  return `
    ${renderAppHeader(`Order ${id}`, true)}
    <main class="page-content">
      <div class="px" style="padding-top:var(--space-4);">
        <!-- Status Banner -->
        <div class="card card--green" style="padding:var(--space-5);text-align:center;position:relative;overflow:hidden;">
          <div style="font-size:2.5rem;margin-bottom:var(--space-2);">📦</div>
          <div style="font-family:var(--font-heading);font-weight:var(--fw-extrabold);font-size:var(--fs-lg);margin-bottom:var(--space-1);">${order.statusLabel}</div>
          <div style="font-size:var(--fs-sm);color:var(--text-muted);">Estimated delivery: ${order.eta || 'Today'} · ${activeHub?.name || 'Local Hub'}</div>
          <div style="margin-top:var(--space-3);height:6px;background:var(--green-200);border-radius:3px;overflow:hidden;">
            <div style="width:${progressMap[order.status] || 40}%;height:100%;background:var(--green);border-radius:3px;transition:width 1s;"></div>
          </div>
        </div>

        <!-- Timeline -->
        <div style="margin-top:var(--space-6);margin-bottom:var(--space-4);">
          ${orderStages.map((stage, index) => {
            const isDone = order.timeline.find(t => t.key === stage.key) || progressMap[order.status] >= progressMap[stage.key];
            const timelineMatch = order.timeline.find(t => t.key === stage.key);
            const subtitle = timelineMatch ? `${timelineMatch.time} · ${timelineMatch.detail}` : stage.key === 'packed' ? `Being sorted at ${activeHub?.name || 'local hub'}` : '';
            return renderStep(stage.label, subtitle, Boolean(isDone), index < orderStages.length - 1, index === orderStages.length - 1);
          }).join('')}
        </div>

        <hr class="divider" />

        <!-- Delivery Partner -->
        <div style="margin-top:var(--space-4);">
          <div style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">Delivery Partner</div>
          <div class="card" style="display:flex;align-items:center;gap:var(--space-3);">
            <div class="avatar avatar--green" style="width:48px;height:48px;font-size:var(--fs-lg);">${order.deliveryPartner.initials}</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);">${order.deliveryPartner.name}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">⭐ ${order.deliveryPartner.rating} · ${order.deliveryPartner.deliveries}+ deliveries</div>
            </div>
            <a href="tel:${order.deliveryPartner.phone}" class="btn btn-secondary btn-sm" style="padding:8px 12px;">📞 Call</a>
          </div>
        </div>

        <!-- Map Placeholder -->
        <div style="margin-top:var(--space-4);">
          <div class="card" style="height:160px;background:linear-gradient(135deg,var(--green-50),var(--surface-container));display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px dashed var(--green-200);">
            <div style="font-size:2rem;margin-bottom:var(--space-2);">🗺️</div>
            <div style="font-size:var(--fs-sm);color:var(--text-muted);">Live map tracking</div>
            <div style="font-size:var(--fs-xs);color:var(--green);">Coming soon</div>
          </div>
        </div>

        <hr class="divider" style="margin-top:var(--space-4);" />

        <!-- Order Items -->
        <div style="margin-top:var(--space-4);">
          <div style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">Order Items</div>
          ${order.items.map(item => `
            <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
              <span style="color:var(--text-secondary);">${item.image} ${item.name} × ${item.qty}${item.unit}</span>
              <span>₹${item.price * item.qty}</span>
            </div>
          `).join('')}
          <div style="display:flex;justify-content:space-between;padding-top:var(--space-3);border-top:1px solid var(--border);margin-top:var(--space-2);">
            <span style="font-weight:var(--fw-bold);">Total</span>
            <span style="font-weight:var(--fw-bold);">₹${order.total}</span>
          </div>
        </div>

        <!-- Actions -->
        <div style="margin-top:var(--space-6);display:flex;gap:var(--space-3);">
          <a href="#/support" class="btn btn-secondary btn-full">💬 Support</a>
          <button class="btn btn-secondary btn-full" id="cancel-btn" style="color:var(--error);border-color:rgba(220,38,38,0.3);">Cancel Order</button>
        </div>

        <div style="height:var(--space-8);"></div>
      </div>
    </main>
  `;
}

function renderStep(title, subtitle, done, hasLine, isLast = false) {
  const dotStyle = done
    ? 'background:var(--green);color:#fff;'
    : (!isLast ? 'background:var(--green-100);' : 'background:var(--border);');
  const lineColor = done ? 'var(--green)' : 'var(--border-light)';
  return `
    <div style="display:flex;gap:var(--space-4);margin-bottom:${isLast ? '0' : 'var(--space-4)'};">
      <div style="display:flex;flex-direction:column;align-items:center;">
        <div style="width:28px;height:28px;border-radius:50%;${dotStyle}display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">
          ${done ? '✓' : `<div class="${!isLast && !done ? 'pulse-dot' : ''}" style="width:8px;height:8px;background:${done ? '#fff' : isLast ? 'var(--text-muted)' : 'var(--green)'};border-radius:50%;"></div>`}
        </div>
        ${!isLast ? `<div style="width:2px;flex:1;background:${lineColor};margin-top:4px;min-height:20px;"></div>` : ''}
      </div>
      <div style="padding-bottom:${isLast ? '0' : 'var(--space-2)'};">
        <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);color:${done ? 'var(--dark)' : 'var(--text-muted)'};">${title}</div>
        ${subtitle ? `<div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">${subtitle}</div>` : ''}
      </div>
    </div>
  `;
}

export function initOrderTracking() {
  document.getElementById('cancel-btn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to cancel this order?')) {
      let toast = document.getElementById('app-toast');
      if (!toast) { toast = document.createElement('div'); toast.id = 'app-toast'; toast.className = 'toast'; document.body.appendChild(toast); }
      toast.textContent = '❌ Order has been cancelled';
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
      setTimeout(() => { window.location.hash = '#/orders'; }, 1500);
    }
  });
}
