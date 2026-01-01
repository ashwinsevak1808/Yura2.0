import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
// Try to find the service role key, fallback to anon key to prevent crash
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || "";

// Check if we have valid keys
if (!supabaseUrl) {
    console.error("❌ NEXT_PUBLIC_SUPABASE_URL is missing.");
}

if (!supabaseServiceKey) {
    console.error("❌ No Supabase Key found. Database operations will fail.");
} else if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ SUPABASE_SERVICE_ROLE_KEY is missing. Using Anon Key. Admin operations (like guest checkout bypassing RLS) may fail.");
}

export const supabaseAdmin = createClient(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);
