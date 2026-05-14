// Full Checkout System
import { renderAppHeader } from '../components/navbar.js';
import { cart, deliverySlots } from '../data/mock-data.js';
import { getRecommendedSlot } from '../utils/ops.js';

let selectedSlot = null;
let selectedPayment = 'UPI';

export function renderCheckout() {
  const recommendedSlot = getRecommendedSlot(deliverySlots);
  if (!selectedSlot && recommendedSlot) selectedSlot = recommendedSlot.id;
  const activeSlot = deliverySlots.find(s => s.id === selectedSlot) || recommendedSlot;
  const surgeFee = activeSlot?.surge ? Math.round(cart.subtotal * (activeSlot.surgeMultiplier || 0)) : 0;
  const total = (cart.total || 390) + surgeFee;
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);
  const fmt = d => d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return `
    ${renderAppHeader('Checkout', true)}
    <main class="page-content">
      <!-- Delivery Address -->
      <div class="px" style="padding-top:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">📍 Delivery Address</h3>
        <div class="card" style="border-color:var(--green-200);background:var(--green-50);">
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);">
            <span style="font-weight:var(--fw-semibold);">Home</span>
            <span style="font-size:var(--fs-xs);color:var(--green-700);font-weight:var(--fw-semibold);cursor:pointer;">Change</span>
          </div>
          <div style="font-size:var(--fs-sm);color:var(--text-secondary);" id="addr-preview">Flat 201, Green Valley Apartments, Baner Road, Pune — 411045</div>
        </div>
        <div style="margin-top:var(--space-3);">
          <label style="font-size:var(--fs-sm);font-weight:var(--fw-medium);color:var(--text-secondary);display:block;margin-bottom:var(--space-1);">Delivery Instructions</label>
          <div style="display:flex;gap:var(--space-2);flex-wrap:wrap;margin-bottom:var(--space-2);">
            <button class="filter-chip filter-chip--active instr-chip" data-instr="Ring the bell">🔔 Ring the bell</button>
            <button class="filter-chip instr-chip" data-instr="Leave at door">🚪 Leave at door</button>
            <button class="filter-chip instr-chip" data-instr="Call before">📞 Call before</button>
          </div>
          <input type="text" class="input" placeholder="Any other instructions..." id="delivery-notes" style="font-size:var(--fs-sm);" />
        </div>
      </div>

      <hr class="divider" />

      <!-- Delivery Slot -->
      <div class="px" style="padding-top:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">🕐 Delivery Slot</h3>
        <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:var(--space-2);">Recommended slot highlighted based on hub capacity and routing efficiency.</div>
        <div style="display:flex;gap:var(--space-2);margin-bottom:var(--space-3);">
          <button class="filter-chip filter-chip--active date-chip" data-date="today">Today</button>
          <button class="filter-chip date-chip" data-date="tomorrow">${fmt(tomorrow)}</button>
          <button class="filter-chip date-chip" data-date="dayafter">${fmt(dayAfter)}</button>
        </div>
        <div class="slot-grid" style="padding:0;">
          ${deliverySlots.map(s => `
            <div class="slot-chip ${s.id === selectedSlot ? 'slot-chip--active' : ''} ${!s.available ? 'slot-chip--disabled' : ''}" data-slot="${s.id}">
              <div style="font-weight:var(--fw-semibold);">${s.label}</div>
              <div style="font-size:var(--fs-xs);color:${s.surge ? 'var(--orange)' : 'var(--text-muted)'};">${s.surge ? '⚡ Peak hour' : s.period}</div>
              <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${s.remaining}/${s.capacity} slots left</div>
              ${s.recommended ? `<div style="margin-top:4px;"><span class="pill pill--green" style="padding:2px 6px;font-size:10px;">Recommended</span></div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <hr class="divider" />

      <!-- Payment -->
      <div class="px" style="padding-top:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">💳 Payment Method</h3>
        <div class="payment-option ${selectedPayment === 'UPI' ? 'selected' : ''}" data-payment="UPI"><div class="payment-option__radio"></div><span>📱 UPI / Google Pay</span></div>
        <div class="payment-option ${selectedPayment === 'Card' ? 'selected' : ''}" data-payment="Card"><div class="payment-option__radio"></div><span>💳 Debit / Credit Card</span></div>
        <div class="payment-option ${selectedPayment === 'Wallet' ? 'selected' : ''}" data-payment="Wallet"><div class="payment-option__radio"></div><div><span>👛 Annsetu Wallet</span><div style="font-size:var(--fs-xs);color:var(--green);">Balance: ₹250</div></div></div>
        <div class="payment-option ${selectedPayment === 'COD' ? 'selected' : ''}" data-payment="COD"><div class="payment-option__radio"></div><span>💵 Cash on Delivery</span></div>
      </div>

      <hr class="divider" />

      <!-- Order Summary -->
      <div class="px" style="padding-top:var(--space-4);padding-bottom:var(--space-4);">
        <h3 style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-md);margin-bottom:var(--space-3);">📋 Order Summary</h3>
        ${cart.items.length > 0 ? cart.items.map(item => `
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);">
            <span style="color:var(--text-secondary);">${item.image} ${item.name} × ${item.qty}</span>
            <span>₹${item.price * item.qty}</span>
          </div>
        `).join('') : `
          <div style="font-size:var(--fs-sm);color:var(--text-muted);padding:var(--space-3);text-align:center;">Cart items will appear here</div>
        `}
        <div style="border-top:1px solid var(--border);padding-top:var(--space-2);margin-top:var(--space-2);">
          <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:2px;"><span style="color:var(--text-secondary);">Subtotal</span><span>₹${cart.subtotal}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:2px;"><span style="color:var(--text-secondary);">Delivery</span><span style="${cart.deliveryFee === 0 ? 'color:var(--green);' : ''}">${cart.deliveryFee === 0 ? 'FREE' : '₹' + cart.deliveryFee}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:2px;"><span style="color:var(--text-secondary);">Fees</span><span>₹${cart.packagingFee + cart.platformFee}</span></div>
          <div id="surge-fee-row" style="display:${surgeFee > 0 ? 'flex' : 'none'};justify-content:space-between;font-size:var(--fs-sm);margin-bottom:2px;">
            <span style="color:var(--orange);">Peak hour surcharge</span>
            <span style="color:var(--orange);" id="surge-fee-value">₹${surgeFee}</span>
          </div>
          ${cart.couponDiscount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:var(--fs-sm);margin-bottom:2px;"><span style="color:var(--green);">Coupon</span><span style="color:var(--green);">- ₹${cart.couponDiscount}</span></div>` : ''}
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:var(--space-3);border-top:1.5px solid var(--dark);margin-top:var(--space-2);">
          <span style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);">Total</span>
          <span style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);" id="order-total">₹${total}</span>
        </div>
      </div>

      <div style="height:80px;"></div>

      <!-- Sticky Place Order -->
      <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:rgba(255,255,255,0.95);backdrop-filter:blur(12px);border-top:1px solid var(--border-light);padding:var(--space-3) var(--space-4) calc(var(--space-3) + var(--safe-bottom));z-index:50;">
        <button class="btn btn-primary btn-full btn-lg" id="place-order-btn">
          <span id="place-order-text">Place Order — ₹${total}</span>
          <div class="dots-loading" id="place-order-loader" style="display:none;"><span></span><span></span><span></span></div>
        </button>
        <p style="text-align:center;font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--space-2);">🔒 Secure & encrypted payment</p>
      </div>
    </main>
  `;
}

export function initCheckout() {
  function computeSurgeFee() {
    const slot = deliverySlots.find(s => s.id === selectedSlot);
    return slot?.surge ? Math.round(cart.subtotal * (slot.surgeMultiplier || 0)) : 0;
  }

  function updateTotals() {
    const surgeFee = computeSurgeFee();
    const total = (cart.total || 0) + surgeFee;
    const surgeRow = document.getElementById('surge-fee-row');
    const surgeValue = document.getElementById('surge-fee-value');
    const totalEl = document.getElementById('order-total');
    const placeOrderText = document.getElementById('place-order-text');
    if (surgeRow) surgeRow.style.display = surgeFee > 0 ? 'flex' : 'none';
    if (surgeValue) surgeValue.textContent = `₹${surgeFee}`;
    if (totalEl) totalEl.textContent = `₹${total}`;
    if (placeOrderText) placeOrderText.textContent = `Place Order — ₹${total}`;
  }

  // Payment selection
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPayment = opt.dataset.payment;
    });
  });

  // Slot selection
  document.querySelectorAll('.slot-chip:not(.slot-chip--disabled)').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.slot-chip').forEach(c => c.classList.remove('slot-chip--active'));
      chip.classList.add('slot-chip--active');
      selectedSlot = parseInt(chip.dataset.slot);
      updateTotals();
    });
  });

  // Date tabs
  document.querySelectorAll('.date-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.date-chip').forEach(c => c.classList.remove('filter-chip--active'));
      chip.classList.add('filter-chip--active');
    });
  });

  // Instruction chips
  document.querySelectorAll('.instr-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('filter-chip--active');
    });
  });

  updateTotals();

  // Place order
  const placeOrderBtn = document.getElementById('place-order-btn');
  const placeOrderText = document.getElementById('place-order-text');
  const placeOrderLoader = document.getElementById('place-order-loader');

  placeOrderBtn?.addEventListener('click', async () => {
    const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
    const userId = localStorage.getItem('annsetu_userId');
    if (!userId) return alert('Please log in to checkout');

    if (cart.items.length === 0) return alert('Your cart is empty');

    placeOrderText.style.display = 'none';
    placeOrderLoader.style.display = 'flex';
    placeOrderBtn.disabled = true;

    // Build checkout payload
    const payload = {
      consumerId: userId,
      items: cart.items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
      hubId: 'hub-pune-01', // Example default or user selected hub
      deliveryType: 'home_delivery',
      paymentMethod: selectedPayment
    };

    // Import api logic inside or assume it's imported at top
    // Wait, let's just make sure it's imported at top
    import('../data/api.js').then(async ({ api }) => {
      const res = await api.checkout(payload);

      if (res?.success) {
        cart.items = [];
        cart.coupon = null;
        cart.notify();

        placeOrderBtn.innerHTML = `✓ Order Placed — ${res.orderId}`;
        placeOrderBtn.style.background = 'var(--green-700)';

        let toast = document.getElementById('app-toast');
        if (!toast) { toast = document.createElement('div'); toast.id = 'app-toast'; toast.className = 'toast'; document.body.appendChild(toast); }
        toast.textContent = `🎉 Order ${res.orderId} placed successfully!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
        setTimeout(() => { window.location.hash = '#/orders'; }, 2500);
      } else {
        placeOrderText.style.display = 'block';
        placeOrderLoader.style.display = 'none';
        placeOrderBtn.disabled = false;
        alert(res?.error || 'Checkout failed. An item may be out of stock.');
      }
    });
  });
}

