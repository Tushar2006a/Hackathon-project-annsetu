// Annsetu Mock Data — Consumer Operations System

export const hubs = [
  {
    id: 'hub-pune-01',
    name: 'Pune Central Hub',
    distanceKm: 0.8,
    etaMins: 30,
    coverageKm: 5,
    address: 'Baner Road, Pune',
    status: 'active',
    rating: 4.8,
    load: { current: 312, capacity: 420 },
    surgeWindow: '7 PM - 9 PM',
  },
  {
    id: 'hub-pune-02',
    name: 'Pune West Hub',
    distanceKm: 2.4,
    etaMins: 35,
    coverageKm: 6,
    address: 'Aundh, Pune',
    status: 'active',
    rating: 4.7,
    load: { current: 248, capacity: 360 },
    surgeWindow: '6 PM - 8 PM',
  },
  {
    id: 'hub-pune-03',
    name: 'Pune East Hub',
    distanceKm: 4.1,
    etaMins: 45,
    coverageKm: 7,
    address: 'Kharadi, Pune',
    status: 'active',
    rating: 4.6,
    load: { current: 190, capacity: 320 },
    surgeWindow: '7 PM - 10 PM',
  },
];

export const inventoryBatches = [
  { id: 'batch-AN-1001', productId: 1, hubId: 'hub-pune-01', harvestedAt: '2026-05-11T04:30:00Z', expiryAt: '2026-05-13T04:30:00Z', qty: 120, remaining: 82, grade: 'A', fifoRank: 1 },
  { id: 'batch-AN-1002', productId: 2, hubId: 'hub-pune-01', harvestedAt: '2026-05-11T05:10:00Z', expiryAt: '2026-05-12T05:10:00Z', qty: 80, remaining: 44, grade: 'A', fifoRank: 1 },
  { id: 'batch-AN-1003', productId: 6, hubId: 'hub-pune-01', harvestedAt: '2026-05-10T06:00:00Z', expiryAt: '2026-05-12T06:00:00Z', qty: 40, remaining: 12, grade: 'A', fifoRank: 2 },
  { id: 'batch-AN-1004', productId: 15, hubId: 'hub-pune-01', harvestedAt: '2026-05-11T03:40:00Z', expiryAt: '2026-05-12T03:40:00Z', qty: 160, remaining: 96, grade: 'A', fifoRank: 1 },
  { id: 'batch-AN-1005', productId: 8, hubId: 'hub-pune-02', harvestedAt: '2026-05-10T05:30:00Z', expiryAt: '2026-05-14T05:30:00Z', qty: 60, remaining: 18, grade: 'B', fifoRank: 1 },
  { id: 'batch-AN-1006', productId: 4, hubId: 'hub-pune-02', harvestedAt: '2026-05-09T05:00:00Z', expiryAt: '2026-05-13T05:00:00Z', qty: 25, remaining: 8, grade: 'A', fifoRank: 1 },
  { id: 'batch-AN-1007', productId: 12, hubId: 'hub-pune-03', harvestedAt: '2026-05-10T04:30:00Z', expiryAt: '2026-05-12T04:30:00Z', qty: 90, remaining: 40, grade: 'A', fifoRank: 1 },
];

export const smartOpsSignals = [
  { id: 'ops-1', label: 'Hub load', value: '78% capacity', status: 'ok', detail: 'Pune Central Hub' },
  { id: 'ops-2', label: 'Routing', value: '3 active clusters', status: 'ok', detail: 'Avg ETA 32 min' },
  { id: 'ops-3', label: 'Expiry watch', value: '12 batches in 24h', status: 'warn', detail: 'Auto-discount live' },
];

