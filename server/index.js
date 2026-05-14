// Annsetu Backend — Express API Server
import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = 3000;

// ── Supabase Client ──
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;
let useSupabase = false;

if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    useSupabase = true;
    console.log('✅ Supabase connected:', SUPABASE_URL);
  } catch (err) {
    console.error('❌ Failed to initialize Supabase:', err.message);
    console.log('⚠️  Falling back to local JSON database');
  }
} else {
  console.log('⚠️  Supabase credentials not configured. Falling back to local JSON database.');
  console.log('💡 Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env file');
}

// ── Load Local DB Fallback ──
const DB_PATH = join(__dirname, 'data', 'db.json');
let db;

function loadDB() {
  try {
    db = JSON.parse(readFileSync(DB_PATH, 'utf-8'));
  } catch {
    console.error('Failed to load db.json, using defaults');
    db = { products: [], users: [], otps: {}, carts: {}, orders: [], hubs: [], farmers: [], stats: {}, categories: [] };
  }
}

function saveDB() {
  try {
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (e) {
    console.error('Failed to save db.json:', e.message);
  }
}

loadDB();

async function createSupabasePhoneUser({ phone, name = '', role = '', hub = null }) {
  if (!useSupabase || !supabase) return null;

  const { data, error } = await supabase.auth.admin.createUser({
    phone: phone.startsWith('+') ? phone : `+91${phone}`,
    phone_confirm: true,
    user_metadata: {
      full_name: name,
      role,
      hub,
    },
  });

  if (error) throw error;
  return data?.user ?? null;
}

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '10mb' }));  // allow base64 image uploads

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.url}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.send('<h1>Annsetu API Server is running.</h1><p>This is the backend API. Please open the Vite frontend URL (usually <a href="http://localhost:5173">http://localhost:5173</a> or <a href="http://localhost:5174">http://localhost:5174</a>) to view the application.</p>');
});

// ════════════════════════════════════════════
//  AUTH ROUTES
// ════════════════════════════════════════════

// Send OTP
app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    return res.status(400).json({ error: 'Valid phone number required' });
  }

  // Generate a 4-digit OTP (for demo, always 1234)
  const otp = '1234';
  db.otps[phone] = { otp, createdAt: Date.now(), attempts: 0 };
  saveDB();

  console.log(`📱 OTP for ${phone}: ${otp}`);
  res.json({ success: true, message: `OTP sent to +91 ${phone}` });
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP required' });
  }

  const stored = db.otps[phone];

  // Accept any 4-digit OTP for demo mode
  if (!otp || otp.length !== 4) {
    return res.status(400).json({ error: 'Invalid OTP format' });
  }

  // Find or create user
  let user = db.users.find(u => u.phone === phone);
  if (!user && useSupabase) {
    try {
      const authUser = await createSupabasePhoneUser({ phone });
      if (authUser?.id) {
        user = {
          id: authUser.id,
          phone,
          name: '',
          role: '',
          hub: '',
          createdAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.error('Supabase auth user creation error:', err.message);
    }
  }

  if (!user) {
    user = {
      id: randomUUID(),
      phone,
      name: '',
      role: '',
      hub: '',
      createdAt: new Date().toISOString()
    };

    if (useSupabase) {
      try {
        const { data: newUser, error } = await supabase.from('users').insert([{
          id: user.id,
          phone: user.phone,
          name: user.name,
          role: user.role,
          hub_id: null
        }]).select().single();
        if (!error && newUser) {
          user = newUser;
          console.log('✅ New user inserted into Supabase:', user.id);
        }
      } catch (err) {
        console.error('Failed to insert new user into Supabase:', err.message);
      }
    }
  }

  const existingUserIndex = db.users.findIndex(u => u.phone === phone);
  if (existingUserIndex >= 0) {
    db.users[existingUserIndex] = { ...db.users[existingUserIndex], ...user };
  } else {
    db.users.push(user);
  }

  // Clean up OTP
  delete db.otps[phone];
  saveDB();

  res.json({
    success: true,
    user,
    token: `annsetu_${user.id}_${Date.now()}`,
    isNewUser: !user.role
  });
});

