-- Add gold_purity column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'gold_purity'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN gold_purity VARCHAR(3) DEFAULT '22K' CHECK (gold_purity IN ('18K', '22K'));
  END IF;
END $$;

-- Add available_in_both_purities column to products table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'available_in_both_purities'
  ) THEN
    ALTER TABLE products 
    ADD COLUMN available_in_both_purities BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add rate_18k column to gold_rates table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'gold_rates' AND column_name = 'rate_18k'
  ) THEN
    ALTER TABLE gold_rates 
    ADD COLUMN rate_18k DECIMAL(10, 2);
  END IF;
END $$;

-- Update existing products to have default purity if null
UPDATE products 
SET gold_purity = '22K' 
WHERE gold_purity IS NULL;

-- Update existing products to have default available_in_both_purities if null
UPDATE products 
SET available_in_both_purities = false 
WHERE available_in_both_purities IS NULL;

-- Calculate and set 18K rate for existing gold_rates records where it's null
UPDATE gold_rates 
SET rate_18k = ROUND(rate_per_gram * 0.75, 2)
WHERE rate_18k IS NULL;

-- Add comment to columns for documentation
COMMENT ON COLUMN products.gold_purity IS 'Gold purity: 18K or 22K';
COMMENT ON COLUMN products.available_in_both_purities IS 'Whether customers can choose between 18K and 22K for this product';
COMMENT ON COLUMN gold_rates.rate_18k IS '18K gold rate per gram';
