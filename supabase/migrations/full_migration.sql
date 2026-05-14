-- ═══════════════════════════════════════════════════════════════
--  ANNSETU — Complete Supabase Database Schema
--  Farm-to-Family Commerce Platform
--  21 Tables · RLS · Indexes · Seed Data
-- ═══════════════════════════════════════════════════════════════

-- ── Utility: updated_at trigger ──
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ═══════════════════════════════════════════════════════════════
--  1. USERS & AUTH
-- ═══════════════════════════════════════════════════════════════

-- 1a. users
CREATE TABLE public.users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         text UNIQUE NOT NULL,
  name          text DEFAULT '',
  role          text DEFAULT '' CHECK (role IN ('', 'consumer', 'farmer', 'hub', 'admin')),
  hub_id        uuid,  -- FK added after hubs table
  avatar_url    text,
  referral_code text UNIQUE,
  wallet_balance integer DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_users_phone ON public.users(phone);
CREATE INDEX idx_users_role ON public.users(role);

-- 1b. otps
CREATE TABLE public.otps (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       text NOT NULL,
  otp         text NOT NULL,
  attempts    integer DEFAULT 0,
  expires_at  timestamptz NOT NULL DEFAULT (now() + interval '5 minutes'),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_otps_phone ON public.otps(phone);
CREATE INDEX idx_otps_expires ON public.otps(expires_at);

-- 1c. addresses
CREATE TABLE public.addresses (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label         text DEFAULT 'Home',
  address_line  text NOT NULL,
  city          text DEFAULT '',
  pincode       text DEFAULT '',
  lat           double precision,
  lng           double precision,
  is_default    boolean DEFAULT false,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_addresses_user ON public.addresses(user_id);

-- 1d. farm_profiles
CREATE TABLE public.farm_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  farm_name       text DEFAULT '',
  location        text DEFAULT '',
  crops           text[] DEFAULT '{}',
  farm_size_acres numeric DEFAULT 0,
  is_organic      boolean DEFAULT false,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

CREATE TRIGGER farm_profiles_updated_at
  BEFORE UPDATE ON public.farm_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ═══════════════════════════════════════════════════════════════
--  2. HUBS & LOGISTICS
-- ═══════════════════════════════════════════════════════════════

-- 9. hubs
CREATE TABLE public.hubs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  address       text DEFAULT '',
  city          text DEFAULT '',
  pincode       text DEFAULT '',
  lat           double precision,
  lng           double precision,
  coverage_km   numeric DEFAULT 5,
  status        text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  rating        numeric(2,1) DEFAULT 0,
  capacity      integer DEFAULT 300,
  current_load  integer DEFAULT 0,
  surge_window  text DEFAULT '',
  hours_open    time DEFAULT '06:00',
  hours_close   time DEFAULT '21:00',
  owner_id      uuid REFERENCES public.users(id) ON DELETE SET NULL,
  created_at    timestamptz DEFAULT now()
);

CREATE INDEX idx_hubs_city ON public.hubs(city);
CREATE INDEX idx_hubs_status ON public.hubs(status);
CREATE INDEX idx_hubs_owner ON public.hubs(owner_id);

-- Now add FK from users.hub_id → hubs.id
ALTER TABLE public.users
  ADD CONSTRAINT fk_users_hub FOREIGN KEY (hub_id) REFERENCES public.hubs(id) ON DELETE SET NULL;

-- 10. delivery_slots
CREATE TABLE public.delivery_slots (
  id                serial PRIMARY KEY,
  hub_id            uuid REFERENCES public.hubs(id) ON DELETE CASCADE,
  label             text NOT NULL,
  period            text DEFAULT 'Morning',
  is_available      boolean DEFAULT true,
  is_surge          boolean DEFAULT false,
  surge_multiplier  numeric DEFAULT 0,
  capacity          integer DEFAULT 100,
  remaining         integer DEFAULT 100,
  is_recommended    boolean DEFAULT false
);

CREATE INDEX idx_slots_hub ON public.delivery_slots(hub_id);

-- 16. delivery_partners
CREATE TABLE public.delivery_partners (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text NOT NULL,
  phone             text DEFAULT '',
  rating            numeric(2,1) DEFAULT 0,
  total_deliveries  integer DEFAULT 0,
  hub_id            uuid REFERENCES public.hubs(id) ON DELETE SET NULL,
  is_active         boolean DEFAULT true
);


-- ═══════════════════════════════════════════════════════════════
--  3. CATALOG & INVENTORY
-- ═══════════════════════════════════════════════════════════════

-- 5. categories
CREATE TABLE public.categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text UNIQUE NOT NULL,
  emoji       text DEFAULT '',
  sort_order  integer DEFAULT 0
);

