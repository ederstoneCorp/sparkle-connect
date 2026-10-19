# Sparkle Connect Architecture & System Design

## Overview
Sparkle Connect is a campus social networking, student communication, community building, and gig marketplace platform tailored specifically for university students across Kenya (UoN, KU, Strathmore, JKUAT, Moi, Egerton, USIU, Daystar, MKU, TUK, Maseno).

## Cross-Platform Architecture
The platform provides both a native Android Mobile Application and a fully responsive Web Application (Desktop, Tablet, Mobile Browser) powered by a unified data and domain model:

```
       +----------------------------+     +-------------------------------+
       |   React 19 Web Client      |     |  Native Android (Compose)     |
       | (Desktop, Tablet, Mobile)  |     |   (Kotlin MVVM + Coroutines)  |
       |  Vite + TailwindCSS + TS   |     |   Room DB + StateFlow + KSP   |
       +--------------+-------------+     +---------------+---------------+
                      |                                   |
                      +-----------------+-----------------+
                                        |
                             Data & Persistence Layer
                                        |
                      +-----------------v-----------------+
                      |    Shared Database Architecture   |
                      |  - Supabase PostgreSQL (Cloud)    |
                      |  - Android Room DB (Local Cache)  |
                      |  - Web LocalStorage (Offline sync)|
                      |  - JWT Session & Auth Records     |
                      +-----------------------------------+
```

## Authentication & Gmail Flow
Sparkle Connect provides a streamlined authentication flow designed specifically for students:
1. **Gmail Instant Login (Auto-Save to Database)**:
   - Students can authenticate using their Gmail address without needing to invent or remember a password.
   - The platform auto-derives their display name from their Gmail handle or provides a quick display name input.
   - A secure internal token is generated automatically.
   - The user profile is immediately marked as `isRecordedInDatabase = true` and saved in the active database (Android Room, Web LocalStorage, Supabase).
2. **Email & Password Authentication**:
   - For students using official university credentials (`@uonbi.ac.ke`, `@ku.ac.ke`, `@strathmore.edu`, etc.).
3. **Student Profile Registration**:
   - Captures Kenyan university affiliation, faculty, degree course, year of study, skills, and campus interests.

## Implemented Core Modules
1. **Feed & Campus Discussions**:
   - University-scoped or national campus feeds.
   - Category filtering: Campus Life, Tech & Devs, Academics, Career, Opportunities, Hustles.
   - Anonymous Secret Confessions mode (identities hidden, confidential peer support).
   - Real-time likes, threaded comments with anonymous toggle, and sharing.
2. **Student Gig Marketplace**:
   - Peer-to-peer freelance marketplace denominated in Kenyan Shillings (`KES`).
   - Categories: Software & Web, Graphic Design, Academic Writing, Peer Tutoring, Photography & Media.
   - Gig posting with budget, deliverables, deadline, and skills required.
   - Proposal application modal with cover note, M-Pesa phone number, and portfolio links.
3. **Campus Communities & Clubs**:
   - Clubs, GDSC chapters, debate societies, and faculty circles across Kenyan institutions.
   - Instant Join/Leave toggle and real-time membership counts.
4. **Campus Events & Hackathons**:
   - Tech hackathons, career summits, and university workshops.
   - Real-time RSVP toggle with confirmed attendee counter.
5. **Direct Messages & Chat**:
   - Responsive split-pane chat interface on web / full-screen conversation threads on mobile.
   - Fast messaging with timestamp and student verification badges.
6. **Student Profiles & Multi-Account Switching**:
   - University verification badges, course details, year of study, and skills tags.
   - Instant account switcher for testing multi-role campus accounts.

## Running & Building the Projects

### Web Application (`apps/web`)
```bash
# Development server (Port 3000)
cd apps/web
node ../../node_modules/vite/bin/vite.js

# Type check
node ./node_modules/typescript/bin/tsc --noEmit

# Production build (Outputs to apps/web/dist/)
node ./node_modules/vite/bin/vite.js build
```

### Android Mobile Application (`app`)
```bash
# Run unit tests
.\gradlew.bat testDebugUnitTest --tests com.example.SparkleRepositoryTest

# Build debug APK
.\gradlew.bat assembleDebug

# Install on connected physical device / emulator
.\gradlew.bat installDebug
```
The compiled debug APK is located at `app/build/intermediates/apk/debug/app-debug.apk` or `app/build/outputs/apk/debug/app-debug.apk`.
