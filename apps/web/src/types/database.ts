export interface University {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  location: string;
  website?: string;
  logo_url?: string;
}

export interface Profile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  university_id?: string;
  faculty?: string;
  course?: string;
  year_of_study?: number;
  role: 'student' | 'alumni' | 'moderator' | 'admin';
  is_verified_student: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  author_id?: string;
  author_name?: string;
  author_avatar?: string;
  university_name?: string;
  content: string;
  category: string;
  is_anonymous: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface Gig {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_university: string;
  title: string;
  description: string;
  category: string;
  skills_required: string[];
  opportunity_type: 'freelance' | 'internship' | 'tutoring' | 'part_time' | 'collaboration' | 'volunteer';
  is_paid: boolean;
  compensation?: string;
  location_type: 'remote' | 'on_campus' | 'hybrid';
  deadline?: string;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  created_at: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  category: string;
  university_name?: string;
  is_private: boolean;
  members_count: number;
}

export interface Event {
  id: string;
  organizer_name: string;
  university_name: string;
  title: string;
  description: string;
  cover_url?: string;
  venue: string;
  is_online: boolean;
  start_time: string;
  end_time: string;
  category: string;
  registered_count: number;
  capacity?: number;
}
