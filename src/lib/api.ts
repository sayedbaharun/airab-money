export const API_BASE_URL = '/api'

interface ApiEnvelope<T> {
  data: T
}

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
  published_at?: string | null
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
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscription_status: string
  subscription_date: string
  preferences: Record<string, unknown>
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
  responded_at?: string | null
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
  notes?: string | null
  interview_date?: string | null
  created_at: string
  updated_at: string
}

export interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  type: 'stock' | 'crypto' | 'commodity' | 'gcc' | 'index' | 'middleeast'
}

export interface ContactSubmission {
  name: string
  email: string
  subject: string
  message: string
  messageType: string
}

export interface NewsletterSubscriptionInput {
  email: string
  name?: string | null
  preferences?: Record<string, unknown>
}

export interface GuestApplicationInput {
  name: string
  email: string
  company?: string | null
  position?: string | null
  bio: string
  expertiseAreas: string[]
  linkedinUrl?: string | null
  websiteUrl?: string | null
  proposedTopics: string[]
}

export interface ArticleGenerationInput {
  topic: string
  word_count: number
  style: string
}

export interface GeneratedArticle {
  headline: string
  content: string
  fallback?: boolean
}

export interface ImagePromptResult {
  hero_prompt: string
  inline_prompt: string
  fallback?: boolean
}

export interface GeneratedImageResult {
  imageUrl: string
  fallback?: boolean
}

export interface ApiMessageResult {
  message: string
  status: string
  subscriber_id?: string
  message_id?: string
  application_id?: string
}

export const apiFetch = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errData = await response.json().catch(() => null)
    throw new Error(errData?.error || `API request failed: ${response.status} ${response.statusText}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

const buildQueryString = (params: Record<string, string | number | boolean | undefined>) => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value))
    }
  })

  const query = searchParams.toString()
  return query ? `?${query}` : ''
}

export const getArticles = async (params: {
  status?: string
  limit?: number
  sort?: 'created_at' | 'published_at'
  order?: 'asc' | 'desc'
} = {}) => {
  const query = buildQueryString(params)
  const response = await apiFetch<ApiEnvelope<Article[]>>(`/articles${query}`)
  return response.data
}

export const getArticle = async (id: string) => {
  const response = await apiFetch<ApiEnvelope<Article>>(`/articles/${id}`)
  return response.data
}

export const createArticle = async (payload: Partial<Article>) => {
  const response = await apiFetch<ApiEnvelope<Article>>('/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export const updateArticle = async (id: string, payload: Partial<Article>) => {
  const response = await apiFetch<ApiEnvelope<Article>>(`/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
  return response.data
}

export const deleteArticle = async (id: string) => {
  await apiFetch<void>(`/articles/${id}`, {
    method: 'DELETE',
  })
}

export const getEpisodes = async (params: {
  status?: string
  featured?: boolean
  show_type?: string
  category?: string
  limit?: number
} = {}) => {
  const query = buildQueryString(params)
  const response = await apiFetch<ApiEnvelope<PodcastEpisode[]>>(`/episodes${query}`)
  return response.data
}

export const getBlogPosts = async (params: {
  status?: string
  featured?: boolean
  category?: string
  limit?: number
} = {}) => {
  const query = buildQueryString(params)
  const response = await apiFetch<ApiEnvelope<BlogPost[]>>(`/blogs${query}`)
  return response.data
}

export const submitContactForm = async (payload: ContactSubmission) => {
  const response = await apiFetch<ApiEnvelope<ApiMessageResult>>('/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export const submitGuestApplication = async (payload: GuestApplicationInput) => {
  const response = await apiFetch<ApiEnvelope<ApiMessageResult>>('/applications', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export const subscribeToNewsletter = async (payload: NewsletterSubscriptionInput) => {
  const response = await apiFetch<ApiEnvelope<ApiMessageResult>>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export const getMarketData = async () => {
  return apiFetch<{ success: boolean; data: MarketData[]; updatedAt: string }>('/market-data')
}

export const generateArticle = async (payload: ArticleGenerationInput) => {
  return apiFetch<GeneratedArticle>('/generate-article', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export const generateImagePrompts = async (payload: { content: string; headline: string }) => {
  const response = await apiFetch<ApiEnvelope<ImagePromptResult>>('/generate-image-prompts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}

export const generateArticleImage = async (payload: { prompt: string; imageType: 'hero' | 'inline' }) => {
  const response = await apiFetch<ApiEnvelope<GeneratedImageResult>>('/generate-article-image', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response.data
}