// ════════════════════════════════════════════
//  USER ROUTES
// ════════════════════════════════════════════

// Register / Update user
app.post('/api/users', async (req, res) => {
  const { phone, name, role, hub } = req.body;

  try {
    if (useSupabase) {
      // Try to find existing user in Supabase
      const { data: existing } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (existing) {
        // Update existing user
        const { data: updated, error } = await supabase
          .from('users')
          .update({
            name: name || existing.name,
            role: role || existing.role,
            hub_id: hub || existing.hub_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return res.json({ success: true, user: updated });
      } else {
        const authUser = await createSupabasePhoneUser({ phone, name, role, hub });
        const userId = authUser?.id || randomUUID();

        // Create new user
        const { data: newUser, error } = await supabase
          .from('users')
          .insert([{
            id: userId,
            phone: phone || '',
            name: name || '',
            role: role || '',
            hub_id: hub || null
          }])
          .select()
          .single();

        if (error) throw error;
        console.log('✅ User created in Supabase:', newUser.id);
        return res.json({ success: true, user: newUser });
      }
    }
  } catch (err) {
    console.error('Supabase user creation error:', err.message);
    // Fall through to local DB
  }

  // Fallback to local JSON database
  let user = db.users.find(u => u.phone === phone);
  if (user) {
    // Update existing
    if (name) user.name = name;
    if (role) user.role = role;
    if (hub) user.hub = hub;
  } else {
    user = {
      id: randomUUID(),
      phone: phone || '',
      name: name || '',
      role: role || '',
      hub: hub || '',
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
  }

  saveDB();
  res.json({ success: true, user });
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    if (useSupabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.params.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (user) return res.json(user);
    }
  } catch (err) {
    console.error('Supabase user fetch error:', err.message);
  }

  // Fallback to local
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  const { name, role, hub } = req.body;

  try {
    if (useSupabase) {
      const { data: updated, error } = await supabase
        .from('users')
        .update({
          ...(name !== undefined && { name }),
          ...(role !== undefined && { role }),
          ...(hub !== undefined && { hub_id: hub }),
          updated_at: new Date().toISOString()
        })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (updated) return res.json({ success: true, user: updated });
    }
  } catch (err) {
    console.error('Supabase user update error:', err.message);
  }

  // Fallback to local
  const user = db.users.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (name !== undefined) user.name = name;
  if (role !== undefined) user.role = role;
  if (hub !== undefined) user.hub = hub;

  saveDB();
  res.json({ success: true, user });
});

// ════════════════════════════════════════════
//  PRODUCT ROUTES
// ════════════════════════════════════════════

// Get all products (with optional category filter)
app.get('/api/products', (req, res) => {
  let result = db.products;
  const { category, search } = req.query;

  if (category && category !== 'All') {
    result = result.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.farmer.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  res.json({
    products: result,
    categories: db.categories,
    total: result.length
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const related = db.products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);
  res.json({ product, related });
});

// ════════════════════════════════════════════
//  CART ROUTES
// ════════════════════════════════════════════

// Get cart
app.get('/api/cart/:userId', (req, res) => {
  const cart = db.carts[req.params.userId] || { items: [] };
  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const count = cart.items.reduce((sum, item) => sum + item.qty, 0);
  res.json({ ...cart, total, count });
});

// Add to cart
app.post('/api/cart/:userId', (req, res) => {
  const { productId, qty = 1 } = req.body;
  const userId = req.params.userId;

  const product = db.products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  if (!db.carts[userId]) {
    db.carts[userId] = { items: [] };
  }

  const existing = db.carts[userId].items.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    db.carts[userId].items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
      farmer: product.farmer,
      qty
    });
  }

  saveDB();
  const cart = db.carts[userId];
  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ success: true, cart: { ...cart, total } });
});

