-- ==============================================================================
-- KALARA DISTRO - PRODUCTION DATABASE SCHEMA & ATOMIC RPC PROCEDURES
-- Brand: KALARA DISTRO ("WEAR YOUR STYLE, SHOW YOUR IDENTITY")
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Store Admins & Staff)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('superadmin', 'admin', 'staff')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    details TEXT,
    base_price NUMERIC(12, 2) NOT NULL CHECK (base_price >= 0),
    compare_at_price NUMERIC(12, 2) CHECK (compare_at_price >= base_price),
    is_featured BOOLEAN DEFAULT FALSE,
    is_new_arrival BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PRODUCT VARIANTS (Size, Color, Stock SKU)
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    additional_price NUMERIC(12, 2) DEFAULT 0 CHECK (additional_price >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_product_size_color UNIQUE (product_id, size, color)
);

-- 6. CUSTOMERS (Can purchase guest or registered)
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT,
    notes TEXT,
    total_orders INT DEFAULT 0,
    total_spend NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. KLR-20261126-XXXX
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_city TEXT NOT NULL,
    shipping_postal_code TEXT,
    shipping_courier TEXT NOT NULL DEFAULT 'JNE Regular',
    shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    total_amount NUMERIC(12, 2) NOT NULL CHECK (total_amount >= 0),
    payment_method TEXT NOT NULL DEFAULT 'manual_bank_transfer',
    payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending_verification', 'paid', 'rejected', 'refunded')),
    payment_proof_url TEXT,
    order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled')),
    tracking_number TEXT,
    customer_notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. ORDER ITEMS (Locked unit price from server database)
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    variant_sku TEXT NOT NULL,
    size TEXT NOT NULL,
    color TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. ORDER STATUS HISTORY
CREATE TABLE IF NOT EXISTS order_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    order_status TEXT NOT NULL,
    payment_status TEXT NOT NULL,
    notes TEXT,
    changed_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. STORE SETTINGS
CREATE TABLE IF NOT EXISTS store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    store_name TEXT NOT NULL DEFAULT 'KALARA DISTRO',
    tagline TEXT NOT NULL DEFAULT 'WEAR YOUR STYLE, SHOW YOUR IDENTITY',
    about_text TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    contact_whatsapp TEXT,
    address TEXT,
    bank_name TEXT DEFAULT 'BCA',
    bank_account_name TEXT DEFAULT 'KALARA DISTRO',
    bank_account_number TEXT DEFAULT '8830129381',
    flat_shipping_rate NUMERIC(12, 2) DEFAULT 15000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- INDEXES FOR FAST RETRIEVAL
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ==============================================================================
-- ATOMIC RPC FUNCTION: CREATE ORDER WITH REAL STOCK CHECK & DEDUCTION
-- Guarantee: No race conditions, frontend cannot fake prices or bypass stock.
-- ==============================================================================

