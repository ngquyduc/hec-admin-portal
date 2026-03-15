# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Project name: `hec-admin-portal`
   - Database password: (save this securely)
   - Region: Choose closest to your location
4. Wait for the project to be created (~2 minutes)

## 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## 3. Configure Environment Variables

1. Create a `.env` file in the root directory (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## 4. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql` and paste it
4. Click **Run** to execute the schema

This will create:
- `staff`, `teachers`, `students`, `parents` tables
- Indexes for performance
- Auto-updating `updated_at` triggers
- Row Level Security policies

## 5. (Optional) Add Sample Data

You can add test data through the **Table Editor** in Supabase dashboard, or run SQL inserts.

## 6. Configure Authentication (Optional for now)

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider (enabled by default)
3. Later you can add Google, GitHub, etc.

## 7. Test Connection

Run the development server and check if the connection works:
```bash
pnpm dev
```

## 8. Apply Schema Migrations (for existing projects)

If your database already exists and you changed table fields in code, run the migration SQL file:

1. Open **SQL Editor** in Supabase dashboard
2. Click **New Query**
3. Paste the content from [supabase/migrations/20260314_replace_student_level_with_entry_exit.sql](supabase/migrations/20260314_replace_student_level_with_entry_exit.sql)
4. Click **Run**

This migration:
- Adds `entry_result` and `exit_target`
- Copies old `level` values into `entry_result`
- Drops the old `level` column

## Security Notes

- **Never commit `.env` to git** (it's already in `.gitignore`)
- The current RLS policies allow all authenticated users full access
- You should customize RLS policies based on your role-based access needs
- Consider setting up separate policies for different staff roles
