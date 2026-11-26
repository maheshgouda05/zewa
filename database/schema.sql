-- ============================================================================
-- ZEWA (ZERO WASTE) FOOD SURPLUS MARKETPLACE
-- PRODUCTION-GRADE SUPABASE POSTGRESQL DATABASE SCHEMA
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean existing schema if re-running
DROP TABLE IF EXISTS order_status_history CASCADE;
DROP TABLE IF EXISTS customer_restrictions CASCADE;
DROP TABLE IF EXISTS delivery_assignments CASCADE;
DROP TABLE IF EXISTS delivery_partners CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS inventory_reservations CASCADE;
DROP TABLE IF EXISTS food_items CASCADE;
DROP TABLE IF EXISTS restaurants CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- ----------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to Supabase auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'restaurant', 'delivery_partner', 'admin')),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- ----------------------------------------------------------------------------
-- 2. RESTAURANTS & FOOD CARTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('restaurant', 'food_cart', 'bakery', 'cafe', 'hotel')),
    address TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    phone TEXT NOT NULL,
    image_url TEXT,
    fssai_license TEXT,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_restaurants_owner ON restaurants(owner_id);
CREATE INDEX idx_restaurants_coords ON restaurants(latitude, longitude);
CREATE INDEX idx_restaurants_active ON restaurants(is_active);

-- ----------------------------------------------------------------------------
-- 3. FOOD ITEMS (SURPLUS INVENTORY) TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('Meals', 'Bakery', 'Snacks', 'Desserts', 'Tiffin', 'Beverages', 'Other')),
    dietary_type TEXT NOT NULL CHECK (dietary_type IN ('veg', 'non-veg')),
    image_url TEXT,
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price > 0),
    starting_price NUMERIC(10, 2) NOT NULL CHECK (starting_price <= original_price),
    min_price NUMERIC(10, 2) NOT NULL CHECK (min_price > 0 AND min_price <= starting_price),
    max_discount_percent NUMERIC(5, 2) DEFAULT 75.00 NOT NULL,
    available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0),
    freshness_info TEXT, -- e.g. "Cooked fresh at 7:00 PM evening batch"
    expiry_time TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_food_items_restaurant ON food_items(restaurant_id);
CREATE INDEX idx_food_items_active ON food_items(is_active, available_quantity);
CREATE INDEX idx_food_items_expiry ON food_items(expiry_time);

-- ----------------------------------------------------------------------------
-- 4. INVENTORY RESERVATIONS TABLE (Prevents overselling during checkout)
-- ----------------------------------------------------------------------------
CREATE TABLE inventory_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_item_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 2),
    reserved_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL, -- Defaults to 10 minutes from reservation
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'converted', 'released', 'expired'))
);

CREATE INDEX idx_reservations_item ON inventory_reservations(food_item_id, status);
CREATE INDEX idx_reservations_customer ON inventory_reservations(customer_id, status);
CREATE INDEX idx_reservations_expiry ON inventory_reservations(expires_at) WHERE status = 'active';

-- ----------------------------------------------------------------------------
-- 5. ORDERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. "ZW-948201"
    customer_id UUID NOT NULL REFERENCES profiles(id),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id),
    status TEXT NOT NULL DEFAULT 'pending_payment' CHECK (
        status IN (
            'pending_payment',
            'confirmed',
            'preparing',
            'ready_for_pickup',
            'out_for_delivery',
            'delivered',
            'cancelled'
        )
    ),
    total_original_amount NUMERIC(10, 2) NOT NULL,
    total_discounted_amount NUMERIC(10, 2) NOT NULL,
    total_savings NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) DEFAULT 30.00 NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_latitude NUMERIC(10, 7) NOT NULL,
    delivery_longitude NUMERIC(10, 7) NOT NULL,
    customer_phone TEXT NOT NULL,
    special_instructions TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_num ON orders(order_number);

