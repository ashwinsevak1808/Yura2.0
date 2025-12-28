-- Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create Policy: Allow Public Read Access (Everyone can see testimonials)
CREATE POLICY "Enable read access for all users" ON testimonials
  FOR SELECT USING (true);

-- Create Policy: Allow Admin Full Access (Only authenticated users/admins can create/update/delete)
-- Assuming your team logs in via Supabase Auth. 
-- If you want strictly public submission (unlikely for "team adds them"), we can adjust.
-- For now, we'll allow authenticated users (your team) to insert/update/delete.
CREATE POLICY "Enable insert for authenticated users only" ON testimonials
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON testimonials
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON testimonials
  FOR DELETE USING (auth.role() = 'authenticated');
