# Supabase Setup Guide

Your backend is now configured to upload all IDs to Supabase! Here's how to set it up:

## Step 1: Create `.env` file in the server directory

Create `/Users/tushar/Desktop/webapp/server/.env` with your Supabase credentials:

```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 2: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Settings** → **API** in the sidebar
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role Secret** → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **Keep the Service Role key private!** Never commit it to git.

## Step 3: Verify Database Schema

Make sure your Supabase project has these tables created:

- `users` (with columns: id, phone, name, role, hub_id, created_at, updated_at)
- `hubs` (with columns: id, name, address, city, pincode, lat, lng)
- `farmer_listings` (with columns: id, user_id, name, category, price, unit, stock, description, image_data, hub_id)
- `orders` (with columns: id, user_id, product_id, quantity, total_price, status)

You can run the migration from `/Users/tushar/Desktop/webapp/supabase/migrations/001_complete_schema.sql`

## Step 4: Start the Server

```bash
cd /Users/tushar/Desktop/webapp/server
npm run dev
```

You should see a log message like:
```
✅ Supabase connected: https://your-project-ref.supabase.co
```

## What's Happening Now

✅ **User IDs** are being uploaded to `users` table when you create/update users
✅ **Hub IDs** are being uploaded to `hubs` table when you create hubs
✅ **Product IDs** are being uploaded to `farmer_listings` table when farmers list products
✅ **Order IDs** are being uploaded to `orders` table when orders are placed

All with **fallback to local JSON database** if Supabase is not available!

## Troubleshooting

### IDs still not uploading?

1. **Check server logs** - Look for error messages starting with `❌` or `Supabase error:`
2. **Verify credentials** - Make sure `.env` file is in `/server/` directory, not root
3. **Check database schema** - Run the migration to create required tables
4. **Restart server** - After adding `.env`, restart with `npm run dev`

### Test endpoint with curl:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "name": "Test User", "role": "farmer"}'
```

You should see a response with an ID, and check Supabase dashboard to confirm it's in the database.
