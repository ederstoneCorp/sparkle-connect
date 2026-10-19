# Sparkle Connect Database Design

## Schema Overview
The database is structured around 29 PostgreSQL tables under strict Row Level Security (RLS) policies.

### Core Entities
1. **`universities` & `campuses`**: Master directory of accredited Kenyan higher education institutions (e.g., UoN, KU, Strathmore, JKUAT, Moi, Egerton).
2. **`profiles`**: Linked directly to `auth.users(id)`. Contains username, display name, verified student status, university affiliation, faculty, year of study, and bio.
3. **`interests` & `profile_interests`**: Normalised tags for student networking, clubs, and gig recommendations.
4. **`posts`, `post_media`, `post_likes`, `comments`, `saved_posts`**: Social microblogging with category filters and anonymous posting support.
5. **`conversations`, `conversation_members`, `messages`, `message_attachments`**: Real-time direct & group messaging.
6. **`gigs`, `gig_applications`, `gig_bookmarks`**: Student marketplace supporting freelance, tutoring, internship, and campus assistance gigs.
7. **`communities`, `community_members`, `community_posts`**: Student clubs, circles, and departmental groups.
8. **`events`, `event_registrations`**: University workshops, summits, hackathons, and sports events.
9. **`notifications`, `notification_preferences`**: Multi-channel activity notifications.
10. **`reports`, `user_blocks`, `moderation_actions`**: Student safety, abuse reporting, and audit trail.
11. **`account_security_events`**: Audit log for logins, password changes, and security events.

### Anonymous Mode Privacy
To ensure true student safety when discussing sensitive campus topics, the `public_posts` view strips the `author_id` whenever `is_anonymous = true`. Author identity is securely isolated at the database level and inaccessible to standard client queries.