export const orderStages = [
  { key: 'placed', label: 'Order Placed' },
  { key: 'picked', label: 'Picked from Farm' },
  { key: 'packed', label: 'Packed at Hub' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export const products = [
  { id: 1, name: 'Organic Tomatoes', category: 'Vegetables', price: 45, originalPrice: 55, unit: 'kg', stock: 120, farmer: 'Ramesh Patel', farmLocation: 'Gujarat', farmDistance: 3.2, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: true, nutrition: { calories: 18, protein: 0.9, fiber: 1.2 }, deliveryEta: '30 min', image: '🍅', rating: 4.5, reviewCount: 128 },
  { id: 2, name: 'Fresh Spinach', category: 'Leafy Greens', price: 30, originalPrice: 30, unit: 'bunch', stock: 80, farmer: 'Lakshmi Devi', farmLocation: 'Haryana', farmDistance: 5.1, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: true, nutrition: { calories: 23, protein: 2.9, fiber: 2.2 }, deliveryEta: '30 min', image: '🥬', rating: 4.7, reviewCount: 93 },
  { id: 3, name: 'Wheat Grains', category: 'Grains', price: 38, originalPrice: 42, unit: 'kg', stock: 200, farmer: 'Suresh Kumar', farmLocation: 'Punjab', farmDistance: 12, freshness: 'This Season', harvestedAt: '2026-04-20', isOrganic: false, isSeasonal: true, isSubscribable: false, nutrition: { calories: 340, protein: 12, fiber: 12.2 }, deliveryEta: '2 hrs', image: '🌾', rating: 4.3, reviewCount: 67 },
  { id: 4, name: 'Alphonso Mangoes', category: 'Fruits', price: 320, originalPrice: 400, unit: 'dozen', stock: 15, farmer: 'Anand Deshmukh', farmLocation: 'Maharashtra', farmDistance: 8.5, freshness: '2 Days Ago', harvestedAt: '2026-05-09', isOrganic: true, isSeasonal: true, isSubscribable: false, nutrition: { calories: 60, protein: 0.8, fiber: 1.6 }, deliveryEta: '2 hrs', image: '🥭', rating: 4.9, reviewCount: 245 },
  { id: 5, name: 'Green Peas', category: 'Vegetables', price: 60, originalPrice: 60, unit: 'kg', stock: 45, farmer: 'Meena Sharma', farmLocation: 'Uttar Pradesh', farmDistance: 6.2, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: false, isSeasonal: true, isSubscribable: false, nutrition: { calories: 81, protein: 5.4, fiber: 5.1 }, deliveryEta: '45 min', image: '🫛', rating: 4.4, reviewCount: 56 },
  { id: 6, name: 'Farm Carrots', category: 'Vegetables', price: 35, originalPrice: 45, unit: 'kg', stock: 8, farmer: 'Rajesh Singh', farmLocation: 'Himachal Pradesh', farmDistance: 4.3, freshness: 'Yesterday', harvestedAt: '2026-05-10', isOrganic: true, isSeasonal: false, isSubscribable: true, nutrition: { calories: 41, protein: 0.9, fiber: 2.8 }, deliveryEta: '30 min', image: '🥕', rating: 4.6, reviewCount: 89 },
  { id: 7, name: 'Basmati Rice', category: 'Grains', price: 95, originalPrice: 110, unit: 'kg', stock: 150, farmer: 'Harpal Singh', farmLocation: 'Punjab', farmDistance: 14, freshness: 'This Season', harvestedAt: '2026-03-15', isOrganic: false, isSeasonal: false, isSubscribable: true, nutrition: { calories: 350, protein: 7.1, fiber: 0.4 }, deliveryEta: '2 hrs', image: '🍚', rating: 4.5, reviewCount: 112 },
  { id: 8, name: 'Fresh Potatoes', category: 'Vegetables', price: 25, originalPrice: 30, unit: 'kg', stock: 5, farmer: 'Kamla Devi', farmLocation: 'Uttar Pradesh', farmDistance: 7.8, freshness: 'This Week', harvestedAt: '2026-05-06', isOrganic: false, isSeasonal: false, isSubscribable: true, nutrition: { calories: 77, protein: 2, fiber: 2.2 }, deliveryEta: '45 min', image: '🥔', rating: 4.2, reviewCount: 74 },
  { id: 9, name: 'Red Onions', category: 'Vegetables', price: 28, originalPrice: 28, unit: 'kg', stock: 200, farmer: 'Vishnu Patil', farmLocation: 'Maharashtra', farmDistance: 2.5, freshness: 'Yesterday', harvestedAt: '2026-05-10', isOrganic: false, isSeasonal: false, isSubscribable: true, nutrition: { calories: 40, protein: 1.1, fiber: 1.7 }, deliveryEta: '30 min', image: '🧅', rating: 4.3, reviewCount: 156 },
  { id: 10, name: 'Cauliflower', category: 'Vegetables', price: 40, originalPrice: 50, unit: 'piece', stock: 35, farmer: 'Asha Kumari', farmLocation: 'Bihar', farmDistance: 9.1, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: true, isSubscribable: false, nutrition: { calories: 25, protein: 2, fiber: 2 }, deliveryEta: '45 min', image: '🥦', rating: 4.4, reviewCount: 42 },
  { id: 11, name: 'Fresh Capsicum', category: 'Vegetables', price: 55, originalPrice: 65, unit: 'kg', stock: 25, farmer: 'Ravi Tiwari', farmLocation: 'Karnataka', farmDistance: 3.7, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: false, nutrition: { calories: 20, protein: 0.9, fiber: 1.7 }, deliveryEta: '30 min', image: '🫑', rating: 4.3, reviewCount: 31 },
  { id: 12, name: 'Ripe Bananas', category: 'Fruits', price: 40, originalPrice: 40, unit: 'dozen', stock: 60, farmer: 'Sunita Reddy', farmLocation: 'Tamil Nadu', farmDistance: 6.4, freshness: 'Yesterday', harvestedAt: '2026-05-10', isOrganic: false, isSeasonal: false, isSubscribable: true, nutrition: { calories: 89, protein: 1.1, fiber: 2.6 }, deliveryEta: '30 min', image: '🍌', rating: 4.6, reviewCount: 178 },
  { id: 13, name: 'Kashmir Apples', category: 'Fruits', price: 180, originalPrice: 220, unit: 'kg', stock: 20, farmer: 'Farooq Ahmed', farmLocation: 'Kashmir', farmDistance: 18, freshness: '3 Days Ago', harvestedAt: '2026-05-08', isOrganic: true, isSeasonal: true, isSubscribable: false, nutrition: { calories: 52, protein: 0.3, fiber: 2.4 }, deliveryEta: '2 hrs', image: '🍎', rating: 4.8, reviewCount: 203 },
  { id: 14, name: 'Sweet Pomegranate', category: 'Fruits', price: 150, originalPrice: 180, unit: 'kg', stock: 18, farmer: 'Ganesh Mane', farmLocation: 'Maharashtra', farmDistance: 5.9, freshness: 'Yesterday', harvestedAt: '2026-05-10', isOrganic: false, isSeasonal: true, isSubscribable: false, nutrition: { calories: 83, protein: 1.7, fiber: 4 }, deliveryEta: '45 min', image: '🫐', rating: 4.5, reviewCount: 87 },
  { id: 15, name: 'Farm Milk', category: 'Dairy', price: 65, originalPrice: 65, unit: 'litre', stock: 100, farmer: 'Gopal Dairy Farm', farmLocation: 'Gujarat', farmDistance: 1.8, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: true, nutrition: { calories: 62, protein: 3.2, fiber: 0 }, deliveryEta: '20 min', image: '🥛', rating: 4.9, reviewCount: 312 },
  { id: 16, name: 'Fresh Curd', category: 'Dairy', price: 45, originalPrice: 50, unit: 'kg', stock: 60, farmer: 'Gopal Dairy Farm', farmLocation: 'Gujarat', farmDistance: 1.8, freshness: 'Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: true, nutrition: { calories: 60, protein: 3.5, fiber: 0 }, deliveryEta: '20 min', image: '🍶', rating: 4.7, reviewCount: 145 },
  { id: 17, name: 'Farm Paneer', category: 'Dairy', price: 280, originalPrice: 320, unit: 'kg', stock: 12, farmer: 'Gopal Dairy Farm', farmLocation: 'Gujarat', farmDistance: 1.8, freshness: 'Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: false, nutrition: { calories: 265, protein: 18.3, fiber: 0 }, deliveryEta: '30 min', image: '🧀', rating: 4.8, reviewCount: 98 },
  { id: 18, name: 'Pure Desi Ghee', category: 'Dairy', price: 550, originalPrice: 650, unit: 'kg', stock: 25, farmer: 'Gopal Dairy Farm', farmLocation: 'Gujarat', farmDistance: 1.8, freshness: 'This Week', harvestedAt: '2026-05-07', isOrganic: true, isSeasonal: false, isSubscribable: false, nutrition: { calories: 900, protein: 0, fiber: 0 }, deliveryEta: '45 min', image: '🫕', rating: 4.9, reviewCount: 267 },
  { id: 19, name: 'Fresh Methi', category: 'Leafy Greens', price: 20, originalPrice: 25, unit: 'bunch', stock: 40, farmer: 'Lakshmi Devi', farmLocation: 'Haryana', farmDistance: 5.1, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: true, isSubscribable: true, nutrition: { calories: 49, protein: 4.4, fiber: 3.7 }, deliveryEta: '30 min', image: '🌿', rating: 4.5, reviewCount: 64 },
  { id: 20, name: 'Green Coriander', category: 'Leafy Greens', price: 15, originalPrice: 15, unit: 'bunch', stock: 90, farmer: 'Lakshmi Devi', farmLocation: 'Haryana', farmDistance: 5.1, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: true, isSeasonal: false, isSubscribable: true, nutrition: { calories: 23, protein: 2.1, fiber: 2.8 }, deliveryEta: '30 min', image: '🌱', rating: 4.6, reviewCount: 112 },
  { id: 21, name: 'Toor Dal', category: 'Grains', price: 120, originalPrice: 140, unit: 'kg', stock: 80, farmer: 'Suresh Kumar', farmLocation: 'Punjab', farmDistance: 12, freshness: 'This Season', harvestedAt: '2026-04-10', isOrganic: false, isSeasonal: false, isSubscribable: true, nutrition: { calories: 343, protein: 22, fiber: 15 }, deliveryEta: '2 hrs', image: '🫘', rating: 4.4, reviewCount: 88 },
  { id: 22, name: 'Fresh Cucumber', category: 'Vegetables', price: 30, originalPrice: 30, unit: 'kg', stock: 55, farmer: 'Ravi Tiwari', farmLocation: 'Karnataka', farmDistance: 3.7, freshness: 'Harvested Today', harvestedAt: new Date().toISOString(), isOrganic: false, isSeasonal: false, isSubscribable: false, nutrition: { calories: 15, protein: 0.7, fiber: 0.5 }, deliveryEta: '30 min', image: '🥒', rating: 4.3, reviewCount: 45 },
  { id: 23, name: 'Watermelon', category: 'Fruits', price: 25, originalPrice: 30, unit: 'kg', stock: 30, farmer: 'Sunita Reddy', farmLocation: 'Tamil Nadu', farmDistance: 6.4, freshness: 'Yesterday', harvestedAt: '2026-05-10', isOrganic: false, isSeasonal: true, isSubscribable: false, nutrition: { calories: 30, protein: 0.6, fiber: 0.4 }, deliveryEta: '45 min', image: '🍉', rating: 4.7, reviewCount: 134 },
  { id: 24, name: 'Fresh Guava', category: 'Fruits', price: 60, originalPrice: 70, unit: 'kg', stock: 22, farmer: 'Anand Deshmukh', farmLocation: 'Maharashtra', farmDistance: 8.5, freshness: 'Yesterday', harvestedAt: '2026-05-10', isOrganic: true, isSeasonal: true, isSubscribable: false, nutrition: { calories: 68, protein: 2.6, fiber: 5.4 }, deliveryEta: '45 min', image: '🍐', rating: 4.5, reviewCount: 73 },
];

export const categories = ['All', 'Vegetables', 'Fruits', 'Leafy Greens', 'Dairy', 'Grains'];

export const stats = { farmers: 2847, hubs: 156, orders: 48520, families: 12340 };

export const banners = [
  { id: 1, title: 'Farm-Fresh\nDelivered Fast', subtitle: 'From harvest to your door in 30 min', cta: 'Shop Now', gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', color: '#fff' },
  { id: 2, title: 'Mango Season\nis Here! 🥭', subtitle: 'Alphonso mangoes from Ratnagiri farms', cta: 'Order Now', gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff' },
  { id: 3, title: 'Subscribe &\nSave 15%', subtitle: 'Daily milk, weekly veggies & more', cta: 'Start Plan', gradient: 'linear-gradient(135deg, #166534 0%, #14532d 100%)', color: '#fff' },
];

export const deliverySlots = [
  { id: 1, label: '7 AM – 9 AM', period: 'Morning', available: true, surge: false, surgeMultiplier: 0, capacity: 140, remaining: 52, recommended: false },
  { id: 2, label: '9 AM – 11 AM', period: 'Morning', available: true, surge: false, surgeMultiplier: 0, capacity: 160, remaining: 68, recommended: true },
  { id: 3, label: '11 AM – 1 PM', period: 'Afternoon', available: true, surge: false, surgeMultiplier: 0, capacity: 140, remaining: 41, recommended: false },
  { id: 4, label: '1 PM – 3 PM', period: 'Afternoon', available: true, surge: true, surgeMultiplier: 0.08, capacity: 120, remaining: 18, recommended: false },
  { id: 5, label: '3 PM – 5 PM', period: 'Evening', available: true, surge: false, surgeMultiplier: 0, capacity: 150, remaining: 60, recommended: false },
  { id: 6, label: '5 PM – 7 PM', period: 'Evening', available: false, surge: false, surgeMultiplier: 0, capacity: 140, remaining: 0, recommended: false },
  { id: 7, label: '7 PM – 9 PM', period: 'Night', available: true, surge: true, surgeMultiplier: 0.12, capacity: 110, remaining: 12, recommended: false },
];

export const coupons = [
  { code: 'FRESH50', discount: 50, type: 'flat', minOrder: 200, description: '₹50 off on orders above ₹200' },
  { code: 'FIRST20', discount: 20, type: 'percent', maxDiscount: 100, minOrder: 150, description: '20% off up to ₹100' },
  { code: 'VEGGIES', discount: 30, type: 'flat', minOrder: 100, description: '₹30 off on vegetables' },
];

export const subscriptionPlans = [
  { id: 'sub-1', name: 'Daily Fresh Milk', product: products.find(p => p.id === 15), frequency: 'Daily', price: 65, savings: '₹120/month', image: '🥛', active: true, nextDelivery: 'Tomorrow, 7 AM', slot: '7 AM – 9 AM', address: 'Home', paused: false },
  { id: 'sub-2', name: 'Weekly Veggie Basket', product: null, frequency: 'Weekly', price: 299, savings: '₹180/month', image: '🥬', active: true, nextDelivery: 'Monday, 9 AM', slot: '9 AM – 11 AM', address: 'Home', paused: false },
  { id: 'sub-3', name: 'Weekend Fruits', product: null, frequency: 'Weekly', price: 199, savings: '₹80/month', image: '🍎', active: false, nextDelivery: 'Saturday, 8 AM', slot: '7 AM – 9 AM', address: 'Office', paused: true },
];

export const notifications = [
  { id: 1, type: 'delivery', icon: '🚚', bg: 'var(--green-100)', title: 'Order Out for Delivery', desc: 'Your order AN-2847 is on its way! ETA 15 mins.', time: '5 min ago', unread: true },
  { id: 2, type: 'order', icon: '📦', bg: 'var(--info-light)', title: 'Order Packed', desc: 'Your order AN-2847 has been packed at Pune Hub.', time: '30 min ago', unread: true },
  { id: 3, type: 'offer', icon: '⚡', bg: 'var(--orange-100)', title: 'Flash Sale — 2 Hours Only!', desc: 'Mangoes at ₹250/dozen. Limited stock!', time: '1 hr ago', unread: false },
  { id: 4, type: 'recommend', icon: '🎯', bg: 'var(--green-50)', title: 'Fresh Arrivals Near You', desc: 'Spinach and methi just harvested from nearby farms.', time: '3 hrs ago', unread: false },
  { id: 5, type: 'delivery', icon: '✅', bg: 'var(--green-100)', title: 'Order Delivered', desc: 'Your order AN-2845 has been delivered. Rate your experience!', time: 'Yesterday', unread: false },
];

export const consumerOrders = [
  {
    id: 'AN-2847',
    hubId: 'hub-pune-01',
    total: 330,
    date: 'Today, 10:30 AM',
    status: 'packed',
    statusLabel: 'Packed at Hub',
    statusClass: 'badge--warning',
    eta: '2:30 PM',
    items: [
      { id: 1, name: 'Organic Tomatoes', qty: 5, price: 45, unit: 'kg', image: '🍅' },
      { id: 6, name: 'Farm Carrots', qty: 3, price: 35, unit: 'kg', image: '🥕' },
    ],
    deliveryPartner: { name: 'Rahul Kumar', initials: 'RK', rating: 4.8, deliveries: 1200, phone: '+919876543210' },
    timeline: [
      { key: 'placed', time: '10:30 AM', detail: 'Order placed' },
      { key: 'picked', time: '11:15 AM', detail: 'Picked from Ramesh Patel farm' },
      { key: 'packed', time: '12:05 PM', detail: 'Sorted at Pune Central Hub' },
      { key: 'out_for_delivery', time: '2:00 PM', detail: 'Rider assigned' },
    ],
  },
  {
    id: 'AN-2845',
    hubId: 'hub-pune-01',
    total: 280,
    date: 'Yesterday',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusClass: 'badge--success',
    eta: '',
    items: [
      { id: 2, name: 'Fresh Spinach', qty: 2, price: 30, unit: 'bunch', image: '🥬' },
      { id: 8, name: 'Fresh Potatoes', qty: 3, price: 25, unit: 'kg', image: '🥔' },
    ],
    deliveryPartner: { name: 'Neha Rao', initials: 'NR', rating: 4.7, deliveries: 860, phone: '+919812345678' },
    timeline: [
      { key: 'placed', time: 'Yesterday, 9:20 AM', detail: 'Order placed' },
      { key: 'picked', time: 'Yesterday, 10:00 AM', detail: 'Picked from nearby farms' },
      { key: 'packed', time: 'Yesterday, 11:00 AM', detail: 'Packed at Pune Central Hub' },
      { key: 'out_for_delivery', time: 'Yesterday, 12:10 PM', detail: 'Out for delivery' },
      { key: 'delivered', time: 'Yesterday, 12:45 PM', detail: 'Delivered at doorstep' },
    ],
  },
  {
    id: 'AN-2840',
    hubId: 'hub-pune-02',
    total: 640,
    date: '5 days ago',
    status: 'delivered',
    statusLabel: 'Delivered',
    statusClass: 'badge--success',
    eta: '',
    items: [
      { id: 4, name: 'Alphonso Mangoes', qty: 2, price: 320, unit: 'dozen', image: '🥭' },
    ],
    deliveryPartner: { name: 'Ajay Singh', initials: 'AS', rating: 4.9, deliveries: 990, phone: '+919845678123' },
    timeline: [
      { key: 'placed', time: '5 days ago, 8:10 AM', detail: 'Order placed' },
      { key: 'picked', time: '5 days ago, 9:00 AM', detail: 'Picked from Ratnagiri farm' },
      { key: 'packed', time: '5 days ago, 10:15 AM', detail: 'Packed at Pune West Hub' },
      { key: 'out_for_delivery', time: '5 days ago, 11:30 AM', detail: 'Out for delivery' },
      { key: 'delivered', time: '5 days ago, 12:10 PM', detail: 'Delivered at doorstep' },
    ],
  },
];

export const supportFAQs = [
  { q: 'How do I track my order?', a: 'Go to Orders → tap on any active order to see real-time tracking with delivery partner details.' },
    { q: 'What if items are missing?', a: 'Report missing items within 24 hours from Order Details → Report Issue. We will refund or redeliver.' },
  { q: 'How do subscriptions work?', a: 'Subscribe to daily/weekly deliveries of milk, veggies, or fruits. Pause or skip anytime from Profile → Subscriptions.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before they are dispatched from the hub. Go to Order Tracking → Cancel Order.' },
  { q: 'How is freshness guaranteed?', a: 'We source directly from farms and deliver within hours. Each product shows harvest time and freshness status.' },
];

export const testimonials = [
  { name: 'Ramesh Patel', role: 'Farmer, Gujarat', quote: 'Annsetu has transformed how I sell my produce. I now get fair prices directly and my income has increased by 40%.', initials: 'RP' },
  { name: 'Priya Mehta', role: 'Consumer, Mumbai', quote: 'The freshness of produce from Annsetu is unmatched. I know exactly which farm my food comes from.', initials: 'PM' },
  { name: 'Vikram Joshi', role: 'Hub Operator, Pune', quote: 'Managing deliveries has never been easier. The platform is intuitive and the logistics flow is seamless.', initials: 'VJ' },
];

export const farmerOrders = [
  { id: 'ORD-2847', items: 'Tomatoes, Carrots', qty: '12 kg', amount: '₹540', status: 'Delivered', date: '9 May 2026' },
  { id: 'ORD-2846', items: 'Spinach', qty: '8 bunches', amount: '₹240', status: 'In Transit', date: '9 May 2026' },
  { id: 'ORD-2845', items: 'Potatoes, Peas', qty: '15 kg', amount: '₹735', status: 'Picked Up', date: '8 May 2026' },
  { id: 'ORD-2844', items: 'Tomatoes', qty: '10 kg', amount: '₹450', status: 'Delivered', date: '8 May 2026' },
  { id: 'ORD-2843', items: 'Carrots, Spinach', qty: '6 kg', amount: '₹330', status: 'Delivered', date: '7 May 2026' },
];

export const weeklyEarnings = [
  { day: 'Mon', amount: 1200 }, { day: 'Tue', amount: 1850 },
  { day: 'Wed', amount: 980 }, { day: 'Thu', amount: 2200 },
  { day: 'Fri', amount: 1650 }, { day: 'Sat', amount: 2800 },
  { day: 'Sun', amount: 1400 },
];

export const hubDeliveries = [
  { id: 'DLV-0091', destination: 'Koramangala, Bangalore', items: 14, status: 'transit', eta: '30 mins' },
  { id: 'DLV-0090', destination: 'Indiranagar, Bangalore', items: 8, status: 'delivered', eta: 'Delivered' },
  { id: 'DLV-0089', destination: 'HSR Layout, Bangalore', items: 22, status: 'pending', eta: '2:30 PM' },
  { id: 'DLV-0088', destination: 'Whitefield, Bangalore', items: 11, status: 'transit', eta: '45 mins' },
  { id: 'DLV-0087', destination: 'JP Nagar, Bangalore', items: 6, status: 'delivered', eta: 'Delivered' },
];

export const minOrderValue = 149;

// Cart State
export const cart = {
  items: [],
  coupon: null,
  add(product, qty = 1) {
    const existing = this.items.find(i => i.id === product.id);
    const maxAllowed = Math.max(0, product.stock - (existing?.qty || 0));
    const safeQty = Math.min(qty, maxAllowed);
    if (safeQty <= 0) { this.notify(); return; }
    if (existing) { existing.qty += safeQty; }
    else { this.items.push({ ...product, qty: safeQty }); }
    this.notify();
  },
  remove(productId) {
    this.items = this.items.filter(i => i.id !== productId);
    this.notify();
  },
  updateQty(productId, qty) {
    const item = this.items.find(i => i.id === productId);
    if (item) {
      const maxAllowed = item.stock ?? qty;
      item.qty = Math.max(0, Math.min(qty, maxAllowed));
      if (item.qty === 0) this.remove(productId);
    }
    this.notify();
  },
  normalize() {
    let adjusted = false;
    this.items.forEach(item => {
      if (item.stock !== undefined && item.qty > item.stock) {
        item.qty = item.stock;
        adjusted = true;
      }
    });
    this.items = this.items.filter(i => i.qty > 0);
    if (adjusted) this.notify();
    return adjusted;
  },
  applyCoupon(code) {
    const c = coupons.find(cp => cp.code === code.toUpperCase());
    if (!c) return { success: false, msg: 'Invalid coupon code' };
    if (this.subtotal < c.minOrder) return { success: false, msg: `Min order ₹${c.minOrder} required` };
    this.coupon = c;
    this.notify();
    return { success: true, msg: `Coupon ${c.code} applied!` };
  },
  removeCoupon() { this.coupon = null; this.notify(); },
  get subtotal() { return this.items.reduce((sum, i) => sum + i.price * i.qty, 0); },
  get deliveryFee() { return this.subtotal >= 299 ? 0 : 25; },
  get packagingFee() { return this.items.length > 0 ? 9 : 0; },
  get platformFee() { return this.items.length > 0 ? 5 : 0; },
  get minOrderGap() { return Math.max(0, minOrderValue - this.subtotal); },
  get couponDiscount() {
    if (!this.coupon) return 0;
    if (this.coupon.type === 'flat') return this.coupon.discount;
    const d = Math.round(this.subtotal * this.coupon.discount / 100);
    return this.coupon.maxDiscount ? Math.min(d, this.coupon.maxDiscount) : d;
  },
  get savings() {
    return this.items.reduce((sum, i) => sum + Math.max(0, (i.originalPrice - i.price)) * i.qty, 0) + this.couponDiscount;
  },
  get total() {
    return Math.max(0, this.subtotal + this.deliveryFee + this.packagingFee + this.platformFee - this.couponDiscount);
  },
  get count() { return this.items.reduce((sum, i) => sum + i.qty, 0); },
  get stockIssues() {
    return this.items.filter(i => i.stock !== undefined && i.qty > i.stock);
  },
  listeners: [],
  subscribe(fn) { this.listeners.push(fn); },
  notify() { this.listeners.forEach(fn => fn(this)); }
};
