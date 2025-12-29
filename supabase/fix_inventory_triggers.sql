-- ==============================================
-- FIX & ENHANCE INVENTORY TRIGGERS
-- ==============================================

BEGIN;

-- 1. Create a SYNC function to fix "10" stuck inventory
-- This will recalculate every product's total inventory based on its sizes
CREATE OR REPLACE FUNCTION sync_product_inventory()
RETURNS void AS $$
BEGIN
    -- Update all products that have sizes
    UPDATE products p
    SET inventory = (
        SELECT COALESCE(SUM(stock), 0)
        FROM product_sizes ps
        WHERE ps.product_id = p.id
    )
    WHERE EXISTS (
        SELECT 1 FROM product_sizes ps WHERE ps.product_id = p.id
    );
    
    -- Optional: If a product has NO sizes, what should inventory be?
    -- Current logic leaves it alone, which is safer.
END;
$$ LANGUAGE plpgsql;

-- Run the sync immediately to fix existing bad data
SELECT sync_product_inventory();


-- 2. ENHANCE Decrement Trigger to handle Order Updates (e.g. Admin Acceptance)
-- Previously, stock only decreased on INSERT. Now we want it to decrease if
-- status changes to 'paid' or 'confirmed' later (e.g. UPI manual approval).

-- First, drop the conditional logic from the function if it relies too much on INSERT context
-- The existing function `decrement_size_inventory` uses `NEW.items`, which works for UPDATE too.

DROP TRIGGER IF EXISTS decrement_size_inventory_on_order_update ON orders;

CREATE TRIGGER decrement_size_inventory_on_order_update
AFTER UPDATE ON orders
FOR EACH ROW
WHEN (
    -- Fire only if:
    -- 1. Status is now PAID/CONFIRMED
    (NEW.payment_status = 'paid' OR NEW.status = 'confirmed') 
    AND 
    -- 2. It was NOT paid/confirmed before (prevent double deduction)
    (OLD.payment_status != 'paid' AND OLD.status != 'confirmed')
    AND
    -- 3. Payment method is NOT 'cod' (COD is deducted on INSERT, don't double dip)
    NEW.payment_method != 'cod' 
)
EXECUTE FUNCTION decrement_size_inventory();


-- 3. ENSURE the INSERT trigger covers all cases
-- The previous trigger covered 'paid' and 'cod'.
-- If 'upi' comes in as 'pending', it won't fire on insert.
-- It will now fire on UPDATE via the trigger above when Admin accepts it.

-- Let's double check the INSERT trigger existence
-- (We don't need to recreate it if it exists from previous migration, but let's ensure it's correct)
-- dropping it to be safe and recreating
DROP TRIGGER IF EXISTS decrement_size_inventory_on_order ON orders;

CREATE TRIGGER decrement_size_inventory_on_order
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid' OR NEW.payment_method = 'cod')
    EXECUTE FUNCTION decrement_size_inventory();


-- 4. LOGGING/DEBUGGING (Optional, for transparency)
-- Create a small log table to track inventory changes if you want to debug future issues
CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID,
    size TEXT,
    change_amount INTEGER,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update the decrement function to log changes (optional but helpful)
-- We will replace the function to add logging and robust error handling
CREATE OR REPLACE FUNCTION decrement_size_inventory()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
    size_name TEXT;
    current_stock INTEGER;
BEGIN
    -- Loop through all items in the order
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        product_id := (item->>'product_id')::UUID;
        quantity := (item->>'quantity')::INTEGER;
        size_name := item->>'size';
        
        -- Get current stock
        SELECT stock INTO current_stock
        FROM product_sizes
        WHERE product_sizes.product_id = decrement_size_inventory.product_id 
        AND product_sizes.size = size_name;
        
        -- If stock is found, update it. If not found, ignore (or handle gracefully)
        IF current_stock IS NOT NULL THEN
             -- Check for negative stock safety
             IF current_stock < quantity THEN
                  -- We allow it but log a warning, or you could RAISE EXCEPTION
                  -- For now, let's allow it to go negative to prevent blocking the order 
                  -- (since the order is already placed/paid), but ideally we block before.
                  -- User asked to "decrease count properly".
                  -- If we block here on UPDATE, the Admin Update might fail.
                  null; 
             END IF;

             UPDATE product_sizes
             SET stock = stock - quantity
             WHERE product_sizes.product_id = decrement_size_inventory.product_id 
             AND product_sizes.size = size_name;
             
             -- Update Parent
             UPDATE products
             SET inventory = (
                SELECT COALESCE(SUM(stock), 0) 
                FROM product_sizes 
                WHERE product_sizes.product_id = decrement_size_inventory.product_id
             )
             WHERE id = decrement_size_inventory.product_id;
             
             -- Log
             INSERT INTO inventory_logs (product_id, size, change_amount, reason)
             VALUES (product_id, size_name, -quantity, 'Order ' || NEW.id || ' ' || NEW.status);
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;
