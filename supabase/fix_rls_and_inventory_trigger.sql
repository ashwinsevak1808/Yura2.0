-- ==============================================
-- FIX RLS & AUTOMATE INVENTORY COUNT
-- ==============================================

BEGIN;

-- 1. ENABLE GUEST CHECKOUT (RLS Fix)
-- Allow anyone (including anonymous users) to INSERT into orders and order_items
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing restricted policies if they conflict
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON orders;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON order_items;

-- Create OPEN insert policies for Guest Checkout
CREATE POLICY "Enable insert for all users" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable insert for all users" ON order_items FOR INSERT WITH CHECK (true);

-- Ensure they can read their own orders (by ID/session is tricky, but at least allow creators to see?)
-- Usually for guest checkout, we just allow insert. Viewing is done via a secure "Success" page or by ID lookup if needed.
-- For standard "Select", we might restrict it, but Insert needs to be open.

-- 2. AUTOMATE TOTAL INVENTORY CALCULATION
-- Create a function that sums up stock from product_sizes and updates products.inventory
CREATE OR REPLACE FUNCTION update_product_inventory_from_sizes()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the parent product's inventory to be the sum of all its sizes' stock
    UPDATE products
    SET inventory = (
        SELECT COALESCE(SUM(stock), 0)
        FROM product_sizes
        WHERE product_id = NEW.product_id
    )
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the Trigger
DROP TRIGGER IF EXISTS trigger_update_inventory_from_sizes ON product_sizes;

CREATE TRIGGER trigger_update_inventory_from_sizes
AFTER INSERT OR UPDATE OR DELETE ON product_sizes
FOR EACH ROW
EXECUTE FUNCTION update_product_inventory_from_sizes();

-- 3. RECALCULATE ALL EXISTING INVENTORY NOW
-- Force update for all products to ensure they match current size stocks
UPDATE products p
SET inventory = (
    SELECT COALESCE(SUM(stock), 0)
    FROM product_sizes ps
    WHERE ps.product_id = p.id
);


COMMIT;
