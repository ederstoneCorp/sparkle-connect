import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  StudentProfile,
  RegisteredAccount,
  CampusPost,
  Gig,
  Community,
  CampusEvent,
  Conversation,
  SparkleNotification,
  University,
  PostCategory,
  PostVisibility,
  ChatMessage,
  GigApplication,
  SparkleMoment,
} from '../types/models';
import {
  UNIVERSITIES,
  INITIAL_POSTS,
  INITIAL_GIGS,
  INITIAL_COMMUNITIES,
  INITIAL_EVENTS,
  INITIAL_CONVERSATIONS,
  INITIAL_NOTIFICATIONS,
} from '../lib/initialData';
import { supabase } from '../lib/supabase';

interface SparkleState {
  accounts: RegisteredAccount[];
  currentUser: StudentProfile | null;
  currentAccountId: string | null;
  posts: CampusPost[];
  gigs: Gig[];
  communities: Community[];
  events: CampusEvent[];
  conversations: Conversation[];
  notifications: SparkleNotification[];
  moments: SparkleMoment[];
  selectedUniversityId: string; // 'ALL' or university ID
  activeTab: 'feed' | 'gigs' | 'communities' | 'academics' | 'events' | 'messages';
  isAuthModalOpen: boolean;
  isPasswordRecovery: boolean;
  isProfileModalOpen: boolean;
  isNotificationsOpen: boolean;
}

interface SparkleContextType extends SparkleState {
  universities: University[];
  setSelectedUniversityId: (id: string) => void;
  setActiveTab: (tab: 'feed' | 'gigs' | 'communities' | 'academics' | 'events' | 'messages') => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGmail: (googleEmail: string, derivedName?: string) => Promise<{ success: boolean; account?: RegisteredAccount; error?: string }>;
  addMoment: (caption: string, backgroundColorHex: string) => void;
  markMomentViewed: (momentId: string) => void;
  deleteMoment: (momentId: string) => void;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: {
    email: string;
    password?: string;
    displayName: string;
    universityId: string;
    faculty: string;
    course: string;
    yearOfStudy: number;
    skills: string[];
    interests: string[];
  }) => Promise<{ success: boolean; error?: string; confirmationRequired?: boolean }>;
  signOut: () => void;
  switchAccount: (accountId: string) => void;
  updateAvatar: (newAvatarUrl: string) => void;
  updateCourse: (newCourse: string) => void;
  updateProfile: (updates: { bio?: string; faculty?: string; course?: string; yearOfStudy?: number }) => Promise<{ success: boolean; error?: string }>;
  toggleProfilePrivacy: () => Promise<{ success: boolean; error?: string }>;
  addPost: (
    content: string,
    category: PostCategory,
    isAnonymous: boolean,
    tags: string[],
    mediaUrl?: string,
    images?: string[],
    visibility?: PostVisibility,
    commentsDisabled?: boolean
  ) => void;
  deletePost: (postId: string) => void;
  updatePostCaption: (postId: string, newContent: string) => void;
  toggleCommentsDisabled: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  addComment: (postId: string, content: string, isAnonymous?: boolean) => void;
  createGig: (title: string, description: string, budgetKes: number, category: string, deadline: string, skills: string[]) => void;
  applyForGig: (gigId: string, coverNote: string, phone: string, portfolioUrl?: string) => void;
  toggleJoinCommunity: (communityId: string) => void;
  toggleRsvpEvent: (eventId: string) => void;
  sendMessage: (conversationId: string, content: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;
}

