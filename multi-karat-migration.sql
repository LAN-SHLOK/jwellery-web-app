-- ============================================================
-- MULTI-KARAT SUPPORT MIGRATION (18K + 22K)
-- ============================================================
-- This migration adds support for multiple gold purities (18K and 22K)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Step 1: Add new columns to gold_rates table for 18K support
ALTER TABLE gold_rates 
ADD COLUMN IF NOT EXISTS karat VARCHAR DEFAULT '22K',
ADD COLUMN IF NOT EXISTS rate_18k NUMERIC(10,2);

-- Step 2: Update existing gold_rates records to have karat specified
UPDATE gold_rates 
SET karat = '22K' 
WHERE karat IS NULL;

-- Step 3: Add comment to clarify the structure
COMMENT ON COLUMN gold_rates.rate_per_gram IS '22K gold rate per gram in ₹';
COMMENT ON COLUMN gold_rates.rate_18k IS '18K gold rate per gram in ₹ (optional, can be calculated)';
COMMENT ON COLUMN gold_rates.karat IS 'Primary karat for this rate entry (22K or 18K)';

-- Step 4: Ensure gold_purity column in products allows both values
-- (Already exists, just adding a check constraint for validation)
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_gold_purity_check;

ALTER TABLE products 
ADD CONSTRAINT products_gold_purity_check 
CHECK (gold_purity IN ('18K', '22K'));

-- Step 5: Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_gold_purity ON products(gold_purity);
CREATE INDEX IF NOT EXISTS idx_gold_rates_karat ON gold_rates(karat);
CREATE INDEX IF NOT EXISTS idx_gold_rates_created_at ON gold_rates(created_at DESC);

-- Step 6: Create a view for latest rates by karat
CREATE OR REPLACE VIEW latest_gold_rates AS
SELECT DISTINCT ON (karat)
    id,
    karat,
    rate_per_gram,
    rate_18k,
    created_at
FROM gold_rates
ORDER BY karat, created_at DESC;

-- Step 7: Add helpful comments
COMMENT ON TABLE gold_rates IS 'Daily gold rates for different karats (18K and 22K)';
COMMENT ON VIEW latest_gold_rates IS 'Latest gold rate for each karat type';

-- ============================================================
-- OPTIONAL: Sample data for 18K rates
-- ============================================================
-- Uncomment below to add sample 18K rates
-- Note: 18K is typically 75% pure gold vs 22K which is 91.67% pure
-- So 18K rate is approximately 82% of 22K rate

-- INSERT INTO gold_rates (karat, rate_per_gram, created_at) VALUES
-- ('18K', 5330, NOW() - INTERVAL '7 days'),
-- ('18K', 5350, NOW() - INTERVAL '6 days'),
-- ('18K', 5320, NOW() - INTERVAL '5 days'),
-- ('18K', 5380, NOW() - INTERVAL '4 days'),
-- ('18K', 5400, NOW() - INTERVAL '3 days'),
-- ('18K', 5390, NOW() - INTERVAL '2 days'),
-- ('18K', 5420, NOW() - INTERVAL '1 day'),
-- ('18K', 5450, NOW());

-- ============================================================
-- VERIFICATION QUERIES
-- ============================================================
-- Run these to verify the migration worked correctly:

-- Check latest rates for each karat
-- SELECT * FROM latest_gold_rates;

-- Check products by karat
-- SELECT gold_purity, COUNT(*) as count FROM products GROUP BY gold_purity;

-- Check all gold rates
-- SELECT karat, rate_per_gram, rate_18k, created_at FROM gold_rates ORDER BY created_at DESC LIMIT 20;

-- ============================================================
-- ROLLBACK (if needed)
-- ============================================================
-- Uncomment and run these if you need to rollback the changes:

-- DROP VIEW IF EXISTS latest_gold_rates;
-- DROP INDEX IF EXISTS idx_products_gold_purity;
-- DROP INDEX IF EXISTS idx_gold_rates_karat;
-- DROP INDEX IF EXISTS idx_gold_rates_created_at;
-- ALTER TABLE products DROP CONSTRAINT IF EXISTS products_gold_purity_check;
-- ALTER TABLE gold_rates DROP COLUMN IF EXISTS karat;
-- ALTER TABLE gold_rates DROP COLUMN IF EXISTS rate_18k;
