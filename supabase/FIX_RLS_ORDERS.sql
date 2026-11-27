-- ==============================================================================
-- FIX RLS PERMISSION FOR ORDERS, ORDER_ITEMS, CUSTOMERS & RPC
-- Jalankan ini di SQL Editor Supabase untuk mengizinkan order masuk dari checkout publik
-- ==============================================================================

-- 1. Berikan izin eksekusi function create_order_atomic ke role public & anon
GRANT EXECUTE ON FUNCTION create_order_atomic TO anon, authenticated, service_role, public;

-- 2. Pastikan RLS mengizinkan INSERT ke orders, order_items, customers, & order_status_history
DROP POLICY IF EXISTS "Public insert orders" ON orders;
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert order items" ON order_items;
CREATE POLICY "Public insert order items" ON order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert customers" ON customers;
CREATE POLICY "Public insert customers" ON customers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update customers" ON customers;
CREATE POLICY "Public update customers" ON customers FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert status history" ON order_status_history;
CREATE POLICY "Public insert status history" ON order_status_history FOR INSERT WITH CHECK (true);

-- 3. Izinkan update stock_quantity pada product_variants saat RPC dijalankan
DROP POLICY IF EXISTS "Public update variants stock" ON product_variants;
CREATE POLICY "Public update variants stock" ON product_variants FOR UPDATE USING (true) WITH CHECK (true);
