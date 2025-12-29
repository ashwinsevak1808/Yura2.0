-- =================================================================
-- FINAL INVENTORY FIX: SECURITY DEFINER & DEBUGGING
-- =================================================================

BEGIN;

-- 1. Create a log table to verify the trigger is actually firing
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID,
    product_id UUID,
    size TEXT,
    qty INTEGER,
    status TEXT,
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE THE FUNCTION WITH "SECURITY DEFINER"
-- "SECURITY DEFINER" is crucial: It means this function runs with ADMIN privileges.
-- This allows Guest Users (who can't normally touch inventory) to unknowingly decrease stock when they buy.

CREATE OR REPLACE FUNCTION decrement_size_inventory()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    p_id UUID;
    qty INTEGER;
    size_name TEXT;
    current_stock INTEGER;
    new_stock INTEGER;
BEGIN
    -- Log that the trigger started (helps debugging)
    INSERT INTO inventory_logs (order_id, message, status)
    VALUES (NEW.id, 'Trigger Started', NEW.status);

    -- Loop through items
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        p_id := (item->>'product_id')::UUID;
        qty := (item->>'quantity')::INTEGER;
        size_name := (item->>'size');

        -- Log the attempt
        INSERT INTO inventory_logs (order_id, product_id, size, qty, message)
        VALUES (NEW.id, p_id, size_name, qty, 'Processing Item');

        -- A. UPDATE SIZE STOCK
        -- We return the new stock to verify it happened
        UPDATE product_sizes ps
        SET stock = ps.stock - qty
        WHERE ps.product_id = p_id 
        AND ps.size = size_name
        RETURNING stock INTO new_stock;
        
        -- Log the result
        IF new_stock IS NOT NULL THEN
             INSERT INTO inventory_logs (order_id, product_id, size, qty, message)
             VALUES (NEW.id, p_id, size_name, new_stock, 'Stock Updated Successfully');
        ELSE
             INSERT INTO inventory_logs (order_id, product_id, size, qty, message)
             VALUES (NEW.id, p_id, size_name, 0, 'ERROR: Size Not Found/No Update');
        END IF;

        -- B. UPDATE PRODUCT TOTAL
        UPDATE products p
        SET inventory = (
            SELECT COALESCE(SUM(ps_inner.stock), 0)
            FROM product_sizes ps_inner
            WHERE ps_inner.product_id = p_id
        )
        WHERE p.id = p_id;
        
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 
-- ^^^ IMPORTANT: SECURITY DEFINER ensures this allows updates even if user is 'anon'


-- 3. RECREATE TRIGGERS (To ensure they use the new function)

DROP TRIGGER IF EXISTS decrement_inventory_on_insert ON orders;
CREATE TRIGGER decrement_inventory_on_insert
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid' OR NEW.payment_method = 'cod')
    EXECUTE FUNCTION decrement_size_inventory();

DROP TRIGGER IF EXISTS decrement_inventory_on_update ON orders;
CREATE TRIGGER decrement_inventory_on_update
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (
        (NEW.payment_status = 'paid' OR NEW.status = 'confirmed') 
        AND (OLD.payment_status != 'paid' AND OLD.status != 'confirmed')
        AND NEW.payment_method != 'cod'
    )
    EXECUTE FUNCTION decrement_size_inventory();

-- 4. Initial Sync
SELECT sync_product_inventory();

COMMIT;
