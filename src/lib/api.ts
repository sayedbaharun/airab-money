export const API_BASE_URL = '/api'
const ADMIN_PASSWORD_STORAGE_KEY = 'airab_admin_password'
const ADMIN_PASSWORD_HEADER = 'x-admin-password'

type ApiRequestOptions = RequestInit & {
  adminPassword?: string | null
  requireAdminAuth?: boolean
  rawBody?: boolean
}

interface ApiEnvelope<T> {
  data: T
}

export interface Pagination {
  page: number
  pageSize: number
  total: number
}

export interface PaginatedEnvelope<T> {
  data: T
  pagination: Pagination
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
  transcript_url?: string | null
  featured_image_url?: string | null
  thumbnail_url?: string | null
  publish_date: string
  status: string
  guest_name?: string | null
  guest_bio?: string | null
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
  featured_image_url?: string | null
  author_name: string
  category: string
  tags: string[]
  status: string
  featured: boolean
  view_count: number
  estimated_read_time: number
  meta_description?: string | null
  published_at?: string | null
  created_at: string
  updated_at: string
}

export interface Presenter {
  id: string
  name: string
  slug: string
  role: string
  bio: string
  photo_url?: string | null
  show_types: string[]
  linkedin_url?: string | null
  twitter_url?: string | null
  website_url?: string | null
  featured: boolean
  display_order: number
  created_at: string
  updated_at: string
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string | null
  subscription_status: string
  subscription_date: string
  preferences: Record<string, unknown>
  confirmed_at?: string | null
  unsubscribe_token: string
  last_email_sent?: string | null
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
  company?: string | null
  position?: string | null
  bio: string
  expertise_areas: string[]
  linkedin_url?: string | null
  website_url?: string | null
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

export interface MarketDataResponse {
  success: boolean
  data: MarketData[]
  updatedAt: string
  source?: 'finnhub' | 'fallback'
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

export interface AdminAuthResult {
  authenticated: boolean
}

export interface UploadResult {
  url: string
  size: number
  mime: string
  original_name: string
}

export const getAdminPassword = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY)
}

export const setAdminPassword = (password: string | null) => {
  if (typeof window === 'undefined') return

  if (password) {
    window.sessionStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password)
    return
  }

  window.sessionStorage.removeItem(ADMIN_PASSWORD_STORAGE_KEY)
}

const buildHeaders = (headers: HeadersInit | undefined, adminPassword: string | null, rawBody: boolean) => {
  const mergedHeaders = new Headers(headers)

  if (!rawBody && !mergedHeaders.has('Content-Type')) {
    mergedHeaders.set('Content-Type', 'application/json')
  }

  if (adminPassword) {
    mergedHeaders.set(ADMIN_PASSWORD_HEADER, adminPassword)
  }

  return mergedHeaders
}

