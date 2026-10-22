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
} from '../types/models';
import {
  UNIVERSITIES,
  INITIAL_ACCOUNTS,
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
  ]);

  const setSelectedUniversityId = (id: string) => {
    setState((prev) => ({ ...prev, selectedUniversityId: id }));
  };

  // Restore the authenticated Supabase session and hydrate the matching cloud profile.
  useEffect(() => {
    let active = true;
    const hydrate = async (user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string } | null) => {
      if (!user) {
        if (active) setState((prev) => ({ ...prev, currentUser: null, currentAccountId: null, isAuthModalOpen: true }));
        return;
      }
      try {
        const profile = await ensureProfile(user);
        if (active) setState((prev) => ({ ...prev, currentUser: profile, currentAccountId: user.id, isAuthModalOpen: prev.isPasswordRecovery }));
      } catch (error) {
        console.error('Could not restore Sparkle profile:', error);
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
              timeAgo: 'Just now',
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
      skills: Array.isArray(metadata.skills) ? metadata.skills as string[] : ['Campus Networking'],
      interests: Array.isArray(metadata.interests) ? metadata.interests as string[] : ['Campus Life'],
      joinedDate: new Date(user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  };

  const ensureProfile = async (user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string }) => {
    const mapped = profileFromUser(user);
    const { data: existingProfile, error: readError } = await supabase
      .from('profiles')
      .select('id, username, display_name, avatar_url, bio, faculty, course, year_of_study, is_verified_student, created_at')
      .eq('id', user.id)
      .maybeSingle();
    if (readError) throw readError;

    if (!existingProfile) {
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
      joinedDate: new Date(existingProfile.created_at || user.created_at || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    } as StudentProfile;
  };

  const signIn = async (email: string, password?: string) => {
    if (!password) return { success: false, error: 'Enter your password to sign in.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
    if (error || !data.user) return { success: false, error: error?.message || 'Unable to sign in.' };
    try {
      const profile = await ensureProfile(data.user);
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

  // Avatar update
  const updateAvatar = (newAvatarUrl: string) => {
    setState((prev) => {
      if (!prev.currentUser) return prev;
      const updatedPhotos = [newAvatarUrl, ...(prev.currentUser.photos || [])].filter(
        (url, idx, self) => self.indexOf(url) === idx
      );
      const updatedUser: StudentProfile = {
        ...prev.currentUser,
        avatarUrl: newAvatarUrl,
        photos: updatedPhotos,
      };
      const updatedAccounts = prev.accounts.map((acc) =>
        acc.id === prev.currentAccountId
          ? { ...acc, profile: updatedUser }
          : acc
      );
      return {
        ...prev,
        currentUser: updatedUser,
        accounts: updatedAccounts,
      };
    });
  };

  const updateCourse = (newCourse: string) => {
    setState((prev) => {
      if (!prev.currentUser) return prev;
      const updatedUser: StudentProfile = {
        ...prev.currentUser,
        course: newCourse,
      };
      const updatedAccounts = prev.accounts.map((acc) =>
        acc.id === prev.currentAccountId
          ? { ...acc, profile: updatedUser }
          : acc
      );
      return {
        ...prev,
        currentUser: updatedUser,
        accounts: updatedAccounts,
      };
    });
  };

  // Post Actions
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
    if (!state.currentUser) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }

    const postImages = images && images.length > 0 ? images : mediaUrl ? [mediaUrl] : [];

    const newPost: CampusPost = {
      id: `post_${Date.now()}`,
      authorId: isAnonymous ? 'anon' : state.currentUser.id,
      authorName: isAnonymous ? 'Secret Student' : state.currentUser.displayName,
      authorAvatar: isAnonymous
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=sparkle_anon'
        : state.currentUser.avatarUrl,
      authorUniversity: isAnonymous ? 'Kenyan Campus' : state.currentUser.university.shortName,
      authorCourse: isAnonymous ? 'Anonymous' : state.currentUser.course,
      isAuthorVerified: !isAnonymous,
      content,
      mediaUrl: postImages.length > 0 ? postImages[0] : undefined,
      images: postImages,
      visibility,
      commentsDisabled,
      category,
      timeAgo: 'Just now',
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
      posts: [newPost, ...prev.posts],
    }));
  };

  const deletePost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.filter((p) => p.id !== postId),
    }));
  };

  const updatePostCaption = (postId: string, newContent: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === postId ? { ...p, content: newContent } : p)),
    }));
  };

  const toggleCommentsDisabled = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => (p.id === postId ? { ...p, commentsDisabled: !p.commentsDisabled } : p)),
    }));
  };

  const toggleSavePost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((p) => {
        if (p.id === postId) {
          const isSaved = !(p.isSaved || p.isSavedByMe);
          return {
            ...p,
            isSaved,
            isSavedByMe: isSaved,
          };
        }
        return p;
      }),
    }));
  };

  const toggleLikePost = (postId: string) => {
    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          const isLiked = !(post.isLiked || post.isLikedByMe);
          return {
            ...post,
            isLiked,
            isLikedByMe: isLiked,
            likesCount: isLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      }),
    }));
  };

  const addComment = (postId: string, content: string, isAnonymous: boolean = false) => {
    if (!state.currentUser) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }

    const newComment = {
      id: `cmt_${Date.now()}`,
      authorName: isAnonymous ? 'Anonymous Comrade' : state.currentUser.displayName,
      authorAvatar: isAnonymous
        ? 'https://api.dicebear.com/7.x/bottts/svg?seed=anon'
        : state.currentUser.avatarUrl,
      authorUniversity: isAnonymous ? 'Campus' : state.currentUser.university.shortName,
      content,
      timeAgo: 'Just now',
      isAnonymous,
    };

    setState((prev) => ({
      ...prev,
      posts: prev.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      }),
    }));
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
        signUp,
        signOut,
        switchAccount,
        updateAvatar,
        updateCourse,
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
