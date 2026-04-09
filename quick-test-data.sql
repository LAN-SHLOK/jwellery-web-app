-- Quick test data - Run this in Supabase SQL Editor

-- Add gold rate history for the last 7 days
INSERT INTO gold_rates (rate_per_gram, created_at) VALUES
  (7000, NOW() - INTERVAL '6 days'),
  (7050, NOW() - INTERVAL '5 days'),
  (7100, NOW() - INTERVAL '4 days'),
  (7080, NOW() - INTERVAL '3 days'),
  (7120, NOW() - INTERVAL '2 days'),
  (7150, NOW() - INTERVAL '1 day'),
  (7200, NOW());

-- Done! Now refresh your admin dashboard to see:
-- ✓ Gold rate chart with 7 days of data
-- ✓ 3 coupons already created (from migration)
-- ✓ Ready to test the features
