// Annsetu Mobile App — Main Bootstrap
import './styles/index.css';
import { Router } from './router.js';

// Auto-fix for users stuck with offline/local tokens
const token = localStorage.getItem('annsetu_token');
if (token && (token.startsWith('annsetu_') || token.startsWith('offline_'))) {
  localStorage.clear();
  window.location.href = '/';
}
// Onboarding Flow
import { renderSplash, initSplash } from './pages/splash.js';
import { renderOnboarding, initOnboarding } from './pages/onboarding.js';
import { renderPhoneLogin, initPhoneLogin } from './pages/otp-login.js';
import { renderRoleSelect, initRoleSelect } from './pages/role-select.js';
import { renderPermissions, initPermissions } from './pages/permissions.js';
import { renderHubSelect, initHubSelect } from './pages/hub-select.js';
import { renderFarmerSetup, renderHubCreate, initFarmerSetup, initHubCreate } from './pages/setup-forms.js';
import { renderWelcome, initWelcome } from './pages/welcome.js';

// Consumer Pages
import { renderHome, initHome } from './pages/home.js';
import { renderProducts, initProducts } from './pages/products.js';
import { renderProductDetail, initProductDetail } from './pages/product-detail.js';
import { renderConsumerDashboard, initConsumerDashboard } from './pages/consumer-dashboard.js';
import { renderSubscriptions, initSubscriptions } from './pages/subscriptions.js';
import { renderSupport, initSupport } from './pages/support.js';
import { renderNotifications, initNotifications } from './pages/notifications.js';
import { renderCheckout, initCheckout } from './pages/checkout.js';
import { renderCartPage, initCartPage, showToast, updateCartBadge } from './components/cart.js';
import { renderOrderTracking, initOrderTracking } from './pages/order-tracking.js';

// Farmer Pages
import { renderFarmerDashboard, initFarmerDashboard } from './pages/farmer-dashboard.js';
import { renderFarmerProducts, initFarmerProducts } from './pages/farmer-products.js';
import { renderFarmerOrders, initFarmerOrders } from './pages/farmer-orders.js';

// Hub Pages
import { renderHubManagement, initHubManagement } from './pages/hub-management.js';

// Admin Pages
import { renderAdminDashboard, initAdminDashboard } from './pages/admin-dashboard.js';
import { renderAdminLogin, initAdminLogin } from './pages/admin-auth.js';

// Shared Pages
import { renderProfile } from './pages/profile.js';
import { renderLogin, initLogin, renderRegister, initRegister } from './pages/login.js';
import { initHeader } from './components/navbar.js';
import { products, cart } from './data/mock-data.js';
import { getDynamicPrice } from './utils/ops.js';
import { api } from './data/api.js';

const app = document.getElementById('app');
let userState = { phone: '', role: '', hub: '', name: '' };

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('annsetu_user') || '{}');
  } catch {
    return {};
  }
}

function hydrateUserState() {
  const stored = loadStoredUser();
  if (stored?.role) {
    userState = { ...userState, ...stored };
    return true;
  }
  return false;
}

function setAdminMode(isAdmin) {
  app.classList.toggle('admin-app', isAdmin);
  document.body.classList.toggle('admin-body', isAdmin);
  if (!isAdmin) {
    document.body.removeAttribute('data-theme');
  }
}

// ── Global Add to Cart ──
window.addProductToCart = (productId) => {
  const product = products.find(p => p.id === productId);
  if (product) {
    const { price: dynamicPrice, multiplier } = getDynamicPrice(product);
    const pricedProduct = multiplier > 0 ? { ...product, price: dynamicPrice } : product;
    cart.add(pricedProduct);
    showToast(`${product.name} added to cart`);
    updateCartBadge();
  }
};

// ── Service Worker ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

// ── Onboarding Flow Controller ──
function startOnboarding() {
  const initialPath = window.location.hash.slice(1) || '/';
  if (initialPath.startsWith('/admin-login')) {
    setAdminMode(true);
    showStep(renderAdminLogin(), () => {
      initAdminLogin();
    });
    return;
  }

  // Step 1: Always show splash
  showStep(renderSplash(), () => {
    initSplash(() => {
      // Resume session if user already exists
      if (hydrateUserState()) {
        startApp();
        return;
      }
      // Step 2: onboarding slides, then phone login
      goToOnboarding();
    });
  });
}

function goToOnboarding() {
  transitionTo(renderOnboarding(), () => {
    initOnboarding(() => {
      goToPhoneLogin();
    });
  });
}

