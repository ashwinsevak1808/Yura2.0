-- ============================================
-- YURAA E-Commerce Database Migration
-- Production-Ready Orders & Inventory System
-- ============================================

-- Step 1: Clean all existing orders
-- ============================================
TRUNCATE TABLE orders CASCADE;

-- Step 2: Drop existing orders table to recreate with all necessary fields
-- ============================================
DROP TABLE IF EXISTS orders CASCADE;

-- Step 3: Create production-ready orders table
-- ============================================
CREATE TABLE orders (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    
    -- Shipping Information
    shipping_address JSONB NOT NULL,
    special_instructions TEXT,
    
    -- Order Items (stored as JSONB array)
    items JSONB NOT NULL,
    
    -- Pricing Information
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_cost NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    
    -- Payment Information
    payment_method TEXT NOT NULL CHECK (payment_method IN ('razorpay', 'cod', 'upi')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded', 'partially_refunded')),
    
    -- Razorpay Integration Fields
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    
    -- Refund Information
    refund_id TEXT,
    refund_amount NUMERIC(10, 2),
    refund_status TEXT CHECK (refund_status IN ('pending', 'processed', 'failed')),
    refund_reason TEXT,
    refunded_at TIMESTAMP WITH TIME ZONE,
    
    -- Order Status & Fulfillment
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    
    -- Tracking Information
    tracking_number TEXT,
    carrier TEXT,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    
    -- Cancellation Information
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT,
    
    -- Notion Integration (for your existing workflow)
    notion_page_id TEXT,
    
    -- Notes & Metadata
    admin_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Step 4: Create indexes for better query performance
-- ============================================
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Step 5: Create trigger to auto-update updated_at timestamp
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Ensure products table has inventory tracking
-- ============================================
-- Check if inventory column exists, if not add it
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'inventory'
    ) THEN
        ALTER TABLE products ADD COLUMN inventory INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Add index on inventory for quick stock checks
CREATE INDEX IF NOT EXISTS idx_products_inventory ON products(inventory);

-- Step 7: Create function to decrement inventory when order is placed
-- ============================================
CREATE OR REPLACE FUNCTION decrement_product_inventory()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
BEGIN
    -- Loop through all items in the order
    FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
    LOOP
        product_id := (item->>'product_id')::UUID;
        quantity := (item->>'quantity')::INTEGER;
        
        -- Decrement inventory
        UPDATE products
        SET inventory = inventory - quantity
        WHERE id = product_id;
        
        -- Check if inventory went negative (shouldn't happen with proper validation)
        IF (SELECT inventory FROM products WHERE id = product_id) < 0 THEN
            RAISE EXCEPTION 'Insufficient inventory for product %', product_id;
        END IF;
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to decrement inventory on order creation
CREATE TRIGGER decrement_inventory_on_order
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.payment_status = 'paid' OR NEW.payment_method = 'cod')
    EXECUTE FUNCTION decrement_product_inventory();

-- Step 8: Create function to restore inventory when order is cancelled/refunded
-- ============================================
CREATE OR REPLACE FUNCTION restore_product_inventory()
RETURNS TRIGGER AS $$
DECLARE
    item JSONB;
    product_id UUID;
    quantity INTEGER;
BEGIN
    -- Only restore if status changed to cancelled or refunded
    IF (NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded')) THEN
        -- Loop through all items in the order
        FOR item IN SELECT * FROM jsonb_array_elements(NEW.items)
        LOOP
            product_id := (item->>'product_id')::UUID;
            quantity := (item->>'quantity')::INTEGER;
            
            -- Restore inventory
            UPDATE products
            SET inventory = inventory + quantity
            WHERE id = product_id;
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to restore inventory on order cancellation/refund
CREATE TRIGGER restore_inventory_on_cancellation
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION restore_product_inventory();

-- Step 9: Create view for order analytics (useful for admin panel)
-- ============================================
CREATE OR REPLACE VIEW order_analytics AS
SELECT 
    DATE(created_at) as order_date,
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as average_order_value,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
    COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_orders
FROM orders
GROUP BY DATE(created_at)
ORDER BY order_date DESC;

-- Step 10: Grant necessary permissions (adjust based on your RLS policies)
-- ============================================
-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to view their own orders
CREATE POLICY "Users can view their own orders"
    ON orders FOR SELECT
    USING (customer_email = auth.jwt() ->> 'email');

-- Create policy for service role to manage all orders
CREATE POLICY "Service role can manage all orders"
    ON orders FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verification Queries (run these to verify the migration)
-- ============================================

-- Check orders table structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'orders' 
-- ORDER BY ordinal_position;

-- Check if triggers are created
-- SELECT trigger_name, event_manipulation, event_object_table 
-- FROM information_schema.triggers 
-- WHERE event_object_table = 'orders';

-- Check products inventory column
-- SELECT column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND column_name = 'inventory';
