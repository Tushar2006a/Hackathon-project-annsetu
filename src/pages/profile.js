// Enhanced Profile Page with Referral & Stats
import { renderAppHeader, renderBottomNav, getUserRole } from '../components/navbar.js';

function getInitials(name) {
  if (!name) return '??';
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

export function renderProfile() {
  const role = getUserRole();
  const user = JSON.parse(localStorage.getItem('annsetu_user') || '{}');

  // Real name from localStorage; fall back gracefully
  const realName  = user.name  || '';
  const realPhone = user.phone || '';
  const initials  = realName ? getInitials(realName) : (realPhone ? realPhone.slice(-2) : '??');

  const profileConfigs = {
    consumer: {
      name: realName || 'Consumer',
      subtitle: `Consumer · ${realPhone ? '+91 ' + realPhone : 'Annsetu User'}`,
      initials,
      avatarClass: 'avatar--green',
      stats: [
        { value: '23', label: 'Orders' },
        { value: '₹8.2K', label: 'Spent' },
        { value: '₹420', label: 'Saved' },
      ],
      menuItems: [
        { icon: '📦', bg: 'var(--green-100)', title: 'My Orders', subtitle: 'Track & reorder', href: '#/orders' },
        { icon: '🔄', bg: 'var(--green-50)', title: 'Subscriptions', subtitle: 'Daily milk, weekly veggies', href: '#/subscriptions' },
        { icon: '❤️', bg: '#fef2f2', title: 'Saved Items', subtitle: 'Your favorites', href: '#/' },
        { icon: '📍', bg: 'var(--bg-secondary)', title: 'Saved Addresses', subtitle: 'Home, Office, Other', href: null },
        { icon: '💳', bg: 'var(--bg-secondary)', title: 'Payment Methods', subtitle: 'UPI & Wallet (₹250)', href: null },
        { icon: '🔔', bg: 'var(--orange-50)', title: 'Notifications', subtitle: '2 unread', href: '#/notifications' },
        { icon: '❓', bg: 'var(--bg-secondary)', title: 'Help & Support', subtitle: 'FAQs & chat', href: '#/support' },
      ]
    },
    farmer: {
      name: realName || 'Farmer',
      subtitle: `Farmer · ${realPhone ? '+91 ' + realPhone : 'Annsetu User'}`,
      initials,
      avatarClass: 'avatar--green',
      stats: [
        { value: '156', label: 'Orders' },
        { value: '₹48K', label: 'Earned' },
        { value: '8', label: 'Products' },
      ],
      menuItems: [
        { icon: '📊', bg: 'var(--green-100)', title: 'Earnings', subtitle: '₹48,250 this month', href: '#/' },
        { icon: '📦', bg: 'var(--green-50)', title: 'My Products', subtitle: '8 products listed', href: '#/my-products' },
        { icon: '📋', bg: 'var(--warning-light)', title: 'Orders', subtitle: '3 pending orders', href: '#/farmer-orders' },
        { icon: '🏦', bg: 'var(--bg-secondary)', title: 'Bank Details', subtitle: 'For payouts', href: null },
        { icon: '🌾', bg: 'var(--earth-100)', title: 'Farm Profile', subtitle: 'Edit farm info', href: null },
        { icon: '🔔', bg: 'var(--orange-50)', title: 'Notifications', subtitle: 'Order & pickup alerts', href: '#/notifications' },
        { icon: '❓', bg: 'var(--bg-secondary)', title: 'Help & Support', subtitle: 'FAQs & chat', href: '#/support' },
      ]
    },
    hub: {
      name: realName || 'Hub Admin',
      subtitle: `Hub Owner · ${realPhone ? '+91 ' + realPhone : 'Annsetu User'}`,
      initials,
      avatarClass: 'avatar--green',
      stats: [
        { value: '89', label: 'Deliveries' },
        { value: '14', label: 'Active' },
        { value: '4.8', label: 'Rating' },
      ],
      menuItems: [
        { icon: '🏪', bg: 'var(--earth-100)', title: 'Hub Settings', subtitle: 'Name, hours, delivery', href: '#/hub' },
        { icon: '📦', bg: 'var(--green-100)', title: 'Inventory', subtitle: 'Stock management', href: '#/hub' },
        { icon: '🚚', bg: 'var(--warning-light)', title: 'Deliveries', subtitle: 'Active routes', href: '#/deliveries' },
        { icon: '🔔', bg: 'var(--orange-50)', title: 'Notifications', subtitle: 'Alerts', href: '#/notifications' },
        { icon: '❓', bg: 'var(--bg-secondary)', title: 'Help & Support', subtitle: 'FAQs & chat', href: '#/support' },
      ]
    }
  };

  const config = profileConfigs[role] || profileConfigs.consumer;
  // Referral code from real name initials + last 3 digits of phone
  const referralCode = (realName ? realName.split(' ')[0].toUpperCase() : 'USER') + (realPhone ? realPhone.slice(-3) : '000');



  return `
    ${renderAppHeader()}
    <main class="page-content">
      <!-- Profile Header -->
      <div style="padding:var(--space-6) var(--space-4);text-align:center;background:linear-gradient(135deg, var(--green-50) 0%, var(--bg-primary) 100%);">
        <div class="avatar ${config.avatarClass}" style="width:68px;height:68px;font-size:var(--fs-xl);margin:0 auto var(--space-3);box-shadow:var(--shadow-md);">${config.initials}</div>
        <h2 style="font-family:var(--font-heading);font-weight:var(--fw-extrabold);font-size:var(--fs-xl);margin-bottom:2px;">${config.name}</h2>
        <p style="font-size:var(--fs-sm);color:var(--text-muted);">${config.subtitle}</p>
      </div>

      <!-- Quick Stats -->
      <div style="display:flex;gap:var(--space-2);padding:0 var(--space-4);margin-top:calc(-1 * var(--space-4));">
        ${config.stats.map(s => `
          <div class="card" style="flex:1;text-align:center;padding:var(--space-3);">
            <div style="font-family:var(--font-heading);font-weight:var(--fw-bold);font-size:var(--fs-lg);color:var(--green-700);">${s.value}</div>
            <div style="font-size:var(--fs-xs);color:var(--text-muted);">${s.label}</div>
          </div>
        `).join('')}
      </div>

      <!-- Referral Card (Consumer only) -->
      ${role === 'consumer' ? `
        <div class="px" style="padding-top:var(--space-4);">
          <div class="card card--green" style="display:flex;align-items:center;gap:var(--space-3);">
            <div style="font-size:2rem;">🎁</div>
            <div style="flex:1;">
              <div style="font-weight:var(--fw-bold);font-size:var(--fs-body);color:var(--green-800);">Invite Friends, Earn ₹50</div>
              <div style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:2px;">Share code: <strong style="color:var(--green-700);">${referralCode}</strong></div>
            </div>
            <button class="btn btn-primary btn-sm" id="share-btn" style="flex-shrink:0;">Share</button>
          </div>
        </div>
      ` : ''}

      <hr class="divider" style="margin-top:var(--space-4);" />

      <!-- Menu Items -->
      ${config.menuItems.map(item => `
        <div class="list-item" ${item.href ? `onclick="window.location.hash='${item.href}'"` : ''} style="cursor:pointer;">
          <div class="list-item__icon" style="background:${item.bg};">${item.icon}</div>
          <div class="list-item__content">
            <div class="list-item__title">${item.title}</div>
            <div class="list-item__subtitle">${item.subtitle}</div>
          </div>
          <span style="color:var(--text-muted);">→</span>
        </div>
      `).join('')}

      <hr class="divider" />

      <!-- App Settings -->
      <div class="list-item">
        <div class="list-item__icon" style="background:var(--bg-secondary);">⚙️</div>
        <div class="list-item__content">
          <div class="list-item__title">App Settings</div>
          <div class="list-item__subtitle">Language, theme</div>
        </div>
        <span style="color:var(--text-muted);">→</span>
      </div>

      <!-- About -->
      <div class="list-item">
        <div class="list-item__icon" style="background:var(--bg-secondary);">ℹ️</div>
        <div class="list-item__content">
          <div class="list-item__title">About Annsetu</div>
          <div class="list-item__subtitle">v2.0 · Farm-to-family commerce</div>
        </div>
        <span style="color:var(--text-muted);">→</span>
      </div>

      <!-- Sign Out -->
      <div class="list-item" onclick="localStorage.removeItem('annsetu_user');location.reload();" style="cursor:pointer;">
        <div class="list-item__icon" style="background:var(--error-light);">🚪</div>
        <div class="list-item__content">
          <div class="list-item__title" style="color:var(--error);">Sign Out</div>
          <div class="list-item__subtitle" style="color:var(--text-muted);">Returns to login</div>
        </div>
      </div>

      <div style="text-align:center;padding:var(--space-6);font-size:var(--fs-xs);color:var(--text-muted);">
        Annsetu v2.0 · Made with 💚 in India 🇮🇳
      </div>
    </main>
    ${renderBottomNav('profile', role)}
  `;
}
