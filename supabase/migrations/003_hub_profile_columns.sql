-- ═══════════════════════════════════════════════════════════════
--  Add hub profile columns for rich hub profiles
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE public.hubs
  ADD COLUMN IF NOT EXISTS description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone text DEFAULT '',
  ADD COLUMN IF NOT EXISTS email text DEFAULT '',
  ADD COLUMN IF NOT EXISTS image_data text DEFAULT '',
  ADD COLUMN IF NOT EXISTS specialties text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS location text DEFAULT '',
  ADD COLUMN IF NOT EXISTS radius numeric DEFAULT 5,
  ADD COLUMN IF NOT EXISTS hours jsonb DEFAULT '{"open":"06:00","close":"21:00"}',
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
