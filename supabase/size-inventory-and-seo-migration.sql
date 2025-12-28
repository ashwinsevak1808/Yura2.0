-- ============================================
-- SAFE Size-Based Inventory & SEO Metadata Migration
-- NO DATA WILL BE DELETED - ONLY ADDING NEW FIELDS
-- ============================================

-- Safety Check: Show what will be modified
DO $$ 
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION SAFETY CHECK';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'This migration will:';
    RAISE NOTICE '1. ADD stock column to product_sizes (if not exists)';
    RAISE NOTICE '2. ADD SEO metadata columns to products (if not exists)';
    RAISE NOTICE '3. CREATE/UPDATE helper functions';
    RAISE NOTICE '4. CREATE/UPDATE triggers for inventory management';
    RAISE NOTICE '';
    RAISE NOTICE 'NO DATA WILL BE DELETED OR MODIFIED';
    RAISE NOTICE 'All existing data will remain intact';
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- Step 1: Add stock column to product_sizes
-- ============================================
DO $$ 
BEGIN
    -- Check if column already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_sizes' AND column_name = 'stock'
    ) THEN
        ALTER TABLE product_sizes ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;
        RAISE NOTICE '✓ Added stock column to product_sizes table';
    ELSE
        RAISE NOTICE '✓ Stock column already exists in product_sizes table';
    END IF;
END $$;

-- Add index for quick stock lookups
CREATE INDEX IF NOT EXISTS idx_product_sizes_stock ON product_sizes(stock);

-- ============================================
-- Step 2: Add SEO/Metadata fields to products
-- ============================================
DO $$ 
BEGIN
    -- Meta Title
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'meta_title'
    ) THEN
        ALTER TABLE products ADD COLUMN meta_title TEXT;
        RAISE NOTICE '✓ Added meta_title column to products table';
    ELSE
        RAISE NOTICE '✓ meta_title column already exists';
    END IF;

    -- Meta Description
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'meta_description'
    ) THEN
        ALTER TABLE products ADD COLUMN meta_description TEXT;
        RAISE NOTICE '✓ Added meta_description column to products table';
    ELSE
        RAISE NOTICE '✓ meta_description column already exists';
    END IF;

    -- Meta Keywords
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'meta_keywords'
    ) THEN
        ALTER TABLE products ADD COLUMN meta_keywords TEXT;
        RAISE NOTICE '✓ Added meta_keywords column to products table';
    ELSE
        RAISE NOTICE '✓ meta_keywords column already exists';
    END IF;

    -- OG Image
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'og_image'
    ) THEN
        ALTER TABLE products ADD COLUMN og_image TEXT;
        RAISE NOTICE '✓ Added og_image column to products table';
    ELSE
        RAISE NOTICE '✓ og_image column already exists';
    END IF;

    -- OG Title
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'og_title'
    ) THEN
        ALTER TABLE products ADD COLUMN og_title TEXT;
        RAISE NOTICE '✓ Added og_title column to products table';
    ELSE
        RAISE NOTICE '✓ og_title column already exists';
    END IF;

    -- OG Description
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'og_description'
    ) THEN
        ALTER TABLE products ADD COLUMN og_description TEXT;
        RAISE NOTICE '✓ Added og_description column to products table';
    ELSE
        RAISE NOTICE '✓ og_description column already exists';
    END IF;

    -- Twitter Card
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'twitter_card'
    ) THEN
        ALTER TABLE products ADD COLUMN twitter_card TEXT DEFAULT 'summary_large_image';
        RAISE NOTICE '✓ Added twitter_card column to products table';
    ELSE
        RAISE NOTICE '✓ twitter_card column already exists';
    END IF;

    -- Twitter Title
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'twitter_title'
    ) THEN
        ALTER TABLE products ADD COLUMN twitter_title TEXT;
        RAISE NOTICE '✓ Added twitter_title column to products table';
    ELSE
        RAISE NOTICE '✓ twitter_title column already exists';
    END IF;

    -- Twitter Description
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'twitter_description'
    ) THEN
        ALTER TABLE products ADD COLUMN twitter_description TEXT;
        RAISE NOTICE '✓ Added twitter_description column to products table';
    ELSE
        RAISE NOTICE '✓ twitter_description column already exists';
    END IF;

    -- Twitter Image
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'twitter_image'
    ) THEN
        ALTER TABLE products ADD COLUMN twitter_image TEXT;
        RAISE NOTICE '✓ Added twitter_image column to products table';
    ELSE
        RAISE NOTICE '✓ twitter_image column already exists';
    END IF;
END $$;

-- ============================================
-- Step 3: Create view for inventory management
-- ============================================
CREATE OR REPLACE VIEW product_inventory_summary AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    p.slug,
    p.inventory as total_inventory,
    ps.id as size_id,
    ps.size,
    ps.stock as size_stock,
    CASE 
        WHEN ps.stock > 0 THEN true 
        ELSE false 
    END as size_in_stock
FROM products p
LEFT JOIN product_sizes ps ON p.id = ps.product_id
ORDER BY p.name, ps.size;

