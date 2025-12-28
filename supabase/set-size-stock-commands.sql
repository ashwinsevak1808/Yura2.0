-- ============================================
-- Quick Commands to Set Stock for Existing Products
-- ============================================

-- Step 1: View current product sizes (to see what needs stock)
-- ============================================
SELECT 
    p.name as product_name,
    ps.size,
    ps.stock as current_stock
FROM products p
JOIN product_sizes ps ON p.id = ps.product_id
ORDER BY p.name, ps.size;

-- Step 2: Set default stock for ALL sizes (e.g., 10 items each)
-- ============================================
UPDATE product_sizes SET stock = 10;

-- Step 3: Update total inventory for all products
-- ============================================
UPDATE products 
SET inventory = (
    SELECT COALESCE(SUM(stock), 0) 
    FROM product_sizes 
    WHERE product_sizes.product_id = products.id
);

-- Step 4: Set stock for specific product sizes (EXAMPLE - customize as needed)
-- ============================================

-- Example 1: Set stock for a specific product by name
UPDATE product_sizes ps
SET stock = 15
FROM products p
WHERE ps.product_id = p.id 
AND p.name = 'Your Product Name Here'
AND ps.size = 'M';

-- Example 2: Set different stock for different sizes of same product
DO $$
DECLARE
    product_uuid UUID;
BEGIN
    -- Replace 'Your Product Name' with actual product name
    SELECT id INTO product_uuid FROM products WHERE name = 'Your Product Name' LIMIT 1;
    
    -- Set stock for each size
    UPDATE product_sizes SET stock = 5  WHERE product_id = product_uuid AND size = 'XS';
    UPDATE product_sizes SET stock = 10 WHERE product_id = product_uuid AND size = 'S';
    UPDATE product_sizes SET stock = 15 WHERE product_id = product_uuid AND size = 'M';
    UPDATE product_sizes SET stock = 12 WHERE product_id = product_uuid AND size = 'L';
    UPDATE product_sizes SET stock = 8  WHERE product_id = product_uuid AND size = 'XL';
    UPDATE product_sizes SET stock = 5  WHERE product_id = product_uuid AND size = 'XXL';
    
    -- Update total inventory
    UPDATE products 
    SET inventory = (SELECT SUM(stock) FROM product_sizes WHERE product_id = product_uuid)
    WHERE id = product_uuid;
END $$;

-- Step 5: Set stock based on size (all S=10, all M=15, etc.)
-- ============================================
UPDATE product_sizes SET stock = 8  WHERE size = 'XS';
UPDATE product_sizes SET stock = 12 WHERE size = 'S';
UPDATE product_sizes SET stock = 20 WHERE size = 'M';
UPDATE product_sizes SET stock = 18 WHERE size = 'L';
UPDATE product_sizes SET stock = 15 WHERE size = 'XL';
UPDATE product_sizes SET stock = 10 WHERE size = 'XXL';

-- Then update all products' total inventory
UPDATE products 
SET inventory = (
    SELECT COALESCE(SUM(stock), 0) 
    FROM product_sizes 
    WHERE product_sizes.product_id = products.id
);

-- Step 6: Verify the changes
-- ============================================
SELECT 
    p.name,
    p.inventory as total_inventory,
    ps.size,
    ps.stock as size_stock
FROM products p
LEFT JOIN product_sizes ps ON p.id = ps.product_id
ORDER BY p.name, ps.size;

-- Step 7: Check products with low stock
-- ============================================
SELECT 
    p.name,
    ps.size,
    ps.stock
FROM products p
JOIN product_sizes ps ON p.id = ps.product_id
WHERE ps.stock < 5
ORDER BY ps.stock ASC;

-- Step 8: Check products with no stock
-- ============================================
SELECT 
    p.name,
    ps.size,
    ps.stock
FROM products p
JOIN product_sizes ps ON p.id = ps.product_id
WHERE ps.stock = 0
ORDER BY p.name;

-- ============================================
-- BULK OPERATIONS
-- ============================================

-- Set stock for all products in a specific category
UPDATE product_sizes ps
SET stock = 20
FROM products p
WHERE ps.product_id = p.id 
AND p.category = 'Anarkali';

-- Update total inventory after bulk changes
UPDATE products 
SET inventory = (
    SELECT COALESCE(SUM(stock), 0) 
    FROM product_sizes 
    WHERE product_sizes.product_id = products.id
);

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- Get inventory summary for a specific product
SELECT * FROM product_inventory_summary 
WHERE product_name LIKE '%Kurti%';

-- Get total stock for a product
SELECT 
    p.name,
    get_product_total_stock(p.id) as total_stock
FROM products p
LIMIT 10;

-- Check if a specific size is available
SELECT 
    p.name,
    check_size_availability(p.id, 'M', 2) as has_2_medium_available
FROM products p
LIMIT 10;
