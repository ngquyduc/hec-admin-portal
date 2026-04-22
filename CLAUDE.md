# HEC

## Database Schema Changes

The schema is managed via Supabase migrations. **Never edit the remote DB directly** for schema changes — always go through migrations so the history stays in sync.

### Workflow for any schema change

1. Create a new migration file:
   ```bash
   pnpm db:new <descriptive-name>
   # e.g. pnpm db:new add_phone_to_students
   ```
2. Edit the generated file in `supabase/migrations/` with your SQL.
3. Push it to the remote DB:
   ```bash
   pnpm db:push
   ```

### Other useful commands

- `pnpm db:pull` — pull the current remote schema as a new baseline migration (useful after direct SQL edits or when starting fresh)
- `pnpm db:diff` — preview what would change between local migrations and the remote DB

### Notes

- The project is linked to Supabase project ref `oyhsezzjppwszsesckwb`.
- `supabase-schema.sql` in the root is a legacy reference file — do not use it as a source of truth. The `supabase/migrations/` folder is authoritative.
- `database.types.ts` and `database.ts` are **manually maintained** (not auto-generated). Update the `type` fields there whenever you add/change columns.
