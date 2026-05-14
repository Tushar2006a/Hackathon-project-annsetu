// Mobile App Header & Navigation — Fresh Harvest
export function renderAppHeader(title = '', showBack = false) {
  return `
    <header class="app-header">
      ${showBack ? `
        <a href="#/" class="app-header__back" onclick="window.history.length > 1 ? (event.preventDefault(), window.history.back()) : null">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </a>
        <span class="header-title">${title}</span>
      ` : `
        <div class="app-header__logo">
          <div class="app-header__logo-icon">
            <img src="/images/logo-icon.svg" alt="Annsetu" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <span class="app-header__title">Annsetu</span>
        </div>
      `}
      <div class="app-header__actions">
        <button class="icon-btn" id="notif-btn" aria-label="Notifications" onclick="window.location.hash='#/notifications'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span class="icon-btn__badge" id="notif-badge" style="display:flex;background:var(--orange);">2</span>
        </button>
        <button class="icon-btn" id="cart-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span class="icon-btn__badge" id="cart-badge">0</span>
        </button>
      </div>
    </header>
  `;
}

// Farmer-specific header (no cart)
export function renderFarmerHeader(title = '', showBack = false) {
  return `
    <header class="app-header">
      ${showBack ? `
        <a href="#/" class="app-header__back" onclick="window.history.length > 1 ? (event.preventDefault(), window.history.back()) : null">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </a>
        <span class="header-title">${title}</span>
      ` : `
        <div class="app-header__logo">
          <div class="app-header__logo-icon">
            <img src="/images/logo-icon.svg" alt="Annsetu" style="width:100%;height:100%;object-fit:contain;" />
          </div>
          <span class="app-header__title">Annsetu</span>
        </div>
      `}
      <div class="app-header__actions">
        <button class="icon-btn" id="notif-btn" aria-label="Notifications" onclick="window.location.hash='#/notifications'">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
          <span class="icon-btn__badge" id="notif-badge" style="display:flex;background:var(--orange);">3</span>
        </button>
      </div>
    </header>
  `;
}

// Role-based Bottom Navigation
export function renderBottomNav(active = 'home', role = 'consumer') {
  const navConfigs = {
    consumer: [
      { id: 'home', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', label: 'Home', href: '#/' },
      { id: 'products', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>', label: 'Shop', href: '#/products' },
      { id: 'orders', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>', label: 'Orders', href: '#/orders' },
      { id: 'profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Profile', href: '#/profile' },
    ],
    farmer: [
      { id: 'dashboard', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>', label: 'Dashboard', href: '#/' },
      { id: 'my-products', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', label: 'Products', href: '#/my-products' },
      { id: 'farmer-orders', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', label: 'Demand', href: '#/farmer-orders' },
      { id: 'profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Profile', href: '#/profile' },
    ],
    hub: [
      { id: 'hub-dash', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', label: 'Hub', href: '#/' },
      { id: 'inventory', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>', label: 'Inventory', href: '#/hub' },
      { id: 'deliveries', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>', label: 'Deliveries', href: '#/deliveries' },
      { id: 'profile', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', label: 'Profile', href: '#/profile' },
    ],
  };

  const items = navConfigs[role] || navConfigs.consumer;

  return `
    <nav class="bottom-nav">
      ${items.map(item => `
        <a href="${item.href}" class="bottom-nav__item ${active === item.id ? 'bottom-nav__item--active' : ''}">
          ${item.icon}
          <span>${item.label}</span>
        </a>
      `).join('')}
    </nav>
  `;
}

export function initHeader() {
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', () => {
      window.location.hash = '#/cart';
    });
  }
}

// Get current user role from localStorage
export function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');
    return user.role || 'consumer';
  } catch { return 'consumer'; }
}
