# Sparkle Connect 🇰🇪
> **Kenyan University Campus Network & Student Freelance Gig Hub**

Sparkle Connect is a platform designed specifically for Kenyan university students (UoN, Kenyatta University, Strathmore, JKUAT, Moi, Egerton, USIU, Daystar, MKU, TUK, Maseno). It features both a **native Android mobile application** and a **responsive web application** (desktop, tablet, mobile web).

---

## ✨ Features Across Mobile & Web

- 🔐 **Authentication**
  - Web: Supabase Auth email/password registration and Google OAuth sign-in.
  - Android: native authentication flows using Firebase Auth / Android Credential Manager.
  - Email confirmation and password recovery are supported by the web flow when configured in Supabase.
  - **Important:** Android and web authentication/backend providers are not yet unified, so cross-platform accounts and content should not be assumed to sync.
- 💬 **Campus Feed & Secret Confessions**:
  - Filter feeds by university or browse national discussions.
  - Category tags: *Campus Life*, *Tech & Devs*, *Academics*, *Career*, *Hustles*.
  - Post anonymously in *Secret Confessions* mode.
  - Likes, threaded comments (with anonymous toggle), and instant sharing.
- 💼 **Student Gig Marketplace (KES)**:
  - Browse and post student gigs with deliverables and budgets in Kenyan Shillings (`KES`).
  - Categories: Software & Web, Graphic Design, Academic Writing, Peer Tutoring, Photography & Media.
  - One-click gig applications with cover notes, M-Pesa phone numbers, and portfolio links.
- 🏛️ **Campus Communities & Clubs**:
  - Student societies, developer clubs (GDSC), debate forums, and faculty circles.
  - Instant join/leave with live member counts.
- 📅 **Events & Hackathons**:
  - Inter-varsity hackathons, tech workshops, career summits.
  - RSVP registration toggle with live attendee counters.
- 💬 **Direct Messages & Chat**:
  - Fast 1-on-1 direct messages between verified students across campuses.
- 👤 **Student Profiles & Account Switcher**:
  - Verified student badges, degree course, year of study, skills tags, and account switching.

---

## Current implementation status

Sparkle Connect has a native Android application and a responsive web application, but feature parity is still in progress. The web login/profile flows use Supabase Auth and the profile table; several social actions and Campus Moments are currently browser-local. Android uses Firebase/Room, so a shared cross-platform data layer is still required before posts, messages, gigs, moments, and profiles can be guaranteed to synchronize between platforms.

Production authentication also requires the Google OAuth client, Supabase provider settings, redirect allowlists, email confirmation templates, and database migrations to be configured in the intended Supabase project.

---

## 🛠️ Project Architecture

```
Sparkle Connect/
├── app/                  # Native Android Application (Kotlin, Jetpack Compose, Room, MVVM)
│   ├── src/main/java/com/example/
│   │   ├── data/         # Room Database, DAOs, Entities, SparkleRepository
│   │   ├── ui/           # Compose Screens (Auth, Feed, Gigs, Communities, Events, Messages)
│   │   └── viewmodel/    # SparkleViewModel
│   └── build.gradle.kts
├── apps/web/             # Responsive Web Application (React 19, TypeScript, Vite, TailwindCSS)
│   ├── src/
│   │   ├── components/   # Layout (Navbar, Sidebar, BottomNav), Screens, Modals
│   │   ├── context/      # SparkleContext (Supabase Auth, profile state, browser-local UI state)
│   │   ├── lib/          # Initial seed data, Supabase client
│   │   └── types/        # TypeScript interfaces matching Android Room schema
│   ├── dist/             # Production build output ready for deployment
│   └── package.json
├── docs/                 # System architecture, database, and security specs
├── supabase/migrations/  # PostgreSQL schema and RLS policies for cloud sync
└── debug.keystore        # Android debug keystore
```

---

## 🚀 Getting Started

### 1. Web Application (`apps/web`)

To run the web app locally:
```bash
cd "apps/web"
node ./node_modules/vite/bin/vite.js
```
The app will start at `http://localhost:3000`.

To build for production:
```bash
node ./node_modules/typescript/bin/tsc --noEmit
node ./node_modules/vite/bin/vite.js build
```
Production assets are generated in `apps/web/dist/`.

### 2. Android Mobile Application (`app`)

To run tests:
```bash
.\gradlew.bat testDebugUnitTest --tests com.example.SparkleRepositoryTest
```

To build and install the debug APK on a connected device:
```bash
.\gradlew.bat assembleDebug
.\gradlew.bat installDebug
```
The compiled APK is at `app/build/intermediates/apk/debug/app-debug.apk`.

---

## 🎨 Brand Design Tokens

| Token | Hex | Role |
| :--- | :--- | :--- |
| **Sparkle Purple** | `#6C3BFF` | Primary Brand Color |
| **Sparkle Orange** | `#FF6B35` | Accents & Badges |
| **Sparkle Pink** | `#F43F8C` | Gradients & Highlights |
| **Sparkle Mint** | `#28D7A0` | Verification & Success |
| **Sparkle Blue** | `#2878FF` | Info & Links |
| **Background** | `#F8F9FD` | Clean Light Canvas |
