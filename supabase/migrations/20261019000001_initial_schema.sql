-- Sparkle Connect: Complete Database Schema Migration (PostgreSQL / Supabase)
-- Version: 20261019000001

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Universities in Kenya
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    logo_url TEXT,
    website TEXT,
    location VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Campuses
CREATE TABLE IF NOT EXISTS public.campuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Profiles (Linked to Supabase Auth auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    campus_id UUID REFERENCES public.campuses(id) ON DELETE SET NULL,
    faculty VARCHAR(150),
    course VARCHAR(150),
    year_of_study INT CHECK (year_of_study BETWEEN 1 AND 7),
    role VARCHAR(30) DEFAULT 'student' CHECK (role IN ('student', 'alumni', 'moderator', 'admin')),
    is_verified_student BOOLEAN DEFAULT FALSE,
    student_id_proof_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Interests Reference
CREATE TABLE IF NOT EXISTS public.interests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    icon VARCHAR(50)
);

-- 5. Profile Interests
CREATE TABLE IF NOT EXISTS public.profile_interests (
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
    PRIMARY KEY (profile_id, interest_id)
);

-- 6. Follows / Connections
CREATE TABLE IF NOT EXISTS public.follows (
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (follower_id, following_id),
    CHECK (follower_id <> following_id)
);

-- 7. Posts
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    category VARCHAR(60) NOT NULL DEFAULT 'general',
    is_anonymous BOOLEAN DEFAULT FALSE,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Post Media
CREATE TABLE IF NOT EXISTS public.post_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(30) DEFAULT 'image',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Post Likes
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- 10. Comments
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Saved Posts
CREATE TABLE IF NOT EXISTS public.saved_posts (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, post_id)
);

-- 12. Conversations
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150),
    is_group BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Conversation Members
CREATE TABLE IF NOT EXISTS public.conversation_members (
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) DEFAULT 'member' CHECK (role IN ('creator', 'admin', 'member')),
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- 14. Messages
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Message Attachments
CREATE TABLE IF NOT EXISTS public.message_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Gigs Marketplace
CREATE TABLE IF NOT EXISTS public.gigs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(80) NOT NULL,
    skills_required TEXT[] DEFAULT '{}',
    opportunity_type VARCHAR(50) DEFAULT 'freelance' CHECK (opportunity_type IN ('freelance', 'internship', 'tutoring', 'part_time', 'collaboration', 'volunteer')),
    is_paid BOOLEAN DEFAULT TRUE,
    compensation VARCHAR(100),
    location_type VARCHAR(50) DEFAULT 'remote' CHECK (location_type IN ('remote', 'on_campus', 'hybrid')),
    deadline TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Gig Applications
CREATE TABLE IF NOT EXISTS public.gig_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
    applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cover_note TEXT NOT NULL,
    portfolio_url TEXT,
    contact_phone VARCHAR(50),
    status VARCHAR(30) DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewing', 'accepted', 'rejected', 'withdrawn')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(gig_id, applicant_id)
);

-- 18. Gig Bookmarks
CREATE TABLE IF NOT EXISTS public.gig_bookmarks (
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    gig_id UUID NOT NULL REFERENCES public.gigs(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, gig_id)
);

-- 19. Communities
CREATE TABLE IF NOT EXISTS public.communities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT,
    category VARCHAR(60) NOT NULL,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    is_private BOOLEAN DEFAULT FALSE,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    members_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. Community Members
CREATE TABLE IF NOT EXISTS public.community_members (
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) DEFAULT 'member' CHECK (role IN ('leader', 'moderator', 'member')),
    status VARCHAR(30) DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'declined')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (community_id, user_id)
);

-- 21. Community Posts Junction
CREATE TABLE IF NOT EXISTS public.community_posts (
    community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    PRIMARY KEY (community_id, post_id)
);

