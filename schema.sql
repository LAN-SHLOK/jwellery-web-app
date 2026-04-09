-- Table for products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    slug VARCHAR UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR, -- ring, chain, earring, bangle, pendant, necklace
    gold_weight_grams NUMERIC(6,3) NOT NULL,
    gold_purity VARCHAR DEFAULT '22K',
    making_charge_type VARCHAR NOT NULL, -- 'fixed' or 'percentage'
    making_charge_value NUMERIC(10,2) NOT NULL,
    jeweller_margin NUMERIC(10,2) NOT NULL,
    images TEXT[], -- Cloudinary URLs array
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    hallmark_number VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for daily gold rates
CREATE TABLE IF NOT EXISTS gold_rates (
    id SERIAL PRIMARY KEY,
    rate_per_gram NUMERIC(10,2) NOT NULL, -- 22K rate in ₹
    entered_by VARCHAR, -- admin identifier
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table for orders
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name VARCHAR NOT NULL,
    customer_phone VARCHAR NOT NULL,
    customer_email VARCHAR,
    address JSONB NOT NULL,
    items JSONB NOT NULL, -- snapshot of cart at time of order
    gold_rate_used NUMERIC(10,2), -- rate at time of purchase
    subtotal NUMERIC(10,2),
    gst_amount NUMERIC(10,2),
    total_amount NUMERIC(10,2),
    payment_method VARCHAR, -- 'razorpay' | 'cod'
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

-- ============================================================
-- DISABLE RLS on all tables
-- The app uses server-side API routes with the anon key.
-- Auth is handled by JWT middleware — not Supabase RLS policies.
-- Without this, all queries return 0 rows and login/products fail.
-- ============================================================
ALTER TABLE products  DISABLE ROW LEVEL SECURITY;
ALTER TABLE gold_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders    DISABLE ROW LEVEL SECURITY;
ALTER TABLE users     DISABLE ROW LEVEL SECURITY;
