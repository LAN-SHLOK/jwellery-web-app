-- =====================================================
-- PRODUCT REVIEWS & COUPON CODES MIGRATION
-- =====================================================

-- 1. CREATE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved);
CREATE INDEX idx_reviews_rating ON product_reviews(rating);
CREATE INDEX idx_reviews_created ON product_reviews(created_at DESC);

-- 2. CREATE COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
  min_order_value NUMERIC(10, 2) DEFAULT 0,
  max_discount_amount NUMERIC(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupons_valid ON coupons(valid_from, valid_until);

-- 3. CREATE COUPON USAGE TRACKING TABLE
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL,
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_order ON coupon_usage(order_id);
CREATE INDEX idx_coupon_usage_email ON coupon_usage(customer_email);

-- 4. ADD COUPON FIELDS TO ORDERS TABLE
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0;

-- 5. CREATE FUNCTION TO UPDATE TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. CREATE TRIGGERS FOR UPDATED_AT
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON product_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 7. CREATE VIEW FOR PRODUCT RATINGS SUMMARY
CREATE OR REPLACE VIEW product_ratings_summary AS
SELECT 
  p.id as product_id,
  p.slug,
  COUNT(pr.id) as review_count,
  COALESCE(AVG(pr.rating), 0) as average_rating,
  COUNT(CASE WHEN pr.rating = 5 THEN 1 END) as five_star_count,
  COUNT(CASE WHEN pr.rating = 4 THEN 1 END) as four_star_count,
  COUNT(CASE WHEN pr.rating = 3 THEN 1 END) as three_star_count,
  COUNT(CASE WHEN pr.rating = 2 THEN 1 END) as two_star_count,
  COUNT(CASE WHEN pr.rating = 1 THEN 1 END) as one_star_count
FROM products p
LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = true
GROUP BY p.id, p.slug;

-- 8. ENABLE RLS
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- 9. CREATE RLS POLICIES FOR REVIEWS
CREATE POLICY "Anyone can view approved reviews"
  ON product_reviews FOR SELECT
  USING (is_approved = true);

CREATE POLICY "Authenticated users can insert reviews"
  ON product_reviews FOR INSERT
  WITH CHECK (true);

-- 10. CREATE RLS POLICIES FOR COUPONS
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active = true AND valid_until > NOW());

-- 11. SAMPLE COUPONS DATA
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, valid_until, is_active)
VALUES 
  ('WELCOME10', 'Welcome discount - 10% off your first order', 'percentage', 10, 5000, 2000, 100, NOW() + INTERVAL '90 days', true),
  ('GOLD500', 'Flat ₹500 off on orders above ₹10,000', 'fixed', 500, 10000, NULL, 200, NOW() + INTERVAL '60 days', true),
  ('FESTIVE15', 'Festive season special - 15% off', 'percentage', 15, 15000, 5000, 50, NOW() + INTERVAL '30 days', true);

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
-- DROP VIEW IF EXISTS product_ratings_summary;
-- DROP TRIGGER IF EXISTS update_coupons_updated_at ON coupons;
-- DROP TRIGGER IF EXISTS update_reviews_updated_at ON product_reviews;
-- DROP FUNCTION IF EXISTS update_updated_at_column();
-- ALTER TABLE orders DROP COLUMN IF EXISTS coupon_code, DROP COLUMN IF EXISTS discount_amount;
-- DROP TABLE IF EXISTS coupon_usage;
-- DROP TABLE IF EXISTS coupons;
-- DROP TABLE IF EXISTS product_reviews;