-- ----------------------------------------------------------------------------
-- 6. ORDER ITEMS TABLE (Preserves price snapshot upon checkout)
-- ----------------------------------------------------------------------------
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    food_item_id UUID NOT NULL REFERENCES food_items(id),
    food_name TEXT NOT NULL, -- Immutable snapshot
    quantity INTEGER NOT NULL CHECK (quantity > 0 AND quantity <= 2),
    original_unit_price NUMERIC(10, 2) NOT NULL,
    purchase_unit_price NUMERIC(10, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ----------------------------------------------------------------------------
-- 7. PAYMENTS TABLE (Separate from Order status for financial audit)
-- ----------------------------------------------------------------------------
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_gateway TEXT DEFAULT 'online_gateway' NOT NULL, -- razorpay / stripe / upi
    transaction_id TEXT UNIQUE,
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR' NOT NULL,
    status TEXT NOT NULL DEFAULT 'initiated' CHECK (
        status IN ('initiated', 'processing', 'successful', 'failed', 'refunded')
    ),
    gateway_response JSONB,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ----------------------------------------------------------------------------
-- 8. DELIVERY PARTNERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE delivery_partners (
    id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    vehicle_type TEXT NOT NULL CHECK (vehicle_type IN ('bicycle', 'motorcycle', 'scooter', 'ev')),
    vehicle_number TEXT,
    current_latitude NUMERIC(10, 7),
    current_longitude NUMERIC(10, 7),
    is_online BOOLEAN DEFAULT false NOT NULL,
    is_busy BOOLEAN DEFAULT false NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.00 NOT NULL,
    total_deliveries INTEGER DEFAULT 0 NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_delivery_status ON delivery_partners(is_online, is_busy);
CREATE INDEX idx_delivery_location ON delivery_partners(current_latitude, current_longitude);

-- ----------------------------------------------------------------------------
-- 9. DELIVERY ASSIGNMENTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE delivery_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    delivery_partner_id UUID NOT NULL REFERENCES delivery_partners(id),
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (
        status IN ('assigned', 'accepted', 'rejected', 'timed_out', 'picked_up', 'delivered')
    ),
    assigned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    accepted_at TIMESTAMPTZ,
    picked_up_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
);

CREATE INDEX idx_assignments_order ON delivery_assignments(order_id);
CREATE INDEX idx_assignments_partner ON delivery_assignments(delivery_partner_id, status);

-- ----------------------------------------------------------------------------
-- 10. CUSTOMER RESTRICTIONS TABLE (Misuse and cancellation prevention)
-- ----------------------------------------------------------------------------
CREATE TABLE customer_restrictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    is_restricted BOOLEAN DEFAULT false NOT NULL,
    cancellation_count INTEGER DEFAULT 0 NOT NULL,
    no_show_count INTEGER DEFAULT 0 NOT NULL,
    restriction_reason TEXT,
    restricted_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ----------------------------------------------------------------------------
-- 11. ORDER STATUS HISTORY TABLE (Complete immutable audit trail)
-- ----------------------------------------------------------------------------
CREATE TABLE order_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT NOT NULL,
    changed_by_profile_id UUID REFERENCES profiles(id),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_status_history_order ON order_status_history(order_id);

-- ============================================================================
-- STORED FUNCTIONS & BUSINESS LOGIC
-- ============================================================================

-- A. Dynamic Price Calculator Function
CREATE OR REPLACE FUNCTION calculate_dynamic_price(
    p_food_item_id UUID,
    p_at_time TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
    current_price NUMERIC(10, 2),
    discount_percent NUMERIC(5, 2),
    time_remaining_seconds INTEGER,
    is_expired BOOLEAN
) AS $$
DECLARE
    v_item RECORD;
    v_total_window_sec NUMERIC;
    v_remain_sec NUMERIC;
    v_decay_ratio NUMERIC;
    v_calc_price NUMERIC(10, 2);
    v_discount NUMERIC(5, 2);
BEGIN
    SELECT * INTO v_item FROM food_items WHERE id = p_food_item_id;
    IF NOT FOUND THEN
        RETURN;
    END IF;

    -- Time remaining until food expiry / closing
    v_remain_sec := EXTRACT(EPOCH FROM (v_item.expiry_time - p_at_time));

    IF v_remain_sec <= 0 OR v_item.available_quantity <= 0 OR v_item.is_active = false THEN
        current_price := v_item.min_price;
        discount_percent := v_item.max_discount_percent;
        time_remaining_seconds := 0;
        is_expired := true;
        RETURN NEXT;
        RETURN;
    END IF;

    -- Dynamic discount window: standard 4 hours (14400 sec) prior to expiry
    v_total_window_sec := 14400.0;
    IF v_remain_sec >= v_total_window_sec THEN
        v_decay_ratio := 0.0; -- at start of window
    ELSE
        -- Decay accelerates non-linearly as closing approaches (alpha = 1.35)
        v_decay_ratio := POWER((v_total_window_sec - v_remain_sec) / v_total_window_sec, 1.35);
    END IF;

    -- Price slides from starting_price down to min_price
    v_calc_price := v_item.starting_price - ((v_item.starting_price - v_item.min_price) * v_decay_ratio);
    v_calc_price := ROUND(GREATEST(v_item.min_price, LEAST(v_item.starting_price, v_calc_price)), 2);

    -- Calculate discount percent relative to original price
    v_discount := ROUND(((v_item.original_price - v_calc_price) / v_item.original_price) * 100.0, 2);

    current_price := v_calc_price;
    discount_percent := v_discount;
    time_remaining_seconds := v_remain_sec::INTEGER;
    is_expired := false;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- B. Customer Purchase Limit Check (Max 2 units per listing)
CREATE OR REPLACE FUNCTION check_purchase_limit(
    p_customer_id UUID,
    p_food_item_id UUID,
    p_requested_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_already_purchased INTEGER := 0;
    v_already_reserved INTEGER := 0;
BEGIN
    IF p_requested_quantity < 1 OR p_requested_quantity > 2 THEN
        RETURN false;
    END IF;

    -- Sum from active reservations
    SELECT COALESCE(SUM(quantity), 0) INTO v_already_reserved
    FROM inventory_reservations
    WHERE customer_id = p_customer_id
      AND food_item_id = p_food_item_id
      AND status = 'active'
      AND expires_at > now();

    -- Sum from today's confirmed/active orders
    SELECT COALESCE(SUM(oi.quantity), 0) INTO v_already_purchased
    FROM order_items oi
    JOIN orders o ON o.id = oi.order_id
    WHERE o.customer_id = p_customer_id
      AND oi.food_item_id = p_food_item_id
      AND o.status NOT IN ('cancelled', 'pending_payment')
      AND o.created_at >= (now() - INTERVAL '12 hours');

    IF (v_already_reserved + v_already_purchased + p_requested_quantity) > 2 THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_restrictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- 1. Profiles: Users can read public profile data; only owners can update their own
CREATE POLICY "Public profile view" ON profiles FOR SELECT USING (true);
CREATE POLICY "User can update self" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Restaurants: Anyone can view active restaurants; owners can insert/update
CREATE POLICY "Public view restaurants" ON restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Owners manage their restaurant" ON restaurants FOR ALL USING (auth.uid() = owner_id);

-- 3. Food Items: Anyone can view available items; restaurant owners can manage
CREATE POLICY "Public view active food" ON food_items FOR SELECT USING (is_active = true);
CREATE POLICY "Restaurant manages food" ON food_items FOR ALL USING (
    EXISTS (SELECT 1 FROM restaurants WHERE id = food_items.restaurant_id AND owner_id = auth.uid())
);

-- 4. Reservations: Customers manage their own reservations
CREATE POLICY "Customer reservations" ON inventory_reservations FOR ALL USING (auth.uid() = customer_id);

-- 5. Orders: Customers see their own; restaurants see theirs; delivery see assigned
CREATE POLICY "Customer order access" ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Restaurant order access" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM restaurants WHERE id = orders.restaurant_id AND owner_id = auth.uid())
);
CREATE POLICY "Delivery partner order access" ON orders FOR SELECT USING (
    EXISTS (SELECT 1 FROM delivery_assignments WHERE order_id = orders.id AND delivery_partner_id = auth.uid())
);

-- 6. Order Items: Same as orders
CREATE POLICY "Order items viewable by order parties" ON order_items FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND (
            orders.customer_id = auth.uid() 
            OR EXISTS (SELECT 1 FROM restaurants WHERE id = orders.restaurant_id AND owner_id = auth.uid())
            OR EXISTS (SELECT 1 FROM delivery_assignments WHERE order_id = orders.id AND delivery_partner_id = auth.uid())
        )
    )
);

-- 7. Delivery Partners: Delivery partners manage self; customers/restaurants can view assigned
CREATE POLICY "Delivery partner self manage" ON delivery_partners FOR ALL USING (auth.uid() = id);
CREATE POLICY "Public view online delivery partners" ON delivery_partners FOR SELECT USING (is_online = true);

-- 8. Delivery Assignments: Partner sees assigned orders; customer/restaurant sees assignment
CREATE POLICY "Partner assignment access" ON delivery_assignments FOR ALL USING (auth.uid() = delivery_partner_id);

-- ============================================================================
-- SEED DATA FOR DEMO & TESTING
-- ============================================================================

-- Function to setup sample accounts and surplus listings
-- (Executed safely when initializing database)
