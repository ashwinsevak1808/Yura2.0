-- Create a table for managing additional charges
create table if not exists charges (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null, -- Internal name (e.g., 'Standard Shipping')
  label text not null, -- Display name (e.g., 'Shipping Charges')
  type text not null check (type in ('fixed', 'percentage')),
  amount numeric not null,
  is_active boolean default true,
  min_cart_value numeric default 0, -- Apply only if cart value is above this
  max_cart_value numeric, -- Apply only if cart value is below this (null means no upper limit)
  description text
);

-- RLS Policies
alter table charges enable row level security;

-- Allow read access to everyone (so checkout can fetch charges)
create policy "Allow public read access" on charges
  for select using (true);

-- Allow write access only to admins
create policy "Allow admin write access" on charges
  for all using (
    exists (
      select 1 from user_roles
      where user_roles.user_id = auth.uid()
      and user_roles.role = 'admin'
    )
  );
