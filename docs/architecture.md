# Sparkle Connect Architecture & System Design

## Overview
Sparkle Connect is a campus social networking, student communication, community building, and gig discovery platform tailored specifically for university students across Kenya.

## Shared Backend Architecture
The platform utilizes a unified, single backend architecture ensuring complete data consistency between the Responsive Web Application (React/TypeScript/Vite) and Native Android Application (Kotlin/Jetpack Compose):

```
       +----------------------------+     +-------------------------------+
       |   React 19 Web Client      |     |  Native Android (Compose)     |
       | (Desktop, Tablet, Mobile)  |     |   (Kotlin MVVM + Coroutines)  |
       +--------------+-------------+     +---------------+---------------+
                      |                                   |
                      +-----------------+-----------------+
                                        |
                             HTTPS / WSS Realtime
                                        |
                      +-----------------v-----------------+
                      |         Supabase Backend          |
                      |  - Supabase Auth (JWT / Sessions) |
                      |  - PostgreSQL 15+ with RLS        |
                      |  - Supabase Realtime Channels     |
                      |  - Supabase S3 Object Storage     |
                      +-----------------------------------+
```

## Core Modules & Destinations
1. **Feed & Campus Discussions**: Microblogging with media, multi-university category filters, real-time likes/comments, and privacy-preserving anonymous mode.
2. **Gig Marketplace**: Student freelance marketplace (Tech, Design, Tutoring, Writing, Campus Delivery) with application tracking.
3. **Communities & Circles**: Faculty, tech clubs, sports clubs, departmental guilds with moderation controls.
4. **Campus Events**: Hackathons, career fairs, cultural fests, workshops with RSVP and live attendee counts.
5. **Real-time Messaging**: Private 1-on-1 direct messages and community group chats.
6. **Student Verification & Profiles**: Verified university badges, course details, skills, and portfolio showcases.
