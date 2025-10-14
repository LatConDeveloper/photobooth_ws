# Supabase Setup for PhotoBooth

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Note your project URL and keys from Settings > API

## Database Setup

### Option 1: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migrations in order:
   - Copy and paste `migrations/0001_base.sql`
   - Execute
   - Copy and paste `migrations/0002_seed_data.sql`
   - Execute

### Option 2: Via Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

## Storage Buckets

Create the following storage buckets in your Supabase dashboard (Storage section):

1. **photos/raw** - For original captured photos
   - Public: No
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png

2. **photos/exports** - For processed/exported photos
   - Public: No (use signed URLs)
   - File size limit: 10MB
   - Allowed MIME types: image/jpeg, image/png

### Storage Policies

For each bucket, add these policies:

**photos/raw:**
```sql
-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'photos/raw');

-- Allow service role full access
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'photos/raw');
```

**photos/exports:**
```sql
-- Allow service role full access
CREATE POLICY "Service role full access"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'photos/exports');
```

## Environment Variables

After setup, update your `server/.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
```

## Verification

Run the server and check the health endpoint:

```bash
cd server
npm run dev

# In another terminal
curl http://localhost:8787/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "...",
  "supabase": "connected"
}
```
