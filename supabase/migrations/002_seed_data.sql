-- ═══════════════════════════════════════════════════════════════
--  ANNSETU — Seed Data
--  Populate catalog from mock-data.js
-- ═══════════════════════════════════════════════════════════════


-- ── Categories ──
INSERT INTO public.categories (name, emoji, sort_order) VALUES
  ('Vegetables',   '🥬', 1),
  ('Fruits',       '🍎', 2),
  ('Leafy Greens', '🌿', 3),
  ('Dairy',        '🥛', 4),
  ('Grains',       '🌾', 5);


-- ── Hubs (3 Pune hubs) ──
INSERT INTO public.hubs (id, name, address, city, pincode, coverage_km, status, rating, capacity, current_load, surge_window) VALUES
  ('a1000001-0000-0000-0000-000000000001', 'Pune Central Hub', 'Baner Road, Pune',  'Pune', '411045', 5,  'active', 4.8, 420, 312, '7 PM - 9 PM'),
  ('a1000001-0000-0000-0000-000000000002', 'Pune West Hub',    'Aundh, Pune',       'Pune', '411007', 6,  'active', 4.7, 360, 248, '6 PM - 8 PM'),
  ('a1000001-0000-0000-0000-000000000003', 'Pune East Hub',    'Kharadi, Pune',     'Pune', '411014', 7,  'active', 4.6, 320, 190, '7 PM - 10 PM');


-- ── Delivery Slots (linked to Pune Central Hub) ──
INSERT INTO public.delivery_slots (hub_id, label, period, is_available, is_surge, surge_multiplier, capacity, remaining, is_recommended) VALUES
  ('a1000001-0000-0000-0000-000000000001', '7 AM – 9 AM',   'Morning',   true,  false, 0,    140, 52,  false),
  ('a1000001-0000-0000-0000-000000000001', '9 AM – 11 AM',  'Morning',   true,  false, 0,    160, 68,  true),
  ('a1000001-0000-0000-0000-000000000001', '11 AM – 1 PM',  'Afternoon', true,  false, 0,    140, 41,  false),
  ('a1000001-0000-0000-0000-000000000001', '1 PM – 3 PM',   'Afternoon', true,  true,  0.08, 120, 18,  false),
  ('a1000001-0000-0000-0000-000000000001', '3 PM – 5 PM',   'Evening',   true,  false, 0,    150, 60,  false),
  ('a1000001-0000-0000-0000-000000000001', '5 PM – 7 PM',   'Evening',   false, false, 0,    140, 0,   false),
  ('a1000001-0000-0000-0000-000000000001', '7 PM – 9 PM',   'Night',     true,  true,  0.12, 110, 12,  false);


