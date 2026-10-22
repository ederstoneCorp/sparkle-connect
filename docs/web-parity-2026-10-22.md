# Web and Android parity work (22 October 2026)

This branch starts from the latest `main` commit and focuses on the web application.

## Implemented on this branch

- Web email/password sign-in and registration use Supabase Auth.
- Google sign-in starts the real Supabase Google OAuth redirect flow; entering a Gmail address alone is not accepted as authentication.
- Supabase sessions hydrate the current web profile. Local storage no longer restores a fake authenticated identity or persists account passwords.
- Email confirmation messaging is shown when Supabase requires confirmation.
- Password recovery sends a real Supabase reset email and provides a password-update screen after the recovery callback.
- Profile bio, faculty, course, and year changes can be persisted to `public.profiles`.
- Profile privacy preference is stored in `public.profiles.is_private_account`; the migration adjusts the profile SELECT policy to respect that preference.
- Added a web Campus Moments strip, composer, and viewer with 24-hour expiry and the Android brand palette.
- Added a web TypeScript/Vite build workflow for pull requests.

## Important boundaries

- Campus Moments are currently browser-local and text-only; they are not yet shared with other users or synchronized with Android.
- Web post creation, caption edits, deletion, comment settings, likes, comments, and saved-post actions now write to Supabase. Migration `20261022000003_web_social_persistence.sql` adds post metadata, RLS policies for these action tables, database-maintained counters, and Realtime publication. Existing seeded posts and full cloud-feed hydration still need careful end-to-end verification; gigs, event RSVPs, communities, and messages remain incomplete.
- Android currently uses Firebase/Room while the web app uses Supabase. Accounts and content are not automatically shared across both platforms until the backend architecture is unified.
- This branch does not change `main`. The database migrations must be applied to the intended Supabase project before the privacy preference can work in production.
- The code build does not prove that Google OAuth credentials, redirect allowlists, SMTP/email confirmation, or production RLS configuration are correct. Those still require live configuration and end-to-end testing.

## Verification checklist

1. Run the web TypeScript/Vite build.
2. Test email sign-up, email confirmation, sign-in, Google OAuth, password recovery, and sign-out against the intended Supabase project.
3. Apply all migrations in order, including `20261022000003_web_social_persistence.sql`, and test profile and social-content reads/writes under separate authenticated accounts.
4. Confirm that a private profile is visible to its owner but hidden from other authenticated users.
5. Verify that Moments expire after 24 hours and remain clearly labeled as browser-local until cloud synchronization is implemented.
6. Test post create/edit/delete, likes, comments, saved posts, anonymous posts, and disabled comments across two accounts and after refresh. Then persist gigs, communities, event RSVPs, and messages, and compare each web screen against Android before calling the platforms equivalent.
