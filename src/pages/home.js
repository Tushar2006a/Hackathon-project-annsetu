// Consumer Homepage — Premium Ops Dashboard
import { renderAppHeader, renderBottomNav, getUserRole } from '../components/navbar.js';
import { products, stats, testimonials, banners, cart, hubs, inventoryBatches, smartOpsSignals } from '../data/mock-data.js';
import { getActiveHub, formatEta, getFreshnessMeta, getDemandMeta, getDynamicPrice, getStockMeta, getBatchForProduct } from '../utils/ops.js';
import { api } from '../data/api.js';
import { openBuyFreshModal } from '../components/buy-fresh-modal.js';

export function renderHome() {
  const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  const activeHub = getActiveHub(hubs, user.hub) || hubs[0];

  const freshArrivals = products.filter(p => p.freshness === 'Harvested Today').slice(0, 6);
  const seasonal = products.filter(p => p.isSeasonal).slice(0, 4);
  const subscribable = products.filter(p => p.isSubscribable).slice(0, 4);
  const essentials = products.filter(p => ['Grains', 'Dairy'].includes(p.category)).slice(0, 4);
  const deals = products.filter(p => p.originalPrice > p.price).slice(0, 4);
  const quickDelivery = products.filter(p => p.deliveryEta === '30 min' || p.deliveryEta === '20 min').slice(0, 6);
  const nearbyStock = products.filter(p => p.farmDistance <= 5).slice(0, 6);
  const recommended = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const expiring = inventoryBatches
    .filter(b => (new Date(b.expiryAt).getTime() - Date.now()) < 36 * 3600000)
    .map(b => products.find(p => p.id === b.productId))
    .filter(Boolean)
    .slice(0, 4);

  const cats = [
    { name: 'Vegetables', emoji: '🥬', color: 'var(--green-100)' },
    { name: 'Fruits', emoji: '🍎', color: '#fef2f2' },
    { name: 'Dairy', emoji: '🥛', color: 'var(--orange-50)' },
    { name: 'Grains', emoji: '🌾', color: 'var(--earth-100)' },
    { name: 'Leafy Greens', emoji: '🌿', color: 'var(--green-50)' },
  ];

  return `
    ${renderAppHeader()}
    <main class="page-content">
      <div class="px" style="padding-top:var(--space-3);">
        <div class="hub-banner">
          <div class="pulse-dot"></div>
          <div class="hub-banner__meta">
            <div class="hub-banner__title">${activeHub.name}</div>
            <div class="hub-banner__subtitle">${activeHub.distanceKm} km · ${formatEta(activeHub.etaMins)} · ${activeHub.load.current}/${activeHub.load.capacity} live orders</div>
          </div>
          <span class="pill pill--green">ETA ${formatEta(activeHub.etaMins)}</span>
        </div>
      </div>

      <div style="padding:var(--space-4) var(--space-4) var(--space-2);">
        <div class="section-kicker">${greeting}${user.name ? ', ' + user.name.split(' ')[0] + ' 👋' : ' 👋'}</div>
        <h1 style="font-family:var(--font-heading);font-size:var(--fs-2xl);font-weight:var(--fw-extrabold);margin-bottom:var(--space-3);color:var(--dark);">Fresh picks from nearby farms</h1>
        <div style="position:relative;">
          <input type="text" class="input" placeholder="Search vegetables, fruits, dairy..." id="home-search" style="padding-left:40px;background:var(--bg-secondary);border-color:transparent;" />
          <svg style="position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted);" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        </div>
      </div>

      <!-- Just Added by Farmers (loaded async) -->
      <div id="just-added-section" style="display:none;">
        <div class="section-header">
          <span class="section-header__title">🌿 Just Added by Farmers</span>
          <span class="section-header__link" style="color:var(--green-600);font-size:var(--fs-xs);">Live</span>
        </div>
        <div id="just-added-feed" class="h-scroll" style="padding-bottom:var(--space-3);gap:var(--space-3);"></div>
        <hr class="divider" />
      </div>

      <div style="padding:var(--space-2) var(--space-4) var(--space-3);">
        <div style="display:flex;gap:var(--space-3);overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;">
          ${cats.map(c => `
            <a href="#/products?cat=${encodeURIComponent(c.name)}" style="display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:inherit;flex-shrink:0;">
              <div style="width:52px;height:52px;border-radius:var(--radius-lg);background:${c.color};display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:var(--shadow-xs);">${c.emoji}</div>
              <span style="font-size:var(--fs-xs);font-weight:var(--fw-medium);">${c.name}</span>
            </a>
          `).join('')}
        </div>
      </div>

      <div class="section-header" style="padding-bottom:var(--space-2);">
        <span class="section-header__title">Ops Pulse</span>
        <span class="section-header__link">Live</span>
      </div>
      <div class="ops-strip" style="padding-bottom:var(--space-4);">
        ${smartOpsSignals.map(s => renderOpsCard(s)).join('')}
      </div>

      <div class="banner-carousel" id="banner-carousel">
        <div class="banner-carousel__track" id="banner-track">
          ${banners.map(b => `
            <div class="banner-carousel__slide" style="background:${b.gradient};color:${b.color};">
              <div style="font-family:var(--font-heading);font-size:var(--fs-xl);font-weight:var(--fw-extrabold);line-height:1.2;white-space:pre-line;margin-bottom:var(--space-2);">${b.title}</div>
              <div style="font-size:var(--fs-sm);opacity:0.9;margin-bottom:var(--space-3);">${b.subtitle}</div>
              <div><span style="background:rgba(255,255,255,0.25);padding:6px 14px;border-radius:var(--radius-full);font-size:var(--fs-sm);font-weight:var(--fw-semibold);">${b.cta} →</span></div>
            </div>
          `).join('')}
        </div>
        <div class="banner-carousel__dots" id="banner-dots">
          ${banners.map((_, i) => `<div class="banner-carousel__dot ${i === 0 ? 'banner-carousel__dot--active' : ''}" data-slide="${i}"></div>`).join('')}
        </div>
      </div>

      <div style="height:var(--space-4);"></div>

      <div class="section-header">
        <span class="section-header__title">⚡ Express Delivery</span>
        <a href="#/products" class="section-header__link">See All →</a>
      </div>
      <div class="h-scroll" style="padding-bottom:var(--space-3);">
        ${quickDelivery.map(p => renderMiniCard(p)).join('')}
      </div>

      <hr class="divider" />

      <div class="section-header">
        <span class="section-header__title">Nearby Fresh Stock</span>
        <a href="#/products" class="section-header__link">View →</a>
      </div>
      <div class="h-scroll" style="padding-bottom:var(--space-3);">
        ${nearbyStock.map(p => renderMiniCard(p)).join('')}
      </div>

      <hr class="divider" />

      <div class="section-header">
        <span class="section-header__title">Fresh Arrivals</span>
        <a href="#/products" class="section-header__link">See All →</a>
      </div>
      <div class="products-grid" style="padding-bottom:var(--space-4);">
        ${freshArrivals.slice(0, 4).map(p => renderProductCard(p, activeHub?.id)).join('')}
      </div>

      <hr class="divider" />

      <div class="section-header">
        <span class="section-header__title">Subscribe & Save</span>
        <a href="#/subscriptions" class="section-header__link">View Plans →</a>
      </div>
      <div class="h-scroll" style="padding-bottom:var(--space-4);">
        ${subscribable.map(p => `
          <a href="#/product/${p.id}" style="min-width:160px;background:var(--green-50);border:1px solid var(--green-200);border-radius:var(--radius-lg);padding:var(--space-3);text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center;text-align:center;">
            <div style="font-size:2.2rem;margin-bottom:var(--space-2);">${p.image}</div>
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);margin-bottom:2px;">${p.name}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-bottom:var(--space-2);">₹${p.price}/${p.unit}</div>
            <span class="btn btn-primary btn-sm" style="padding:4px 12px;font-size:11px;min-height:28px;">Start Plan</span>
          </a>
        `).join('')}
      </div>

      <hr class="divider" />

      ${seasonal.length > 0 ? `
        <div class="section-header">
          <span class="section-header__title">Seasonal Picks</span>
        </div>
        <div class="h-scroll" style="padding-bottom:var(--space-4);">
          ${seasonal.map(p => renderMiniCard(p)).join('')}
        </div>
        <hr class="divider" />
      ` : ''}

      ${expiring.length > 0 ? `
        <div class="section-header">
          <span class="section-header__title">Expiry Specials</span>
          <span class="section-header__link">Auto-discount</span>
        </div>
        <div class="h-scroll" style="padding-bottom:var(--space-4);">
          ${expiring.map(p => renderMiniCard(p)).join('')}
        </div>
        <hr class="divider" />
      ` : ''}

      <div class="section-header">
        <span class="section-header__title">Daily Essentials</span>
        <a href="#/products" class="section-header__link">See All →</a>
      </div>
      <div class="products-grid" style="padding-bottom:var(--space-4);">
        ${essentials.map(p => renderProductCard(p, activeHub?.id)).join('')}
      </div>

      <hr class="divider" />

      ${deals.length > 0 ? `
        <div class="section-header">
          <span class="section-header__title">Deals & Combos</span>
        </div>
        <div class="h-scroll" style="padding-bottom:var(--space-4);">
          ${deals.map(p => `
            <a href="#/product/${p.id}" style="min-width:160px;background:var(--orange-50);border:1px solid var(--orange-100);border-radius:var(--radius-lg);overflow:hidden;text-decoration:none;color:inherit;">
              <div style="height:90px;background:linear-gradient(135deg,var(--orange-50),var(--green-50));display:flex;align-items:center;justify-content:center;font-size:2.5rem;position:relative;">
                ${p.image}
                <span style="position:absolute;top:6px;right:6px;background:var(--orange);color:#fff;padding:2px 6px;border-radius:var(--radius-sm);font-size:10px;font-weight:var(--fw-bold);">${Math.round((1 - p.price/p.originalPrice)*100)}% OFF</span>
              </div>
              <div style="padding:var(--space-2) var(--space-3);">
                <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);">${p.name}</div>
                <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
                  <span style="font-weight:var(--fw-bold);color:var(--green-700);">₹${p.price}</span>
                  <span style="font-size:var(--fs-xs);text-decoration:line-through;color:var(--text-muted);">₹${p.originalPrice}</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
        <hr class="divider" />
      ` : ''}

      <div class="section-header">
        <span class="section-header__title">Recommended For You</span>
        <a href="#/products" class="section-header__link">Explore →</a>
      </div>
      <div class="products-grid" style="padding-bottom:var(--space-4);">
        ${recommended.map(p => renderProductCard(p, activeHub?.id)).join('')}
      </div>

      <hr class="divider" />

      <div class="stats-grid" style="padding-top:var(--space-4);padding-bottom:var(--space-4);">
        <div class="stat-widget">
          <div style="font-size:1.3rem;margin-bottom:var(--space-1);">🌾</div>
          <div class="stat-widget__value">${stats.farmers.toLocaleString()}+</div>
          <div class="stat-widget__label">Farmers</div>
        </div>
        <div class="stat-widget">
          <div style="font-size:1.3rem;margin-bottom:var(--space-1);">🏪</div>
          <div class="stat-widget__value">${stats.hubs}+</div>
          <div class="stat-widget__label">Hubs</div>
        </div>
        <div class="stat-widget">
          <div style="font-size:1.3rem;margin-bottom:var(--space-1);">📦</div>
          <div class="stat-widget__value">${(stats.orders/1000).toFixed(1)}K</div>
          <div class="stat-widget__label">Orders</div>
        </div>
        <div class="stat-widget">
          <div style="font-size:1.3rem;margin-bottom:var(--space-1);">❤️</div>
          <div class="stat-widget__value">${(stats.families/1000).toFixed(1)}K</div>
          <div class="stat-widget__label">Families</div>
        </div>
      </div>

      <hr class="divider" />

      <div class="section-header"><span class="section-header__title">How It Works</span></div>
      <div class="stack" style="padding-bottom:var(--space-4);">
        <div class="card" style="display:flex;gap:var(--space-3);align-items:center;">
          <div style="width:44px;height:44px;border-radius:var(--radius-md);background:var(--green-100);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🌱</div>
          <div>
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);margin-bottom:2px;">Farmers list produce</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Direct from farms, with transparent pricing</div>
          </div>
        </div>
        <div class="card" style="display:flex;gap:var(--space-3);align-items:center;">
          <div style="width:44px;height:44px;border-radius:var(--radius-md);background:var(--orange-100);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🏪</div>
          <div>
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);margin-bottom:2px;">Hubs collect & sort</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Local hubs handle quality & logistics</div>
          </div>
        </div>
        <div class="card" style="display:flex;gap:var(--space-3);align-items:center;">
          <div style="width:44px;height:44px;border-radius:var(--radius-md);background:var(--earth-100);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0;">🏠</div>
          <div>
            <div style="font-weight:var(--fw-semibold);font-size:var(--fs-body);margin-bottom:2px;">Families receive fresh</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">Doorstep delivery, full farm-to-table transparency</div>
          </div>
        </div>
      </div>

      <hr class="divider" />

      <div class="section-header"><span class="section-header__title">Community Voices</span></div>
      <div class="h-scroll" style="padding-bottom:var(--space-5);">
        ${testimonials.map(t => `
          <div class="testimonial-card">
            <div class="testimonial-card__quote">"${t.quote}"</div>
            <div class="testimonial-card__author">
              <div class="avatar avatar--green">${t.initials}</div>
              <div>
                <div class="testimonial-card__name">${t.name}</div>
                <div class="testimonial-card__role">${t.role}</div>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </main>

    ${cart.count > 0 ? renderCartFloat() : ''}
    ${renderBottomNav('home', getUserRole())}
  `;
}

function renderProductCard(p, hubId) {
  const freshness = getFreshnessMeta(p);
  const demand = getDemandMeta(p);
  const dynamic = getDynamicPrice(p);
  const stock = getStockMeta(p);
  const batch = getBatchForProduct(inventoryBatches, p.id, hubId);
  const hasDiscount = p.originalPrice > p.price;
  const showDynamic = demand.multiplier > 0;

  return `
    <a href="#/product/${p.id}" class="product-card">
      <div class="product-card__image">
        ${p.image}
        <div class="product-card__freshness">${freshness.label}</div>
        ${p.farmDistance <= 5 ? `<div class="pill pill--earth" style="position:absolute;top:8px;right:8px;">Nearby</div>` : ''}
      </div>
      <div class="product-card__body">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;">
          <span class="product-card__category">${p.category}</span>
          <span class="pill pill--green">${p.deliveryEta}</span>
        </div>
        <div class="product-card__name">${p.name}</div>
        <div class="product-card__farmer">by ${p.farmer} · Farmer sourced</div>
        <div class="price-stack">
          <span class="price-stack__current">₹${showDynamic ? dynamic.price : p.price}<span style="font-size:var(--fs-xs);color:var(--text-muted);font-weight:var(--fw-regular);">/${p.unit}</span></span>
          ${showDynamic ? `<span class="price-stack__original">₹${p.price}</span>` : hasDiscount ? `<span class="price-stack__original">₹${p.originalPrice}</span>` : ''}
          ${showDynamic ? `<span class="price-stack__meta">${demand.label}</span>` : ''}
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding-top:var(--space-2);">
          <span class="pill ${stock.tone === 'warning' ? 'pill--warning' : stock.tone === 'error' ? 'pill--error' : 'pill--green'}">${stock.label}</span>
          <button class="btn btn-primary btn-sm add-to-cart-btn" data-product-id="${p.id}" onclick="event.preventDefault();event.stopPropagation();">Add</button>
        </div>
        ${batch ? `<div class="product-card__stock-warning">Batch ${batch.grade} · FIFO ${batch.fifoRank}</div>` : ''}
      </div>
    </a>
  `;
}

function renderMiniCard(p) {
  const dynamic = getDynamicPrice(p);
  const demand = getDemandMeta(p);
  return `
    <a href="#/product/${p.id}" style="min-width:140px;background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);overflow:hidden;text-decoration:none;color:inherit;box-shadow:var(--shadow-xs);">
      <div style="height:86px;background:linear-gradient(135deg,var(--green-50),var(--surface-container));display:flex;align-items:center;justify-content:center;font-size:2.2rem;position:relative;">
        ${p.image}
        ${demand.multiplier > 0 ? `<span class="pill pill--orange" style="position:absolute;top:6px;right:6px;">Peak</span>` : ''}
      </div>
      <div style="padding:var(--space-2) var(--space-3) var(--space-3);">
        <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);margin-bottom:2px;" class="truncate">${p.name}</div>
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <span style="font-weight:var(--fw-bold);font-size:var(--fs-sm);color:var(--green-700);">₹${demand.multiplier > 0 ? dynamic.price : p.price}</span>
          <span class="pill pill--green" style="padding:2px 6px;font-size:10px;">${p.deliveryEta}</span>
        </div>
      </div>
    </a>
  `;
}

function renderOpsCard(signal) {
  return `
    <div class="ops-card ${signal.status === 'warn' ? 'ops-card--warn' : ''}">
      <div class="ops-card__label">${signal.label}</div>
      <div class="ops-card__value">${signal.value}</div>
      <div class="ops-card__detail">${signal.detail}</div>
    </div>
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

export function initHome() {
  // Banner carousel
  const track = document.getElementById('banner-track');
  const dots = document.querySelectorAll('.banner-carousel__dot');
  if (track && dots.length) {
    let current = 0;
    const total = dots.length;
    setInterval(() => {
      current = (current + 1) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('banner-carousel__dot--active', i === current));
    }, 4000);
    dots.forEach(d => d.addEventListener('click', () => {
      current = parseInt(d.dataset.slide);
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((dd, i) => dd.classList.toggle('banner-carousel__dot--active', i === current));
    }));
  }

  // Load Just Added by Farmers feed
  loadJustAdded();
}

async function loadJustAdded() {
  const section = document.getElementById('just-added-section');
  const feed    = document.getElementById('just-added-feed');
  if (!section || !feed) return;

  const res = await api.getHubInventory().catch(() => null);
  const inventory = res?.inventory || [];
  if (!inventory.length) return;

  section.style.display = 'block';
  // Change section title to reflect Hub Stock
  const headerTitle = section.querySelector('.section-header__title');
  if (headerTitle) headerTitle.innerHTML = '🏪 Available at Nearest Hubs';

  feed.innerHTML = inventory.map(p => {
    const imgHtml = p.image_data
      ? `<img src="${p.image_data}" alt="${p.product_name}" style="width:100%;height:110px;object-fit:cover;" />`
      : `<div style="width:100%;height:110px;background:linear-gradient(135deg,var(--green-50),var(--earth-100));display:flex;align-items:center;justify-content:center;font-size:2.5rem;">🌿</div>`;
    return `
      <div style="min-width:150px;max-width:150px;background:var(--bg-card);border:1px solid var(--border-light);border-radius:var(--radius-lg);overflow:hidden;box-shadow:var(--shadow-xs);flex-shrink:0;">
        ${imgHtml}
        <div style="padding:var(--space-2) var(--space-3) var(--space-3);">
          <div style="font-weight:var(--fw-semibold);font-size:var(--fs-sm);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.product_name}</div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:var(--space-2);">
            <span style="font-weight:var(--fw-bold);color:var(--green-700);font-size:var(--fs-sm);">₹${p.price_per_kg}/kg</span>
          </div>
          <div style="font-size:9px;color:var(--green-600);margin-top:2px;font-weight:var(--fw-semibold);">🟢 ${p.available_stock} kg left</div>
          <button class="buy-fresh-btn" 
                  data-id="${p.id}" 
                  data-name="${p.product_name}"
                  data-price="${p.price_per_kg}"
                  data-unit="kg"
                  data-img="${p.image_data || ''}"
                  style="width:100%;border:none;cursor:pointer;display:block;margin-top:var(--space-2);background:var(--green-600);color:#fff;text-align:center;padding:6px 8px;border-radius:var(--radius-sm);font-size:10px;font-weight:var(--fw-bold);text-decoration:none;">
            Buy Fresh →
          </button>
        </div>
      </div>`;
  }).join('');

  // Attach click listeners for instant purchase
  feed.querySelectorAll('.buy-fresh-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const b = e.currentTarget;
      const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
      const userId = localStorage.getItem('annsetu_userId');
      
      if (!userId) {
        alert('Please login to buy produce.');
        return;
      }

      b.disabled = true;
      b.textContent = 'Processing...';

      const payload = {
        id: b.dataset.id,
        farmerId: b.dataset.farmerId,
        farmerName: b.dataset.farmerName,
        name: b.dataset.name,
        price: b.dataset.price,
        unit: b.dataset.unit,
        hubId: b.dataset.hubId,
        hubName: b.dataset.hubName,
        img: b.dataset.img
      };

      openBuyFreshModal(payload);
    });
  });
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