// Update cart item quantity
app.put('/api/cart/:userId', (req, res) => {
  const { productId, qty } = req.body;
  const userId = req.params.userId;

  if (!db.carts[userId]) return res.json({ success: true, cart: { items: [], total: 0 } });

  if (qty <= 0) {
    db.carts[userId].items = db.carts[userId].items.filter(i => i.id !== productId);
  } else {
    const item = db.carts[userId].items.find(i => i.id === productId);
    if (item) item.qty = qty;
  }

  saveDB();
  const cart = db.carts[userId];
  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  res.json({ success: true, cart: { ...cart, total } });
});

// Clear cart
app.delete('/api/cart/:userId', (req, res) => {
  db.carts[req.params.userId] = { items: [] };
  saveDB();
  res.json({ success: true });
});

// ════════════════════════════════════════════
//  CHECKOUT & SUPPLY CHAIN FLOW
// ════════════════════════════════════════════

app.post('/api/checkout', async (req, res) => {
  const { consumerId, items, hubId, deliveryType, paymentMethod } = req.body;
  if (!items || !items.length) return res.status(400).json({ error: 'Cart is empty' });

  try {
    if (useSupabase) {
      let totalAmount = 0;
      const successfulReserves = [];

      // 1. Reserve Stock Atomically
      for (const item of items) {
        // Fetch current price to lock it in
        const { data: inv } = await supabase.from('hub_inventory').select('price_per_kg').eq('id', item.id).single();
        if (!inv) throw new Error(`Item ${item.name} not found in inventory`);

        const itemTotal = Number(inv.price_per_kg) * item.qty;
        totalAmount += itemTotal;

        const { data: reserved, error } = await supabase.rpc('reserve_inventory_stock', {
          inventory_id: item.id,
          requested_qty: item.qty
        });

        if (error || !reserved) {
          // Manual Rollback for previously reserved items in this order
          for (const resItem of successfulReserves) {
             await supabase.rpc('reserve_inventory_stock', {
               inventory_id: resItem.id,
               requested_qty: -resItem.qty // Add back
             });
          }
          throw new Error(`Out of stock or insufficient quantity for ${item.name}`);
        }
        successfulReserves.push(item);
      }

      // Add fees
      totalAmount += 5; // Packaging
      totalAmount += 2; // Platform fee

      // 2. Create Order Record
      const orderId = randomUUID();
      const { data: order, error: orderErr } = await supabase.from('orders').insert([{
        id: orderId,
        consumer_id: consumerId,
        hub_id: hubId,
        total_amount: totalAmount,
        status: 'pending',
        delivery_type: deliveryType || 'pickup'
      }]).select().single();

      if (orderErr) throw orderErr;

      // 3. Create Order Items
      const orderItemsToInsert = items.map(i => ({
        order_id: orderId,
        hub_inventory_id: i.id,
        quantity: i.qty,
        price_at_time: i.price
      }));
      await supabase.from('order_items').insert(orderItemsToInsert);

      // 4. Create Order Timeline Tracking
      await supabase.from('order_tracking').insert([{
        order_id: orderId,
        status: 'Order Placed',
        description: 'Your order has been received and stock is reserved.'
      }]);

      return res.json({ success: true, orderId: order.id, totalAmount });
    }
  } catch (err) {
    console.error('Checkout error:', err.message);
    return res.status(400).json({ success: false, error: err.message });
  }

  // Fallback local logic (mock success for offline users)
  res.json({ success: true, orderId: 'mock-' + randomUUID().slice(0,8) });
});

// ════════════════════════════════════════════
//  ORDERS
// ════════════════════════════════════════════