const STORAGE_KEY = 'sparkle_connect_local_v2';
const isCloudPostId = (id: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

const formatTimeAgo = (timestamp?: number | string | null): string => {
  if (timestamp === null || timestamp === undefined || timestamp === '') return 'Just now';
  const time = typeof timestamp === 'number' ? timestamp : Date.parse(timestamp);
  if (!Number.isFinite(time)) return 'Just now';
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(time).toLocaleDateString();
};

const SparkleContext = createContext<SparkleContextType | undefined>(undefined);

export const SparkleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or seed
  const [state, setState] = useState<SparkleState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          accounts: [],
          currentUser: null,
          currentAccountId: null,
          posts: parsed.posts || INITIAL_POSTS,
          gigs: parsed.gigs || INITIAL_GIGS,
          communities: parsed.communities || INITIAL_COMMUNITIES,
          events: parsed.events || INITIAL_EVENTS,
          conversations: parsed.conversations || INITIAL_CONVERSATIONS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          moments: (parsed.moments || []).filter((moment: SparkleMoment) => Date.now() - moment.createdAtTimestamp < 24 * 60 * 60 * 1000),
          selectedUniversityId: 'ALL',
          activeTab: 'feed',
          isAuthModalOpen: true,
          isPasswordRecovery: false,
          isProfileModalOpen: false,
          isNotificationsOpen: false,
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached Sparkle data, falling back to initial data:', e);
    }

    return {
      accounts: [],
      currentUser: null,
      currentAccountId: null,
      posts: INITIAL_POSTS,
      gigs: INITIAL_GIGS,
      communities: INITIAL_COMMUNITIES,
      events: INITIAL_EVENTS,
      conversations: INITIAL_CONVERSATIONS,
      notifications: INITIAL_NOTIFICATIONS,
      moments: [],
      selectedUniversityId: 'ALL',
      activeTab: 'feed',
      isAuthModalOpen: true,
      isPasswordRecovery: false,
      isProfileModalOpen: false,
      isNotificationsOpen: false,
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        posts: state.posts,
        gigs: state.gigs,
        communities: state.communities,
        events: state.events,
        conversations: state.conversations,
        notifications: state.notifications,
        moments: state.moments.filter((moment) => Date.now() - moment.createdAtTimestamp < 24 * 60 * 60 * 1000),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.error('Failed to sync Sparkle state to localStorage:', e);
    }
  }, [
    state.accounts,
    state.currentUser,
    state.currentAccountId,
    state.posts,
    state.gigs,
    state.communities,
    state.events,
    state.conversations,
    state.notifications,
    state.moments,
  ]);

  useEffect(() => {
    const refreshRelativeTimes = () => {
      setState((prev) => {
        let changed = false;
        const posts = prev.posts.map((post) => {
          if (!post.createdAtTimestamp) return post;
          const timeAgo = formatTimeAgo(post.createdAtTimestamp);
          const comments = post.comments.map((comment) => {
            if (!comment.createdAtTimestamp) return comment;
            const commentTimeAgo = formatTimeAgo(comment.createdAtTimestamp);
            if (comment.timeAgo === commentTimeAgo) return comment;
            changed = true;
            return { ...comment, timeAgo: commentTimeAgo };
          });
          if (post.timeAgo === timeAgo && comments.every((comment, index) => comment === post.comments[index])) return post;
          changed = true;
          return { ...post, timeAgo, comments };
        });
        return changed ? { ...prev, posts } : prev;
      });
    };
    const timer = window.setInterval(refreshRelativeTimes, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const addMoment = (caption: string, backgroundColorHex: string) => {
    if (!state.currentUser || !caption.trim()) return;
    const now = Date.now();
    const moment: SparkleMoment = {
      id: `moment_${now}`,
      authorId: state.currentUser.id,
      authorName: state.currentUser.displayName,
      authorAvatar: state.currentUser.avatarUrl,
      authorUniversity: state.currentUser.university.shortName,
      textCaption: caption.trim().slice(0, 240),
      backgroundColorHex,
      createdAtTimestamp: now,
      audience: 'PUBLIC',
      viewedByUsers: [],
      isViewedByMe: false,
    };
    setState((prev) => ({
      ...prev,
      moments: [moment, ...prev.moments.filter((item) => now - item.createdAtTimestamp < 24 * 60 * 60 * 1000)],
    }));
  };

  const markMomentViewed = (momentId: string) => {
    if (!state.currentUser) return;
    setState((prev) => ({
      ...prev,
      moments: prev.moments.map((moment) => moment.id !== momentId ? moment : {
        ...moment,
        isViewedByMe: true,
        viewedByUsers: moment.viewedByUsers.includes(state.currentUser!.id)
          ? moment.viewedByUsers
          : [...moment.viewedByUsers, state.currentUser!.id],
      }),
    }));
  };

  const deleteMoment = (momentId: string) => {
    if (!state.currentUser) return;
    setState((prev) => ({
      ...prev,
      moments: prev.moments.filter((moment) => !(moment.id === momentId && moment.authorId === state.currentUser!.id)),
    }));
  };

  const setSelectedUniversityId = (id: string) => {
    setState((prev) => ({ ...prev, selectedUniversityId: id }));
  };

  // Restore the authenticated Supabase session and hydrate the matching cloud profile.
  useEffect(() => {
    let active = true;
    const hydrate = async (user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string; app_metadata?: Record<string, unknown> } | null) => {
      if (!user) {
        if (active) setState((prev) => ({ ...prev, currentUser: null, currentAccountId: null, isAuthModalOpen: true }));
        return;
      }
      try {
        const isGoogleLogin = user.app_metadata?.provider === 'google';
        const profile = await ensureProfile(user, !isGoogleLogin);
        if (active) setState((prev) => ({ ...prev, currentUser: profile, currentAccountId: user.id, isAuthModalOpen: prev.isPasswordRecovery }));
      } catch (error) {
        console.error('Could not restore Sparkle profile:', error);
        await supabase.auth.signOut();
        if (active) setState((prev) => ({ ...prev, currentUser: null, currentAccountId: null, isAuthModalOpen: true }));
      }
    };

    void supabase.auth.getSession().then(({ data: { session } }) => hydrate(session?.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setState((prev) => ({ ...prev, isPasswordRecovery: true, isAuthModalOpen: true }));
      }
      void hydrate(session?.user || null);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load shared feed content and the signed-in user's post actions from Supabase.
  useEffect(() => {
    const user = state.currentUser;
    if (!user) return;
    let active = true;
    const loadCloudFeed = async () => {
      const { data: rows, error } = await supabase
        .from('posts')
        .select('id, author_id, university_id, content, category, is_anonymous, likes_count, comments_count, created_at, tags, visibility, comments_disabled, media_urls')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) {
        console.error('Could not load campus feed from Supabase:', error.message);
        return;
      }
      const postRows = rows || [];
      if (!postRows.length || !active) return;
      const postIds = postRows.map((row: any) => row.id);
      const authorIds = [...new Set(postRows.map((row: any) => row.author_id))];
      const [{ data: profiles }, { data: comments }, { data: likes }, { data: saved }, { data: universities }] = await Promise.all([
        supabase.from('profiles').select('id, display_name, avatar_url, course, is_verified_student, university_id').in('id', authorIds),
        supabase.from('comments').select('id, post_id, author_id, content, is_anonymous, created_at').in('post_id', postIds).order('created_at', { ascending: true }),
        supabase.from('post_likes').select('post_id, user_id').in('post_id', postIds),
        supabase.from('saved_posts').select('post_id').eq('user_id', user.id).in('post_id', postIds),
        supabase.from('universities').select('id, short_name'),
      ]);
      if (!active) return;
      const commentAuthorIds = [...new Set((comments || []).map((comment: any) => comment.author_id))];
      const knownProfileIds = new Set((profiles || []).map((profile: any) => profile.id));
      const missingCommentAuthorIds = commentAuthorIds.filter((id: string) => !knownProfileIds.has(id));
      const { data: commentProfiles } = missingCommentAuthorIds.length
        ? await supabase.from('profiles').select('id, display_name, avatar_url, course, is_verified_student, university_id').in('id', missingCommentAuthorIds)
        : { data: [] };
      if (!active) return;
      const profileById = new Map<string, any>([...(profiles || []), ...(commentProfiles || [])].map((profile: any) => [profile.id, profile] as [string, any]));
      const universityById = new Map<string, string>((universities || []).map((university: any) => [university.id, university.short_name] as [string, string]));
      const commentsByPost = new Map<string, any[]>();
      (comments || []).forEach((comment: any) => {
        const list = commentsByPost.get(comment.post_id) || [];
        list.push(comment);
        commentsByPost.set(comment.post_id, list);
      });
      const likedPostIds = new Set((likes || []).filter((like: any) => like.user_id === user.id).map((like: any) => like.post_id));
      const savedPostIds = new Set((saved || []).map((item: any) => item.post_id));
      const cloudPosts: CampusPost[] = postRows.map((row: any) => {
        const profile = profileById.get(row.author_id) as any;
        const anonymous = Boolean(row.is_anonymous);
        const postComments = (commentsByPost.get(row.id) || []).map((comment: any) => {
          const commentProfile = profileById.get(comment.author_id) as any;
          const commentAnonymous = Boolean(comment.is_anonymous);
          return {
            id: comment.id,
            authorName: commentAnonymous ? 'Anonymous Comrade' : commentProfile?.display_name || 'Comrade Student',
            authorAvatar: commentAnonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anon' : commentProfile?.avatar_url || '',
            authorUniversity: commentAnonymous ? 'Campus' : String(universityById.get(commentProfile?.university_id) || 'Kenyan Campus'),
            content: comment.content,
            timeAgo: formatTimeAgo(comment.created_at),
            createdAtTimestamp: comment.created_at ? Date.parse(comment.created_at) : undefined,
            isAnonymous: commentAnonymous,
          };
        });
        const mediaUrls = Array.isArray(row.media_urls) ? row.media_urls : [];
        return {
          id: row.id,
          authorId: row.author_id,
          authorName: anonymous ? 'Secret Student' : profile?.display_name || 'Comrade Student',
          authorAvatar: anonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=sparkle_anon' : profile?.avatar_url || '',
          authorUniversity: anonymous ? 'Kenyan Campus' : String(universityById.get(profile?.university_id) || 'Kenyan Campus'),
          authorCourse: anonymous ? 'Anonymous' : profile?.course || '',
          isAuthorVerified: !anonymous && Boolean(profile?.is_verified_student),
          content: row.content,
          category: row.category as PostCategory,
          isAnonymous: anonymous,
          likesCount: Number(row.likes_count || 0),
          commentsCount: Number(row.comments_count || 0),
          isLiked: likedPostIds.has(row.id),
          isLikedByMe: likedPostIds.has(row.id),
          isSaved: savedPostIds.has(row.id),
          isSavedByMe: savedPostIds.has(row.id),
          timeAgo: formatTimeAgo(row.created_at),
          createdAtTimestamp: row.created_at ? Date.parse(row.created_at) : undefined,
          comments: postComments,
          mediaUrl: mediaUrls[0],
          images: mediaUrls,
          tags: Array.isArray(row.tags) ? row.tags : [],
          visibility: row.visibility as PostVisibility,
          commentsDisabled: Boolean(row.comments_disabled),
        };
      });
      setState((prev) => {
        const localSeedPosts = prev.posts.filter((post) => !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(post.id));
        return { ...prev, posts: [...cloudPosts, ...localSeedPosts] };
      });
    };
    void loadCloudFeed();
    return () => { active = false; };
  }, [state.currentUser?.id]);

  // Supabase Realtime subscriptions for live feed updates & messages
  useEffect(() => {
    const channel = supabase
      .channel('sparkle-campus-feed')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.new) {
            const p = payload.new as any;
            // The creator adds the fully hydrated post after the insert returns; avoid a race
            // where Realtime inserts a placeholder first and prevents that richer local entry.
            if (p.author_id === state.currentUser?.id) return;
            const newPost: CampusPost = {
              id: p.id || `post_${Date.now()}`,
              authorId: p.author_id || 'peer',
              authorName: p.author_name || 'Comrade Student',
              authorAvatar: p.author_avatar || '',
              authorUniversity: p.university || 'Kenyan University',
              authorCourse: p.course || '',
              isAuthorVerified: p.is_verified ?? true,
              content: p.content || '',
              category: p.category || 'CAMPUS_LIFE',
              isAnonymous: p.is_anonymous || false,
              likesCount: p.likes_count || 0,
              commentsCount: p.comments_count || 0,
              isLikedByMe: false,
              timeAgo: formatTimeAgo(p.created_at),
              createdAtTimestamp: p.created_at ? Date.parse(p.created_at) : Date.now(),
              comments: [],
            };
            setState((prev) => {
              if (prev.posts.some((post) => post.id === newPost.id)) return prev;
              return { ...prev, posts: [newPost, ...prev.posts] };
            });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          if (payload.new) {
            const m = payload.new as any;
            const newMsg: ChatMessage = {
              id: m.id || `msg_${Date.now()}`,
              senderId: m.sender_id || '',
              senderName: m.sender_name || 'Comrade',
              text: m.content || '',
              content: m.content || '',
              timestamp: 'Just now',
              isFromMe: m.sender_id === state.currentUser?.id,
            };
            setState((prev) => ({
              ...prev,
              conversations: prev.conversations.map((conv) => {
                if (conv.id === m.conversation_id) {
                  return {
                    ...conv,
                    lastMessage: m.content || '',
                    lastMessageTime: 'Just now',
                    messages: [...conv.messages, newMsg],
                  };
                }
                return conv;
              }),
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.currentUser?.id]);

  const setActiveTab = (tab: 'feed' | 'gigs' | 'communities' | 'academics' | 'events' | 'messages') => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  };

  const setIsAuthModalOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, isAuthModalOpen: open }));
  };

  const setIsProfileModalOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, isProfileModalOpen: open }));
  };

  const setIsNotificationsOpen = (open: boolean) => {
    setState((prev) => ({ ...prev, isNotificationsOpen: open }));
  };

  const profileFromUser = (user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string }): StudentProfile => {
    const metadata = user.user_metadata || {};
    const university = UNIVERSITIES.find((item) => item.id === String(metadata.universityId || '')) || UNIVERSITIES[0];
    const displayName = String(metadata.display_name || metadata.full_name || user.email?.split('@')[0] || 'Student');
    const username = String(metadata.username || (user.email || 'student').split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_'));
    return {
      id: user.id,
      username,
      displayName,
      email: user.email || '',
      avatarUrl: String(metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`),
      bio: String(metadata.bio || `Student at ${university.shortName}`),
      university,
      faculty: String(metadata.faculty || 'Not specified'),
      course: String(metadata.course || 'Not specified'),
      yearOfStudy: Number(metadata.year_of_study || 1),
      isVerifiedStudent: false,
      isPrivateAccount: Boolean(metadata.is_private_account),
      skills: Array.isArray(metadata.skills) ? metadata.skills as string[] : ['Campus Networking'],
      interests: Array.isArray(metadata.interests) ? metadata.interests as string[] : ['Campus Life'],
      joinedDate: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  };

  const ensureProfile = async (user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string; app_metadata?: Record<string, unknown> }, allowCreate = true) => {
    const mapped = profileFromUser(user);
    const { data: existingProfile, error: readError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, faculty, course, year_of_study, is_verified_student, is_private_account, created_at')
      .eq('id', user.id)
      .maybeSingle();
    if (readError) throw readError;

    if (!existingProfile) {
      if (!allowCreate) {
        throw new Error('No Sparkle Connect account is registered for this login. Please register first.');
      }
      const baseUsername = mapped.username.slice(0, 40) || 'student';
      const profilePayload = {
        id: user.id,
        username: `${baseUsername}_${user.id.replace(/-/g, '').slice(0, 6)}`,
        display_name: mapped.displayName,
        avatar_url: mapped.avatarUrl,
        bio: mapped.bio,
        faculty: mapped.faculty,
        course: mapped.course,
        year_of_study: mapped.yearOfStudy,
        is_verified_student: false,
        is_private_account: false,
      };
      const { error } = await supabase.from('profiles').insert(profilePayload);
      if (error) throw error;
      return mapped;
    }

    return {
      ...mapped,
      username: existingProfile.username || mapped.username,
      displayName: existingProfile.display_name || mapped.displayName,
      avatarUrl: existingProfile.avatar_url || mapped.avatarUrl,
      bio: existingProfile.bio || mapped.bio,
      faculty: existingProfile.faculty || mapped.faculty,
      course: existingProfile.course || mapped.course,
      yearOfStudy: existingProfile.year_of_study || mapped.yearOfStudy,
      isVerifiedStudent: Boolean(existingProfile.is_verified_student),
      isPrivateAccount: Boolean(existingProfile.is_private_account),
      joinedDate: new Date(existingProfile.created_at || user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    } as StudentProfile;
  };

  const signIn = async (email: string, password?: string) => {
    if (!password) return { success: false, error: 'Enter your password to sign in.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.user) return { success: false, error: error?.message || 'Unable to sign in.' };
    try {
      const profile = await ensureProfile(data.user, false);
      setState((prev) => ({ ...prev, currentUser: profile, currentAccountId: data.user.id, isAuthModalOpen: false }));
      return { success: true };
    } catch (profileError) {
      await supabase.auth.signOut();
      return { success: false, error: profileError instanceof Error ? profileError.message : 'Could not load your profile.' };
    }
  };

  // A typed Gmail address is not Google authentication. Use the configured OAuth flow.
  const signInWithGmail = async (_googleEmail: string, _derivedName?: string) => {
    const redirectTo = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signUp = async (data: {
    email: string;
    password?: string;
    displayName: string;
    universityId: string;
    faculty: string;
    course: string;
    yearOfStudy: number;
    skills: string[];
    interests: string[];
  }) => {
    if (!data.password || data.password.length < 8) {
      return { success: false, error: 'Use a password with at least 8 characters.' };
    }
    const cleanEmail = data.email.trim().toLowerCase();
    const univ = UNIVERSITIES.find((u) => u.id === data.universityId) || UNIVERSITIES[0];
    const username = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9_]/g, '_').slice(0, 40) || 'student';
    const { data: result, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          display_name: data.displayName.trim(),
          username,
          universityId: univ.id,
          faculty: data.faculty,
          course: data.course,
          year_of_study: data.yearOfStudy,
          skills: data.skills,
          interests: data.interests,
        },
      },
    });
    if (error) return { success: false, error: error.message };
    if (!result.user) return { success: false, error: 'Account creation could not be confirmed. Please try again.' };
    const createdUser = result.user;

    if (result.session) {
      try {
        const profile = await ensureProfile(createdUser);
        setState((prev) => ({ ...prev, currentUser: profile, currentAccountId: createdUser.id, isAuthModalOpen: false }));
      } catch (profileError) {
        return { success: false, error: profileError instanceof Error ? profileError.message : 'Account created, but profile setup failed.' };
      }
      return { success: true };
    }
    return { success: true, confirmationRequired: true };
  };

  const resetPassword = async (email: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { success: false, error: 'Enter the email address for your account.' };
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo: `${window.location.origin}/?reset-password=1`,
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const updatePassword = async (password: string) => {
    if (password.length < 8) return { success: false, error: 'Use a password with at least 8 characters.' };
    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { success: false, error: error.message };
    setState((prev) => ({ ...prev, isPasswordRecovery: false, isAuthModalOpen: false }));
    window.history.replaceState({}, document.title, window.location.pathname);
    return { success: true };
  };

  const signOut = () => {
    supabase.auth.signOut().catch(() => {});
    setState((prev) => ({
      ...prev,
      currentUser: null,
      currentAccountId: null,
      isAuthModalOpen: true,
    }));
  };

  const switchAccount = (accountId: string) => {
    const target = state.accounts.find((a) => a.id === accountId);
    if (target) {
      setState((prev) => ({
        ...prev,
        currentUser: target.profile,
        currentAccountId: target.id,
      }));
    }
  };

  const toggleProfilePrivacy = async () => {
    const user = state.currentUser;
    if (!user) return { success: false, error: 'Sign in to change profile privacy.' };
    const nextValue = !user.isPrivateAccount;
    const { error } = await supabase.from('profiles').update({ is_private_account: nextValue }).eq('id', user.id);
    if (error) return { success: false, error: error.message };
    setState((prev) => {
      if (!prev.currentUser || prev.currentUser.id !== user.id) return prev;
      return { ...prev, currentUser: { ...prev.currentUser, isPrivateAccount: nextValue } };
    });
    return { success: true };
  };

  // Profile edits are saved to Supabase and reflected immediately in the web UI.
  const updateProfile = async (updates: { bio?: string; faculty?: string; course?: string; yearOfStudy?: number }) => {
    const user = state.currentUser;
    if (!user) return { success: false, error: 'Sign in to update your profile.' };
    const payload: Record<string, string | number> = {};
    if (updates.bio !== undefined) payload.bio = updates.bio.trim();
    if (updates.faculty !== undefined) payload.faculty = updates.faculty.trim();
    if (updates.course !== undefined) payload.course = updates.course.trim();
    if (updates.yearOfStudy !== undefined) payload.year_of_study = updates.yearOfStudy;

    const { error } = await supabase.from('profiles').update(payload).eq('id', user.id);
    if (error) return { success: false, error: error.message };

    setState((prev) => {
      if (!prev.currentUser || prev.currentUser.id !== user.id) return prev;
      const updatedUser = { ...prev.currentUser, ...updates };
      return {
        ...prev,
        currentUser: updatedUser,
        accounts: prev.accounts.map((account) => account.id === user.id ? { ...account, profile: updatedUser } : account),
      };
    });
    return { success: true };
  };

  const updateAvatar = (newAvatarUrl: string) => {
    const user = state.currentUser;
    if (!user) return;
    void supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user.id).then(({ error }) => {
      if (error) console.error('Could not save profile photo:', error.message);
    });
    setState((prev) => {
      if (!prev.currentUser || prev.currentUser.id !== user.id) return prev;
      const updatedPhotos = [newAvatarUrl, ...(prev.currentUser.photos || [])].filter((url, idx, self) => self.indexOf(url) === idx);
      const updatedUser = { ...prev.currentUser, avatarUrl: newAvatarUrl, photos: updatedPhotos };
      return {
        ...prev,
        currentUser: updatedUser,
        accounts: prev.accounts.map((account) => account.id === user.id ? { ...account, profile: updatedUser } : account),
      };
    });
  };

  const updateCourse = (newCourse: string) => {
    void updateProfile({ course: newCourse });
  };

  // Post Actions: write authenticated actions to Supabase; local state mirrors confirmed writes.
  const addPost = (
    content: string,
    category: PostCategory,
    isAnonymous: boolean,
    tags: string[],
    mediaUrl?: string,
    images?: string[],
    visibility: PostVisibility = 'CAMPUS_COMMUNITY',
    commentsDisabled: boolean = false
  ) => {
    const author = state.currentUser;
    if (!author) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }
    const postImages = images && images.length > 0 ? images : mediaUrl ? [mediaUrl] : [];
    void (async () => {
      const { data, error } = await supabase.from('posts').insert({
        author_id: author.id,
        content: content.trim(),
        category,
        is_anonymous: isAnonymous,
        tags: tags.length > 0 ? tags : ['campus', category.toLowerCase()],
        visibility,
        comments_disabled: commentsDisabled,
        media_urls: postImages,
      }).select('id, created_at').single();
      if (error || !data) {
        console.error('Could not publish post:', error?.message || 'No post returned');
        return;
      }
      const newPost: CampusPost = {
        id: data.id,
        authorId: author.id,
        authorName: isAnonymous ? 'Secret Student' : author.displayName,
        authorAvatar: isAnonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=sparkle_anon' : author.avatarUrl,
        authorUniversity: isAnonymous ? 'Kenyan Campus' : author.university.shortName,
        authorCourse: isAnonymous ? 'Anonymous' : author.course,
        isAuthorVerified: !isAnonymous,
        content: content.trim(),
        mediaUrl: postImages[0],
        images: postImages,
        visibility,
        commentsDisabled,
        category,
        timeAgo: formatTimeAgo(data.created_at),
        createdAtTimestamp: data.created_at ? Date.parse(data.created_at) : Date.now(),
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: false,
        isLikedByMe: false,
        isSaved: false,
        isSavedByMe: false,
        isAnonymous,
        tags: tags.length > 0 ? tags : ['campus', category.toLowerCase()],
        comments: [],
      };
      setState((prev) => ({
        ...prev,
        posts: prev.posts.some((post) => post.id === newPost.id) ? prev.posts : [newPost, ...prev.posts],
      }));
    })();
  };

  const deletePost = (postId: string) => {
    const user = state.currentUser;
    if (!user) return;
    if (!isCloudPostId(postId)) {
      setState((prev) => ({ ...prev, posts: prev.posts.filter((post) => post.id !== postId) }));
      return;
    }
    void (async () => {
      const { error } = await supabase.from('posts').delete().eq('id', postId).eq('author_id', user.id);
      if (error) {
        console.error('Could not delete post:', error.message);
        return;
      }
      setState((prev) => ({ ...prev, posts: prev.posts.filter((post) => post.id !== postId) }));
    })();
  };

  const updatePostCaption = (postId: string, newContent: string) => {
    const user = state.currentUser;
    if (!user || !newContent.trim()) return;
    if (!isCloudPostId(postId)) {
      setState((prev) => ({ ...prev, posts: prev.posts.map((post) => post.id === postId ? { ...post, content: newContent.trim() } : post) }));
      return;
    }
    void (async () => {
      const { error } = await supabase.from('posts').update({ content: newContent.trim() }).eq('id', postId).eq('author_id', user.id);
      if (error) {
        console.error('Could not update post:', error.message);
        return;
      }
      setState((prev) => ({ ...prev, posts: prev.posts.map((post) => post.id === postId ? { ...post, content: newContent.trim() } : post) }));
    })();
  };

  const toggleCommentsDisabled = (postId: string) => {
    const post = state.posts.find((item) => item.id === postId);
    const user = state.currentUser;
    if (!post || !user || post.authorId !== user.id) return;
    const nextValue = !post.commentsDisabled;
    if (!isCloudPostId(postId)) {
      setState((prev) => ({ ...prev, posts: prev.posts.map((item) => item.id === postId ? { ...item, commentsDisabled: nextValue } : item) }));
      return;
    }
    void (async () => {
      const { error } = await supabase.from('posts').update({ comments_disabled: nextValue }).eq('id', postId).eq('author_id', user.id);
      if (error) {
        console.error('Could not update comment setting:', error.message);
        return;
      }
      setState((prev) => ({ ...prev, posts: prev.posts.map((item) => item.id === postId ? { ...item, commentsDisabled: nextValue } : item) }));
    })();
  };

  const toggleSavePost = (postId: string) => {
    const user = state.currentUser;
    const post = state.posts.find((item) => item.id === postId);
    if (!user || !post) return;
    const wasSaved = Boolean(post.isSaved || post.isSavedByMe);
    if (!isCloudPostId(postId)) {
      setState((prev) => ({ ...prev, posts: prev.posts.map((item) => item.id === postId ? { ...item, isSaved: !wasSaved, isSavedByMe: !wasSaved } : item) }));
      return;
    }
    void (async () => {
      const result = wasSaved
        ? await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id)
        : await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
      if (result.error) {
        console.error('Could not update saved post:', result.error.message);
        return;
      }
      setState((prev) => ({ ...prev, posts: prev.posts.map((item) => item.id === postId ? { ...item, isSaved: !wasSaved, isSavedByMe: !wasSaved } : item) }));
    })();
  };

  const toggleLikePost = (postId: string) => {
    const user = state.currentUser;
    const post = state.posts.find((item) => item.id === postId);
    if (!user || !post) return;
    const wasLiked = Boolean(post.isLiked || post.isLikedByMe);
    if (!isCloudPostId(postId)) {
      setState((prev) => ({ ...prev, posts: prev.posts.map((item) => item.id === postId ? {
        ...item, isLiked: !wasLiked, isLikedByMe: !wasLiked,
        likesCount: Math.max(0, item.likesCount + (wasLiked ? -1 : 1)),
      } : item) }));
      return;
    }
    void (async () => {
      const result = wasLiked
        ? await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', user.id)
        : await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id });
      if (result.error) {
        console.error('Could not update post like:', result.error.message);
        return;
      }
      setState((prev) => ({ ...prev, posts: prev.posts.map((item) => item.id === postId ? {
        ...item,
        isLiked: !wasLiked,
        isLikedByMe: !wasLiked,
        likesCount: Math.max(0, item.likesCount + (wasLiked ? -1 : 1)),
      } : item) }));
    })();
  };

  const addComment = (postId: string, content: string, isAnonymous: boolean = false) => {
    const author = state.currentUser;
    if (!author) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }
    const cleanContent = content.trim();
    if (!cleanContent) return;
    if (!isCloudPostId(postId)) {
      const newComment = {
        id: `cmt_${Date.now()}`,
        authorName: isAnonymous ? 'Anonymous Comrade' : author.displayName,
        authorAvatar: isAnonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anon' : author.avatarUrl,
        authorUniversity: isAnonymous ? 'Campus' : author.university.shortName,
        content: cleanContent, timeAgo: 'Just now', isAnonymous,
      };
      setState((prev) => ({ ...prev, posts: prev.posts.map((post) => post.id === postId ? {
        ...post, commentsCount: post.commentsCount + 1, comments: [...post.comments, newComment],
      } : post) }));
      return;
    }
    void (async () => {
      const { data, error } = await supabase.from('comments').insert({
        post_id: postId,
        author_id: author.id,
        content: cleanContent,
        is_anonymous: isAnonymous,
      }).select('id, created_at').single();
      if (error || !data) {
        console.error('Could not publish comment:', error?.message || 'No comment returned');
        return;
      }
      const newComment = {
        id: data.id,
        authorName: isAnonymous ? 'Anonymous Comrade' : author.displayName,
        authorAvatar: isAnonymous ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anon' : author.avatarUrl,
        authorUniversity: isAnonymous ? 'Campus' : author.university.shortName,
        content: cleanContent,
        timeAgo: 'Just now',
        isAnonymous,
      };
      setState((prev) => ({
        ...prev,
        posts: prev.posts.map((post) => post.id === postId ? {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment],
        } : post),
      }));
    })();
  };

  // Gig Actions
  const createGig = (
    title: string,
    description: string,
    budgetKes: number,
    category: string,
    deadline: string,
    skills: string[]
  ) => {
    if (!state.currentUser) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }

    const newGig: Gig = {
      id: `gig_${Date.now()}`,
      title,
      description,
      clientName: state.currentUser.displayName,
      clientAvatar: state.currentUser.avatarUrl,
      clientUniversity: state.currentUser.university.shortName,
      publisherName: state.currentUser.displayName,
      publisherAvatar: state.currentUser.avatarUrl,
      publisherUniversity: state.currentUser.university.shortName,
      budgetKes,
      compensation: `KES ${budgetKes.toLocaleString()}`,
      category,
      deadline,
      status: 'OPEN',
      skillsRequired: skills,
      postedDate: 'Today',
      applicantCount: 0,
      applicationsCount: 0,
      isApplied: false,
      hasApplied: false,
      isPaid: true,
      locationType: 'Hybrid',
      isBookmarked: false,
    };

    setState((prev) => ({
      ...prev,
      gigs: [newGig, ...prev.gigs],
    }));
  };

  const applyForGig = (gigId: string, coverNote: string, phone: string, portfolioUrl?: string) => {
    if (!state.currentUser) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }

    setState((prev) => ({
      ...prev,
      gigs: prev.gigs.map((gig) => {
        if (gig.id === gigId) {
          return {
            ...gig,
            isApplied: true,
            hasApplied: true,
            applicantCount: (gig.applicantCount || 0) + 1,
            applicationsCount: (gig.applicationsCount || 0) + 1,
          };
        }
        return gig;
      }),
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: 'Gig Application Sent! 💼',
          body: `You successfully applied for "${state.gigs.find((g) => g.id === gigId)?.title}". The client has been notified.`,
          timeAgo: 'Just now',
          timestamp: 'Just now',
          type: 'gig',
          targetId: gigId,
          isRead: false,
        },
        ...prev.notifications,
      ],
    }));
  };

  // Community Actions
  const toggleJoinCommunity = (communityId: string) => {
    setState((prev) => ({
      ...prev,
      communities: prev.communities.map((c) => {
        if (c.id === communityId) {
          const isJoined = !c.isJoined;
          return {
            ...c,
            isJoined,
            membersCount: isJoined ? c.membersCount + 1 : Math.max(0, c.membersCount - 1),
          };
        }
        return c;
      }),
    }));
  };

  // Event Actions
  const toggleRsvpEvent = (eventId: string) => {
    setState((prev) => ({
      ...prev,
      events: prev.events.map((e) => {
        if (e.id === eventId) {
          const isRsvpd = !(e.isRsvpd || e.isRegistered);
          const currentCount = e.attendeesCount ?? e.attendeeCount ?? 0;
          return {
            ...e,
            isRsvpd,
            isRegistered: isRsvpd,
            attendeesCount: isRsvpd ? currentCount + 1 : Math.max(0, currentCount - 1),
            attendeeCount: isRsvpd ? currentCount + 1 : Math.max(0, currentCount - 1),
          };
        }
        return e;
      }),
    }));
  };

  // Messaging Actions
  const sendMessage = (conversationId: string, content: string) => {
    if (!state.currentUser || !content.trim()) return;

    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: state.currentUser.id,
      senderName: state.currentUser.displayName,
      text: content.trim(),
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromMe: true,
    };

    setState((prev) => ({
      ...prev,
      conversations: prev.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: content.trim(),
            lastMessageTime: 'Just now',
            messages: [...conv.messages, newMessage],
          };
        }
        return conv;
      }),
    }));
  };

  // Notification Actions
  const markNotificationAsRead = (notificationId: string) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)),
    }));
  };

  const markAllNotificationsAsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
    }));
  };

  const unreadNotificationsCount = useMemo(
    () => state.notifications.filter((n) => !n.isRead).length,
    [state.notifications]
  );

  const unreadMessagesCount = useMemo(
    () => state.conversations.reduce((acc, c) => acc + c.unreadCount, 0),
    [state.conversations]
  );

  return (
    <SparkleContext.Provider
      value={{
        ...state,
        universities: UNIVERSITIES,
        setSelectedUniversityId,
        setActiveTab,
        setIsAuthModalOpen,
        setIsProfileModalOpen,
        setIsNotificationsOpen,
        signIn,
        signInWithGmail,
        resetPassword,
        updatePassword,
        addMoment,
        markMomentViewed,
        deleteMoment,
        signUp,
        signOut,
        switchAccount,
        updateAvatar,
        updateCourse,
        updateProfile,
        toggleProfilePrivacy,
        addPost,
        deletePost,
        updatePostCaption,
        toggleCommentsDisabled,
        toggleSavePost,
        toggleLikePost,
        addComment,
        createGig,
        applyForGig,
        toggleJoinCommunity,
        toggleRsvpEvent,
        sendMessage,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        unreadMessagesCount,
      }}
    >
      {children}
    </SparkleContext.Provider>
  );
};

export const useSparkle = () => {
  const context = useContext(SparkleContext);
  if (!context) {
    throw new Error('useSparkle must be used within a SparkleProvider');
  }
  return context;
};
