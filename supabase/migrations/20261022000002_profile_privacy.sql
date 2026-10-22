-- Keep the web profile privacy control aligned with the native Android profile sheet.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_private_account BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN public.profiles.is_private_account IS
  'When true, the profile is visible only to its owner under the current profile visibility policy.';

-- Replace the permissive read policy so the setting actually has an effect.
DROP POLICY IF EXISTS "Public profiles are readable by authenticated users" ON public.profiles;

CREATE POLICY "Profiles are readable according to privacy preference"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id OR is_private_account = FALSE);
