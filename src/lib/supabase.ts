import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://legcfikbspvftdqpdvxg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2NmaWtic3B2ZnRkcXBkdnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzA5NDcsImV4cCI6MjA5MDIwNjk0N30.7kWYYWi0H2k1ARA0tK6x7o-KtAKdYhLb3AjV7y3MYDI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
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
  published_at: string
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
  published_at: string
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