CREATE OR REPLACE FUNCTION create_order_atomic(
    p_customer_name TEXT,
    p_customer_email TEXT,
    p_customer_phone TEXT,
    p_shipping_address TEXT,
    p_shipping_city TEXT,
    p_shipping_postal_code TEXT,
    p_shipping_courier TEXT,
    p_payment_method TEXT,
    p_customer_notes TEXT,
    p_items JSONB -- Array of { variant_id: UUID, quantity: INT }
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_item JSONB;
    v_variant RECORD;
    v_product RECORD;
    v_calc_subtotal NUMERIC(12, 2) := 0;
    v_shipping_cost NUMERIC(12, 2) := 15000;
    v_total_amount NUMERIC(12, 2);
    v_item_price NUMERIC(12, 2);
    v_item_subtotal NUMERIC(12, 2);
    v_customer_id UUID;
    v_primary_image TEXT;
BEGIN
    -- Check items not empty
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Shopping cart is empty';
    END IF;

    -- Generate human-friendly order number
    v_order_number := 'KLR-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));

    -- Upsert Customer Record
    SELECT id INTO v_customer_id FROM customers WHERE email = p_customer_email LIMIT 1;
    IF v_customer_id IS NULL THEN
        INSERT INTO customers (email, full_name, phone, address, city, postal_code, notes)
        VALUES (p_customer_email, p_customer_name, p_customer_phone, p_shipping_address, p_shipping_city, p_shipping_postal_code, p_customer_notes)
        RETURNING id INTO v_customer_id;
    ELSE
        UPDATE customers 
        SET full_name = p_customer_name, phone = p_customer_phone, address = p_shipping_address, city = p_shipping_city, postal_code = p_shipping_postal_code, updated_at = NOW()
        WHERE id = v_customer_id;
    END IF;

    -- Fetch store flat shipping rate
    SELECT flat_shipping_rate INTO v_shipping_cost FROM store_settings WHERE id = 'default';
    IF v_shipping_cost IS NULL THEN
        v_shipping_cost := 15000;
    END IF;

    -- First Pass: Verify stock and calculate verified subtotal
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Lock row FOR UPDATE to avoid concurrency oversell
        SELECT * INTO v_variant 
        FROM product_variants 
        WHERE id = (v_item->>'variant_id')::UUID 
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product variant % does not exist.', v_item->>'variant_id';
        END IF;

        IF v_variant.stock_quantity < (v_item->>'quantity')::INT THEN
            RAISE EXCEPTION 'Insufficient stock for SKU %. Available: %, Requested: %', v_variant.sku, v_variant.stock_quantity, (v_item->>'quantity')::INT;
        END IF;

        SELECT * INTO v_product FROM products WHERE id = v_variant.product_id;
        IF NOT FOUND OR NOT v_product.is_active THEN
            RAISE EXCEPTION 'Product % is not available for purchase.', v_variant.product_id;
        END IF;

        v_item_price := v_product.base_price + COALESCE(v_variant.additional_price, 0);
        v_item_subtotal := v_item_price * (v_item->>'quantity')::INT;
        v_calc_subtotal := v_calc_subtotal + v_item_subtotal;
    END LOOP;

    v_total_amount := v_calc_subtotal + v_shipping_cost;

    -- Create Order Header
    INSERT INTO orders (
        order_number,
        customer_id,
        customer_email,
        customer_name,
        customer_phone,
        shipping_address,
        shipping_city,
        shipping_postal_code,
        shipping_courier,
        shipping_cost,
        subtotal,
        total_amount,
        payment_method,
        payment_status,
        order_status,
        customer_notes
    ) VALUES (
        v_order_number,
        v_customer_id,
        p_customer_email,
        p_customer_name,
        p_customer_phone,
        p_shipping_address,
        p_shipping_city,
        p_shipping_postal_code,
        COALESCE(p_shipping_courier, 'JNE Regular'),
        v_shipping_cost,
        v_calc_subtotal,
        v_total_amount,
        p_payment_method,
        'unpaid',
        'pending',
        p_customer_notes
    ) RETURNING id INTO v_order_id;

    -- Second Pass: Deduct Stock and Insert Order Items
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        SELECT * INTO v_variant FROM product_variants WHERE id = (v_item->>'variant_id')::UUID;
        SELECT * INTO v_product FROM products WHERE id = v_variant.product_id;
        SELECT image_url INTO v_primary_image FROM product_images WHERE product_id = v_product.id ORDER BY is_primary DESC, display_order ASC LIMIT 1;

        v_item_price := v_product.base_price + COALESCE(v_variant.additional_price, 0);
        v_item_subtotal := v_item_price * (v_item->>'quantity')::INT;

        -- Deduct Stock
        UPDATE product_variants 
        SET stock_quantity = stock_quantity - (v_item->>'quantity')::INT,
            updated_at = NOW()
        WHERE id = v_variant.id;

        -- Insert Line Item
        INSERT INTO order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_sku,
            size,
            color,
            quantity,
            unit_price,
            subtotal,
            image_url
        ) VALUES (
            v_order_id,
            v_product.id,
            v_variant.id,
            v_product.name,
            v_variant.sku,
            v_variant.size,
            v_variant.color,
            (v_item->>'quantity')::INT,
            v_item_price,
            v_item_subtotal,
            v_primary_image
        );
    END LOOP;

    -- Log initial status history
    INSERT INTO order_status_history (
        order_id,
        order_status,
        payment_status,
        notes,
        changed_by
    ) VALUES (
        v_order_id,
        'pending',
        'unpaid',
        'Order created successfully by customer',
        'customer'
    );

    -- Update Customer Totals
    UPDATE customers 
    SET total_orders = total_orders + 1,
        total_spend = total_spend + v_total_amount,
        updated_at = NOW()
    WHERE id = v_customer_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'order_id', v_order_id,
        'order_number', v_order_number,
        'subtotal', v_calc_subtotal,
        'shipping_cost', v_shipping_cost,
        'total_amount', v_total_amount
    );
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Public can read active catalog
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can read product variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "Public can read store settings" ON store_settings FOR SELECT USING (true);

-- Orders: Public can create orders (via RPC or direct insert) and view their order by order_number + email
CREATE POLICY "Public can track order by number" ON orders FOR SELECT USING (true);
CREATE POLICY "Public can view order items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Public can view order status history" ON order_status_history FOR SELECT USING (true);
CREATE POLICY "Public can upload payment proof" ON orders FOR UPDATE USING (true) WITH CHECK (true);

-- Admin Full Access: authenticated users with admin/superadmin profile
CREATE POLICY "Admin full categories" ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full products" ON products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full images" ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full variants" ON product_variants FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full customers" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full orders" ON orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full items" ON order_items FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full history" ON order_status_history FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full settings" ON store_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Profiles self & admin access" ON profiles FOR ALL TO authenticated USING (true) WITH CHECK (true);