-- ── Products (24 items from mock-data.js) ──
INSERT INTO public.products (id, name, category, price, original_price, unit, stock, farmer_name, farm_location, farm_distance_km, freshness, harvested_at, is_organic, is_seasonal, is_subscribable, nutrition, delivery_eta, image, rating, review_count) VALUES
  (1,  'Organic Tomatoes',   'Vegetables',   45,  55,  'kg',     120, 'Ramesh Patel',       'Gujarat',          3.2,  'Harvested Today', now(),                  true,  false, true,  '{"calories":18,"protein":0.9,"fiber":1.2}',   '30 min', '🍅', 4.5, 128),
  (2,  'Fresh Spinach',      'Leafy Greens', 30,  30,  'bunch',  80,  'Lakshmi Devi',       'Haryana',          5.1,  'Harvested Today', now(),                  true,  false, true,  '{"calories":23,"protein":2.9,"fiber":2.2}',   '30 min', '🥬', 4.7, 93),
  (3,  'Wheat Grains',       'Grains',       38,  42,  'kg',     200, 'Suresh Kumar',       'Punjab',           12,   'This Season',     '2026-04-20T00:00:00Z', false, true,  false, '{"calories":340,"protein":12,"fiber":12.2}',  '2 hrs',  '🌾', 4.3, 67),
  (4,  'Alphonso Mangoes',   'Fruits',       320, 400, 'dozen',  15,  'Anand Deshmukh',     'Maharashtra',      8.5,  '2 Days Ago',      '2026-05-09T00:00:00Z', true,  true,  false, '{"calories":60,"protein":0.8,"fiber":1.6}',   '2 hrs',  '🥭', 4.9, 245),
  (5,  'Green Peas',         'Vegetables',   60,  60,  'kg',     45,  'Meena Sharma',       'Uttar Pradesh',    6.2,  'Harvested Today', now(),                  false, true,  false, '{"calories":81,"protein":5.4,"fiber":5.1}',   '45 min', '🫛', 4.4, 56),
  (6,  'Farm Carrots',       'Vegetables',   35,  45,  'kg',     8,   'Rajesh Singh',       'Himachal Pradesh', 4.3,  'Yesterday',       '2026-05-10T00:00:00Z', true,  false, true,  '{"calories":41,"protein":0.9,"fiber":2.8}',   '30 min', '🥕', 4.6, 89),
  (7,  'Basmati Rice',       'Grains',       95,  110, 'kg',     150, 'Harpal Singh',       'Punjab',           14,   'This Season',     '2026-03-15T00:00:00Z', false, false, true,  '{"calories":350,"protein":7.1,"fiber":0.4}',  '2 hrs',  '🍚', 4.5, 112),
  (8,  'Fresh Potatoes',     'Vegetables',   25,  30,  'kg',     5,   'Kamla Devi',         'Uttar Pradesh',    7.8,  'This Week',       '2026-05-06T00:00:00Z', false, false, true,  '{"calories":77,"protein":2,"fiber":2.2}',     '45 min', '🥔', 4.2, 74),
  (9,  'Red Onions',         'Vegetables',   28,  28,  'kg',     200, 'Vishnu Patil',       'Maharashtra',      2.5,  'Yesterday',       '2026-05-10T00:00:00Z', false, false, true,  '{"calories":40,"protein":1.1,"fiber":1.7}',   '30 min', '🧅', 4.3, 156),
  (10, 'Cauliflower',        'Vegetables',   40,  50,  'piece',  35,  'Asha Kumari',        'Bihar',            9.1,  'Harvested Today', now(),                  true,  true,  false, '{"calories":25,"protein":2,"fiber":2}',       '45 min', '🥦', 4.4, 42),
  (11, 'Fresh Capsicum',     'Vegetables',   55,  65,  'kg',     25,  'Ravi Tiwari',        'Karnataka',        3.7,  'Harvested Today', now(),                  true,  false, false, '{"calories":20,"protein":0.9,"fiber":1.7}',   '30 min', '🫑', 4.3, 31),
  (12, 'Ripe Bananas',       'Fruits',       40,  40,  'dozen',  60,  'Sunita Reddy',       'Tamil Nadu',       6.4,  'Yesterday',       '2026-05-10T00:00:00Z', false, false, true,  '{"calories":89,"protein":1.1,"fiber":2.6}',   '30 min', '🍌', 4.6, 178),
  (13, 'Kashmir Apples',     'Fruits',       180, 220, 'kg',     20,  'Farooq Ahmed',       'Kashmir',          18,   '3 Days Ago',      '2026-05-08T00:00:00Z', true,  true,  false, '{"calories":52,"protein":0.3,"fiber":2.4}',   '2 hrs',  '🍎', 4.8, 203),
  (14, 'Sweet Pomegranate',  'Fruits',       150, 180, 'kg',     18,  'Ganesh Mane',        'Maharashtra',      5.9,  'Yesterday',       '2026-05-10T00:00:00Z', false, true,  false, '{"calories":83,"protein":1.7,"fiber":4}',     '45 min', '🫐', 4.5, 87),
  (15, 'Farm Milk',          'Dairy',        65,  65,  'litre',  100, 'Gopal Dairy Farm',   'Gujarat',          1.8,  'Harvested Today', now(),                  true,  false, true,  '{"calories":62,"protein":3.2,"fiber":0}',     '20 min', '🥛', 4.9, 312),
  (16, 'Fresh Curd',         'Dairy',        45,  50,  'kg',     60,  'Gopal Dairy Farm',   'Gujarat',          1.8,  'Today',           now(),                  true,  false, true,  '{"calories":60,"protein":3.5,"fiber":0}',     '20 min', '🍶', 4.7, 145),
  (17, 'Farm Paneer',        'Dairy',        280, 320, 'kg',     12,  'Gopal Dairy Farm',   'Gujarat',          1.8,  'Today',           now(),                  true,  false, false, '{"calories":265,"protein":18.3,"fiber":0}',   '30 min', '🧀', 4.8, 98),
  (18, 'Pure Desi Ghee',     'Dairy',        550, 650, 'kg',     25,  'Gopal Dairy Farm',   'Gujarat',          1.8,  'This Week',       '2026-05-07T00:00:00Z', true,  false, false, '{"calories":900,"protein":0,"fiber":0}',      '45 min', '🫕', 4.9, 267),
  (19, 'Fresh Methi',        'Leafy Greens', 20,  25,  'bunch',  40,  'Lakshmi Devi',       'Haryana',          5.1,  'Harvested Today', now(),                  true,  true,  true,  '{"calories":49,"protein":4.4,"fiber":3.7}',   '30 min', '🌿', 4.5, 64),
  (20, 'Green Coriander',    'Leafy Greens', 15,  15,  'bunch',  90,  'Lakshmi Devi',       'Haryana',          5.1,  'Harvested Today', now(),                  true,  false, true,  '{"calories":23,"protein":2.1,"fiber":2.8}',   '30 min', '🌱', 4.6, 112),
  (21, 'Toor Dal',           'Grains',       120, 140, 'kg',     80,  'Suresh Kumar',       'Punjab',           12,   'This Season',     '2026-04-10T00:00:00Z', false, false, true,  '{"calories":343,"protein":22,"fiber":15}',    '2 hrs',  '🫘', 4.4, 88),
  (22, 'Fresh Cucumber',     'Vegetables',   30,  30,  'kg',     55,  'Ravi Tiwari',        'Karnataka',        3.7,  'Harvested Today', now(),                  false, false, false, '{"calories":15,"protein":0.7,"fiber":0.5}',   '30 min', '🥒', 4.3, 45),
  (23, 'Watermelon',         'Fruits',       25,  30,  'kg',     30,  'Sunita Reddy',       'Tamil Nadu',       6.4,  'Yesterday',       '2026-05-10T00:00:00Z', false, true,  false, '{"calories":30,"protein":0.6,"fiber":0.4}',   '45 min', '🍉', 4.7, 134),
  (24, 'Fresh Guava',        'Fruits',       60,  70,  'kg',     22,  'Anand Deshmukh',     'Maharashtra',      8.5,  'Yesterday',       '2026-05-10T00:00:00Z', true,  true,  false, '{"calories":68,"protein":2.6,"fiber":5.4}',   '45 min', '🍐', 4.5, 73);


