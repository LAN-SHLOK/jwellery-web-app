-- ============================================
-- Add Purity Support to Database
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add gold_purity column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gold_purity VARCHAR(3) DEFAULT '22K';

-- Add constraint to ensure only valid values
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_gold_purity_check;

ALTER TABLE products 
ADD CONSTRAINT products_gold_purity_check 
CHECK (gold_purity IN ('18K', '22K'));

-- 2. Add available_in_both_purities column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS available_in_both_purities BOOLEAN DEFAULT false;

-- 3. Add rate_18k column to gold_rates table
ALTER TABLE gold_rates 
ADD COLUMN IF NOT EXISTS rate_18k DECIMAL(10, 2);

-- 4. Update existing products to have default values
UPDATE products 
SET gold_purity = '22K' 
WHERE gold_purity IS NULL;

UPDATE products 
SET available_in_both_purities = false 
WHERE available_in_both_purities IS NULL;

-- 5. Calculate and set 18K rate for existing gold_rates records
UPDATE gold_rates 
SET rate_18k = ROUND(rate_per_gram * 0.75, 2)
WHERE rate_18k IS NULL;

-- 6. Verify the changes
SELECT 
  'products' as table_name,
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('gold_purity', 'available_in_both_purities')

UNION ALL

SELECT 
  'gold_rates' as table_name,
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'gold_rates' 
AND column_name = 'rate_18k';
