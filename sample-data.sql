-- Sample data for testing the jewelry e-commerce platform

-- First, make sure you have run the reviews-coupons-migration.sql

-- Add sample gold rate history (last 7 days)
INSERT INTO gold_rate_history (rate_per_gram, created_at) VALUES
  (7000, NOW() - INTERVAL '6 days'),
  (7050, NOW() - INTERVAL '5 days'),
  (7100, NOW() - INTERVAL '4 days'),
  (7080, NOW() - INTERVAL '3 days'),
  (7120, NOW() - INTERVAL '2 days'),
  (7150, NOW() - INTERVAL '1 day'),
  (7200, NOW());

-- Add sample coupons
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount_amount, usage_limit, valid_from, valid_until, is_active) VALUES
  ('WELCOME10', 'Welcome discount for new customers', 'percentage', 10, 5000, 2000, 100, NOW(), NOW() + INTERVAL '30 days', true),
  ('FESTIVE500', 'Festival special - Flat ₹500 off', 'fixed', 500, 10000, NULL, 50, NOW(), NOW() + INTERVAL '15 days', true),
  ('VIP20', 'VIP customer exclusive 20% off', 'percentage', 20, 15000, 5000, 20, NOW(), NOW() + INTERVAL '60 days', true),
  ('SAVE1000', 'Save ₹1000 on premium purchases', 'fixed', 1000, 25000, NULL, 30, NOW(), NOW() + INTERVAL '45 days', true);

-- Add sample product reviews (assuming you have products with these IDs - adjust as needed)
-- First, get a product ID from your products table
-- You'll need to replace 'YOUR_PRODUCT_ID_HERE' with actual product IDs from your database

-- Example reviews (you need to update product_id with real IDs from your products table)
-- Run this query in Supabase SQL editor to get product IDs first:
-- SELECT id, name FROM products LIMIT 5;

-- Then uncomment and update these with real product IDs:
/*
INSERT INTO product_reviews (product_id, customer_name, customer_email, rating, title, review_text, verified_purchase, is_approved) VALUES
  ('YOUR_PRODUCT_ID_1', 'Priya Sharma', 'priya@example.com', 5, 'Absolutely stunning!', 'The craftsmanship is exceptional. The gold quality is exactly as described. Highly recommend!', true, true),
  ('YOUR_PRODUCT_ID_1', 'Rahul Mehta', 'rahul@example.com', 4, 'Beautiful piece', 'Very happy with my purchase. The design is elegant and the finish is perfect.', true, true),
  ('YOUR_PRODUCT_ID_2', 'Anjali Patel', 'anjali@example.com', 5, 'Perfect for gifting', 'Bought this as a wedding gift. The recipient loved it! Packaging was also premium.', true, true),
  ('YOUR_PRODUCT_ID_2', 'Vikram Singh', 'vikram@example.com', 5, 'Excellent quality', 'Worth every rupee. The hallmark certification gives confidence. Will buy again.', false, true),
  ('YOUR_PRODUCT_ID_3', 'Sneha Reddy', 'sneha@example.com', 4, 'Good value', 'Nice design and good weight. Delivery was prompt. Satisfied with the purchase.', true, false);
*/

-- Note: The last review has is_approved = false, so it won't show on the website until admin approves it

-- To add reviews with real product IDs, follow these steps:
-- 1. Go to Supabase SQL Editor
-- 2. Run: SELECT id, name, slug FROM products LIMIT 5;
-- 3. Copy the product IDs
-- 4. Replace YOUR_PRODUCT_ID_1, YOUR_PRODUCT_ID_2, etc. with real IDs
-- 5. Uncomment the INSERT statement above and run it
