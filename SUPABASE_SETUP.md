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

Link the CLI to your remote project and apply all migrations:

```bash
pnpm exec supabase link --project-ref <your-project-ref>
pnpm db:push
```

- **Project ref**: the subdomain from your `VITE_SUPABASE_URL` (e.g. `https://abcdef.supabase.co` → ref is `abcdef`)
- You will be prompted for the **database password** (Supabase dashboard → Settings → Database — not the anon key)

This applies all migration files in `supabase/migrations/` in order, creating all tables, indexes, triggers, and RLS policies.

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

Schema changes are managed via migration files in `supabase/migrations/`. To apply any pending migrations to an existing database:

```bash
pnpm db:push
```

To create a new migration for a schema change (instead of using the Supabase dashboard SQL editor):

```bash
pnpm db:new describe_your_change
# Edit the generated file in supabase/migrations/
pnpm db:push
```

See `DEVELOPER.md` for the full workflow.

## Security Notes

- **Never commit `.env` to git** (it's already in `.gitignore`)
- The current RLS policies allow all authenticated users full access
- You should customize RLS policies based on your role-based access needs
- Consider setting up separate policies for different staff roles
