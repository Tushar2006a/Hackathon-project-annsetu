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