-- ── Inventory Batches ──
INSERT INTO public.inventory_batches (id, product_id, hub_id, harvested_at, expiry_at, qty, remaining, grade, fifo_rank) VALUES
  ('batch-AN-1001', 1,  'a1000001-0000-0000-0000-000000000001', '2026-05-11T04:30:00Z', '2026-05-13T04:30:00Z', 120, 82, 'A', 1),
  ('batch-AN-1002', 2,  'a1000001-0000-0000-0000-000000000001', '2026-05-11T05:10:00Z', '2026-05-12T05:10:00Z', 80,  44, 'A', 1),
  ('batch-AN-1003', 6,  'a1000001-0000-0000-0000-000000000001', '2026-05-10T06:00:00Z', '2026-05-12T06:00:00Z', 40,  12, 'A', 2),
  ('batch-AN-1004', 15, 'a1000001-0000-0000-0000-000000000001', '2026-05-11T03:40:00Z', '2026-05-12T03:40:00Z', 160, 96, 'A', 1),
  ('batch-AN-1005', 8,  'a1000001-0000-0000-0000-000000000002', '2026-05-10T05:30:00Z', '2026-05-14T05:30:00Z', 60,  18, 'B', 1),
  ('batch-AN-1006', 4,  'a1000001-0000-0000-0000-000000000002', '2026-05-09T05:00:00Z', '2026-05-13T05:00:00Z', 25,  8,  'A', 1),
  ('batch-AN-1007', 12, 'a1000001-0000-0000-0000-000000000003', '2026-05-10T04:30:00Z', '2026-05-12T04:30:00Z', 90,  40, 'A', 1);


-- ── Coupons ──
INSERT INTO public.coupons (code, discount, type, max_discount, min_order, description, is_active) VALUES
  ('FRESH50',  50, 'flat',    NULL, 200, '₹50 off on orders above ₹200',   true),
  ('FIRST20',  20, 'percent', 100,  150, '20% off up to ₹100',             true),
  ('VEGGIES',  30, 'flat',    NULL, 100, '₹30 off on vegetables',          true);


-- ── Banners ──
INSERT INTO public.banners (title, subtitle, cta, gradient, color, is_active, sort_order) VALUES
  ('Farm-Fresh
Delivered Fast',    'From harvest to your door in 30 min',     'Shop Now',  'linear-gradient(135deg, #16a34a 0%, #15803d 100%)', '#fff', true, 1),
  ('Mango Season
is Here! 🥭',      'Alphonso mangoes from Ratnagiri farms',    'Order Now', 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', '#fff', true, 2),
  ('Subscribe &
Save 15%',          'Daily milk, weekly veggies & more',        'Start Plan','linear-gradient(135deg, #166534 0%, #14532d 100%)', '#fff', true, 3);


-- ── Platform Stats ──
INSERT INTO public.platform_stats (id, total_farmers, total_hubs, total_orders, total_families) VALUES
  (1, 2847, 156, 48520, 12340);


-- ── Delivery Partners (sample) ──
INSERT INTO public.delivery_partners (name, phone, rating, total_deliveries, hub_id, is_active) VALUES
  ('Rahul Kumar',  '+919876543210', 4.8, 1200, 'a1000001-0000-0000-0000-000000000001', true),
  ('Neha Rao',     '+919812345678', 4.7, 860,  'a1000001-0000-0000-0000-000000000001', true),
  ('Ajay Singh',   '+919845678123', 4.9, 990,  'a1000001-0000-0000-0000-000000000002', true);


-- ═══════════════════════════════════════════════════════════════
--  VERIFY
-- ═══════════════════════════════════════════════════════════════
SELECT 'Schema creation complete!' AS status,
       (SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') AS total_tables,
       (SELECT count(*) FROM public.products) AS total_products,
       (SELECT count(*) FROM public.hubs) AS total_hubs,
       (SELECT count(*) FROM public.categories) AS total_categories;
