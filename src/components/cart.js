// Smart Cart Page
import { renderAppHeader, renderBottomNav } from '../components/navbar.js';
import { cart, hubs, minOrderValue } from '../data/mock-data.js';
import { getActiveHub, formatEta } from '../utils/ops.js';

export function renderCartPage() {
  return `
    ${renderAppHeader('My Cart', true)}
    <main class="page-content">
      <div id="cart-content"></div>
    </main>
    ${renderBottomNav()}
  `;
}

function renderCartContent() {
  if (cart.items.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">🛒</div>
        <p class="empty-state__text" style="margin-bottom:var(--space-2);">Your cart is empty</p>
        <p style="font-size:var(--fs-sm);color:var(--text-muted);margin-bottom:var(--space-4);">Add fresh produce from nearby farms</p>
        <a href="#/products" class="btn btn-primary">Browse Fresh Produce</a>
      </div>
    `;
  }

  const freeDeliveryGap = cart.subtotal < 299 ? 299 - cart.subtotal : 0;
  const activeHub = getActiveHub(hubs) || hubs[0];
  const stockIssues = cart.stockIssues;

  return `
    <!-- Delivery ETA -->
    <div class="px" style="padding-top:var(--space-3);">
      <div class="hub-banner">
        <span style="font-size:1.1rem;">🚚</span>
        <div class="hub-banner__meta">
          <div class="hub-banner__title">Delivery in ${formatEta(activeHub?.etaMins || 30)}</div>
          <div class="hub-banner__subtitle">From ${activeHub?.name || 'Local Hub'} · ${activeHub?.distanceKm || 0.8} km</div>
        </div>
        <span class="pill pill--green">Live</span>
      </div>
    </div>

    ${freeDeliveryGap > 0 ? `
      <div class="px" style="padding-top:var(--space-3);">
        <div style="padding:var(--space-2) var(--space-3);background:var(--orange-50);border:1px solid var(--orange-100);border-radius:var(--radius-md);font-size:var(--fs-sm);color:var(--orange-600);">
          🎯 Add ₹${freeDeliveryGap} more for <strong>free delivery</strong>
        </div>
      </div>
    ` : ''}

    ${cart.minOrderGap > 0 ? `
      <div class="px" style="padding-top:var(--space-3);">
        <div style="padding:var(--space-2) var(--space-3);background:var(--warning-light);border:1px solid rgba(245, 158, 11, 0.2);border-radius:var(--radius-md);font-size:var(--fs-sm);color:#b45309;">
          Minimum order ₹${minOrderValue}. Add ₹${cart.minOrderGap} more to proceed.
        </div>
      </div>
    ` : ''}

    ${stockIssues.length > 0 ? `
      <div class="px" style="padding-top:var(--space-3);">
        <div style="padding:var(--space-2) var(--space-3);background:var(--error-light);border:1px solid rgba(220, 38, 38, 0.15);border-radius:var(--radius-md);font-size:var(--fs-sm);color:var(--error);">
          Some items exceed available stock. Please reduce quantities to continue.
        </div>
      </div>
    ` : ''}

    <!-- Cart Items -->
    <div class="px" style="padding-top:var(--space-3);">
      ${cart.items.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__image">${item.image}</div>
          <div class="cart-item__info">
            <div class="cart-item__name">${item.name}</div>
            <div class="cart-item__price">₹${item.price}/${item.unit} · by ${item.farmer || 'Local Farm'}</div>
            ${item.stock !== undefined && item.qty >= item.stock ? `<div style="font-size:10px;color:var(--orange-600);font-weight:var(--fw-semibold);">Stock limit reached</div>` : ''}
            <div class="cart-item__controls">
              <button class="cart-item__qty-btn" data-action="decrease" data-id="${item.id}">−</button>
              <span style="font-size:var(--fs-body);font-weight:var(--fw-bold);min-width:24px;text-align:center;">${item.qty}</span>
              <button class="cart-item__qty-btn" data-action="increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-weight:var(--fw-bold);font-size:var(--fs-body);margin-bottom:4px;">₹${item.price * item.qty}</div>
            <button class="btn-ghost" style="color:var(--text-muted);padding:2px;font-size:var(--fs-xs);" data-action="remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>

    <hr class="divider" style="margin-top:var(--space-3);" />

    <!-- Coupon -->
    <div class="px" style="padding-top:var(--space-4);">
      <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);margin-bottom:var(--space-2);">Apply Coupon</div>
      ${cart.coupon ? `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-3);background:var(--green-50);border:1px solid var(--green-200);border-radius:var(--radius-md);">
          <div>
            <span style="font-weight:var(--fw-bold);color:var(--green-700);">${cart.coupon.code}</span>
            <span style="font-size:var(--fs-xs);color:var(--text-muted);margin-left:var(--space-2);">- ₹${cart.couponDiscount} off</span>
          </div>
          <button class="btn-ghost" style="color:var(--error);font-size:var(--fs-xs);" id="remove-coupon">Remove</button>
        </div>
      ` : `
        <div class="coupon-row">
          <input type="text" class="input" placeholder="Enter coupon code" id="coupon-input" style="text-transform:uppercase;" />
          <button class="btn btn-secondary btn-sm" id="apply-coupon" style="min-width:70px;">Apply</button>
        </div>
        <div id="coupon-msg" style="font-size:var(--fs-xs);margin-top:var(--space-1);"></div>
      `}
    </div>

    <hr class="divider" style="margin-top:var(--space-4);" />

    <!-- Bill -->
    <div class="px" style="padding-top:var(--space-4);">
      <div style="font-weight:var(--fw-semibold);font-size:var(--fs-md);margin-bottom:var(--space-3);">Bill Details</div>
      <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
        <span style="color:var(--text-secondary);">Item total</span>
        <span style="font-weight:var(--fw-medium);">₹${cart.subtotal}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
        <span style="color:var(--text-secondary);">Delivery fee</span>
        <span style="${cart.deliveryFee === 0 ? 'color:var(--green);font-weight:var(--fw-semibold);' : ''}">${cart.deliveryFee === 0 ? 'FREE' : '₹' + cart.deliveryFee}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
        <span style="color:var(--text-secondary);">Packaging</span>
        <span>₹${cart.packagingFee}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
        <span style="color:var(--text-secondary);">Platform fee</span>
        <span>₹${cart.platformFee}</span>
      </div>
      ${cart.couponDiscount > 0 ? `
        <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
          <span style="color:var(--green);">Coupon discount</span>
          <span style="color:var(--green);font-weight:var(--fw-semibold);">- ₹${cart.couponDiscount}</span>
        </div>
      ` : ''}
      ${cart.savings > 0 ? `
        <div style="padding:var(--space-2) var(--space-3);background:var(--green-50);border-radius:var(--radius-md);margin-bottom:var(--space-3);font-size:var(--fs-sm);color:var(--green-700);font-weight:var(--fw-semibold);text-align:center;">
          🎉 You're saving ₹${cart.savings} on this order!
        </div>
      ` : ''}
      <div style="display:flex;justify-content:space-between;padding-top:var(--space-3);border-top:1.5px solid var(--dark);margin-bottom:var(--space-4);">
        <span style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">Grand Total</span>
        <span style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">₹${cart.total}</span>
      </div>
      <a href="#/checkout" class="btn btn-primary btn-full btn-lg" style="${cart.minOrderGap > 0 || stockIssues.length > 0 ? 'opacity:0.6;pointer-events:none;' : ''}">${cart.minOrderGap > 0 ? `Add ₹${cart.minOrderGap} to proceed` : 'Proceed to Checkout'}</a>
      <p style="text-align:center;font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--space-3);padding-bottom:var(--space-4);">🔒 Secure checkout · Free delivery above ₹299</p>
    </div>
  `;
}

export function initCartPage() {
  const el = document.getElementById('cart-content');
  cart.normalize();
  if (el) el.innerHTML = renderCartContent();

  el?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = parseInt(btn.dataset.id);
    const action = btn.dataset.action;
    if (action === 'increase') { const item = cart.items.find(i => i.id === id); if (item) cart.updateQty(id, item.qty + 1); }
    else if (action === 'decrease') { const item = cart.items.find(i => i.id === id); if (item) cart.updateQty(id, item.qty - 1); }
    else if (action === 'remove') { cart.remove(id); }
    el.innerHTML = renderCartContent();
    bindCouponEvents(el);
    updateCartBadge();
  });

  bindCouponEvents(el);
  updateCartBadge();
}

function bindCouponEvents(el) {
  document.getElementById('apply-coupon')?.addEventListener('click', () => {
    const input = document.getElementById('coupon-input');
    const msg = document.getElementById('coupon-msg');
    if (!input?.value) return;
    const result = cart.applyCoupon(input.value);
    if (msg) { msg.textContent = result.msg; msg.style.color = result.success ? 'var(--green)' : 'var(--error)'; }
    if (result.success && el) { el.innerHTML = renderCartContent(); bindCouponEvents(el); }
  });

  document.getElementById('remove-coupon')?.addEventListener('click', () => {
    cart.removeCoupon();
    if (el) { el.innerHTML = renderCartContent(); bindCouponEvents(el); }
  });
}

export function updateCartBadge() {
  const badge = document.getElementById('cart-badge');
  if (badge) { badge.textContent = cart.count; badge.style.display = cart.count > 0 ? 'flex' : 'none'; }
}

export function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'app-toast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
