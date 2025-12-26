-- ==============================================================================
-- FIX PERMISSIONS & POLICIES (Run this in Supabase SQL Editor)
-- ==============================================================================

-- 1. Enable RLS on tables (good practice, but we need policies)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_specifications ENABLE ROW LEVEL SECURITY;

-- 2. Create permissive policies for 'products' table
-- Allow anyone to VIEW products (Public Storefront)
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Allow Authenticated Users (Admins) to INSERT/UPDATE/DELETE
CREATE POLICY "Admin Insert Products" ON products FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin Update Products" ON products FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin Delete Products" ON products FOR DELETE TO authenticated USING (true);

-- 3. Create policies for related tables (Images, Sizes, Colors, Specs)
-- Public Read
CREATE POLICY "Public Read Images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public Read Sizes" ON product_sizes FOR SELECT USING (true);
CREATE POLICY "Public Read Colors" ON product_colors FOR SELECT USING (true);
CREATE POLICY "Public Read Specs" ON product_specifications FOR SELECT USING (true);

-- Admin Write (Insert/Update/Delete) for Related Tables
CREATE POLICY "Admin Write Images" ON product_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Sizes" ON product_sizes FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Colors" ON product_colors FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Write Specs" ON product_specifications FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 4. FIX STORAGE PERMISSIONS (The "Bucket" Error)
-- Allow public access to view images in 'products' bucket
CREATE POLICY "Public View Storage" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- Allow Authenticated Users to Upload/Delete in 'products' bucket
CREATE POLICY "Admin Manage Storage" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'products') WITH CHECK (bucket_id = 'products');

-- 5. Helper to create the bucket if it doesn't exist (SQL-only way might fail if extension missing, but harmless to try)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;