-- 22. Campus Events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT,
    venue VARCHAR(255) NOT NULL,
    is_online BOOLEAN DEFAULT FALSE,
    online_link TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    capacity INT,
    registered_count INT DEFAULT 0,
    category VARCHAR(60) NOT NULL,
    status VARCHAR(30) DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'canceled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Event Registrations (RSVP)
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'canceled')),
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- 24. Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. Content & User Reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type VARCHAR(40) NOT NULL CHECK (target_type IN ('post', 'comment', 'user', 'gig', 'community', 'event')),
    target_id UUID NOT NULL,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 26. User Blocks
CREATE TABLE IF NOT EXISTS public.user_blocks (
    blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (blocker_id, blocked_id),
    CHECK (blocker_id <> blocked_id)
);

-- 27. Moderation Actions Audit
CREATE TABLE IF NOT EXISTS public.moderation_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    moderator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_type VARCHAR(40) NOT NULL,
    target_id UUID NOT NULL,
    action_taken VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 28. Notification Preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    messages_enabled BOOLEAN DEFAULT TRUE,
    gigs_enabled BOOLEAN DEFAULT TRUE,
    events_enabled BOOLEAN DEFAULT TRUE
);

-- 29. Account Security Events
CREATE TABLE IF NOT EXISTS public.account_security_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type VARCHAR(60) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gig_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_security_events ENABLE ROW LEVEL SECURITY;

-- Core RLS Policies
-- Profiles: readable by all authenticated students; editable only by owner
CREATE POLICY "Public profiles are readable by authenticated users"
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Universities and Campuses: readable by all
CREATE POLICY "Universities are readable by all"
ON public.universities FOR SELECT TO authenticated USING (true);

CREATE POLICY "Campuses are readable by all"
ON public.campuses FOR SELECT TO authenticated USING (true);

-- Posts: readable by authenticated users
CREATE POLICY "Posts readable by authenticated users"
ON public.posts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create posts"
ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE TO authenticated USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
ON public.posts FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Gigs: readable by all authenticated users
CREATE POLICY "Gigs readable by authenticated users"
ON public.gigs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students can publish gigs"
ON public.gigs FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Gig owners can update their gigs"
ON public.gigs FOR UPDATE TO authenticated USING (auth.uid() = creator_id);

-- Gig Applications: applicant and gig creator only
CREATE POLICY "Applicants can view their own applications"
ON public.gig_applications FOR SELECT TO authenticated
USING (auth.uid() = applicant_id OR EXISTS (
    SELECT 1 FROM public.gigs WHERE gigs.id = gig_applications.gig_id AND gigs.creator_id = auth.uid()
));

CREATE POLICY "Students can submit gig applications"
ON public.gig_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = applicant_id);

-- Conversations & Messages: conversation members only
CREATE POLICY "Conversation members can view conversations"
ON public.conversations FOR SELECT TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_members.conversation_id = conversations.id
    AND conversation_members.user_id = auth.uid()
));

CREATE POLICY "Conversation members can read messages"
ON public.messages FOR SELECT TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.conversation_members
    WHERE conversation_members.conversation_id = messages.conversation_id
    AND conversation_members.user_id = auth.uid()
));

CREATE POLICY "Conversation members can send messages"
ON public.messages FOR INSERT TO authenticated
WITH CHECK (
    auth.uid() = sender_id AND EXISTS (
        SELECT 1 FROM public.conversation_members
        WHERE conversation_members.conversation_id = messages.conversation_id
        AND conversation_members.user_id = auth.uid()
    )
);

-- Notifications: recipient only
CREATE POLICY "Recipients view their notifications"
ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = recipient_id);

CREATE POLICY "Recipients update their notifications"
ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = recipient_id);

-- Anonymous Posts View (Enforces Author Anonymity on Public Queries)
CREATE OR REPLACE VIEW public.public_posts AS
SELECT
    id,
    CASE WHEN is_anonymous THEN NULL ELSE author_id END AS author_id,
    university_id,
    content,
    category,
    is_anonymous,
    likes_count,
    comments_count,
    created_at,
    updated_at
FROM public.posts;
