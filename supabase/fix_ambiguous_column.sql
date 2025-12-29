-- ==============================================
-- FIX AMBIGUOUS COLUMN ERROR IN TRIGGER FUNCTION
-- ==============================================

BEGIN;

CREATE OR REPLACE FUNCTION decrement_size_inventory()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    p_id UUID;     -- Renamed from product_id to p_id to avoid ambiguity
    qty INTEGER;
    size_name TEXT;
BEGIN
    -- This function runs for every item in the order
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        p_id := (item->>'product_id')::UUID;
        qty := (item->>'quantity')::INTEGER;
        size_name := (item->>'size');
        
        -- A. Decrease the specific size stock
        -- Explicitly using table aliases (ps for product_sizes) to be 100% safe
        UPDATE product_sizes ps
        SET stock = ps.stock - qty
        WHERE ps.product_id = p_id 
        AND ps.size = size_name;
        
        -- B. Recalculate the MASTER inventory (Sum of all sizes)
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
$$ LANGUAGE plpgsql;

COMMIT;
