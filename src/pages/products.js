// Enhanced Products Listing
import { renderAppHeader, renderBottomNav, getUserRole } from '../components/navbar.js';
import { products, categories, cart, hubs, inventoryBatches } from '../data/mock-data.js';
import { getActiveHub, getFreshnessMeta, getDemandMeta, getDynamicPrice, getStockMeta, getBatchForProduct } from '../utils/ops.js';

let currentSort = 'default';

export function renderProducts() {
  const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  const activeHub = getActiveHub(hubs, user.hub) || hubs[0];
  return `
    ${renderAppHeader('Shop', true)}
    <main class="page-content">
      <div class="px" style="padding-top:var(--space-3);padding-bottom:0;">
        <input type="text" class="input" placeholder="Search products, farmers..." id="product-search" style="background:var(--bg-secondary);border-color:transparent;" />
      </div>

      <!-- Sort Row -->
      <div style="display:flex;align-items:center;justify-content:space-between;padding:var(--space-2) var(--space-4) 0;">
        <span style="font-size:var(--fs-xs);color:var(--text-muted);" id="product-count">${products.length} products</span>
        <select id="sort-select" style="font-size:var(--fs-xs);color:var(--green-700);font-weight:var(--fw-semibold);background:var(--green-50);padding:4px 8px;border-radius:var(--radius-full);border:1px solid var(--green-200);">
          <option value="default">Sort by</option>
          <option value="price-low">Price: Low→High</option>
          <option value="price-high">Price: High→Low</option>
          <option value="freshness">Freshness</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div class="filter-bar" id="filter-bar">
        ${categories.map((c, i) => `
          <button class="filter-chip ${i === 0 ? 'filter-chip--active' : ''}" data-category="${c}">${c}</button>
        `).join('')}
      </div>

      <div class="filter-bar" id="ops-filter-bar" style="padding-top:0;">
        <button class="filter-chip" data-filter="fresh">Harvested Today</button>
        <button class="filter-chip" data-filter="nearby">Nearby Farms</button>
        <button class="filter-chip" data-filter="low">Low Stock</button>
        <button class="filter-chip" data-filter="fast">Fast Delivery</button>
        <button class="filter-chip" data-filter="sub">Subscribable</button>
      </div>

      <div class="products-grid" id="products-grid" style="padding-bottom:var(--space-4);">
        ${products.map(p => renderProductCard(p, activeHub?.id)).join('')}
      </div>
    </main>
    ${cart.count > 0 ? renderCartFloat() : ''}
    ${renderBottomNav('products', getUserRole())}
  `;
}

function renderProductCard(p, hubId) {
  const hasDiscount = p.originalPrice > p.price;
  const isNearby = p.farmDistance <= 5;
  const freshness = getFreshnessMeta(p);
  const demand = getDemandMeta(p);
  const dynamic = getDynamicPrice(p);
  const stock = getStockMeta(p);
  const batch = getBatchForProduct(inventoryBatches, p.id, hubId);
  const showDynamic = demand.multiplier > 0;
  return `
    <a href="#/product/${p.id}" class="product-card">
      <div class="product-card__image">
        ${p.image}
        ${p.freshness === 'Harvested Today' ? `<div class="product-card__freshness">Today</div>` : ''}
        ${isNearby ? `<div class="pill pill--earth" style="position:absolute;top:8px;right:8px;">Nearby</div>` : ''}
      </div>
      <div class="product-card__body">
        <div style="display:flex;align-items:center;gap:4px;margin-bottom:2px;">
          <span class="product-card__category">${p.category}</span>
          <span class="pill pill--green" style="padding:2px 6px;font-size:10px;">${p.deliveryEta}</span>
        </div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__farmer">by ${p.farmer} · Farmer sourced</div>
        <div class="price-stack" style="margin-top:var(--space-2);">
          <span class="price-stack__current">₹${showDynamic ? dynamic.price : p.price}<span style="font-size:var(--fs-xs);color:var(--text-muted);font-weight:var(--fw-regular);">/${p.unit}</span></span>
          ${showDynamic ? `<span class="price-stack__original">₹${p.price}</span>` : hasDiscount ? `<span class="price-stack__original">₹${p.originalPrice}</span>` : ''}
          ${showDynamic ? `<span class="price-stack__meta">${demand.label}</span>` : ''}
        </div>
        <div class="product-card__footer" style="border-top:none;padding-top:var(--space-2);">
          <span class="pill ${stock.tone === 'warning' ? 'pill--warning' : stock.tone === 'error' ? 'pill--error' : 'pill--green'}">${stock.label}</span>
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${p.id}" onclick="event.preventDefault();event.stopPropagation();">Add</button>
        </div>
        ${batch ? `<div class="product-card__stock-warning">Batch ${batch.grade} · FIFO ${batch.fifoRank}</div>` : ''}
      </div>
    </a>
  `;
}

