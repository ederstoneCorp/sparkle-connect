export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  website?: string;
  logoUrl?: string;
  lat?: number;
  lng?: number;
  type?: 'public' | 'private' | 'technical' | 'national';
  founded?: number;
  students?: number;
}

export interface StudentProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string;
  bio: string;
  university: University;
  faculty: string;
  course: string;
  yearOfStudy: number;
  isVerifiedStudent: boolean;
  skills: string[];
  interests: string[];
  joinedDate: string;
  photos?: string[];
  isPrivateAccount?: boolean;
}

export interface RegisteredAccount {
  id: string;
  email: string;
  password?: string;
  profile: StudentProfile;
  authProvider: 'EMAIL' | 'GOOGLE' | 'LINKEDIN' | 'GITHUB' | 'TWITTER';
  googleEmail?: string | null;
  socialHandle?: string | null;
  isRecordedInDatabase: boolean;
}

export type MomentAudience = 'PUBLIC' | 'CAMPUS_ONLY' | 'CONNECTIONS_ONLY';

export interface SparkleMoment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorUniversity: string;
  textCaption: string;
  backgroundColorHex: string;
  createdAtTimestamp: number;
  audience: MomentAudience;
  viewedByUsers: string[];
  isViewedByMe: boolean;
}

export type PostVisibility = 'PUBLIC' | 'CONNECTIONS' | 'CAMPUS_COMMUNITY' | 'PRIVATE';

export type PostCategory =
  | 'ALL'
  | 'CAMPUS_LIFE'
  | 'TECH'
  | 'ACADEMICS'
  | 'CAREER'
  | 'OPPORTUNITIES'
  | 'ANONYMOUS'
  | 'ENTREPRENEURSHIP';

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorUniversity: string;
  content: string;
  timeAgo: string;
  isAnonymous?: boolean;
}

export interface CampusPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorUniversity: string;
  authorCourse: string;
  isAuthorVerified: boolean;
  content: string;
  category: PostCategory;
  isAnonymous?: boolean;
  likesCount: number;
  commentsCount: number;
  isLikedByMe: boolean;
  isLiked?: boolean;
  isSavedByMe?: boolean;
  isSaved?: boolean;
  timeAgo: string;
  comments: PostComment[];
  mediaUrl?: string | null;
  images?: string[];
  storagePaths?: string[];
  visibility?: PostVisibility;
  commentsDisabled?: boolean;
  tags?: string[];
  sharesCount?: number;
}

export type GigOpportunityType =
  | 'FREELANCE'
  | 'INTERNSHIP'
  | 'TUTORING'
  | 'CAMPUS_SERVICE'
  | 'COLLABORATION'
  | 'PART_TIME';

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  skillsRequired: string[];
  opportunityType?: GigOpportunityType;
  isPaid?: boolean;
  compensation?: string;
  budgetKes?: number;
  locationType?: string;
  publisherName?: string;
  publisherUniversity?: string;
  publisherAvatar?: string;
  clientName?: string;
  clientAvatar?: string;
  clientUniversity?: string;
  deadline: string;
  isBookmarked?: boolean;
  hasApplied?: boolean;
  isApplied?: boolean;
  applicationsCount?: number;
  applicantCount?: number;
  status?: string;
  postedDate?: string;
}

export interface GigApplication {
  id: string;
  gigId: string;
  applicantName: string;
  applicantUniversity: string;
  coverNote: string;
  portfolioLink?: string;
  phone: string;
  status?: string;
  submittedAt?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  category: string;
  universityAffiliation?: string;
  university?: string;
  membersCount: number;
  isPrivate?: boolean;
  isJoined: boolean;
  leaderName?: string;
  tags?: string[];
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  organizer?: string;
  university: string;
  venue?: string;
  location?: string;
  isOnline?: boolean;
  dateString?: string;
  timeString?: string;
  date?: string;
  time?: string;
  category?: string;
  attendeeCount?: number;
  attendeesCount?: number;
  capacity?: number;
  isRegistered?: boolean;
  isRsvpd?: boolean;
  coverGradientIndex?: number;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  content?: string;
  timestamp: string;
  isFromMe: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantAvatar: string;
  participantUniversity: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline?: boolean;
  messages: ChatMessage[];
}

export interface SparkleNotification {
  id: string;
  title: string;
  body: string;
  timeAgo?: string;
  timestamp?: string;
  type: string;
  targetId?: string;
  isRead: boolean;
}
