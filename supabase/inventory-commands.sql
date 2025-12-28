-- ============================================
-- YURAA Inventory Management - Quick Reference
-- Common SQL Commands for Managing Inventory
-- ============================================

-- ============================================
-- 1. SET INITIAL INVENTORY FOR ALL PRODUCTS
-- ============================================

-- Set all products to 50 items in stock
UPDATE products SET inventory = 50;

-- Set all products to 100 items in stock
UPDATE products SET inventory = 100;


-- ============================================
-- 2. SET INVENTORY FOR SPECIFIC PRODUCTS
-- ============================================

-- By product slug
UPDATE products 
SET inventory = 25 
WHERE slug = 'elegant-floral-kurti';

-- By product ID
UPDATE products 
SET inventory = 30 
WHERE id = 'your-product-uuid-here';

-- Multiple products at once
UPDATE products 
SET inventory = 40 
WHERE slug IN ('product-1', 'product-2', 'product-3');


-- ============================================
-- 3. MARK PRODUCTS AS OUT OF STOCK
-- ============================================

-- Single product
UPDATE products 
SET inventory = 0 
WHERE slug = 'out-of-stock-product';

-- Multiple products
UPDATE products 
SET inventory = 0 
WHERE id IN (
    'uuid-1',
    'uuid-2',
    'uuid-3'
);


-- ============================================
-- 4. CHECK CURRENT INVENTORY LEVELS
-- ============================================

-- View all products with inventory
SELECT 
    id,
    name,
    slug,
    inventory,
    price
FROM products
ORDER BY inventory DESC;

-- View only low stock products (less than 5)
SELECT 
    id,
    name,
    slug,
    inventory,
    price
FROM products
WHERE inventory < 5
ORDER BY inventory ASC;

-- View out of stock products
SELECT 
    id,
    name,
    slug,
    inventory,
    price
FROM products
WHERE inventory = 0;

-- View in-stock products
SELECT 
    id,
    name,
    slug,
    inventory,
    price
FROM products
WHERE inventory > 0
ORDER BY inventory DESC;


-- ============================================
-- 5. BULK INVENTORY UPDATES
-- ============================================

-- Add 10 items to all products
UPDATE products 
SET inventory = inventory + 10;

-- Add 20 items to specific category
UPDATE products 
SET inventory = inventory + 20 
WHERE category = 'Kurties';

-- Reduce inventory by 5 for all products
UPDATE products 
SET inventory = inventory - 5 
WHERE inventory > 5;


-- ============================================
-- 6. INVENTORY REPORTS
-- ============================================

-- Total inventory value
SELECT 
    SUM(inventory * price) as total_inventory_value,
    SUM(inventory) as total_items
FROM products;

-- Inventory by category
SELECT 
    category,
    COUNT(*) as product_count,
    SUM(inventory) as total_inventory,
    AVG(inventory) as avg_inventory_per_product
FROM products
GROUP BY category
ORDER BY total_inventory DESC;

-- Products needing restock (less than 10 items)
SELECT 
    name,
    slug,
    inventory,
    price,
    inventory * price as inventory_value
FROM products
WHERE inventory < 10
ORDER BY inventory ASC;


-- ============================================
-- 7. MANUAL INVENTORY ADJUSTMENTS
-- ============================================

-- Increase inventory for a product (e.g., new stock arrived)
UPDATE products 
SET inventory = inventory + 50 
WHERE slug = 'product-slug';

-- Decrease inventory (e.g., damaged items)
UPDATE products 
SET inventory = inventory - 3 
WHERE slug = 'product-slug';

-- Set exact inventory count
UPDATE products 
SET inventory = 75 
WHERE slug = 'product-slug';


-- ============================================
-- 8. VERIFY INVENTORY AFTER ORDER
-- ============================================

-- Check inventory for a specific product
SELECT name, inventory 
FROM products 
WHERE id = 'product-uuid';

-- View recent orders and their impact on inventory
SELECT 
    o.id as order_id,
    o.created_at,
    o.status,
    o.items,
    o.total_amount
FROM orders o
ORDER BY o.created_at DESC
LIMIT 10;


-- ============================================
-- 9. RESTORE INVENTORY (Manual Override)
-- ============================================

-- If you need to manually restore inventory after a cancelled order
-- First, find the order items
SELECT items FROM orders WHERE id = 'order-uuid';

-- Then manually update inventory
-- (The trigger should do this automatically, but this is for manual override)
UPDATE products 
SET inventory = inventory + 2  -- quantity from order
WHERE id = 'product-uuid';


-- ============================================
-- 10. INVENTORY AUDIT
-- ============================================

-- Create a snapshot of current inventory
CREATE TABLE IF NOT EXISTS inventory_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_id UUID REFERENCES products(id),
    product_name TEXT,
    inventory_count INTEGER,
    price NUMERIC(10, 2)
);

-- Take inventory snapshot
INSERT INTO inventory_snapshots (product_id, product_name, inventory_count, price)
SELECT id, name, inventory, price
FROM products;

-- Compare current inventory with last snapshot
SELECT 
    p.name,
    p.inventory as current_inventory,
    s.inventory_count as snapshot_inventory,
    (p.inventory - s.inventory_count) as difference
FROM products p
LEFT JOIN inventory_snapshots s ON p.id = s.product_id
WHERE s.snapshot_date = (SELECT MAX(snapshot_date) FROM inventory_snapshots)
ORDER BY ABS(p.inventory - s.inventory_count) DESC;


-- ============================================
-- 11. EMERGENCY COMMANDS
-- ============================================

-- Reset all inventory to 0 (USE WITH CAUTION!)
-- UPDATE products SET inventory = 0;

-- Restore all inventory to default value (USE WITH CAUTION!)
-- UPDATE products SET inventory = 50;


-- ============================================
-- 12. USEFUL QUERIES FOR ADMIN PANEL
-- ============================================

-- Dashboard stats
SELECT 
    COUNT(*) as total_products,
    SUM(inventory) as total_items_in_stock,
    COUNT(CASE WHEN inventory = 0 THEN 1 END) as out_of_stock_count,
    COUNT(CASE WHEN inventory > 0 AND inventory < 10 THEN 1 END) as low_stock_count,
    SUM(inventory * price) as total_inventory_value
FROM products;

-- Best selling products (based on order frequency)
-- Note: This requires the orders table to have item details
SELECT 
    p.name,
    p.inventory,
    COUNT(*) as times_ordered
FROM products p
JOIN orders o ON o.items::text LIKE '%' || p.id::text || '%'
WHERE o.status NOT IN ('cancelled', 'refunded')
GROUP BY p.id, p.name, p.inventory
ORDER BY times_ordered DESC
LIMIT 10;


-- ============================================
-- NOTES
-- ============================================

/*
IMPORTANT REMINDERS:

1. Always check current inventory before making changes:
   SELECT inventory FROM products WHERE slug = 'product-slug';

2. The system automatically decrements inventory when:
   - Order is placed with payment_status = 'paid'
   - Order is placed with payment_method = 'cod'

3. The system automatically restores inventory when:
   - Order status changes to 'cancelled'
   - Order status changes to 'refunded'

4. To prevent overselling:
   - Never set inventory to negative values
   - The trigger will prevent orders if inventory is insufficient

5. For bulk updates, always test on a single product first!

6. Keep backups before making bulk changes:
   CREATE TABLE products_backup AS SELECT * FROM products;
*/