function renderCartFloat() {
  return `
    <div class="cart-float" onclick="window.location.hash='#/cart';">
      <div class="cart-float__left">
        <span class="cart-float__count">${cart.count} items</span>
        <span class="cart-float__label">View Cart</span>
      </div>
      <div class="cart-float__right">
        <span class="cart-float__total">₹${cart.total}</span>
        <span>→</span>
      </div>
    </div>
  `;
}

function getFilteredProducts(category, query, sort, filter) {
  let result = [...products];
  if (category && category !== 'All') result = result.filter(p => p.category === category);
  if (query) {
    const q = query.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(q) || p.farmer.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }
  if (filter === 'fresh') result = result.filter(p => p.freshness === 'Harvested Today');
  if (filter === 'nearby') result = result.filter(p => p.farmDistance <= 5);
  if (filter === 'low') result = result.filter(p => p.stock <= 10);
  if (filter === 'fast') result = result.filter(p => String(p.deliveryEta).includes('20') || String(p.deliveryEta).includes('30'));
  if (filter === 'sub') result = result.filter(p => p.isSubscribable);
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  else if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  else if (sort === 'freshness') result.sort((a, b) => (a.freshness === 'Harvested Today' ? -1 : 1));
  else if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
  return result;
}

export function initProducts() {
  let activeCategory = 'All';
  let searchQuery = '';
  let activeFilter = '';

  function refresh() {
    const filtered = getFilteredProducts(activeCategory, searchQuery, currentSort, activeFilter);
    const grid = document.getElementById('products-grid');
    const count = document.getElementById('product-count');
    const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
    const activeHub = getActiveHub(hubs, user.hub) || hubs[0];
    if (grid) grid.innerHTML = filtered.length > 0 ? filtered.map(p => renderProductCard(p, activeHub?.id)).join('') : `<div class="empty-state" style="grid-column:1/-1;"><div class="empty-state__icon">🔍</div><p class="empty-state__text">No products found</p></div>`;
    if (count) count.textContent = `${filtered.length} products`;
    attachAddToCart();
  }

  document.getElementById('filter-bar')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
    chip.classList.add('filter-chip--active');
    activeCategory = chip.dataset.category;
    refresh();
  });

  document.getElementById('product-search')?.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    refresh();
  });

  document.getElementById('sort-select')?.addEventListener('change', (e) => {
    currentSort = e.target.value;
    refresh();
  });

  document.getElementById('ops-filter-bar')?.addEventListener('click', (e) => {
    const chip = e.target.closest('.filter-chip');
    if (!chip) return;
    document.querySelectorAll('#ops-filter-bar .filter-chip').forEach(c => c.classList.remove('filter-chip--active'));
    if (activeFilter === chip.dataset.filter) {
      activeFilter = '';
      refresh();
      return;
    }
    chip.classList.add('filter-chip--active');
    activeFilter = chip.dataset.filter;
    refresh();
  });

  attachAddToCart();
}

function attachAddToCart() {
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.addProductToCart(parseInt(btn.dataset.productId));
    });
  });
}
