-- =====================================================================================
-- ANNSETU SUPPLY CHAIN SCHEMA
-- Run this script in your Supabase SQL Editor
-- =====================================================================================

-- 1. INVENTORY BATCHES (Farmer -> Hub Transfers)
CREATE TABLE IF NOT EXISTS public.inventory_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    hub_id UUID REFERENCES public.hubs(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    category TEXT DEFAULT 'Vegetables',
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    price_per_kg NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HUB INVENTORY (Source of truth for Consumer Sales)
CREATE TABLE IF NOT EXISTS public.hub_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hub_id UUID REFERENCES public.hubs(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES public.inventory_batches(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    category TEXT DEFAULT 'Vegetables',
    price_per_kg NUMERIC NOT NULL,
    available_stock NUMERIC NOT NULL DEFAULT 0 CHECK (available_stock >= 0),
    image_data TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CARTS & CART ITEMS
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consumer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ordered', 'abandoned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
    hub_inventory_id UUID REFERENCES public.hub_inventory(id) ON DELETE CASCADE,
    quantity NUMERIC NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDER TRACKING
CREATE TABLE IF NOT EXISTS public.order_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL, -- Will link to existing orders table
    status TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ATOMIC INVENTORY RESERVATION FUNCTION (RPC)
-- This function securely reserves stock inside a Postgres transaction
CREATE OR REPLACE FUNCTION reserve_inventory_stock(inventory_id UUID, requested_qty NUMERIC)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_stock NUMERIC;
BEGIN
    -- Lock the row to prevent concurrent race conditions
    SELECT available_stock INTO current_stock
    FROM public.hub_inventory
    WHERE id = inventory_id
    FOR UPDATE;

    IF current_stock >= requested_qty THEN
        UPDATE public.hub_inventory
        SET available_stock = available_stock - requested_qty,
            updated_at = NOW()
        WHERE id = inventory_id;
        RETURN TRUE;
    ELSE
        RETURN FALSE;
    END IF;
END;
$$;

-- Enable Row Level Security
ALTER TABLE public.inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hub_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Admins / Service Roles bypass RLS by default)
CREATE POLICY "Allow public read of hub inventory" ON public.hub_inventory FOR SELECT USING (true);
CREATE POLICY "Allow consumers to read own carts" ON public.carts FOR SELECT USING (auth.uid() = consumer_id);
CREATE POLICY "Allow consumers to update own carts" ON public.carts FOR UPDATE USING (auth.uid() = consumer_id);
CREATE POLICY "Allow consumers to read own cart items" ON public.cart_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_id AND consumer_id = auth.uid()));
