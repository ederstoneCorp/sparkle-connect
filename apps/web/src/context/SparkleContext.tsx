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
  activeTab: 'feed' | 'gigs' | 'communities' | 'events' | 'messages';
  isAuthModalOpen: boolean;
  isProfileModalOpen: boolean;
  isNotificationsOpen: boolean;
}

interface SparkleContextType extends SparkleState {
  universities: University[];
  setSelectedUniversityId: (id: string) => void;
  setActiveTab: (tab: 'feed' | 'gigs' | 'communities' | 'events' | 'messages') => void;
  setIsAuthModalOpen: (open: boolean) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  setIsNotificationsOpen: (open: boolean) => void;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGmail: (googleEmail: string, derivedName?: string) => Promise<{ success: boolean; account?: RegisteredAccount; error?: string }>;
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
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  switchAccount: (accountId: string) => void;
  addPost: (content: string, category: PostCategory, isAnonymous: boolean, tags: string[], mediaUrl?: string) => void;
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
          accounts: parsed.accounts || INITIAL_ACCOUNTS,
          currentUser: parsed.currentUser || null,
          currentAccountId: parsed.currentAccountId || null,
          posts: parsed.posts || INITIAL_POSTS,
          gigs: parsed.gigs || INITIAL_GIGS,
          communities: parsed.communities || INITIAL_COMMUNITIES,
          events: parsed.events || INITIAL_EVENTS,
          conversations: parsed.conversations || INITIAL_CONVERSATIONS,
          notifications: parsed.notifications || INITIAL_NOTIFICATIONS,
          selectedUniversityId: 'ALL',
          activeTab: 'feed',
          isAuthModalOpen: !parsed.currentUser,
          isProfileModalOpen: false,
          isNotificationsOpen: false,
        };
      }
    } catch (e) {
      console.warn('Failed to parse cached Sparkle data, falling back to initial data:', e);
    }

    return {
      accounts: INITIAL_ACCOUNTS,
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
      isProfileModalOpen: false,
      isNotificationsOpen: false,
    };
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      const dataToSave = {
        accounts: state.accounts,
        currentUser: state.currentUser,
        currentAccountId: state.currentAccountId,
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

  const setActiveTab = (tab: 'feed' | 'gigs' | 'communities' | 'events' | 'messages') => {
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

  // Sign In using email/password
  const signIn = async (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = state.accounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail || acc.googleEmail?.toLowerCase() === cleanEmail
    );

    if (!existing) {
      return { success: false, error: 'No account found with this email. Please create an account or use Gmail login.' };
    }

    if (password && existing.password && existing.password !== password) {
      return { success: false, error: 'Incorrect password. Try logging in with Gmail or reset password.' };
    }

    setState((prev) => ({
      ...prev,
      currentUser: existing.profile,
      currentAccountId: existing.id,
      isAuthModalOpen: false,
    }));

    return { success: true };
  };

  // Sign In with Gmail (Exact parity with mobile logic: auto-derives name, generates password, saves to DB without requiring user to create password)
  const signInWithGmail = async (googleEmail: string, derivedName?: string) => {
    const cleanEmail = googleEmail.trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com') && !cleanEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid Gmail address (e.g., student@gmail.com).' };
    }

    // Look for existing account
    const existing = state.accounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail || acc.googleEmail?.toLowerCase() === cleanEmail
    );

    if (existing) {
      setState((prev) => ({
        ...prev,
        currentUser: existing.profile,
        currentAccountId: existing.id,
        isAuthModalOpen: false,
      }));
      return { success: true, account: existing };
    }

    // Derive name from email if not provided (e.g. holdstonez -> Holdstone Z)
    const emailPrefix = cleanEmail.split('@')[0];
    const computedName =
      derivedName && derivedName.trim().length > 0
        ? derivedName.trim()
        : emailPrefix
            .replace(/[._-]/g, ' ')
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');

    const newId = `user_${Date.now()}`;
    const defaultUniversity = UNIVERSITIES[0]; // University of Nairobi default

    const newProfile: StudentProfile = {
      id: newId,
      username: emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      displayName: computedName,
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(computedName)}`,
      bio: `Student at ${defaultUniversity.shortName} • Joined via Google 🇰🇪`,
      university: defaultUniversity,
      faculty: 'Faculty of Science & Technology',
      course: 'BSc Computer Science',
      yearOfStudy: 2,
      isVerifiedStudent: true,
      skills: ['Campus Collaboration', 'Research', 'Tech'],
      interests: ['Tech & Coding', 'Campus Entrepreneurship'],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    const newAccount: RegisteredAccount = {
      id: newId,
      email: cleanEmail,
      password: `sparkle_pwd_${Math.random().toString(36).substring(2, 10)}`, // Auto-generated secure password
      profile: newProfile,
      authProvider: 'GOOGLE',
      googleEmail: cleanEmail,
      socialHandle: `@${newProfile.username}`,
      isRecordedInDatabase: true, // Marked as saved in database
    };

    setState((prev) => ({
      ...prev,
      accounts: [newAccount, ...prev.accounts],
      currentUser: newProfile,
      currentAccountId: newId,
      isAuthModalOpen: false,
    }));

    return { success: true, account: newAccount };
  };

  // Sign Up standard
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
    const cleanEmail = data.email.trim().toLowerCase();
    const existing = state.accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
    }

    const univ = UNIVERSITIES.find((u) => u.id === data.universityId) || UNIVERSITIES[0];
    const newId = `user_${Date.now()}`;
    const username = cleanEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '_');

    const newProfile: StudentProfile = {
      id: newId,
      username,
      displayName: data.displayName.trim(),
      email: cleanEmail,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.displayName)}`,
      bio: `Student at ${univ.shortName} • ${data.course}`,
      university: univ,
      faculty: data.faculty,
      course: data.course,
      yearOfStudy: data.yearOfStudy,
      isVerifiedStudent: true,
      skills: data.skills.length > 0 ? data.skills : ['Student', 'Campus Networking'],
      interests: data.interests.length > 0 ? data.interests : ['Campus Life'],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    const newAccount: RegisteredAccount = {
      id: newId,
      email: cleanEmail,
      password: data.password || `pwd_${Math.random().toString(36).substring(2, 8)}`,
      profile: newProfile,
      authProvider: 'EMAIL',
      socialHandle: `@${username}`,
      isRecordedInDatabase: true,
    };

    setState((prev) => ({
      ...prev,
      accounts: [newAccount, ...prev.accounts],
      currentUser: newProfile,
      currentAccountId: newId,
      isAuthModalOpen: false,
    }));

    return { success: true };
  };

  const signOut = () => {
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

  // Post Actions
  const addPost = (
    content: string,
    category: PostCategory,
    isAnonymous: boolean,
    tags: string[],
    mediaUrl?: string
  ) => {
    if (!state.currentUser) {
      setState((prev) => ({ ...prev, isAuthModalOpen: true }));
      return;
    }

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
      mediaUrl,
      category,
      timeAgo: 'Just now',
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isLikedByMe: false,
      isSaved: false,
      isAnonymous,
      tags: tags.length > 0 ? tags : ['campus', category.toLowerCase()],
      comments: [],
    };

    setState((prev) => ({
      ...prev,
      posts: [newPost, ...prev.posts],
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
        signUp,
        signOut,
        switchAccount,
        addPost,
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
