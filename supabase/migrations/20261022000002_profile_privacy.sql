-- Keep the web profile privacy control aligned with the native Android profile sheet.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_private_account BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.is_private_account IS
  'When true, the profile owner prefers a private student profile. Enforcement for profile visibility must be applied by the relevant read policies and queries.';
