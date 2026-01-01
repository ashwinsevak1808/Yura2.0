-- Create a table for user roles
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read their own role" 
  ON public.user_roles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
  ON public.user_roles 
  FOR ALL 
  USING (
    exists (
      select 1 from public.user_roles 
      where user_id = auth.uid() 
      and role = 'admin'
    )
  );

-- Function to handle new user signup (auto-assign 'user' role)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Manually assign admin role to your email (Run this manually in SQL editor after signup if needed, or I include it here for the migration)
-- NOTE: This assumes the user 'ashwinsevak2091@gmail.com' ALREADY exists in auth.users. 
-- If not, it will do nothing. You might need to sign up first.
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'ashwinsevak2091@gmail.com';
  
  IF target_user_id IS NOT NULL THEN
    -- Check if role entry exists
    IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id) THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (target_user_id, 'admin');
    ELSE
      UPDATE public.user_roles SET role = 'admin' WHERE user_id = target_user_id;
    END IF;
  END IF;
END
$$;