-- 6. products
CREATE TABLE public.products (
  id               serial PRIMARY KEY,
  name             text NOT NULL,
  category_id      uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  category         text DEFAULT '',
  price            integer NOT NULL,
  original_price   integer,
  unit             text DEFAULT 'kg',
  stock            integer DEFAULT 0,
  farmer_id        uuid REFERENCES public.users(id) ON DELETE SET NULL,
  farmer_name      text DEFAULT '',
  farm_location    text DEFAULT '',
  farm_distance_km numeric DEFAULT 0,
  freshness        text DEFAULT '',
  harvested_at     timestamptz,
  is_organic       boolean DEFAULT false,
  is_seasonal      boolean DEFAULT false,
  is_subscribable  boolean DEFAULT false,
  nutrition        jsonb DEFAULT '{}',
  delivery_eta     text DEFAULT '30 min',
  image            text DEFAULT '',
  rating           numeric(2,1) DEFAULT 0,
  review_count     integer DEFAULT 0,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_farmer ON public.products(farmer_id);
CREATE INDEX idx_products_organic ON public.products(is_organic);
CREATE INDEX idx_products_subscribable ON public.products(is_subscribable);

-- 7. farmer_listings
CREATE TABLE public.farmer_listings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  farmer_name   text DEFAULT '',
  name          text NOT NULL,
  category      text DEFAULT 'Vegetables',
  price         integer NOT NULL,
  unit          text DEFAULT 'kg',
  stock         integer DEFAULT 0,
  description   text DEFAULT '',
  image_url     text,
  hub_id        uuid REFERENCES public.hubs(id) ON DELETE SET NULL,
  hub_name      text DEFAULT '',
  is_active     boolean DEFAULT true,
  listed_at     timestamptz DEFAULT now()
);

CREATE INDEX idx_listings_user ON public.farmer_listings(user_id);
CREATE INDEX idx_listings_hub ON public.farmer_listings(hub_id);
CREATE INDEX idx_listings_active ON public.farmer_listings(is_active);

-- 8. inventory_batches
CREATE TABLE public.inventory_batches (
  id            text PRIMARY KEY,
  product_id    integer REFERENCES public.products(id) ON DELETE CASCADE,
  hub_id        uuid REFERENCES public.hubs(id) ON DELETE CASCADE,
  harvested_at  timestamptz,
  expiry_at     timestamptz,
  qty           integer DEFAULT 0,
  remaining     integer DEFAULT 0,
  grade         text DEFAULT 'A' CHECK (grade IN ('A', 'B', 'C')),
  fifo_rank     integer DEFAULT 1
);

CREATE INDEX idx_batches_product ON public.inventory_batches(product_id);
CREATE INDEX idx_batches_hub ON public.inventory_batches(hub_id);
CREATE INDEX idx_batches_expiry ON public.inventory_batches(expiry_at);


-- ═══════════════════════════════════════════════════════════════
--  4. COMMERCE
-- ═══════════════════════════════════════════════════════════════

