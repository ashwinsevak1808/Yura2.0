-- ============================================
-- DROP EXISTING PRODUCT DATA (WITH ORDERS)
-- ============================================
-- Run this script FIRST to clean up your existing data
-- This will delete all product-related data including orders

-- Step 1: Delete order items first (they reference products)
DELETE FROM order_items;

-- Step 2: Delete orders (if you want to keep orders, skip this)
DELETE FROM orders;

-- Step 3: Delete all data from product child tables
DELETE FROM product_specifications;
DELETE FROM product_colors;
DELETE FROM product_sizes;
DELETE FROM product_images;

-- Step 4: Delete all products
DELETE FROM products;

-- Step 5: (Optional) Reset the auto-increment sequences if you have any
-- This ensures IDs start fresh
-- Uncomment if you want to reset sequences:
-- ALTER SEQUENCE products_id_seq RESTART WITH 1;
-- ALTER SEQUENCE product_images_id_seq RESTART WITH 1;
-- ALTER SEQUENCE product_sizes_id_seq RESTART WITH 1;
-- ALTER SEQUENCE product_colors_id_seq RESTART WITH 1;
-- ALTER SEQUENCE product_specifications_id_seq RESTART WITH 1;
-- ALTER SEQUENCE orders_id_seq RESTART WITH 1;
-- ALTER SEQUENCE order_items_id_seq RESTART WITH 1;

-- Verification: Check that all tables are empty
SELECT 'products' as table_name, COUNT(*) as row_count FROM products
UNION ALL
SELECT 'product_images', COUNT(*) FROM product_images
UNION ALL
SELECT 'product_sizes', COUNT(*) FROM product_sizes
UNION ALL
SELECT 'product_colors', COUNT(*) FROM product_colors
UNION ALL
SELECT 'product_specifications', COUNT(*) FROM product_specifications
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM order_items;

-- ============================================
-- RESULT: All tables should show 0 rows
-- ============================================
-- After running this, you can run the kurti_products_insert.sql script