export const apiFetch = async <T>(endpoint: string, options: ApiRequestOptions = {}): Promise<T> => {
  const { adminPassword, headers, requireAdminAuth, rawBody, ...requestOptions } = options
  const resolvedAdminPassword =
    adminPassword !== undefined ? adminPassword : requireAdminAuth ? getAdminPassword() : null

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...requestOptions,
    headers: buildHeaders(headers, resolvedAdminPassword, Boolean(rawBody)),
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

// ───────── Articles ─────────
export const getArticles = async (params: {
  status?: string
  limit?: number
  page?: number
  pageSize?: number
  sort?: 'created_at' | 'published_at'
  order?: 'asc' | 'desc'
} = {}) => {
  const query = buildQueryString(params)
  const response = await apiFetch<PaginatedEnvelope<Article[]>>(`/articles${query}`)
  return response
}

export const getArticle = async (id: string) => {
  const response = await apiFetch<ApiEnvelope<Article>>(`/articles/${id}`)
  return response.data
}

export const createArticle = async (payload: Partial<Article>) => {
  const response = await apiFetch<ApiEnvelope<Article>>('/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const updateArticle = async (id: string, payload: Partial<Article>) => {
  const response = await apiFetch<ApiEnvelope<Article>>(`/articles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const deleteArticle = async (id: string) => {
  await apiFetch<void>(`/articles/${id}`, {
    method: 'DELETE',
    requireAdminAuth: true,
  })
}

// ───────── Episodes ─────────
export const getEpisodes = async (params: {
  status?: string
  featured?: boolean
  show_type?: string
  category?: string
  limit?: number
  page?: number
  pageSize?: number
} = {}) => {
  const query = buildQueryString(params)
  const response = await apiFetch<PaginatedEnvelope<PodcastEpisode[]>>(`/episodes${query}`)
  return response
}

export const getEpisode = async (id: string) => {
  const response = await apiFetch<ApiEnvelope<PodcastEpisode>>(`/episodes/${id}`)
  return response.data
}

export const createEpisode = async (payload: Partial<PodcastEpisode>) => {
  const response = await apiFetch<ApiEnvelope<PodcastEpisode>>('/episodes', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const updateEpisode = async (id: string, payload: Partial<PodcastEpisode>) => {
  const response = await apiFetch<ApiEnvelope<PodcastEpisode>>(`/episodes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const deleteEpisode = async (id: string) => {
  await apiFetch<void>(`/episodes/${id}`, { method: 'DELETE', requireAdminAuth: true })
}

// ───────── Blogs ─────────
export const getBlogPosts = async (params: {
  status?: string
  featured?: boolean
  category?: string
  limit?: number
  page?: number
  pageSize?: number
} = {}) => {
  const query = buildQueryString(params)
  const response = await apiFetch<PaginatedEnvelope<BlogPost[]>>(`/blogs${query}`)
  return response
}

export const getBlogPost = async (slug: string) => {
  const response = await apiFetch<ApiEnvelope<BlogPost>>(`/blogs/${slug}`)
  return response.data
}

export const createBlogPost = async (payload: Partial<BlogPost>) => {
  const response = await apiFetch<ApiEnvelope<BlogPost>>('/blogs', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const updateBlogPost = async (id: string, payload: Partial<BlogPost>) => {
  const response = await apiFetch<ApiEnvelope<BlogPost>>(`/blogs/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const deleteBlogPost = async (id: string) => {
  await apiFetch<void>(`/blogs/${id}`, { method: 'DELETE', requireAdminAuth: true })
}

// ───────── Presenters ─────────
export const getPresenters = async () => {
  const response = await apiFetch<ApiEnvelope<Presenter[]>>(`/presenters`)
  return response.data
}

export const createPresenter = async (payload: Partial<Presenter>) => {
  const response = await apiFetch<ApiEnvelope<Presenter>>('/presenters', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const updatePresenter = async (id: string, payload: Partial<Presenter>) => {
  const response = await apiFetch<ApiEnvelope<Presenter>>(`/presenters/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const deletePresenter = async (id: string) => {
  await apiFetch<void>(`/presenters/${id}`, { method: 'DELETE', requireAdminAuth: true })
}

// ───────── Forms ─────────
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

export const confirmNewsletterSubscription = async (token: string) => {
  const response = await apiFetch<ApiEnvelope<{ message: string; email: string; status: string }>>(
    `/newsletter/confirm?token=${encodeURIComponent(token)}`,
  )
  return response.data
}

export const unsubscribeFromNewsletter = async (token: string) => {
  const response = await apiFetch<ApiEnvelope<{ message: string; email: string; status: string }>>(
    `/newsletter/unsubscribe?token=${encodeURIComponent(token)}`,
  )
  return response.data
}

// ───────── Market data ─────────
export const getMarketData = async () => apiFetch<MarketDataResponse>('/market-data')

// ───────── AI generation ─────────
export const generateArticle = async (payload: ArticleGenerationInput) => {
  return apiFetch<GeneratedArticle>('/generate-article', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
}

export const generateImagePrompts = async (payload: { content: string; headline: string }) => {
  const response = await apiFetch<ApiEnvelope<ImagePromptResult>>('/generate-image-prompts', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

export const generateArticleImage = async (payload: { prompt: string; imageType: 'hero' | 'inline' }) => {
  const response = await apiFetch<ApiEnvelope<GeneratedImageResult>>('/generate-article-image', {
    method: 'POST',
    body: JSON.stringify(payload),
    requireAdminAuth: true,
  })
  return response.data
}

// ───────── Admin lists ─────────
export const getSubscribersAdmin = async () => {
  const response = await apiFetch<ApiEnvelope<NewsletterSubscriber[]>>('/subscribers', { requireAdminAuth: true })
  return response.data
}

export const getContactMessagesAdmin = async () => {
  const response = await apiFetch<ApiEnvelope<ContactMessage[]>>('/contact-messages', { requireAdminAuth: true })
  return response.data
}

export const getApplicationsAdmin = async () => {
  const response = await apiFetch<ApiEnvelope<GuestApplication[]>>('/applications', { requireAdminAuth: true })
  return response.data
}

// ───────── Uploads ─────────
export const uploadFile = async (kind: 'audio' | 'image', file: File): Promise<UploadResult> => {
  const password = getAdminPassword()
  const form = new FormData()
  form.append('file', file)
  const response = await fetch(`${API_BASE_URL}/uploads/${kind}`, {
    method: 'POST',
    body: form,
    headers: password ? { [ADMIN_PASSWORD_HEADER]: password } : undefined,
  })
  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.error || `Upload failed: ${response.status}`)
  }
  const body = (await response.json()) as ApiEnvelope<UploadResult>
  return body.data
}

// ───────── Auth ─────────
export const verifyAdminPassword = async (password: string) => {
  const response = await apiFetch<ApiEnvelope<AdminAuthResult>>('/admin/auth', {
    method: 'POST',
    body: JSON.stringify({ password }),
    adminPassword: null,
  })
  return response.data
}
