// Rich Product Detail Page
import { renderAppHeader } from '../components/navbar.js';
import { products, hubs, inventoryBatches } from '../data/mock-data.js';
import { getActiveHub, formatEta, getFreshnessMeta, getDemandMeta, getDynamicPrice, getStockMeta, getBatchForProduct } from '../utils/ops.js';

const mockReviews = [
  { name: 'Anita S.', rating: 5, text: 'Super fresh! Best tomatoes I\'ve had in months.', date: '2 days ago' },
  { name: 'Ravi K.', rating: 4, text: 'Good quality and great taste. Delivery was fast.', date: '5 days ago' },
];

export function renderProductDetail(params) {
  const id = parseInt(params?.id || 1);
  const product = products.find(p => p.id === id) || products[0];
  const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  const activeHub = getActiveHub(hubs, user.hub) || hubs[0];
  const freshness = getFreshnessMeta(product);
  const demand = getDemandMeta(product);
  const dynamic = getDynamicPrice(product);
  const stock = getStockMeta(product);
  const batch = getBatchForProduct(inventoryBatches, product.id, activeHub?.id);
  const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  const hasDiscount = product.originalPrice > product.price;
  const isNearby = product.farmDistance <= 5;
  const stars = n => '★'.repeat(Math.floor(n)) + (n % 1 >= 0.5 ? '½' : '') + '☆'.repeat(5 - Math.ceil(n));

  return `
    ${renderAppHeader(product.name, true)}
    <main class="page-content">
      <!-- Product Image -->
      <div style="height:260px;background:linear-gradient(135deg,var(--green-50) 0%,var(--surface-container) 100%);display:flex;align-items:center;justify-content:center;font-size:6rem;position:relative;">
        ${product.image}
        <div style="position:absolute;top:12px;left:12px;display:flex;align-items:center;gap:4px;background:var(--green-100);padding:4px 10px;border-radius:var(--radius-full);font-size:var(--fs-xs);font-weight:var(--fw-semibold);color:var(--green-700);"><div class="pulse-dot" style="width:6px;height:6px;"></div> ${freshness.label}</div>
        ${isNearby ? `<div style="position:absolute;top:12px;right:12px;background:var(--earth-100);padding:4px 10px;border-radius:var(--radius-full);font-size:var(--fs-xs);font-weight:var(--fw-semibold);color:var(--earth);">From nearby farms</div>` : ''}
      </div>

      <!-- Product Info -->
      <div class="px" style="padding-top:var(--space-4);">
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2);">
          <span class="badge badge--green">${product.category}</span>
          ${product.isOrganic ? `<span class="badge badge--success">🌿 Organic</span>` : ''}
          ${product.isSeasonal ? `<span class="badge badge--orange">🍂 Seasonal</span>` : ''}
        </div>
        <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-extrabold);margin-bottom:var(--space-1);">${product.name}</h1>
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2);">
          <span style="color:var(--orange);font-size:var(--fs-sm);">${stars(product.rating)}</span>
          <span style="font-size:var(--fs-xs);color:var(--text-muted);">${product.rating} (${product.reviewCount} reviews)</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:var(--space-2);margin-bottom:var(--space-4);flex-wrap:wrap;">
          <span style="font-family:var(--font-heading);font-weight:var(--fw-extrabold);font-size:var(--fs-2xl);color:var(--green-700);">₹${dynamic.price}</span>
          <span style="font-size:var(--fs-body);color:var(--text-muted);">per ${product.unit}</span>
          ${demand.multiplier > 0 ? `<span class="badge badge--orange">${demand.label}</span>` : ''}
          ${hasDiscount ? `<span style="font-size:var(--fs-sm);text-decoration:line-through;color:var(--text-muted);">₹${product.originalPrice}</span>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-3);">
          <span class="pill ${stock.tone === 'warning' ? 'pill--warning' : stock.tone === 'error' ? 'pill--error' : 'pill--green'}">${stock.label}</span>
          <span class="pill pill--green">⚡ ${product.deliveryEta} delivery</span>
        </div>
      </div>

      <!-- Farmer Info -->
      <div class="list-item" style="border-top:1px solid var(--border-light);margin:0 var(--space-4);padding-left:0;padding-right:0;">
        <div class="avatar avatar--green">${product.farmer.charAt(0)}</div>
        <div class="list-item__content">
          <div class="list-item__title">${product.farmer}</div>
          <div class="list-item__subtitle">${product.farmLocation} · ${freshness.label}</div>
        </div>
        <span class="badge badge--success" style="font-size:10px;">✓ Verified</span>
      </div>

      <div class="px" style="padding-top:var(--space-4);">
        <div class="card" style="display:flex;gap:var(--space-3);align-items:center;">
          <div style="width:42px;height:42px;border-radius:var(--radius-md);background:var(--green-100);display:flex;align-items:center;justify-content:center;">🏪</div>
          <div style="flex:1;">
            <div style="font-weight:var(--fw-semibold);">Handled at ${activeHub?.name || 'Local Hub'}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">${activeHub?.distanceKm || '0.8'} km away · FIFO batch picking</div>
          </div>
          <span class="pill pill--green">${formatEta(activeHub?.etaMins || 30)}</span>
        </div>
      </div>

      ${batch ? `
        <div class="px" style="padding-top:var(--space-3);">
          <div class="card" style="display:flex;align-items:center;gap:var(--space-3);">
            <div style="width:42px;height:42px;border-radius:var(--radius-md);background:var(--orange-50);display:flex;align-items:center;justify-content:center;">🧺</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-semibold);">Batch ${batch.id} · Grade ${batch.grade}</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);">FIFO ${batch.fifoRank} · Expires ${fmt(batch.expiryAt)}</div>
            </div>
            <span class="pill pill--orange">${batch.remaining} left</span>
          </div>
        </div>
      ` : ''}

      <!-- Nutrition -->
      ${product.nutrition ? `
        <div style="display:flex;gap:var(--space-3);padding:var(--space-4);">
          <div class="card" style="flex:1;text-align:center;padding:var(--space-3);">
            <div style="font-size:var(--fs-lg);font-weight:var(--fw-bold);color:var(--green-700);">${product.nutrition.calories}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Calories</div>
          </div>
          <div class="card" style="flex:1;text-align:center;padding:var(--space-3);">
            <div style="font-size:var(--fs-lg);font-weight:var(--fw-bold);color:var(--earth);">${product.nutrition.protein}g</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Protein</div>
          </div>
          <div class="card" style="flex:1;text-align:center;padding:var(--space-3);">
            <div style="font-size:var(--fs-lg);font-weight:var(--fw-bold);color:var(--orange);">${product.nutrition.fiber}g</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Fiber</div>
          </div>
        </div>
      ` : ''}

      <!-- Price Breakdown -->
      <div class="px" style="padding-bottom:var(--space-4);">
        <div class="card card--green">
          <div style="font-size:var(--fs-sm);font-weight:var(--fw-semibold);color:var(--green-800);margin-bottom:var(--space-3);text-transform:uppercase;letter-spacing:0.05em;">💰 Transparent Pricing</div>
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);color:var(--text-secondary);"><span>Farm Price</span><span>₹${(dynamic.price * 0.72).toFixed(0)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-2);font-size:var(--fs-sm);color:var(--text-secondary);"><span>Hub Processing</span><span>₹${(dynamic.price * 0.15).toFixed(0)}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-3);font-size:var(--fs-sm);color:var(--text-secondary);"><span>Delivery & Platform</span><span>₹${(dynamic.price * 0.13).toFixed(0)}</span></div>
          <div style="display:flex;justify-content:space-between;border-top:1px dashed var(--green-200);padding-top:var(--space-3);font-weight:var(--fw-bold);color:var(--green-800);"><span>You Pay per ${product.unit}</span><span>₹${dynamic.price}</span></div>
        </div>
      </div>

      <!-- Quality Badges -->
      <div style="display:flex;gap:var(--space-3);padding:0 var(--space-4) var(--space-4);overflow-x:auto;">
        <div class="card" style="flex:1;text-align:center;padding:var(--space-3);"><div style="font-size:1.3rem;">🌿</div><div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">${product.isOrganic ? 'Organic' : 'Natural'}</div></div>
        <div class="card" style="flex:1;text-align:center;padding:var(--space-3);"><div style="font-size:1.3rem;">🚚</div><div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">${product.deliveryEta}</div></div>
        <div class="card" style="flex:1;text-align:center;padding:var(--space-3);"><div style="font-size:1.3rem;">🔁</div><div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">FIFO Batch</div></div>
      </div>

      <hr class="divider" />

      <!-- Reviews -->
      <div class="section-header"><span class="section-header__title">Reviews</span></div>
      <div class="stack" style="padding-bottom:var(--space-4);">
        ${mockReviews.map(r => `
          <div class="card" style="padding:var(--space-3);">
            <div style="display:flex;justify-content:space-between;margin-bottom:var(--space-1);">
              <span style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">${r.name}</span>
              <span style="font-size:var(--fs-xs);color:var(--text-muted);">${r.date}</span>
            </div>
            <div style="color:var(--orange);font-size:var(--fs-xs);margin-bottom:var(--space-1);">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
            <div style="font-size:var(--fs-sm);color:var(--text-secondary);">${r.text}</div>
          </div>
        `).join('')}
      </div>

      <hr class="divider" />

      <!-- Related -->
      ${related.length > 0 ? `
        <div class="section-header"><span class="section-header__title">You may also like</span></div>
        <div class="h-scroll" style="padding-bottom:var(--space-4);">
          ${related.map(p => `
            <a href="#/product/${p.id}" class="product-card" style="min-width:160px;">
              <div class="product-card__image" style="height:100px;">${p.image}</div>
              <div class="product-card__body">
                <div class="product-card__name">${p.name}</div>
                <div class="product-card__price">₹${p.price}<span>/${p.unit}</span></div>
              </div>
            </a>
          `).join('')}
        </div>
      ` : ''}

      <!-- Sticky Add to Cart -->
      <div style="position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:rgba(255,255,255,0.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-top:1px solid var(--border-light);padding:var(--space-3) var(--space-4) calc(var(--space-3) + var(--safe-bottom));display:flex;gap:var(--space-3);align-items:center;z-index:50;">
        <div style="display:flex;align-items:center;border:1.5px solid var(--green-200);background:var(--bg-card);border-radius:var(--radius-full);overflow:hidden;padding:2px;">
          <button class="cart-item__qty-btn" id="qty-minus" style="border:none;border-radius:var(--radius-full);width:36px;height:36px;background:transparent;color:var(--green-700);">−</button>
          <span id="qty-display" style="width:28px;text-align:center;font-weight:var(--fw-bold);font-size:var(--fs-body);">1</span>
          <button class="cart-item__qty-btn" id="qty-plus" style="border:none;border-radius:var(--radius-full);width:36px;height:36px;background:var(--green-50);color:var(--green-700);">+</button>
        </div>
        <button class="btn btn-primary btn-lg" style="flex:1;border-radius:var(--radius-full);" id="add-to-cart-main">Add to Cart · ₹<span id="cart-price">${dynamic.price}</span></button>
      </div>
    </main>
  `;
}

export function initProductDetail(params) {
  const id = parseInt(params?.id || 1);
  const product = products.find(p => p.id === id) || products[0];
  const dynamic = getDynamicPrice(product);
  let qty = 1;
  const qtyDisplay = document.getElementById('qty-display');
  const priceDisplay = document.getElementById('cart-price');

  document.getElementById('qty-minus')?.addEventListener('click', () => {
    if (qty > 1) { qty--; qtyDisplay.textContent = qty; priceDisplay.textContent = dynamic.price * qty; }
  });
  document.getElementById('qty-plus')?.addEventListener('click', () => {
    qty++; qtyDisplay.textContent = qty; priceDisplay.textContent = dynamic.price * qty;
  });
  document.getElementById('add-to-cart-main')?.addEventListener('click', () => {
    for (let i = 0; i < qty; i++) window.addProductToCart(product.id);
  });
}