function goToPhoneLogin() {
  transitionTo(renderPhoneLogin(), () => {
    initPhoneLogin((phone, verifyResult) => {
      userState.phone = phone;

      // Capture name if provided (from name-step in otp-login)
      if (verifyResult?.user?.name) {
        userState.name = verifyResult.user.name;
      }

      // If user already has a role set (returning user), skip setup
      if (verifyResult && !verifyResult.isNewUser && verifyResult.user?.role) {
        const u = verifyResult.user;
        userState.role = u.role;
        userState.hub  = u.hub  || '';
        userState.name = u.name || '';
        // Persist and jump straight to the app
        localStorage.setItem('annsetu_user', JSON.stringify(userState));
        if (u.id) localStorage.setItem('annsetu_userId', u.id);
        startApp();
        return;
      }

      // New user — persist name to server immediately, then continue onboarding
      const userId = verifyResult?.user?.id;
      if (userId && userState.name) {
        localStorage.setItem('annsetu_userId', userId);
        api.updateUser(userId, { name: userState.name }).catch(() => {});
      }

      goToRoleSelect();
    });
  });
}

function goToRoleSelect() {
  transitionTo(renderRoleSelect(), () => {
    initRoleSelect((role) => {
      userState.role = role;
      // Step 5: Permissions
      goToPermissions();
    });
  });
}

function goToPermissions() {
  transitionTo(renderPermissions(), () => {
    initPermissions((granted) => {
      // Step 6: Role-specific setup
      if (userState.role === 'consumer') {
        goToHubSelect();
      } else if (userState.role === 'farmer') {
        goToFarmerSetup();
      } else if (userState.role === 'hub') {
        goToHubCreate();
      }
    });
  });
}

function goToHubSelect() {
  transitionTo(renderHubSelect(), () => {
    initHubSelect((hubId) => {
      userState.hub = hubId;
      // Persist hub selection to DB immediately
      const userId = localStorage.getItem('annsetu_userId');
      if (userId) {
        api.updateUser(userId, { hub: hubId }).catch(() => {});
      }
      goToWelcome();
    });
  });
}

function goToFarmerSetup() {
  transitionTo(renderFarmerSetup(), () => {
    initFarmerSetup((role, name, farmData) => {
      if (name) userState.name = name;
      if (farmData) userState.farmProfile = farmData;
      goToWelcome();
    });
  });
}

function goToHubCreate() {
  transitionTo(renderHubCreate(), () => {
    initHubCreate((role, name, hubData) => {
      if (name) userState.name = name;
      if (hubData) userState.hubData = hubData;
      goToWelcome();
    });
  });
}

async function goToWelcome() {
  // Save user state to localStorage
  localStorage.setItem('annsetu_user', JSON.stringify(userState));

  const userId = localStorage.getItem('annsetu_userId');

  if (userId) {
    // 1. Always save core user record (role, name, hub)
    await api.updateUser(userId, {
      role: userState.role,
      hub:  userState.hub  || '',
      name: userState.name || ''
    }).catch(() => {});

    // 2. Farmer: save full farm profile
    if (userState.role === 'farmer' && userState.farmProfile) {
      await api.saveFarmProfile(userId, userState.farmProfile).catch(() => {});
    }

    // 3. Hub owner: create hub in DB linked to this user
    if (userState.role === 'hub' && userState.hubData) {
      const res = await api.createHub({ ...userState.hubData, userId }).catch(() => null);
      if (res?.hub?.id) {
        userState.hub = res.hub.id;
        localStorage.setItem('annsetu_user', JSON.stringify(userState));
        // hub is also linked to user record inside the server endpoint
      }
    }
  }

  transitionTo(renderWelcome(userState.role), () => {
    initWelcome(userState.role, () => {
      startApp();
    });
  });
}

// ── Transition Helpers ──
function showStep(html, afterRender) {
  app.innerHTML = html;
  if (afterRender) afterRender();
}

function transitionTo(html, afterRender) {
  app.style.animation = 'none';
  app.style.opacity = '0';
  app.style.transform = 'translateX(20px)';

  setTimeout(() => {
    app.innerHTML = html;
    app.style.transition = 'opacity 0.4s var(--ease-out), transform 0.4s var(--ease-out)';
    app.style.opacity = '1';
    app.style.transform = 'translateX(0)';

    if (afterRender) afterRender();
  }, 100);
}

// ── Role-Based App Router ──
function startApp() {
  // Reset transition styles
  app.style.transition = '';
  app.style.opacity = '';
  app.style.transform = '';

  // Reset hash to home
  window.location.hash = '#/';

  const role = userState.role || 'consumer';

  if (role === 'admin') {
    startAdminApp();
  } else if (role === 'farmer') {
    startFarmerApp();
  } else if (role === 'hub') {
    startHubApp();
  } else {
    startConsumerApp();
  }
}

