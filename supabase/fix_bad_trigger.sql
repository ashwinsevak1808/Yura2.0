-- ==============================================
-- CLEANUP BAD TRIGGERS (CASCADE) & FIX
-- ==============================================

BEGIN;

-- 1. DROP BAD FUNCTION & DEPENDENTS (CASCADE)
-- This will wipe out the 'decrement_size_inventory_on_order' trigger too.
DROP FUNCTION IF EXISTS decrement_size_inventory() CASCADE;

-- Also check other potential names just in case
DROP FUNCTION IF EXISTS decrement_inventory() CASCADE;


-- 2. CREATE THE CORRECT INVENTORY DECREMENT TRIGGER (ON ORDER_ITEMS)
-- We attach this to order_items, because that's where we know the Size and Quantity.
CREATE OR REPLACE FUNCTION decrement_stock_on_order()
RETURNS TRIGGER AS $$
BEGIN
    -- Decrease the specific size stock
    UPDATE product_sizes
    SET stock = stock - NEW.quantity
    WHERE product_id = NEW.product_id
    AND size = NEW.size;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. ATTACH TRIGGER TO ORDER_ITEMS
DROP TRIGGER IF EXISTS decrement_stock_on_order_trigger ON order_items;

CREATE TRIGGER decrement_stock_on_order_trigger
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION decrement_stock_on_order();

COMMIT;
