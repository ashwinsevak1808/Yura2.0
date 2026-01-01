-- Create OTP Verifications Table
create table if not exists public.otp_verifications (
    id uuid default gen_random_uuid() primary key,
    email text not null,
    phone text,
    otp_code text not null,
    is_verified boolean default false,
    expires_at timestamptz not null,
    created_at timestamptz default now()
);

-- Index for faster lookups
create index if not exists idx_otp_email on public.otp_verifications(email);

-- Enable RLS
alter table public.otp_verifications enable row level security;

-- Policy: Allow unrestricted insert (server-side usually bypasses RLS, but for good measure)
create policy "Enable insert for everyone" 
on public.otp_verifications for insert 
to public 
with check (true);

-- Policy: Select should be restricted. We'll access via Service Role in API.
-- But if we use standard client, we might need a policy.
-- For now, we'll keep it closed to public selects.