// ── Admin Routes ──
function startAdminApp() {
  setAdminMode(true);
  const router = new Router([
    {
      path: '/',
      render: () => renderAdminDashboard(),
      afterRender: () => { initAdminDashboard(); }
    },
    {
      path: '/logout',
      render: () => {
        localStorage.removeItem('annsetu_user');
        localStorage.removeItem('annsetu_token');
        localStorage.removeItem('annsetu_userId');
        location.reload();
        return '<div></div>';
      },
      afterRender: () => {}
    },
  ]);
}

// ── Consumer Routes ──
function startConsumerApp() {
  setAdminMode(false);
  const router = new Router([
    {
      path: '/',
      render: () => renderHome(),
      afterRender: () => { initHeader(); updateCartBadge(); attachAddToCart(); initHome(); }
    },
    {
      path: '/products',
      render: () => renderProducts(),
      afterRender: () => { initHeader(); updateCartBadge(); initProducts(); }
    },
    {
      path: '/product/:id',
      render: (params) => renderProductDetail(params),
      afterRender: (params) => { initHeader(); updateCartBadge(); initProductDetail(params); }
    },
    {
      path: '/cart',
      render: () => renderCartPage(),
      afterRender: () => { initCartPage(); }
    },
    {
      path: '/checkout',
      render: () => renderCheckout(),
      afterRender: () => { initCheckout(); }
    },
    {
      path: '/orders',
      render: () => renderConsumerDashboard(),
      afterRender: () => { updateCartBadge(); initConsumerDashboard(); }
    },
    {
      path: '/track/:id',
      render: (params) => renderOrderTracking(params?.id),
      afterRender: () => { initOrderTracking(); }
    },
    {
      path: '/profile',
      render: () => renderProfile(),
      afterRender: () => { updateCartBadge(); }
    },
    {
      path: '/subscriptions',
      render: () => renderSubscriptions(),
      afterRender: () => { initSubscriptions(); }
    },
    {
      path: '/support',
      render: () => renderSupport(),
      afterRender: () => { initSupport(); }
    },
    {
      path: '/notifications',
      render: () => renderNotifications(),
      afterRender: () => { initNotifications(); }
    },
    {
      path: '/login',
      render: () => renderLogin(),
      afterRender: () => { initLogin(); }
    },
    {
      path: '/register',
      render: () => renderRegister(),
      afterRender: () => { initRegister(); }
    },
    {
      path: '/logout',
      render: () => {
        localStorage.removeItem('annsetu_user');
        localStorage.removeItem('annsetu_token');
        localStorage.removeItem('annsetu_userId');
        location.reload();
        return '<div></div>';
      },
      afterRender: () => {}
    },
  ]);
}

// ── Farmer Routes ──
function startFarmerApp() {
  setAdminMode(false);
  const router = new Router([
    {
      path: '/',
      render: () => renderFarmerDashboard(),
      afterRender: () => { initFarmerDashboard(); }
    },
    {
      path: '/my-products',
      render: () => renderFarmerProducts(),
      afterRender: () => { initFarmerProducts(); }
    },
    {
      path: '/farmer-orders',
      render: () => renderFarmerOrders(),
      afterRender: () => { initFarmerOrders(); }
    },
    {
      path: '/profile',
      render: () => renderProfile(),
      afterRender: () => {}
    },
    {
      path: '/logout',
      render: () => {
        localStorage.removeItem('annsetu_user');
        localStorage.removeItem('annsetu_token');
        localStorage.removeItem('annsetu_userId');
        location.reload();
        return '<div></div>';
      },
      afterRender: () => {}
    },
  ]);
}

// ── Hub Routes ──
function startHubApp() {
  setAdminMode(false);
  const router = new Router([
    {
      path: '/',
      render: () => renderHubManagement(),
      afterRender: () => { initHubManagement(); }
    },
    {
      path: '/hub',
      render: () => renderHubManagement(),
      afterRender: () => { initHubManagement(); }
    },
    {
      path: '/profile',
      render: () => renderProfile(),
      afterRender: () => {}
    },
    {
      path: '/logout',
      render: () => {
        localStorage.removeItem('annsetu_user');
        localStorage.removeItem('annsetu_token');
        localStorage.removeItem('annsetu_userId');
        location.reload();
        return '<div></div>';
      },
      afterRender: () => {}
    },
  ]);
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

// ── Boot ──
startOnboarding();
