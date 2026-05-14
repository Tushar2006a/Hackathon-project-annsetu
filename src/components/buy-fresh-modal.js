import { cart } from '../data/mock-data.js';

export function renderBuyFreshModal() {
  return `
    <div id="buy-fresh-modal" class="modal-backdrop" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:9999;align-items:flex-end;justify-content:center;backdrop-filter:blur(2px);opacity:0;transition:opacity 0.3s ease;">
      <div id="buy-fresh-sheet" style="width:100%;max-width:500px;background:#fff;border-radius:24px 24px 0 0;padding:24px;transform:translateY(100%);transition:transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);max-height:90vh;overflow-y:auto;">
        
        <div style="width:40px;height:4px;background:var(--border-light);border-radius:2px;margin:0 auto 20px;"></div>
        
        <div id="buy-fresh-content">
          <!-- Populated dynamically -->
        </div>

      </div>
    </div>
  `;
}

export function openBuyFreshModal(product) {
  let modal = document.getElementById('buy-fresh-modal');
  if (!modal) {
    document.body.insertAdjacentHTML('beforeend', renderBuyFreshModal());
    modal = document.getElementById('buy-fresh-modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeBuyFreshModal();
    });
  }

  const content = document.getElementById('buy-fresh-content');
  
  // Base calculations
  let qty = 1;
  const pricePerKg = Number(product.price);
  const packagingFee = 5;
  const platformFee = 2;
  
  function renderContent() {
    const subtotal = pricePerKg * qty;
    const total = subtotal + packagingFee + platformFee;

    content.innerHTML = `
      <div style="display:flex;gap:16px;margin-bottom:20px;">
        <div style="width:80px;height:80px;border-radius:12px;overflow:hidden;background:var(--bg-secondary);flex-shrink:0;">
          ${product.img 
            ? `<img src="${product.img}" style="width:100%;height:100%;object-fit:cover;"/>` 
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">🌿</div>`}
        </div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <h2 style="margin:0;font-size:1.2rem;font-weight:700;">${product.name}</h2>
            <button onclick="document.getElementById('buy-fresh-modal').click()" style="background:none;border:none;font-size:1.5rem;color:var(--text-muted);cursor:pointer;line-height:1;">&times;</button>
          </div>
          <div style="color:var(--text-muted);font-size:0.9rem;margin-bottom:4px;">by ${product.farmerName}</div>
          <div style="color:var(--green-700);font-weight:600;">₹${pricePerKg}/${product.unit}</div>
        </div>
      </div>

      <div style="background:var(--green-50);padding:12px;border-radius:8px;margin-bottom:20px;display:flex;gap:12px;align-items:center;">
        <span style="font-size:1.5rem;">🚚</span>
        <div>
          <div style="font-weight:600;font-size:0.9rem;color:var(--green-800);">Available at ${product.hubName || 'Nearest Hub'}</div>
          <div style="font-size:0.8rem;color:var(--green-700);">Freshly harvested · Pickup ready in 2 hrs</div>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block;font-weight:600;margin-bottom:8px;font-size:0.95rem;">Select Quantity (${product.unit})</label>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
          ${[0.5, 1, 2, 5].map(q => `
            <button type="button" class="qty-btn ${qty === q ? 'active' : ''}" data-qty="${q}" style="flex:1;min-width:60px;padding:10px 0;border:1px solid ${qty === q ? 'var(--green-600)' : 'var(--border-light)'};background:${qty === q ? 'var(--green-50)' : '#fff'};color:${qty === q ? 'var(--green-700)' : 'var(--text-primary)'};border-radius:8px;font-weight:600;cursor:pointer;transition:all 0.2s;">
              ${q}${product.unit}
            </button>
          `).join('')}
        </div>
      </div>

      <div style="background:var(--bg-secondary);padding:16px;border-radius:12px;margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;">
          <span style="color:var(--text-muted);">Subtotal</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.9rem;">
          <span style="color:var(--text-muted);">Packaging</span>
          <span>₹${packagingFee.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;font-size:0.9rem;">
          <span style="color:var(--text-muted);">Handling Fee</span>
          <span>₹${platformFee.toFixed(2)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;border-top:1px dashed var(--border-light);padding-top:12px;font-weight:700;font-size:1.1rem;">
          <span>Total Estimate</span>
          <span>₹${total.toFixed(2)}</span>
        </div>
      </div>

      <button id="add-to-cart-action" class="btn btn-primary btn-full btn-lg" style="box-shadow:0 8px 16px rgba(10,132,60,0.2);">
        Add to Cart · ₹${total.toFixed(2)}
      </button>
    `;

    // Attach listeners
    content.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        qty = Number(e.currentTarget.dataset.qty);
        renderContent();
      });
    });

    document.getElementById('add-to-cart-action').addEventListener('click', () => {
      // Create a standard product object to use with existing cart logic
      const cartItem = {
         id: product.id,
         name: product.name,
         price: pricePerKg,
         stock: 100, // Or whatever stock limit
         image: product.img ? `<img src="${product.img}" style="width:30px;height:30px;border-radius:4px;object-fit:cover;"/>` : '🌿',
         originalPrice: pricePerKg
      };
      cart.add(cartItem, qty);
      closeBuyFreshModal();
      showToast('✅ Added to Cart!');
    });
  }

  renderContent();

  modal.style.display = 'flex';
  // Trigger reflow
  modal.offsetHeight;
  modal.style.opacity = '1';
  document.getElementById('buy-fresh-sheet').style.transform = 'translateY(0)';
}

export function closeBuyFreshModal() {
  const modal = document.getElementById('buy-fresh-modal');
  if (!modal) return;
  modal.style.opacity = '0';
  document.getElementById('buy-fresh-sheet').style.transform = 'translateY(100%)';
  setTimeout(() => {
    modal.style.display = 'none';
  }, 400);
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
