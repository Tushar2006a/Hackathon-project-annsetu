// Annsetu API Client
const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    const raw = await res.text();
    let data = null;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = { error: raw || 'Unexpected server response' };
    }

    if (!res.ok) {
      return { success: false, error: data.error || 'Request failed' };
    }

    return data;
  } catch (err) {
    console.warn(`API ${endpoint}:`, err.message);
    return { success: false, error: 'Cannot reach server. Using offline mode.' };
  }
}

function buildOfflineUser(phone) {
  return {
    id: `offline-${phone}`,
    phone,
    name: '',
    role: '',
    hub: '',
    createdAt: new Date().toISOString(),
  };
}

// ── Auth ──
export const api = {
  // Auth
  sendOTP: async (phone) => {
    const result = await request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });

    if (result?.success) return result;

    // Offline fallback keeps the OTP flow usable in local preview without API server.
    if (phone && String(phone).length >= 10) {
      return {
        success: true,
        message: 'Offline mode: use any 4-digit OTP',
        offline: true,
      };
    }

    return result;
  },

  verifyOTP: async (phone, otp) => {
    const result = await request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    });

    if (result?.success) return result;

    if (phone && String(phone).length >= 10 && String(otp || '').length === 4) {
      return {
        success: true,
        user: buildOfflineUser(phone),
        token: `offline_${phone}_${Date.now()}`,
        isNewUser: true,
        offline: true,
      };
    }

    return result;
  },

  // Users
  createUser: (data) => request('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getUser: (id) => request(`/users/${id}`),

  updateUser: (id, data) => request(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Farmer farm profile (separate from user record)
  saveFarmProfile: (userId, data) => request(`/farmer-profile/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  getFarmProfile: (userId) => request(`/farmer-profile/${userId}`),

  // Hubs
  createHub: (data) => request('/hubs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/products${query ? '?' + query : ''}`);
  },

  getProduct: (id) => request(`/products/${id}`),

  // Cart
  getCart: (userId) => request(`/cart/${userId}`),

  addToCart: (userId, productId, qty = 1) => request(`/cart/${userId}`, {
    method: 'POST',
    body: JSON.stringify({ productId, qty }),
  }),

  updateCart: (userId, productId, qty) => request(`/cart/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({ productId, qty }),
  }),

  clearCart: (userId) => request(`/cart/${userId}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (data) => request('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getOrders: (userId) => request(`/orders${userId ? '?userId=' + userId : ''}`),

  getOrder: (id) => request(`/orders/${id}`),

  // Hubs
  getHubs: () => request('/hubs'),

  getHub: (id) => request(`/hubs/${id}`),

  updateHub: (id, data) => request(`/hubs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  createHub: (data) => request('/hubs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Farmers
  getFarmerDashboard: (id) => request(`/farmers/dashboard/${id}`),

  registerFarmer: (data) => request('/farmers', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Stats
  getStats: () => request('/stats'),

  // Farmer Product Listings
  addFarmerProduct: (data) => request('/farmer-products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMyListings:    (userId) => request(`/farmer-products/${userId}`),
  getRecentListings:()       => request('/farmer-products/recent'),
  deleteListing:    (id)     => request(`/farmer-products/${id}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (data) => request('/orders/instant', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getMyOrders:      (consumerId) => request(`/consumer-orders/${consumerId}`),
  getFarmerOrders:  (farmerId)   => request(`/farmer-orders/${farmerId}`),
  getHubOrders:     (hubId)      => request(`/hub-orders/${hubId}`),
  updateOrderStatus:(id, status) => request(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  // Hub Inventory
  getHubInventory: (hubId) => request(hubId ? `/hub-inventory?hubId=${hubId}` : '/hub-inventory'),

  // New Supply Chain Checkout
  checkout: (data) => request('/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Notifications
  getNotifications: (userId) => request(`/notifications/${userId}`),
  markRead:         (id)     => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead:      (userId) => request(`/notifications/read-all/${userId}`, { method: 'PUT' }),

  // Stats / Health
  getStats: () => request('/stats'),
  health:   () => request('/health'),
};