// Place order
app.post('/api/orders', (req, res) => {
  const { userId, items, address, paymentMethod, total } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'Order must have items' });
  }

  const order = {
    id: `AN-${String(db.orders.length + 2847).padStart(4, '0')}`,
    userId: userId || 'guest',
    items,
    address: address || {},
    paymentMethod: paymentMethod || 'UPI',
    total: total || items.reduce((sum, i) => sum + i.price * i.qty, 0),
    status: 'confirmed',
    timeline: [
      { step: 'Order Placed', time: new Date().toLocaleString('en-IN'), done: true },
      { step: 'Picked from farm', time: '', done: false },
      { step: 'At local hub', time: '', done: false },
      { step: 'Delivered', time: '', done: false }
    ],
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);

  // Clear cart after order
  if (userId && db.carts[userId]) {
    db.carts[userId] = { items: [] };
  }

  saveDB();
  res.json({ success: true, order });
});

// Get user orders
app.get('/api/orders', (req, res) => {
  const { userId } = req.query;
  let orders = db.orders;
  if (userId) {
    orders = orders.filter(o => o.userId === userId);
  }
  // Return newest first
  res.json({ orders: orders.reverse() });
});

// Track order
app.get('/api/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// ════════════════════════════════════════════
//  HUB ROUTES
// ════════════════════════════════════════════

// List hubs
app.get('/api/hubs', async (_req, res) => {
  let allHubs = [...(db.hubs || [])];
  try {
    if (useSupabase) {
      const { data: hubs, error } = await supabase.from('hubs').select('*').order('created_at', { ascending: true });
      if (!error && hubs) {
        // Merge: Supabase hubs that aren't already in local get added
        for (const sh of hubs) {
          const localIdx = allHubs.findIndex(h => h.id === sh.id);
          if (localIdx === -1) {
            allHubs.push({ ...sh, location: sh.address || sh.location || '', radius: sh.coverage_km || 5 });
          }
        }
      }
    }
  } catch (err) {
    console.error('Supabase hubs list error:', err.message);
  }
  res.json({ hubs: allHubs });
});

// Create hub
app.post('/api/hubs', async (req, res) => {
  const { name, location, city, pincode, radius, hours, userId } = req.body;

  try {
    if (useSupabase) {
      const hubId = randomUUID();
      const { data: hub, error } = await supabase
        .from('hubs')
        .insert([{
          id: hubId,
          name: name || 'New Hub',
          location: location || '',
          city: city || '',
          pincode: pincode || '',
          radius: radius || 5,
          hours: hours || { open: '06:00', close: '21:00' },
          rating: 0,
          status: 'active',
          owner_id: userId || null,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      // Also save locally so PUT profile updates work in fallback
      const localHub = {
        id: hubId,
        name: name || 'New Hub',
        location: location || '',
        city: city || '',
        pincode: pincode || '',
        radius: radius || 5,
        hours: hours || { open: '06:00', close: '21:00' },
        rating: 0,
        status: 'active',
        ownerId: userId || null,
        createdAt: new Date().toISOString()
      };
      db.hubs.push(localHub);

      // Link hub to owner's user record
      if (userId) {
        await supabase
          .from('users')
          .update({ hub_id: hubId, updated_at: new Date().toISOString() })
          .eq('id', userId);
        const user = db.users.find(u => u.id === userId);
        if (user) user.hub = hubId;
      }

      saveDB();
      console.log('✅ Hub created in Supabase:', hubId);
      return res.json({ success: true, hub: localHub });
    }
  } catch (err) {
    console.error('Supabase hub creation error:', err.message);
  }

  // Fallback to local
  const hub = {
    id: `hub-${randomUUID().slice(0, 8)}`,
    name: name || 'New Hub',
    location: location || '',
    city: city || '',
    pincode: pincode || '',
    radius: radius || 5,
    hours: hours || { open: '06:00', close: '21:00' },
    rating: 0,
    status: 'active',
    ownerId: userId || null,
    createdAt: new Date().toISOString()
  };

  db.hubs.push(hub);

  // Link hub to owner's user record
  if (userId) {
    const user = db.users.find(u => u.id === userId);
    if (user) user.hub = hub.id;
  }

  saveDB();
  res.json({ success: true, hub });
});

// Get single hub
app.get('/api/hubs/:id', async (_req, res) => {
  const localHub = (db.hubs || []).find(h => h.id === _req.params.id);
  
  try {
    if (useSupabase) {
      const { data: sbHub, error } = await supabase.from('hubs').select('*').eq('id', _req.params.id).single();
      if (!error && sbHub) {
        // Merge: local profile data takes priority over Supabase base data
        const merged = {
          ...sbHub,
          location: sbHub.address || sbHub.location || '',
          radius: sbHub.coverage_km || 5,
          ...(localHub || {}) // local overrides (has profile fields like description, phone etc)
        };
        return res.json({ success: true, hub: merged });
      }
    }
  } catch (err) {
    console.error('Supabase get hub error:', err.message);
  }
  if (!localHub) return res.status(404).json({ error: 'Hub not found' });
  res.json({ success: true, hub: localHub });
});

// Update hub profile
app.put('/api/hubs/:id', async (req, res) => {
  const { name, location, city, pincode, radius, hours, description, phone, email, imageData, specialties } = req.body;

  try {
    if (useSupabase) {
      // Only update fields Supabase knows about
      const safeData = {};
      if (name !== undefined) safeData.name = name;
      if (location !== undefined) safeData.address = location;
      if (city !== undefined) safeData.city = city;
      if (pincode !== undefined) safeData.pincode = pincode;
      if (radius !== undefined) safeData.coverage_km = radius;
      safeData.updated_at = new Date().toISOString();

      const { error } = await supabase.from('hubs').update(safeData).eq('id', req.params.id);
      if (error) console.error('Supabase hub update (safe fields):', error.message);
    }
  } catch (err) {
    console.error('Supabase hub update error:', err.message);
  }

  // Fallback to local — create local copy if hub only exists in Supabase
  let hub = (db.hubs || []).find(h => h.id === req.params.id);
  if (!hub) {
    // Hub might exist in Supabase but not locally, create a local entry
    hub = { id: req.params.id, name: '', location: '', city: '', pincode: '', radius: 5, hours: { open: '06:00', close: '21:00' }, rating: 0, status: 'active', createdAt: new Date().toISOString() };
    db.hubs.push(hub);
  }

  if (name !== undefined) hub.name = name;
  if (location !== undefined) hub.location = location;
  if (city !== undefined) hub.city = city;
  if (pincode !== undefined) hub.pincode = pincode;
  if (radius !== undefined) hub.radius = radius;
  if (hours !== undefined) hub.hours = hours;
  if (description !== undefined) hub.description = description;
  if (phone !== undefined) hub.phone = phone;
  if (email !== undefined) hub.email = email;
  if (imageData !== undefined) hub.imageData = imageData;
  if (specialties !== undefined) hub.specialties = specialties;
  hub.updatedAt = new Date().toISOString();

  saveDB();
  res.json({ success: true, hub });
});

// Hub Inventory (Live Stock available for consumers)
app.get('/api/hub-inventory', async (req, res) => {
  const { hubId } = req.query;
  try {
    if (useSupabase) {
      let query = supabase.from('hub_inventory').select(`
        id,
        product_name,
        category,
        price_per_kg,
        available_stock,
        image_data,
        batch_id
      `).gt('available_stock', 0); // Only show items with stock

      if (hubId) {
        query = query.eq('hub_id', hubId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return res.json({ success: true, inventory: data });
    }
  } catch (err) {
    console.error('Fetch hub inventory error:', err.message);
  }

  // Fallback
  res.json({ success: true, inventory: [] });
});

// ════════════════════════════════════════════
//  FARMER ROUTES
// ════════════════════════════════════════════

// Farmer dashboard
app.get('/api/farmers/dashboard/:id', (req, res) => {
  const farmer = db.farmers.find(f => f.id === req.params.id);
  if (!farmer) {
    // Return default stats for demo
    return res.json({
      id: req.params.id,
      name: 'Ramesh Patel',
      location: 'Gujarat',
      earnings: 48250,
      totalOrders: 156,
      pendingOrders: 3,
      productCount: 8,
      weeklyEarnings: [
        { day: 'Mon', amount: 1200 },
        { day: 'Tue', amount: 1850 },
        { day: 'Wed', amount: 980 },
        { day: 'Thu', amount: 2200 },
        { day: 'Fri', amount: 1650 },
        { day: 'Sat', amount: 2800 },
        { day: 'Sun', amount: 1400 }
      ]
    });
  }
  res.json(farmer);
});

// Save / update farmer profile (farm details separate from user record)
app.put('/api/farmer-profile/:userId', (req, res) => {
  const { farmName, location, crops, farmSize } = req.body;
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.farmProfile = {
    farmName: farmName || '',
    location: location || '',
    crops: crops || [],
    farmSize: farmSize || 0,
    updatedAt: new Date().toISOString()
  };
  saveDB();
  res.json({ success: true, farmProfile: user.farmProfile });
});

// Get farmer profile
app.get('/api/farmer-profile/:userId', (req, res) => {
  const user = db.users.find(u => u.id === req.params.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ success: true, farmProfile: user.farmProfile || {} });
});

// Register farmer
app.post('/api/farmers', (req, res) => {
  const { name, farmName, location, crops, farmSize } = req.body;

  const farmer = {
    id: `farmer-${randomUUID().slice(0, 8)}`,
    name: name || '',
    farmName: farmName || '',
    location: location || '',
    crops: crops || [],
    farmSize: farmSize || 0,
    earnings: 0,
    totalOrders: 0,
    pendingOrders: 0,
    productCount: 0,
    weeklyEarnings: [],
    createdAt: new Date().toISOString()
  };

  db.farmers.push(farmer);
  saveDB();
  res.json({ success: true, farmer });
});

// ── Farmer Product Listings ──
if (!db.farmerListings) db.farmerListings = [];

// Get all farmer listings (for consumer feed - recent first)
app.get('/api/farmer-products/recent', (req, res) => {
  const listings = [...(db.farmerListings || [])].reverse().slice(0, 20);
  res.json({ success: true, listings });
});

// Get listings by farmer userId
app.get('/api/farmer-products/:userId', (req, res) => {
  const listings = (db.farmerListings || []).filter(l => l.userId === req.params.userId);
  res.json({ success: true, listings: listings.reverse() });
});

// Add new farmer product listing (with optional image + hub)
app.post('/api/farmer-products', async (req, res) => {
  const { userId, farmerName, name, category, price, unit, stock, description, imageData, hubId, hubName } = req.body;
  if (!name || !price || !userId) {
    return res.status(400).json({ error: 'name, price and userId are required' });
  }

  try {
    if (useSupabase) {
      const listingId = randomUUID();
      const { data: listing, error } = await supabase
        .from('farmer_listings')
        .insert([{
          id: listingId,
          user_id: userId,
          name,
          category: category || 'Vegetables',
          price: Number(price),
          unit: unit || 'kg',
          stock: Number(stock) || 0,
          description: description || '',
          image_data: imageData || null,
          hub_id: hubId || null
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Farmer listing created in Supabase:', listingId);
      return res.json({ success: true, listing });
    }
  } catch (err) {
    console.error('Supabase farmer listing error:', err.message);
  }

  // Fallback to local
  const listing = {
    id: randomUUID(),
    userId,
    farmerName: farmerName || 'Farmer',
    name,
    category: category || 'Vegetables',
    price: Number(price),
    unit: unit || 'kg',
    stock: Number(stock) || 0,
    description: description || '',
    imageData: imageData || null,
    hubId:    hubId    || null,   // delivery hub
    hubName:  hubName  || null,
    listedAt: new Date().toISOString(),
  };
  if (!db.farmerListings) db.farmerListings = [];
  db.farmerListings.push(listing);
  saveDB();
  res.json({ success: true, listing });
});

// Delete a farmer listing
app.delete('/api/farmer-products/:id', (req, res) => {
  if (!db.farmerListings) return res.json({ success: true });
  db.farmerListings = db.farmerListings.filter(l => l.id !== req.params.id);
  saveDB();
  res.json({ success: true });
});

// ════════════════════════════════════════════
//  NEW CONSUMER OPERATIONS ROUTES
// ════════════════════════════════════════════

// Subscriptions
app.get('/api/subscriptions/:userId', (req, res) => {
  // Mock response
  res.json({ success: true, subscriptions: [] });
});

app.post('/api/subscriptions', (req, res) => {
  res.json({ success: true, message: 'Subscription created', id: randomUUID() });
});

app.put('/api/subscriptions/:id', (req, res) => {
  res.json({ success: true, message: 'Subscription updated' });
});

// ── Orders (farmer listing purchases) ──
if (!db.farmerOrders) db.farmerOrders = [];
if (!db.notifications) db.notifications = [];

// Place an order for a farmer's listing (Instant Buy)
app.post('/api/orders/instant', async (req, res) => {
  console.log('Order Payload:', JSON.stringify(req.body).slice(0, 500) + '...');
  const {
    consumerId, consumerName,
    farmerId,   farmerName,
    listingId,  productName,
    quantity,   price, unit,
    hubId,      hubName,
    imageData
  } = req.body;

  if (!price) {
    console.error('Order Error: Missing price');
    return res.status(400).json({ success: false, error: 'Price is required' });
  }

  try {
    if (useSupabase) {
      const orderId = randomUUID();
      const { data: order, error } = await supabase
        .from('orders')
        .insert([{
          id: orderId,
          user_id: consumerId || null,
          product_id: listingId || null,
          quantity: Number(quantity) || 1,
          total_price: Number(price) * (Number(quantity) || 1),
          status: 'placed'
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('✅ Order created in Supabase:', orderId);
      return res.json({ success: true, order });
    }
  } catch (err) {
    console.error('Supabase order error:', err.message);
  }

  // Fallback to local
  const order = {
    id:           randomUUID(),
    consumerId:   consumerId   || null,
    consumerName: consumerName || 'Consumer',
    farmerId:     farmerId     || null,
    farmerName:   farmerName   || 'Farmer',
    listingId:    listingId    || null,
    productName:  productName  || 'Produce',
    imageData:    imageData    || null,
    quantity:     Number(quantity) || 1,
    price:        Number(price),
    unit:         unit   || 'kg',
    hubId:        hubId  || null,
    hubName:      hubName || 'Hub',
    status:       'placed',
    total:        Number(price) * (Number(quantity) || 1),
    placedAt:     new Date().toISOString()
  };

  if (!db.farmerOrders) db.farmerOrders = [];
  db.farmerOrders.push(order);

  // 🔔 Notify the hub owner if available, otherwise the farmer
  const hubOwnerId = hubId
    ? (db.hubs || []).find(h => h.id === hubId)?.ownerId
    : null;
  const notifyUserId = hubOwnerId || farmerId;

  if (notifyUserId) {
    if (!db.notifications) db.notifications = [];
    db.notifications.push({
      id:        randomUUID(),
      userId:    notifyUserId,
      title:     '🛒 New Order Received!',
      body:      `${consumerName || 'A customer'} ordered ${order.quantity} ${unit} of ${productName}. Deliver to ${hubName}.`,
      type:      'new_order',
      data:      { orderId: order.id, hubId, hubName, productName, quantity: order.quantity },
      read:      false,
      createdAt: new Date().toISOString()
    });
  }

  saveDB();
  res.json({ success: true, order });
});

// Get orders placed to a farmer
app.get('/api/farmer-orders/:farmerId', (req, res) => {
  const orders = (db.farmerOrders || [])
    .filter(o => o.farmerId === req.params.farmerId)
    .reverse();
  res.json({ success: true, orders });
});

// Get orders routed to a hub
app.get('/api/hub-orders/:hubId', (req, res) => {
  const orders = (db.farmerOrders || [])
    .filter(o => o.hubId === req.params.hubId)
    .reverse();
  res.json({ success: true, orders });
});

// Get orders placed by a consumer
app.get('/api/consumer-orders/:consumerId', (req, res) => {
  const orders = (db.farmerOrders || [])
    .filter(o => o.consumerId === req.params.consumerId)
    .reverse();
  res.json({ success: true, orders });
});

// Update order status
app.put('/api/orders/:id/status', (req, res) => {
  const order = (db.farmerOrders || []).find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  order.status = req.body.status || order.status;
  // Notify consumer on status change
  if (order.consumerId && req.body.status) {
    if (!db.notifications) db.notifications = [];
    const statusLabels = { accepted: 'accepted your order', out_for_delivery: 'is on the way to your hub', delivered: 'has been delivered to your hub' };
    if (statusLabels[req.body.status]) {
      db.notifications.push({
        id: randomUUID(), userId: order.consumerId,
        title: '📦 Order Update',
        body: `Your ${order.productName} from ${order.farmerName} ${statusLabels[req.body.status]}.`,
        type: 'order_update',
        data: { orderId: order.id },
        read: false, createdAt: new Date().toISOString()
      });
    }
  }
  saveDB();
  res.json({ success: true, order });
});

// ── Notifications ──
// Get notifications for a user
app.get('/api/notifications/:userId', (req, res) => {
  const notifs = (db.notifications || [])
    .filter(n => n.userId === req.params.userId)
    .reverse()
    .slice(0, 50);
  res.json({ success: true, notifications: notifs });
});

// Mark notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  const n = (db.notifications || []).find(n => n.id === req.params.id);
  if (n) { n.read = true; saveDB(); }
  res.json({ success: true });
});

// Mark all notifications as read for a user
app.put('/api/notifications/read-all/:userId', (req, res) => {
  (db.notifications || [])
    .filter(n => n.userId === req.params.userId)
    .forEach(n => { n.read = true; });
  saveDB();
  res.json({ success: true });
});

// Support
app.post('/api/support/ticket', (req, res) => {
  res.json({ success: true, message: 'Support ticket created', ticketId: `TCK-${randomUUID().slice(0, 6)}` });
});

// Coupons
app.post('/api/coupons/validate', (req, res) => {
  const { code } = req.body;
  if (code === 'FRESH50') {
    res.json({ success: true, discount: 50, type: 'flat' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid coupon code' });
  }
});

// Delivery Slots
app.get('/api/delivery-slots', (req, res) => {
  res.json({ success: true, slots: [] });
});

// ════════════════════════════════════════════
//  STATS ROUTE
// ════════════════════════════════════════════
app.get('/api/stats', (_req, res) => {
  res.json(db.stats);
});

// ════════════════════════════════════════════
//  HEALTH CHECK
// ════════════════════════════════════════════
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    users: db.users.length,
    orders: db.orders.length,
    products: db.products.length
  });
});

// ── Start Server ──
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🌱 Annsetu API Server Running     ║
  ║   http://localhost:${PORT}             ║
  ╚══════════════════════════════════════╝
  
  Endpoints:
    POST /api/auth/send-otp
    POST /api/auth/verify-otp
    GET  /api/products
    GET  /api/products/:id
    POST /api/cart/:userId
    GET  /api/cart/:userId
    POST /api/orders
    GET  /api/orders
    GET  /api/hubs
    GET  /api/stats
    GET  /api/health
  `);
});

// Trigger restart
