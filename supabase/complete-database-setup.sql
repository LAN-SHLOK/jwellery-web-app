-- ============================================
-- COMPLETE DATABASE SETUP & RESET
-- ============================================
-- This single file does EVERYTHING:
-- 1. Creates all tables (if they don't exist)
-- 2. Deletes all existing data
-- 3. Inserts fresh sample data
-- 4. Sets gold rate to ₹6,500/g
-- 
-- Just run this ONE file in Supabase SQL Editor!
-- ============================================

-- ============================================
-- STEP 1: CREATE ALL TABLES
-- ============================================

-- Table for products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR,
    gold_weight_grams NUMERIC(6,3) NOT NULL,
    gold_purity VARCHAR DEFAULT '22K',
    making_charge_type VARCHAR NOT NULL,
    making_charge_value NUMERIC(10,2) NOT NULL,
    jeweller_margin NUMERIC(10,2) NOT NULL,
    images TEXT[],
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    hallmark_number VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for daily gold rates
CREATE TABLE IF NOT EXISTS gold_rates (
    id SERIAL PRIMARY KEY,
    rate_per_gram NUMERIC(10,2) NOT NULL,
    entered_by VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR NOT NULL,
    customer_phone VARCHAR NOT NULL,
    customer_email VARCHAR,
    address JSONB NOT NULL,
    items JSONB NOT NULL,
    gold_rate_used NUMERIC(10,2),
    subtotal NUMERIC(10,2),
    gst_amount NUMERIC(10,2),
    total_amount NUMERIC(10,2),
    payment_method VARCHAR,
    payment_status VARCHAR DEFAULT 'pending',
    order_status VARCHAR DEFAULT 'pending',
    razorpay_order_id VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for admin users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for coupons
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR NOT NULL,
    discount_value NUMERIC(10,2) NOT NULL,
    min_order_value NUMERIC(10,2) DEFAULT 0,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    customer_email VARCHAR,
    discount_applied NUMERIC(10,2),
    used_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for product reviews
CREATE TABLE IF NOT EXISTS product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    customer_name VARCHAR NOT NULL,
    customer_email VARCHAR,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create function for stock decrement (used in checkout)
CREATE OR REPLACE FUNCTION decrement_stock_batch(items jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  item jsonb;
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(items)
  LOOP
    UPDATE products
    SET stock_quantity = stock_quantity - (item->>'quantity')::integer
    WHERE id = (item->>'id')::uuid
      AND stock_quantity >= (item->>'quantity')::integer;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'Insufficient stock for product %', item->>'id';
    END IF;
  END LOOP;
END;
$$;

-- Create trigger function for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON product_reviews;
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON product_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Disable RLS on all tables
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE gold_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews DISABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 2: DELETE ALL EXISTING DATA
-- ============================================

DELETE FROM coupon_usage;
DELETE FROM coupons;
DELETE FROM product_reviews;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM gold_rates;
DELETE FROM users;

-- Reset sequences
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'gold_rates_id_seq') THEN
    ALTER SEQUENCE gold_rates_id_seq RESTART WITH 1;
  END IF;
END $$;

-- ============================================
-- STEP 3: INSERT FRESH DATA
-- ============================================

-- Insert admin user (password: admin123)
INSERT INTO users (email, password_hash, role)
VALUES (
  'admin@example.com',
  '$2b$10$JTkHRFE1om0/JvvBIRGi4edH4NlSAfblu85WmankCc.3NiqfLuGfu',
  'admin'
);

-- Insert current gold rate (₹6,500 per gram for 22K)
INSERT INTO gold_rates (rate_per_gram, entered_by, created_at)
VALUES (6500, 'admin', NOW());

-- Insert historical gold rates (last 7 days for FOMO badge)
INSERT INTO gold_rates (rate_per_gram, entered_by, created_at)
VALUES 
  (6450, 'admin', NOW() - INTERVAL '1 day'),
  (6480, 'admin', NOW() - INTERVAL '2 days'),
  (6520, 'admin', NOW() - INTERVAL '3 days'),
  (6500, 'admin', NOW() - INTERVAL '4 days'),
  (6550, 'admin', NOW() - INTERVAL '5 days'),
  (6530, 'admin', NOW() - INTERVAL '6 days'),
  (6510, 'admin', NOW() - INTERVAL '7 days');

-- Insert products
INSERT INTO products (
  name, slug, description, category, gold_weight_grams, gold_purity,
  making_charge_type, making_charge_value, jeweller_margin, images,
  stock_quantity, is_active, is_featured, hallmark_number
) VALUES
(
  'Classic Solitaire Ring',
  'classic-solitaire-ring',
  'A timeless 22K gold solitaire ring with a polished finish. Crafted by hand in our Jaipur atelier, this piece pairs effortlessly with both traditional and contemporary wear.',
  'ring', 4.200, '22K', 'percentage', 12.00, 800.00,
  ARRAY['/placeholders/ring.svg'], 8, TRUE, TRUE, 'BIS-HM-2024-001'
),
(
  'Kundan Jhumka Earrings',
  'kundan-jhumka-earrings',
  'Traditional Kundan-set jhumka earrings in 22K gold. Each piece is hand-set with uncut stones and finished with a meenakari back. A staple for festive occasions.',
  'earring', 6.800, '22K', 'percentage', 15.00, 1200.00,
  ARRAY['/placeholders/earring.svg'], 5, TRUE, TRUE, 'BIS-HM-2024-002'
),
(
  'Rope Chain Necklace',
  'rope-chain-necklace',
  'A 22K gold rope chain with a secure lobster clasp. 18 inches in length, 2mm width. Versatile enough to wear alone or layered with a pendant.',
  'chain', 8.500, '22K', 'fixed', 1200.00, 600.00,
  ARRAY['/placeholders/chain.svg'], 12, TRUE, FALSE, 'BIS-HM-2024-003'
),
(
  'Temple Bangle Set',
  'temple-bangle-set',
  'A pair of 22K gold temple bangles with intricate deity motifs. Hand-engraved by third-generation artisans from Thrissur. Sold as a pair.',
  'bangle', 18.000, '22K', 'percentage', 10.00, 2500.00,
  ARRAY['/placeholders/bangle.svg'], 3, TRUE, TRUE, 'BIS-HM-2024-004'
),
(
  'Floral Pendant',
  'floral-pendant',
  'A delicate 22K gold floral pendant with a matte finish centre and polished petals. Includes an 18-inch box chain. Perfect for everyday luxury.',
  'pendant', 3.100, '22K', 'fixed', 650.00, 500.00,
  ARRAY['/placeholders/pendant.svg'], 10, TRUE, FALSE, 'BIS-HM-2024-005'
),
(
  'Layered Choker Necklace',
  'layered-choker-necklace',
  'A three-strand 22K gold choker with a traditional South Indian design. Features a central Lakshmi coin motif. Adjustable length from 14 to 16 inches.',
  'necklace', 22.500, '22K', 'percentage', 12.00, 3000.00,
  ARRAY['/placeholders/necklace.svg'], 2, TRUE, TRUE, 'BIS-HM-2024-006'
),
(
  'Twisted Band Ring',
  'twisted-band-ring',
  'A contemporary 22K gold twisted band ring. Minimalist design with a high-polish finish. Available in standard sizes and easy to style for everyday wear.',
  'ring', 3.500, '22K', 'percentage', 10.00, 600.00,
  ARRAY['/placeholders/ring.svg'], 15, TRUE, FALSE, 'BIS-HM-2024-007'
),
(
  'Antique Haaram Necklace',
  'antique-haaram-necklace',
  'A long 22K gold haaram necklace with antique finish and ruby-red enamel accents. 30 inches in length. A statement piece for weddings and ceremonies.',
  'necklace', 35.000, '22K', 'percentage', 14.00, 5000.00,
  ARRAY['/placeholders/necklace.svg'], 1, TRUE, FALSE, 'BIS-HM-2024-008'
),
(
  'Lotus Stud Earrings',
  'lotus-stud-earrings',
  'Petite 22K gold lotus stud earrings with a push-back closure. Lightweight and comfortable for daily wear. Each stud is 8mm in diameter.',
  'earring', 2.200, '22K', 'fixed', 400.00, 350.00,
  ARRAY['/placeholders/earring.svg'], 20, TRUE, FALSE, 'BIS-HM-2024-009'
),
(
  'Broad Kangan Bangle',
  'broad-kangan-bangle',
  'A single broad 22K gold kangan bangle with a hammered texture and smooth inner surface. 10mm width. Sold individually; order two for a pair.',
  'bangle', 12.000, '22K', 'percentage', 11.00, 1800.00,
  ARRAY['/placeholders/bangle.svg'], 6, TRUE, FALSE, 'BIS-HM-2024-010'
),
(
  'Modern Minimalist Ring',
  'modern-minimalist-ring',
  'A sleek 18K gold minimalist ring with a brushed finish. Perfect for everyday wear and stacking. Contemporary design meets timeless elegance.',
  'ring', 3.800, '18K', 'percentage', 10.00, 700.00,
  ARRAY['/placeholders/ring.svg'], 12, TRUE, FALSE, 'BIS-HM-2024-011'
),
(
  'Delicate Chain Bracelet',
  'delicate-chain-bracelet',
  'An 18K gold delicate chain bracelet with adjustable length. Lightweight and comfortable for daily wear. 7-8 inches adjustable.',
  'chain', 5.200, '18K', 'fixed', 800.00, 500.00,
  ARRAY['/placeholders/chain.svg'], 10, TRUE, TRUE, 'BIS-HM-2024-012'
);

-- Insert sample coupons
INSERT INTO coupons (
  code, description, discount_type, discount_value, min_order_value,
  usage_limit, usage_count, valid_from, valid_until, is_active
) VALUES
(
  'WELCOME10',
  'Welcome offer - 10% off on your first order',
  'percentage', 10.00, 10000.00, 100, 0,
  NOW(), NOW() + INTERVAL '30 days', TRUE
),
(
  'FESTIVE500',
  'Festive special - Flat ₹500 off',
  'fixed', 500.00, 15000.00, 50, 0,
  NOW(), NOW() + INTERVAL '15 days', TRUE
),
(
  'GOLD15',
  'Gold rush sale - 15% off on all gold items',
  'percentage', 15.00, 20000.00, 200, 0,
  NOW(), NOW() + INTERVAL '60 days', TRUE
);

-- ============================================
-- STEP 4: VERIFICATION
-- ============================================

-- Show summary
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Gold Rates', COUNT(*) FROM gold_rates
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Coupons', COUNT(*) FROM coupons
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Reviews', COUNT(*) FROM product_reviews;

-- Show current gold rate
SELECT 
  rate_per_gram as "Current Gold Rate (₹/g)",
  entered_by as "Entered By",
  created_at as "Created At"
FROM gold_rates 
ORDER BY created_at DESC 
LIMIT 1;

-- ============================================
-- DONE! ✅
-- ============================================
-- Next steps:
-- 1. Wait 1-2 minutes for cache to clear
-- 2. Hard refresh browser (Ctrl + Shift + R)
-- 3. Visit: http://localhost:3000/collections
-- 4. Admin login: admin@example.com / admin123
-- ============================================