-- ============================================
-- Step 4: Helper function - Get total stock
-- ============================================
CREATE OR REPLACE FUNCTION get_product_total_stock(product_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_stock INTEGER;
BEGIN
    SELECT COALESCE(SUM(stock), 0) INTO total_stock
    FROM product_sizes
    WHERE product_id = product_uuid;
    
    RETURN total_stock;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Step 5: Helper function - Check size availability
-- ============================================
CREATE OR REPLACE FUNCTION check_size_availability(
    product_uuid UUID,
    size_name TEXT,
    requested_quantity INTEGER DEFAULT 1
)
RETURNS BOOLEAN AS $$
DECLARE
    available_stock INTEGER;
BEGIN
    SELECT stock INTO available_stock
    FROM product_sizes
    WHERE product_id = product_uuid AND size = size_name;
    
    RETURN COALESCE(available_stock, 0) >= requested_quantity;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Step 6: Update inventory decrement trigger
-- ============================================

-- Drop old trigger if exists (safe - just removes the trigger, not data)
DROP TRIGGER IF EXISTS decrement_inventory_on_order ON orders;
DROP TRIGGER IF EXISTS decrement_size_inventory_on_order ON orders;

-- Drop old function if exists
DROP FUNCTION IF EXISTS decrement_product_inventory();
DROP FUNCTION IF EXISTS decrement_size_inventory();

-- Create new function for size-based inventory
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
        
        -- Get current stock for this size
        SELECT stock INTO current_stock
        FROM product_sizes
        WHERE product_sizes.product_id = decrement_size_inventory.product_id 
        AND product_sizes.size = size_name;
        
        -- Check if we have enough stock
        IF current_stock IS NULL OR current_stock < quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product % size %. Available: %, Requested: %', 
                product_id, size_name, COALESCE(current_stock, 0), quantity;
        END IF;
        
        -- Decrement size-specific inventory
        UPDATE product_sizes
        SET stock = stock - quantity
        WHERE product_sizes.product_id = decrement_size_inventory.product_id 
        AND product_sizes.size = size_name;
        
        -- Also update the main product inventory (total across all sizes)
        UPDATE products
        SET inventory = (
            SELECT COALESCE(SUM(stock), 0) 
            FROM product_sizes 
            WHERE product_sizes.product_id = decrement_size_inventory.product_id
        )
        WHERE id = decrement_size_inventory.product_id;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER decrement_size_inventory_on_order
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid' OR NEW.payment_method = 'cod')
    EXECUTE FUNCTION decrement_size_inventory();

-- ============================================
-- Step 7: Update inventory restore trigger
-- ============================================

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS restore_inventory_on_cancellation ON orders;
DROP TRIGGER IF EXISTS restore_size_inventory_on_cancellation ON orders;

-- Drop old function if exists
DROP FUNCTION IF EXISTS restore_product_inventory();
DROP FUNCTION IF EXISTS restore_size_inventory();

-- Create new function
CREATE OR REPLACE FUNCTION restore_size_inventory()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
    size_name TEXT;
BEGIN
    -- Only restore if status changed to cancelled or refunded
    IF (NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded')) THEN
        -- Loop through all items in the order
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_id := (item->>'product_id')::UUID;
            quantity := (item->>'quantity')::INTEGER;
            size_name := item->>'size';
            
            -- Restore size-specific inventory
            UPDATE product_sizes
            SET stock = stock + quantity
            WHERE product_sizes.product_id = restore_size_inventory.product_id 
            AND product_sizes.size = size_name;
            
            -- Also update the main product inventory (total across all sizes)
            UPDATE products
            SET inventory = (
                SELECT COALESCE(SUM(stock), 0) 
                FROM product_sizes 
                WHERE product_sizes.product_id = restore_size_inventory.product_id
            )
            WHERE id = restore_size_inventory.product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER restore_size_inventory_on_cancellation
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_size_inventory();

-- ============================================
-- Step 8: Add helpful comments
-- ============================================
COMMENT ON COLUMN product_sizes.stock IS 'Stock quantity available for this specific size';
COMMENT ON COLUMN products.meta_title IS 'SEO meta title (max 60 chars recommended)';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description (max 160 chars recommended)';
COMMENT ON COLUMN products.meta_keywords IS 'SEO keywords, comma-separated';
COMMENT ON COLUMN products.og_image IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN products.og_title IS 'Open Graph title for social sharing';
COMMENT ON COLUMN products.og_description IS 'Open Graph description for social sharing';
COMMENT ON COLUMN products.twitter_card IS 'Twitter card type (summary, summary_large_image, etc.)';

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
DO $$ 
BEGIN
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Next Steps:';
    RAISE NOTICE '1. Set stock for existing product sizes';
    RAISE NOTICE '2. Update total inventory for products';
    RAISE NOTICE '3. Add SEO metadata to products (optional)';
    RAISE NOTICE '';
    RAISE NOTICE 'Use: supabase/set-size-stock-commands.sql';
    RAISE NOTICE 'for quick stock setup commands';
    RAISE NOTICE '========================================';
END $$;

-- ============================================
-- Verification Queries (Uncomment to run)
-- ============================================

-- Check product_sizes structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'product_sizes' 
-- ORDER BY ordinal_position;

-- Check products SEO fields
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' 
-- AND (column_name LIKE '%meta%' OR column_name LIKE '%og_%' OR column_name LIKE '%twitter%')
-- ORDER BY ordinal_position;

-- View current inventory
-- SELECT * FROM product_inventory_summary LIMIT 10;
