---
description: How to set up Free Development and Production environments in Supabase without using the paid Branching feature.
---

# Supabase Multi-Environment Setup (Free Tier)

You are correctly avoiding the "Branching" feature, which is paid. The method below uses **Two Separate Projects** (one for Dev, one for Prod) and creates a workflow to keep them in sync using the Supabase CLI.

### Prerequisites
- You have an existing Supabase project (this will be your **Development** environment).
- You are ready to create a new, empty Supabase project (this will be your **Production** environment).

---

## Step 1: Initialize Local Supabase
First, we need to set up the Supabase CLI in your project to track your database schema.

1. Run the initialization command:
   ```bash
   npx supabase init
   ```
   *This creates a `supabase` folder in your project directory.*

2. Log in to your Supabase account via the CLI:
   ```bash
   npx supabase login
   ```
   *Follow the instructions to generate and paste your access token.*

---

## Step 2: Link Your Development Project
We need to tell the CLI which remote project is your "Development" database so we can pull its current schema.

1. Go to your **Supabase Dashboard** -> **Settings** -> **General**.
2. Copy the **Reference ID** (it looks like `abcdefghijklm`).
3. Link the project:
   ```bash
   npx supabase link --project-ref <your-dev-project-id>
   ```
   *When asked for the database password, enter the password you used when creating the project.*

---

## Step 3: Pull Current Schema
Now we save your current database structure (tables, columns, policies) to a local file. This becomes your "Source of Truth".

1. Pull the schema:
   ```bash
   npx supabase db pull
   ```
   *This creates a file in `supabase/migrations/` (e.g., `20240101120000_remote_schema.sql`).*

---

## Step 4: Create Production Project
1. Go to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**.
3. Name it `Yuraa Production` (or similar).
4. set a strong password and save it.
5. Wait for it to provision.
6. Copy its **Reference ID**.

---

## Step 5: Push Schema to Production
Now we apply the schema (tables, etc.) from your Dev project (which we saved in Step 3) to your new Production project.

1. **Unlink** the Dev project (temporarily):
    *(Note: The CLI can only link to one at a time unless using advanced configs, but swapping links is the safest simple method)*
   ```bash
   npx supabase link --project-ref <your-prod-project-id>
   ```
   *Enter your NEW Production database password.*

2. Push the migrations:
   ```bash
   npx supabase db push
   ```
   *This will create all your tables in the Production database perfectly matching your Dev database.*

---

## Step 6: Managing Future Changes
**The Workflow:**
1.  **Develop**: Make changes in your **Dev** project (e.g., add a column via Dashboard or SQL).
2.  **Capture**: Run `npx supabase link --project-ref <dev-id>` and `npx supabase db pull` to update your local migration file.
3.  **Deploy**: Run `npx supabase link --project-ref <prod-id>` and `npx supabase db push` to apply those changes to Production.

## Step 7: Environment Variables
1.  In your local `.env.local` file, keep using the **Development** URL and Anon Key.
2.  In Vercel (or wherever you deploy), set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the **Production** project keys.
