# Sparkle Connect Security & Access Control

## Principles
1. **Zero-Trust RLS Policies**: Every table containing application records enforces Row Level Security.
2. **Identity Separation for Anonymous Posts**: Public queries select from the `public_posts` view which masks the author identity.
3. **Membership Authorization**: Conversation messages and private community discussions verify membership before returning records.
4. **Credential Isolation**: Client applications (Web & Android) only receive the Supabase Anon key. The Supabase Service-Role key is strictly forbidden on clients.
5. **Input Sanitation & Spam Prevention**: All gig applications, post comments, and reporting workflows enforce server-side validation and duplicate-prevention constraints.
