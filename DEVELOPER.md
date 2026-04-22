# Developer Notes

## Quick Start

1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and fill in your Supabase credentials (see `SUPABASE_SETUP.md`)
3. Link to the remote database (one-time per machine):
   ```bash
   pnpm exec supabase link --project-ref <project-ref>
   ```
   - **Project ref**: the subdomain from your `VITE_SUPABASE_URL` (e.g. `https://abcdef.supabase.co` → ref is `abcdef`)
   - You will be prompted for the **database password** (Supabase dashboard → Settings → Database)
4. Start the dev server: `pnpm dev`

---

## Database Schema Changes

Schema changes live in `supabase/migrations/`. **Do not run SQL directly in the Supabase dashboard** — it will go out of sync with the local migration history.

### Workflow for every schema change

```bash
# 1. Create a new migration file
pnpm db:new your_change_description

# 2. Edit the generated file in supabase/migrations/
#    Write your DDL (CREATE TABLE, ALTER TABLE, DROP INDEX, etc.)

# 3. Apply to the remote database
pnpm db:push

# 4. Commit the migration file
git add supabase/migrations/
git commit -m "db: your_change_description"
```

### Commands

| Command | Description |
|---|---|
| `pnpm db:push` | Apply all pending migration files to the remote DB |
| `pnpm db:pull` | Pull the current remote schema into a new local migration file |
| `pnpm db:diff` | Show what the CLI considers pending (dry-run preview) |
| `pnpm db:new <name>` | Create a new empty timestamped migration file |

### Example

```bash
pnpm db:new add_index_on_lessons_class_id
# edit supabase/migrations/<timestamp>_add_index_on_lessons_class_id.sql
pnpm db:push
```