-- 11. cart_items
CREATE TABLE public.cart_items (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id  integer NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at    timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_cart_user ON public.cart_items(user_id);

-- 12. coupons
CREATE TABLE public.coupons (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code          text UNIQUE NOT NULL,
  discount      integer NOT NULL,
  type          text NOT NULL CHECK (type IN ('flat', 'percent')),
  max_discount  integer,
  min_order     integer DEFAULT 0,
  description   text DEFAULT '',
  is_active     boolean DEFAULT true,
  expires_at    timestamptz
);

-- 13. orders
CREATE TABLE public.orders (
  id                    text PRIMARY KEY,
  consumer_id           uuid REFERENCES public.users(id) ON DELETE SET NULL,
  consumer_name         text DEFAULT '',
  farmer_id             uuid REFERENCES public.users(id) ON DELETE SET NULL,
  farmer_name           text DEFAULT '',
  listing_id            uuid REFERENCES public.farmer_listings(id) ON DELETE SET NULL,
  hub_id                uuid REFERENCES public.hubs(id) ON DELETE SET NULL,
  hub_name              text DEFAULT '',
  status                text DEFAULT 'placed'
                          CHECK (status IN ('placed','accepted','picked','packed','out_for_delivery','delivered','cancelled')),
  payment_method        text DEFAULT 'UPI',
  subtotal              integer DEFAULT 0,
  delivery_fee          integer DEFAULT 0,
  platform_fee          integer DEFAULT 0,
  surge_fee             integer DEFAULT 0,
  coupon_code           text,
  coupon_discount       integer DEFAULT 0,
  total                 integer DEFAULT 0,
  delivery_address      jsonb DEFAULT '{}',
  delivery_instructions text DEFAULT '',
  delivery_slot         text DEFAULT '',
  delivery_date         date,
  eta                   text DEFAULT '',
  placed_at             timestamptz DEFAULT now(),
  delivered_at          timestamptz
);

CREATE INDEX idx_orders_consumer ON public.orders(consumer_id);
CREATE INDEX idx_orders_farmer ON public.orders(farmer_id);
CREATE INDEX idx_orders_hub ON public.orders(hub_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_placed ON public.orders(placed_at DESC);

-- 14. order_items
CREATE TABLE public.order_items (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id    integer REFERENCES public.products(id) ON DELETE SET NULL,
  product_name  text DEFAULT '',
  quantity      integer NOT NULL DEFAULT 1,
  price         integer NOT NULL,
  unit          text DEFAULT 'kg',
  image         text DEFAULT ''
);

CREATE INDEX idx_order_items_order ON public.order_items(order_id);

-- 15. order_timeline
CREATE TABLE public.order_timeline (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  stage         text NOT NULL,
  detail        text DEFAULT '',
  occurred_at   timestamptz DEFAULT now()
);

CREATE INDEX idx_timeline_order ON public.order_timeline(order_id);


-- ═══════════════════════════════════════════════════════════════
--  5. SUBSCRIPTIONS & ENGAGEMENT
-- ═══════════════════════════════════════════════════════════════

-- 17. subscriptions
CREATE TABLE public.subscriptions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id        integer REFERENCES public.products(id) ON DELETE SET NULL,
  name              text NOT NULL,
  frequency         text DEFAULT 'Daily' CHECK (frequency IN ('Daily', 'Weekly', 'Monthly')),
  price             integer NOT NULL,
  slot              text DEFAULT '',
  address_id        uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
  status            text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled')),
  next_delivery_at  timestamptz,
  created_at        timestamptz DEFAULT now()
);

CREATE INDEX idx_subs_user ON public.subscriptions(user_id);
CREATE INDEX idx_subs_status ON public.subscriptions(status);

-- 18. notifications
CREATE TABLE public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  body        text DEFAULT '',
  type        text DEFAULT 'general',
  data        jsonb DEFAULT '{}',
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_notif_user ON public.notifications(user_id);
CREATE INDEX idx_notif_read ON public.notifications(is_read);
CREATE INDEX idx_notif_created ON public.notifications(created_at DESC);

-- 19. support_tickets
CREATE TABLE public.support_tickets (
  id          text PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subject     text DEFAULT '',
  message     text DEFAULT '',
  category    text DEFAULT 'general' CHECK (category IN ('order', 'delivery', 'product', 'general')),
  status      text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX idx_tickets_user ON public.support_tickets(user_id);
CREATE INDEX idx_tickets_status ON public.support_tickets(status);


-- ═══════════════════════════════════════════════════════════════
--  6. CONTENT
-- ═══════════════════════════════════════════════════════════════

-- 20. banners
CREATE TABLE public.banners (
  id          serial PRIMARY KEY,
  title       text NOT NULL,
  subtitle    text DEFAULT '',
  cta         text DEFAULT 'Shop Now',
  gradient    text DEFAULT '',
  color       text DEFAULT '#fff',
  is_active   boolean DEFAULT true,
  sort_order  integer DEFAULT 0
);

-- 21. platform_stats
CREATE TABLE public.platform_stats (
  id              integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  total_farmers   integer DEFAULT 0,
  total_hubs      integer DEFAULT 0,
  total_orders    integer DEFAULT 0,
  total_families  integer DEFAULT 0,
  updated_at      timestamptz DEFAULT now()
);

CREATE TRIGGER platform_stats_updated_at
  BEFORE UPDATE ON public.platform_stats
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ═══════════════════════════════════════════════════════════════
--  RLS — Enable on all tables
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hubs               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_slots     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_partners  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_listings    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_batches  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_stats     ENABLE ROW LEVEL SECURITY;


-- ═══════════════════════════════════════════════════════════════
--  RLS POLICIES
--  Using permissive policies; server uses service_role key
--  for full access. These are for Data API safety.
-- ═══════════════════════════════════════════════════════════════

-- Public-readable tables (anyone can SELECT)
CREATE POLICY "Public read products"     ON public.products        FOR SELECT USING (true);
CREATE POLICY "Public read categories"   ON public.categories      FOR SELECT USING (true);
CREATE POLICY "Public read hubs"         ON public.hubs            FOR SELECT USING (true);
CREATE POLICY "Public read slots"        ON public.delivery_slots  FOR SELECT USING (true);
CREATE POLICY "Public read listings"     ON public.farmer_listings FOR SELECT USING (true);
CREATE POLICY "Public read banners"      ON public.banners         FOR SELECT USING (true);
CREATE POLICY "Public read stats"        ON public.platform_stats  FOR SELECT USING (true);
CREATE POLICY "Public read coupons"      ON public.coupons         FOR SELECT USING (is_active = true);
CREATE POLICY "Public read batches"      ON public.inventory_batches FOR SELECT USING (true);
CREATE POLICY "Public read partners"     ON public.delivery_partners FOR SELECT USING (true);

-- Service-role-only tables (server handles all writes via service_role)
-- Permissive ALL for service_role is implicit; these block anon/authenticated direct writes
CREATE POLICY "Service manage users"         ON public.users         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage otps"          ON public.otps          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage addresses"     ON public.addresses     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage farm_profiles" ON public.farm_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage cart"          ON public.cart_items     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage orders"        ON public.orders        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage order_items"   ON public.order_items   FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage timeline"      ON public.order_timeline FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage subs"          ON public.subscriptions  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage notifs"        ON public.notifications  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage tickets"       ON public.support_tickets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage listings_w"    ON public.farmer_listings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage hubs_w"        ON public.hubs           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage products_w"    ON public.products       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage banners_w"     ON public.banners        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage stats_w"       ON public.platform_stats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage slots_w"       ON public.delivery_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage batches_w"     ON public.inventory_batches FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage partners_w"    ON public.delivery_partners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage categories_w"  ON public.categories     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service manage coupons_w"     ON public.coupons        FOR ALL USING (true) WITH CHECK (true);


-- ═══════════════════════════════════════════════════════════════
--  GRANTS — Expose tables to Data API (April 2026 requirement)
-- ═══════════════════════════════════════════════════════════════

-- Read-only for anon (public browsing)
GRANT SELECT ON public.products          TO anon;
GRANT SELECT ON public.categories        TO anon;
GRANT SELECT ON public.hubs              TO anon;
GRANT SELECT ON public.delivery_slots    TO anon;
GRANT SELECT ON public.farmer_listings   TO anon;
GRANT SELECT ON public.banners           TO anon;
GRANT SELECT ON public.platform_stats    TO anon;
GRANT SELECT ON public.coupons           TO anon;
GRANT SELECT ON public.inventory_batches TO anon;
GRANT SELECT ON public.delivery_partners TO anon;

-- Full CRUD for authenticated (server uses service_role, but authenticated needed for Data API)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users              TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.otps               TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farm_profiles      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.hubs               TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_slots     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.delivery_partners  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products           TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.farmer_listings    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory_batches  TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cart_items         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.coupons            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders             TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items        TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_timeline     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications      TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets    TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners            TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_stats     TO authenticated;

-- Grant sequence usage for serial columns
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
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
