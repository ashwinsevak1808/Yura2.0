-- Add return-related columns to orders table
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS return_requested_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS return_reason TEXT,
ADD COLUMN IF NOT EXISTS return_status TEXT CHECK (return_status IN ('requested', 'approved', 'rejected', 'completed'));

-- Add comment
COMMENT ON COLUMN orders.return_status IS 'Status of the return request: requested, approved, rejected, completed';
