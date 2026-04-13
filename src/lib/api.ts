export const API_BASE_URL = 'http://localhost:3001/api';

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.error || `API request failed: ${response.statusText}`);
  }
  
  return response.json();
};

// Types (Moved from Supabase)
export interface Article {
  id: string
  headline: string
  content: string
  summary: string
  image_url?: string
  image_prompt?: string
  hero_image_url?: string
  inline_image_url?: string
  hero_image_prompt?: string
  inline_image_prompt?: string
  source_url?: string
  source_name?: string
  article_url?: string
  category: string
  tags: string[]
  status: string
  published_at?: string
  created_at: string
}

export interface PodcastEpisode {
  id: string
  title: string
  description: string
  episode_number: number
  season_number: number
  show_type: string
  duration_minutes: number
  audio_url: string
  transcript_url?: string
  featured_image_url?: string
  thumbnail_url?: string
  publish_date: string
  status: string
  guest_name?: string
  guest_bio?: string
  topics: string[]
  categories: string[]
  featured: boolean
  play_count: number
  download_count: number
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image_url?: string
  author_name: string
  category: string
  tags: string[]
  status: string
  featured: boolean
  view_count: number
  estimated_read_time: number
  meta_description?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscription_status: string
  subscription_date: string
  preferences: Record<string, any>
  unsubscribe_token: string
  last_email_sent?: string
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  subject: string
  message: string
  message_type: string
  status: string
  responded_at?: string
  created_at: string
}

export interface GuestApplication {
  id: string
  name: string
  email: string
  company?: string
  position?: string
  bio: string
  expertise_areas: string[]
  linkedin_url?: string
  website_url?: string
  proposed_topics: string[]
  status: string
  notes?: string
  interview_date?: string
  created_at: string
  updated_at: string
}
