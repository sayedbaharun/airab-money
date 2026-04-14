import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import fs from 'fs'
import multer from 'multer'
import OpenAI from 'openai'
import path from 'path'
import { randomUUID, timingSafeEqual } from 'crypto'
import { fileURLToPath } from 'url'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { Resend } from 'resend'

dotenv.config()

const app = express()

const connectionString = process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../../dist')
const ADMIN_PASSWORD_HEADER = 'x-admin-password'

const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'))
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

const ALLOWED_AUDIO_MIME = new Set([
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/wav',
  'audio/x-wav',
  'audio/ogg',
  'audio/webm',
])

const ALLOWED_IMAGE_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const mimeExtension = (mime: string, originalName: string) => {
  const fromName = path.extname(originalName).toLowerCase().replace('.', '')
  if (fromName) return fromName
  if (mime === 'audio/mpeg' || mime === 'audio/mp3') return 'mp3'
  if (mime === 'audio/mp4' || mime === 'audio/x-m4a') return 'm4a'
  if (mime === 'audio/wav' || mime === 'audio/x-wav') return 'wav'
  if (mime === 'audio/ogg') return 'ogg'
  if (mime === 'audio/webm') return 'webm'
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/png') return 'png'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/gif') return 'gif'
  return 'bin'
}

const makeStorage = () =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = mimeExtension(file.mimetype, file.originalname)
      cb(null, `${randomUUID()}.${ext}`)
    },
  })

const audioUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: 250 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_AUDIO_MIME.has(file.mimetype)) return cb(null, true)
    cb(new Error(`Unsupported audio type: ${file.mimetype}`))
  },
})

const imageUpload = multer({
  storage: makeStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_MIME.has(file.mimetype)) return cb(null, true)
    cb(new Error(`Unsupported image type: ${file.mimetype}`))
  },
})

app.use(cors())
app.use('/media', express.static(UPLOAD_DIR, { maxAge: '365d', immutable: true }))
app.use(express.json({ limit: '2mb' }))

const adminPasswordMatches = (candidate: unknown) => {
  const configuredPassword = process.env.ADMIN_PASSWORD

  if (typeof configuredPassword !== 'string' || configuredPassword.length === 0) {
    return false
  }

  if (typeof candidate !== 'string') {
    return false
  }

  const configuredPasswordBuffer = Buffer.from(configuredPassword)
  const candidateBuffer = Buffer.from(candidate)

  return (
    configuredPasswordBuffer.length === candidateBuffer.length &&
    timingSafeEqual(configuredPasswordBuffer, candidateBuffer)
  )
}

const requireAdminAuth: express.RequestHandler = (req, res, next) => {
  const configuredPassword = process.env.ADMIN_PASSWORD

  if (typeof configuredPassword !== 'string' || configuredPassword.length === 0) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD is not configured' })
  }

  if (!adminPasswordMatches(req.header(ADMIN_PASSWORD_HEADER))) {
    return res.status(401).json({ error: 'Invalid admin password' })
  }

  next()
}

const parseLimit = (value: unknown) => {
  const limit = Number(value)
  return Number.isFinite(limit) && limit > 0 ? limit : undefined
}

const parseBoolean = (value: unknown) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

const parseDate = (value: unknown) => {
  if (value === null) return null
  if (typeof value !== 'string' || !value) return undefined

  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? undefined : parsed
}

const getRouteParam = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0]
  }

  return value
}

const normalizeStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
}

const fallbackImagePrompts = (headline: string) => ({
  hero_prompt: `Editorial hero illustration for "${headline}" with clean financial newsroom styling, premium business lighting, and a strong Middle East technology atmosphere.`,
  inline_prompt: `Supporting illustration for "${headline}" focused on data, market movement, and AI-driven finance in the GCC region.`,
  fallback: true,
})

const buildFallbackArticle = (topic: string, wordCount: number, style: string) => {
  const tone =
    style === 'Technical'
      ? 'The analysis below focuses on implementation detail, market structure, and operating implications.'
      : style === 'Casual'
        ? 'The analysis below keeps the language approachable while staying grounded in business reality.'
        : 'The analysis below is written in a clear editorial voice for executives and operators.'

  const sections = [
    `The latest movement around ${topic} matters because the Arab AI and finance ecosystem is moving from experimentation into execution. Capital is concentrating around practical use cases, regulators are watching more closely, and buyers increasingly want measurable outcomes instead of broad promises.`,
    `${tone}`,
    `In practical terms, organizations evaluating ${topic} should separate signal from noise in three areas: commercial demand, execution capacity, and time-to-value. Strong opportunities tend to show a defined customer problem, a realistic deployment path, and a clear link to revenue growth, cost reduction, or decision quality.`,
    `For Gulf and wider MENA operators, the next question is localization. Solutions that understand Arabic language workflows, regional compliance expectations, and sector-specific buying patterns will usually outperform generic imports. That is especially true in government, finance, energy, and enterprise services.`,
    `Investors and executives should also pay attention to infrastructure readiness. The winners around ${topic} will not only have a strong product narrative, but also the data access, distribution channels, partnerships, and internal discipline to sustain adoption after the initial launch window.`,
    `The near-term outlook is straightforward: ${topic} is no longer a fringe conversation. It is becoming part of the core strategic agenda for institutions that want to lead in a market increasingly shaped by AI-native operations and regional execution speed.`,
  ]

  const content = sections.join('\n\n')
  const headline = `${topic}: Why It Matters for AI and Capital in the Arab World`

  return {
    headline,
    content,
    fallback: true,
    estimatedWordCount: Math.max(wordCount, content.split(/\s+/).length),
  }
}

const buildPlaceholderImage = (prompt: string, imageType: 'hero' | 'inline') => {
  const width = imageType === 'hero' ? 1536 : 1024
  const height = imageType === 'hero' ? 1024 : 1024
  const safePrompt = prompt
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#1d4ed8" />
          <stop offset="100%" stop-color="#0f766e" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#bg)" />
      <circle cx="${width - 160}" cy="160" r="120" fill="rgba(255,255,255,0.08)" />
      <circle cx="140" cy="${height - 140}" r="100" fill="rgba(245,158,11,0.18)" />
      <text x="84" y="120" fill="#e2e8f0" font-size="36" font-family="Helvetica, Arial, sans-serif">AIRAB Money</text>
      <text x="84" y="180" fill="#f8fafc" font-size="58" font-weight="700" font-family="Helvetica, Arial, sans-serif">${imageType === 'hero' ? 'Hero Image' : 'Inline Image'}</text>
      <foreignObject x="84" y="260" width="${width - 168}" height="${height - 344}">
        <div xmlns="http://www.w3.org/1999/xhtml" style="color:#e2e8f0;font-family:Helvetica,Arial,sans-serif;font-size:30px;line-height:1.45;">
          ${safePrompt}
        </div>
      </foreignObject>
    </svg>
  `.trim()

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

const handleError = (res: express.Response, error: unknown, fallbackMessage: string) => {
  console.error(fallbackMessage, error)

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' })
  }

  if (error instanceof Error) {
    return res.status(500).json({ error: error.message || fallbackMessage })
  }

  return res.status(500).json({ error: fallbackMessage })
}

const slugify = (value: string) =>
  value
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || randomUUID().slice(0, 8)

const parsePage = (value: unknown) => {
  const page = Number(value)
  return Number.isFinite(page) && page >= 1 ? Math.floor(page) : 1
}

const parsePageSize = (value: unknown, fallback = 12, max = 100) => {
  const size = Number(value)
  if (!Number.isFinite(size) || size < 1) return fallback
  return Math.min(Math.floor(size), max)
}

const buildPublicBaseUrl = (req: express.Request) => {
  if (process.env.PUBLIC_BASE_URL) return process.env.PUBLIC_BASE_URL.replace(/\/+$/, '')
  const proto = (req.headers['x-forwarded-proto'] as string) || req.protocol
  const host = (req.headers['x-forwarded-host'] as string) || req.get('host')
  return `${proto}://${host}`
}

const sendNewsletterConfirmEmail = async (
  req: express.Request,
  email: string,
  name: string | null,
  confirmationToken: string,
) => {
  if (!resend) return { skipped: true, reason: 'RESEND_API_KEY not configured' }

  const from = process.env.RESEND_FROM_EMAIL || 'AIRAB Money <hello@airabmoney.com>'
  const base = buildPublicBaseUrl(req)
  const confirmUrl = `${base}/newsletter/confirm?token=${encodeURIComponent(confirmationToken)}`
  const greeting = name ? `Hi ${name},` : 'Hi there,'

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Confirm your AIRAB Money subscription',
      html: `
        <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111;">
          <h1 style="font-size:22px;margin-bottom:16px;">Confirm your subscription</h1>
          <p>${greeting}</p>
          <p>Thanks for signing up for AIRAB Money — AI intelligence for the Arab world and GCC region. Please confirm your email to start receiving our briefings.</p>
          <p style="margin:28px 0;">
            <a href="${confirmUrl}" style="background:#1d4ed8;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;display:inline-block;">Confirm subscription</a>
          </p>
          <p style="font-size:12px;color:#555;">If the button doesn't work, paste this link into your browser:<br/>${confirmUrl}</p>
          <p style="font-size:12px;color:#555;margin-top:28px;">Didn't sign up? You can safely ignore this email.</p>
        </div>
      `,
    })
    return { skipped: false }
  } catch (error) {
    console.error('Failed to send newsletter confirmation email:', error)
    return { skipped: true, reason: 'email_send_failed' }
  }
}

// ───────────────────────── Market data (Finnhub) ─────────────────────────

interface MarketQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  type: 'stock' | 'crypto' | 'commodity' | 'gcc' | 'index' | 'middleeast'
}

const STATIC_MARKET_FALLBACK: MarketQuote[] = [
  { symbol: 'TASI', name: 'Saudi Tadawul Index', price: 12294.18, change: 74.22, changePercent: 0.61, type: 'middleeast' },
  { symbol: 'DFMGI', name: 'Dubai Financial Market', price: 4318.57, change: -12.09, changePercent: -0.28, type: 'middleeast' },
  { symbol: 'ADX', name: 'Abu Dhabi Securities Exchange', price: 9398.12, change: 21.88, changePercent: 0.23, type: 'middleeast' },
  { symbol: 'BTC', name: 'Bitcoin', price: 84215.33, change: 1365.18, changePercent: 1.65, type: 'crypto' },
  { symbol: 'ETH', name: 'Ethereum', price: 4021.61, change: -48.42, changePercent: -1.19, type: 'crypto' },
  { symbol: 'XAU', name: 'Gold', price: 2364.2, change: 18.41, changePercent: 0.78, type: 'commodity' },
  { symbol: 'BRENT', name: 'Brent Crude', price: 88.12, change: -0.57, changePercent: -0.64, type: 'commodity' },
  { symbol: 'SPX', name: 'S&P 500', price: 5281.48, change: 22.91, changePercent: 0.44, type: 'index' },
]

const FINNHUB_SYMBOLS: Array<{
  key: string
  finnhub: string
  name: string
  symbol: string
  type: MarketQuote['type']
}> = [
  { key: 'SPY', finnhub: 'SPY', name: 'S&P 500 (SPY ETF)', symbol: 'SPX', type: 'index' },
  { key: 'QQQ', finnhub: 'QQQ', name: 'Nasdaq 100 (QQQ ETF)', symbol: 'QQQ', type: 'index' },
  { key: 'BTC', finnhub: 'BINANCE:BTCUSDT', name: 'Bitcoin', symbol: 'BTC', type: 'crypto' },
  { key: 'ETH', finnhub: 'BINANCE:ETHUSDT', name: 'Ethereum', symbol: 'ETH', type: 'crypto' },
]

interface MarketCache {
  data: MarketQuote[]
  updatedAt: string
  source: 'finnhub' | 'fallback'
}
let marketCache: MarketCache | null = null
const MARKET_CACHE_TTL_MS = 60_000

const fetchFinnhubQuote = async (symbol: string, apiKey: string) => {
  const url = `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`
  const resp = await fetch(url)
  if (!resp.ok) throw new Error(`Finnhub ${symbol} ${resp.status}`)
  return (await resp.json()) as { c?: number; d?: number; dp?: number; t?: number }
}

const refreshMarketData = async (): Promise<MarketCache> => {
  const apiKey = process.env.FINNHUB_API_KEY
  const updatedAt = new Date().toISOString()

  if (!apiKey) {
    return { data: STATIC_MARKET_FALLBACK, updatedAt, source: 'fallback' }
  }

  try {
    const quotes = await Promise.all(
      FINNHUB_SYMBOLS.map(async (s) => {
        const q = await fetchFinnhubQuote(s.finnhub, apiKey)
        if (typeof q.c !== 'number' || q.c === 0) {
          throw new Error(`empty quote for ${s.finnhub}`)
        }
        return {
          symbol: s.symbol,
          name: s.name,
          price: q.c,
          change: typeof q.d === 'number' ? q.d : 0,
          changePercent: typeof q.dp === 'number' ? q.dp : 0,
          type: s.type,
        } as MarketQuote
      }),
    )

    // GCC indices are kept as indicative static; Finnhub free tier doesn't cover them reliably.
    const gccIndicative = STATIC_MARKET_FALLBACK.filter((q) => q.type === 'middleeast')
    const commoditiesIndicative = STATIC_MARKET_FALLBACK.filter((q) => q.type === 'commodity')

    return {
      data: [...quotes, ...gccIndicative, ...commoditiesIndicative],
      updatedAt,
      source: 'finnhub',
    }
  } catch (error) {
    console.error('Finnhub fetch failed, using fallback:', error)
    return { data: STATIC_MARKET_FALLBACK, updatedAt, source: 'fallback' }
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Health check failed:', error)
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    })
  }
})

app.post('/api/admin/auth', (req, res) => {
  const configuredPassword = process.env.ADMIN_PASSWORD

  if (typeof configuredPassword !== 'string' || configuredPassword.length === 0) {
    return res.status(503).json({ error: 'ADMIN_PASSWORD is not configured' })
  }

  if (!adminPasswordMatches(req.body.password)) {
    return res.status(401).json({ error: 'Invalid admin password' })
  }

  res.json({
    data: {
      authenticated: true,
    },
  })
})

app.get('/api/articles', async (req, res) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const sort = req.query.sort === 'published_at' ? 'published_at' : 'created_at'
    const order: Prisma.SortOrder = req.query.order === 'asc' ? 'asc' : 'desc'
    const explicitLimit = parseLimit(req.query.limit)
    const page = parsePage(req.query.page)
    const pageSize = parsePageSize(req.query.pageSize, 12, 100)

    const where: Prisma.ArticleWhereInput = {}
    if (status) where.status = status

    const orderBy = sort === 'published_at' ? { published_at: order } : { created_at: order }

    const take = explicitLimit ?? pageSize
    const skip = explicitLimit ? undefined : (page - 1) * pageSize

    const [articles, total] = await Promise.all([
      prisma.article.findMany({ where, orderBy, take, skip }),
      prisma.article.count({ where }),
    ])

    res.json({
      data: articles,
      pagination: { page, pageSize: take, total },
    })
  } catch (error) {
    handleError(res, error, 'Failed to fetch articles')
  }
})

app.get('/api/articles/:id', async (req, res) => {
  try {
    const articleId = getRouteParam(req.params.id)

    if (!articleId) {
      return res.status(400).json({ error: 'Article id is required' })
    }

    const article = await prisma.article.findUnique({
      where: { id: articleId },
    })

    if (!article) {
      return res.status(404).json({ error: 'Article not found' })
    }

    res.json({ data: article })
  } catch (error) {
    handleError(res, error, 'Failed to fetch article')
  }
})

app.post('/api/articles', requireAdminAuth, async (req, res) => {
  try {
    const {
      headline,
      content,
      summary,
      category,
      status,
      tags,
      published_at,
      image_url,
      image_prompt,
      hero_image_url,
      inline_image_url,
      hero_image_prompt,
      inline_image_prompt,
      source_url,
      source_name,
      article_url,
    } = req.body

    if (!headline || !content || !summary) {
      return res.status(400).json({ error: 'headline, content, and summary are required' })
    }

    const article = await prisma.article.create({
      data: {
        headline,
        content,
        summary,
        category: category || 'General',
        status: status || 'published',
        tags: normalizeStringArray(tags),
        published_at: parseDate(published_at) ?? undefined,
        image_url,
        image_prompt,
        hero_image_url,
        inline_image_url,
        hero_image_prompt,
        inline_image_prompt,
        source_url,
        source_name,
        article_url,
      },
    })

    res.status(201).json({ data: article })
  } catch (error) {
    handleError(res, error, 'Failed to create article')
  }
})

app.patch('/api/articles/:id', requireAdminAuth, async (req, res) => {
  try {
    const articleId = getRouteParam(req.params.id)

    if (!articleId) {
      return res.status(400).json({ error: 'Article id is required' })
    }

    const data: Prisma.ArticleUpdateInput = {}

    if (typeof req.body.headline === 'string') data.headline = req.body.headline
    if (typeof req.body.content === 'string') data.content = req.body.content
    if (typeof req.body.summary === 'string') data.summary = req.body.summary
    if (typeof req.body.category === 'string') data.category = req.body.category
    if (typeof req.body.status === 'string') data.status = req.body.status
    if (Array.isArray(req.body.tags)) data.tags = normalizeStringArray(req.body.tags)
    if (typeof req.body.image_url === 'string' || req.body.image_url === null) data.image_url = req.body.image_url
    if (typeof req.body.image_prompt === 'string' || req.body.image_prompt === null) data.image_prompt = req.body.image_prompt
    if (typeof req.body.hero_image_url === 'string' || req.body.hero_image_url === null) data.hero_image_url = req.body.hero_image_url
    if (typeof req.body.inline_image_url === 'string' || req.body.inline_image_url === null) data.inline_image_url = req.body.inline_image_url
    if (typeof req.body.hero_image_prompt === 'string' || req.body.hero_image_prompt === null) data.hero_image_prompt = req.body.hero_image_prompt
    if (typeof req.body.inline_image_prompt === 'string' || req.body.inline_image_prompt === null) data.inline_image_prompt = req.body.inline_image_prompt
    if (typeof req.body.source_url === 'string' || req.body.source_url === null) data.source_url = req.body.source_url
    if (typeof req.body.source_name === 'string' || req.body.source_name === null) data.source_name = req.body.source_name
    if (typeof req.body.article_url === 'string' || req.body.article_url === null) data.article_url = req.body.article_url

    const publishedAt = parseDate(req.body.published_at)
    if (publishedAt !== undefined) data.published_at = publishedAt

    const article = await prisma.article.update({
      where: { id: articleId },
      data,
    })

    res.json({ data: article })
  } catch (error) {
    handleError(res, error, 'Failed to update article')
  }
})

app.delete('/api/articles/:id', requireAdminAuth, async (req, res) => {
  try {
    const articleId = getRouteParam(req.params.id)

    if (!articleId) {
      return res.status(400).json({ error: 'Article id is required' })
    }

    await prisma.article.delete({
      where: { id: articleId },
    })

    res.status(204).send()
  } catch (error) {
    handleError(res, error, 'Failed to delete article')
  }
})

app.get('/api/episodes', async (req, res) => {
  try {
    const where: Prisma.PodcastEpisodeWhereInput = {}
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const showType = typeof req.query.show_type === 'string' ? req.query.show_type : undefined
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const featured = parseBoolean(req.query.featured)
    const explicitLimit = parseLimit(req.query.limit)
    const page = parsePage(req.query.page)
    const pageSize = parsePageSize(req.query.pageSize, 12, 100)

    if (status) where.status = status
    if (showType) where.show_type = showType
    if (category) where.categories = { has: category }
    if (featured !== undefined) where.featured = featured

    const take = explicitLimit ?? pageSize
    const skip = explicitLimit ? undefined : (page - 1) * pageSize

    const [episodes, total] = await Promise.all([
      prisma.podcastEpisode.findMany({ where, orderBy: { publish_date: 'desc' }, take, skip }),
      prisma.podcastEpisode.count({ where }),
    ])

    res.json({ data: episodes, pagination: { page, pageSize: take, total } })
  } catch (error) {
    handleError(res, error, 'Failed to fetch episodes')
  }
})

app.get('/api/episodes/:id', async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Episode id is required' })
    const episode = await prisma.podcastEpisode.findUnique({ where: { id } })
    if (!episode) return res.status(404).json({ error: 'Episode not found' })
    res.json({ data: episode })
  } catch (error) {
    handleError(res, error, 'Failed to fetch episode')
  }
})

app.post('/api/episodes', requireAdminAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      episode_number,
      season_number,
      show_type,
      duration_minutes,
      audio_url,
      transcript_url,
      featured_image_url,
      thumbnail_url,
      publish_date,
      status,
      guest_name,
      guest_bio,
      topics,
      categories,
      featured,
    } = req.body

    if (!title || !description || !audio_url) {
      return res.status(400).json({ error: 'title, description, and audio_url are required' })
    }

    const episode = await prisma.podcastEpisode.create({
      data: {
        title,
        description,
        episode_number: Number(episode_number) || 1,
        season_number: Number(season_number) || 1,
        show_type: show_type || 'Money Moves',
        duration_minutes: Number(duration_minutes) || 0,
        audio_url,
        transcript_url: transcript_url || null,
        featured_image_url: featured_image_url || null,
        thumbnail_url: thumbnail_url || null,
        publish_date: parseDate(publish_date) ?? new Date(),
        status: status || 'published',
        guest_name: guest_name || null,
        guest_bio: guest_bio || null,
        topics: normalizeStringArray(topics),
        categories: normalizeStringArray(categories),
        featured: Boolean(featured),
      },
    })

    res.status(201).json({ data: episode })
  } catch (error) {
    handleError(res, error, 'Failed to create episode')
  }
})

app.patch('/api/episodes/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Episode id is required' })

    const data: Prisma.PodcastEpisodeUpdateInput = {}
    const b = req.body
    if (typeof b.title === 'string') data.title = b.title
    if (typeof b.description === 'string') data.description = b.description
    if (b.episode_number !== undefined) data.episode_number = Number(b.episode_number) || 0
    if (b.season_number !== undefined) data.season_number = Number(b.season_number) || 0
    if (typeof b.show_type === 'string') data.show_type = b.show_type
    if (b.duration_minutes !== undefined) data.duration_minutes = Number(b.duration_minutes) || 0
    if (typeof b.audio_url === 'string') data.audio_url = b.audio_url
    if (typeof b.transcript_url === 'string' || b.transcript_url === null) data.transcript_url = b.transcript_url
    if (typeof b.featured_image_url === 'string' || b.featured_image_url === null) data.featured_image_url = b.featured_image_url
    if (typeof b.thumbnail_url === 'string' || b.thumbnail_url === null) data.thumbnail_url = b.thumbnail_url
    if (typeof b.status === 'string') data.status = b.status
    if (typeof b.guest_name === 'string' || b.guest_name === null) data.guest_name = b.guest_name
    if (typeof b.guest_bio === 'string' || b.guest_bio === null) data.guest_bio = b.guest_bio
    if (Array.isArray(b.topics)) data.topics = normalizeStringArray(b.topics)
    if (Array.isArray(b.categories)) data.categories = normalizeStringArray(b.categories)
    if (b.featured !== undefined) data.featured = Boolean(b.featured)
    const pd = parseDate(b.publish_date)
    if (pd !== undefined) data.publish_date = pd ?? undefined

    const episode = await prisma.podcastEpisode.update({ where: { id }, data })
    res.json({ data: episode })
  } catch (error) {
    handleError(res, error, 'Failed to update episode')
  }
})

app.delete('/api/episodes/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Episode id is required' })
    await prisma.podcastEpisode.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    handleError(res, error, 'Failed to delete episode')
  }
})

app.get('/api/blogs', async (req, res) => {
  try {
    const where: Prisma.BlogPostWhereInput = {}
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const featured = parseBoolean(req.query.featured)
    const explicitLimit = parseLimit(req.query.limit)
    const page = parsePage(req.query.page)
    const pageSize = parsePageSize(req.query.pageSize, 12, 100)

    if (status) where.status = status
    if (category) where.category = category
    if (featured !== undefined) where.featured = featured

    const take = explicitLimit ?? pageSize
    const skip = explicitLimit ? undefined : (page - 1) * pageSize

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({ where, orderBy: { published_at: 'desc' }, take, skip }),
      prisma.blogPost.count({ where }),
    ])

    res.json({ data: posts, pagination: { page, pageSize: take, total } })
  } catch (error) {
    handleError(res, error, 'Failed to fetch blog posts')
  }
})

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const slug = getRouteParam(req.params.slug)
    if (!slug) return res.status(400).json({ error: 'Slug is required' })
    const post = await prisma.blogPost.findUnique({ where: { slug } })
    if (!post) return res.status(404).json({ error: 'Blog post not found' })
    res.json({ data: post })
  } catch (error) {
    handleError(res, error, 'Failed to fetch blog post')
  }
})

app.post('/api/blogs', requireAdminAuth, async (req, res) => {
  try {
    const b = req.body
    if (!b.title || !b.content || !b.excerpt || !b.author_name) {
      return res.status(400).json({ error: 'title, content, excerpt, and author_name are required' })
    }

    const post = await prisma.blogPost.create({
      data: {
        title: b.title,
        slug: (typeof b.slug === 'string' && b.slug) || slugify(b.title),
        content: b.content,
        excerpt: b.excerpt,
        featured_image_url: b.featured_image_url || null,
        author_name: b.author_name,
        category: b.category || 'General',
        tags: normalizeStringArray(b.tags),
        status: b.status || 'published',
        featured: Boolean(b.featured),
        estimated_read_time: Number(b.estimated_read_time) || Math.max(1, Math.round(String(b.content).split(/\s+/).length / 200)),
        meta_description: b.meta_description || null,
        published_at: parseDate(b.published_at) ?? new Date(),
      },
    })

    res.status(201).json({ data: post })
  } catch (error) {
    handleError(res, error, 'Failed to create blog post')
  }
})

app.patch('/api/blogs/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Blog post id is required' })

    const data: Prisma.BlogPostUpdateInput = {}
    const b = req.body
    if (typeof b.title === 'string') data.title = b.title
    if (typeof b.slug === 'string') data.slug = slugify(b.slug)
    if (typeof b.content === 'string') data.content = b.content
    if (typeof b.excerpt === 'string') data.excerpt = b.excerpt
    if (typeof b.featured_image_url === 'string' || b.featured_image_url === null) data.featured_image_url = b.featured_image_url
    if (typeof b.author_name === 'string') data.author_name = b.author_name
    if (typeof b.category === 'string') data.category = b.category
    if (Array.isArray(b.tags)) data.tags = normalizeStringArray(b.tags)
    if (typeof b.status === 'string') data.status = b.status
    if (b.featured !== undefined) data.featured = Boolean(b.featured)
    if (b.estimated_read_time !== undefined) data.estimated_read_time = Number(b.estimated_read_time) || 1
    if (typeof b.meta_description === 'string' || b.meta_description === null) data.meta_description = b.meta_description
    const pd = parseDate(b.published_at)
    if (pd !== undefined) data.published_at = pd ?? undefined

    const post = await prisma.blogPost.update({ where: { id }, data })
    res.json({ data: post })
  } catch (error) {
    handleError(res, error, 'Failed to update blog post')
  }
})

app.delete('/api/blogs/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Blog post id is required' })
    await prisma.blogPost.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    handleError(res, error, 'Failed to delete blog post')
  }
})

// ───────────────────────── Presenters ─────────────────────────

app.get('/api/presenters', async (_req, res) => {
  try {
    const presenters = await prisma.presenter.findMany({
      orderBy: [{ display_order: 'asc' }, { created_at: 'asc' }],
    })
    res.json({ data: presenters })
  } catch (error) {
    handleError(res, error, 'Failed to fetch presenters')
  }
})

app.post('/api/presenters', requireAdminAuth, async (req, res) => {
  try {
    const b = req.body
    if (!b.name || !b.role || !b.bio) {
      return res.status(400).json({ error: 'name, role, and bio are required' })
    }

    const presenter = await prisma.presenter.create({
      data: {
        name: b.name,
        slug: (typeof b.slug === 'string' && b.slug) || slugify(b.name),
        role: b.role,
        bio: b.bio,
        photo_url: b.photo_url || null,
        show_types: normalizeStringArray(b.show_types),
        linkedin_url: b.linkedin_url || null,
        twitter_url: b.twitter_url || null,
        website_url: b.website_url || null,
        featured: Boolean(b.featured),
        display_order: Number(b.display_order) || 0,
      },
    })

    res.status(201).json({ data: presenter })
  } catch (error) {
    handleError(res, error, 'Failed to create presenter')
  }
})

app.patch('/api/presenters/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Presenter id is required' })

    const data: Prisma.PresenterUpdateInput = {}
    const b = req.body
    if (typeof b.name === 'string') data.name = b.name
    if (typeof b.slug === 'string') data.slug = slugify(b.slug)
    if (typeof b.role === 'string') data.role = b.role
    if (typeof b.bio === 'string') data.bio = b.bio
    if (typeof b.photo_url === 'string' || b.photo_url === null) data.photo_url = b.photo_url
    if (Array.isArray(b.show_types)) data.show_types = normalizeStringArray(b.show_types)
    if (typeof b.linkedin_url === 'string' || b.linkedin_url === null) data.linkedin_url = b.linkedin_url
    if (typeof b.twitter_url === 'string' || b.twitter_url === null) data.twitter_url = b.twitter_url
    if (typeof b.website_url === 'string' || b.website_url === null) data.website_url = b.website_url
    if (b.featured !== undefined) data.featured = Boolean(b.featured)
    if (b.display_order !== undefined) data.display_order = Number(b.display_order) || 0

    const presenter = await prisma.presenter.update({ where: { id }, data })
    res.json({ data: presenter })
  } catch (error) {
    handleError(res, error, 'Failed to update presenter')
  }
})

app.delete('/api/presenters/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = getRouteParam(req.params.id)
    if (!id) return res.status(400).json({ error: 'Presenter id is required' })
    await prisma.presenter.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    handleError(res, error, 'Failed to delete presenter')
  }
})

// ───────────────────────── Uploads ─────────────────────────

app.post('/api/uploads/audio', requireAdminAuth, (req, res) => {
  audioUpload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' })
    }
    if (!req.file) return res.status(400).json({ error: 'No file provided' })
    res.status(201).json({
      data: {
        url: `/media/${req.file.filename}`,
        size: req.file.size,
        mime: req.file.mimetype,
        original_name: req.file.originalname,
      },
    })
  })
})

app.post('/api/uploads/image', requireAdminAuth, (req, res) => {
  imageUpload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Upload failed' })
    }
    if (!req.file) return res.status(400).json({ error: 'No file provided' })
    res.status(201).json({
      data: {
        url: `/media/${req.file.filename}`,
        size: req.file.size,
        mime: req.file.mimetype,
        original_name: req.file.originalname,
      },
    })
  })
})

// ───────────────────────── Admin read-only lists ─────────────────────────

app.get('/api/subscribers', requireAdminAuth, async (_req, res) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { created_at: 'desc' },
      take: 500,
    })
    res.json({ data: subscribers })
  } catch (error) {
    handleError(res, error, 'Failed to fetch subscribers')
  }
})

app.get('/api/contact-messages', requireAdminAuth, async (_req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { created_at: 'desc' },
      take: 200,
    })
    res.json({ data: messages })
  } catch (error) {
    handleError(res, error, 'Failed to fetch contact messages')
  }
})

app.get('/api/applications', requireAdminAuth, async (_req, res) => {
  try {
    const applications = await prisma.guestApplication.findMany({
      orderBy: { created_at: 'desc' },
      take: 200,
    })
    res.json({ data: applications })
  } catch (error) {
    handleError(res, error, 'Failed to fetch applications')
  }
})

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, messageType } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email, and message are required' })
    }

    const created = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || 'Contact Form Submission',
        message,
        message_type: messageType || 'general',
      },
    })

    res.status(201).json({
      data: {
        message: 'Your message has been received. We will get back to you shortly.',
        status: 'success',
        message_id: created.id,
      },
    })
  } catch (error) {
    handleError(res, error, 'Failed to submit contact message')
  }
})

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name, preferences } = req.body

    if (typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' })
    }

    const confirmationToken = randomUUID()
    const skipConfirmation = !resend // if email service not configured, auto-confirm

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        name: name || undefined,
        preferences: typeof preferences === 'object' && preferences !== null ? preferences : undefined,
        // If already confirmed, keep active; otherwise re-issue confirmation token
        confirmation_token: skipConfirmation ? null : confirmationToken,
        subscription_status: skipConfirmation ? 'active' : 'pending',
      },
      create: {
        email,
        name: name || null,
        preferences: typeof preferences === 'object' && preferences !== null ? preferences : {},
        subscription_status: skipConfirmation ? 'active' : 'pending',
        confirmation_token: skipConfirmation ? null : confirmationToken,
        confirmed_at: skipConfirmation ? new Date() : null,
        unsubscribe_token: randomUUID(),
      },
    })

    if (!skipConfirmation && subscriber.subscription_status === 'pending' && subscriber.confirmation_token) {
      await sendNewsletterConfirmEmail(req, subscriber.email, subscriber.name, subscriber.confirmation_token)
    }

    res.status(201).json({
      data: {
        message: skipConfirmation
          ? 'You are subscribed to the AIRAB Money newsletter.'
          : 'Check your inbox — we sent a confirmation link.',
        status: 'success',
        subscriber_id: subscriber.id,
      },
    })
  } catch (error) {
    handleError(res, error, 'Failed to subscribe to newsletter')
  }
})

app.get('/api/newsletter/confirm', async (req, res) => {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token : ''
    if (!token) return res.status(400).json({ error: 'token is required' })

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { confirmation_token: token } })
    if (!subscriber) return res.status(404).json({ error: 'Invalid or expired confirmation link' })

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: {
        confirmation_token: null,
        confirmed_at: new Date(),
        subscription_status: 'active',
      },
    })

    res.json({ data: { message: 'Subscription confirmed.', email: subscriber.email, status: 'confirmed' } })
  } catch (error) {
    handleError(res, error, 'Failed to confirm subscription')
  }
})

app.get('/api/newsletter/unsubscribe', async (req, res) => {
  try {
    const token = typeof req.query.token === 'string' ? req.query.token : ''
    if (!token) return res.status(400).json({ error: 'token is required' })

    const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { unsubscribe_token: token } })
    if (!subscriber) return res.status(404).json({ error: 'Invalid unsubscribe link' })

    await prisma.newsletterSubscriber.update({
      where: { id: subscriber.id },
      data: { subscription_status: 'unsubscribed' },
    })

    res.json({ data: { message: 'You are unsubscribed.', email: subscriber.email, status: 'unsubscribed' } })
  } catch (error) {
    handleError(res, error, 'Failed to unsubscribe')
  }
})

app.post('/api/applications', async (req, res) => {
  try {
    const {
      name,
      email,
      company,
      position,
      bio,
      expertiseAreas,
      linkedinUrl,
      websiteUrl,
      proposedTopics,
    } = req.body

    if (!name || !email || !bio) {
      return res.status(400).json({ error: 'name, email, and bio are required' })
    }

    const application = await prisma.guestApplication.create({
      data: {
        name,
        email,
        company: company || null,
        position: position || null,
        bio,
        expertise_areas: normalizeStringArray(expertiseAreas),
        linkedin_url: linkedinUrl || null,
        website_url: websiteUrl || null,
        proposed_topics: normalizeStringArray(proposedTopics),
      },
    })

    res.status(201).json({
      data: {
        message: 'Your guest application has been submitted for review.',
        status: 'success',
        application_id: application.id,
      },
    })
  } catch (error) {
    handleError(res, error, 'Failed to submit guest application')
  }
})

app.get('/api/market-data', async (_req, res) => {
  try {
    const now = Date.now()
    if (!marketCache || now - new Date(marketCache.updatedAt).getTime() > MARKET_CACHE_TTL_MS) {
      marketCache = await refreshMarketData()
    }

    res.json({
      success: true,
      updatedAt: marketCache.updatedAt,
      source: marketCache.source,
      data: marketCache.data,
    })
  } catch (error) {
    handleError(res, error, 'Failed to fetch market data')
  }
})

app.post('/api/generate-article', requireAdminAuth, async (req, res) => {
  try {
    const topic = typeof req.body.topic === 'string' ? req.body.topic.trim() : ''
    const wordCount = Number(req.body.word_count) || 750
    const style = typeof req.body.style === 'string' ? req.body.style : 'Professional'

    if (!topic) {
      return res.status(400).json({ error: 'topic is required' })
    }

    if (!openai) {
      const fallback = buildFallbackArticle(topic, wordCount, style)
      return res.json({
        headline: fallback.headline,
        content: fallback.content,
        fallback: true,
      })
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You are an expert business journalist. Return valid JSON with exactly two string keys: "headline" and "content".',
        },
        {
          role: 'user',
          content: `Write a ${style.toLowerCase()} article about "${topic}" in roughly ${wordCount} words for AIRAB Money, a publication covering AI, finance, and the Arab world. Make it publication-ready.`,
        },
      ],
    })

    const parsed = JSON.parse(completion.choices[0].message.content || '{}')
    res.json({
      headline: parsed.headline || `${topic}: AIRAB Money Brief`,
      content: parsed.content || buildFallbackArticle(topic, wordCount, style).content,
    })
  } catch (error) {
    console.error('OpenAI article generation failed, using fallback:', error)

    const fallback = buildFallbackArticle(
      typeof req.body.topic === 'string' ? req.body.topic : 'AI and finance',
      Number(req.body.word_count) || 750,
      typeof req.body.style === 'string' ? req.body.style : 'Professional',
    )

    res.json({
      headline: fallback.headline,
      content: fallback.content,
      fallback: true,
    })
  }
})

app.post('/api/generate-image-prompts', requireAdminAuth, async (req, res) => {
  try {
    const headline = typeof req.body.headline === 'string' ? req.body.headline.trim() : ''
    const content = typeof req.body.content === 'string' ? req.body.content.trim() : ''

    if (!headline || !content) {
      return res.status(400).json({ error: 'headline and content are required' })
    }

    if (!openai) {
      return res.json({ data: fallbackImagePrompts(headline) })
    }

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'Return valid JSON with "hero_prompt" and "inline_prompt". Keep prompts concise, editorial, photoreal or premium illustrative, and suitable for finance/media publishing.',
        },
        {
          role: 'user',
          content: `Headline: ${headline}\n\nArticle excerpt:\n${content.slice(0, 1800)}`,
        },
      ],
    })

    const parsed = JSON.parse(completion.choices[0].message.content || '{}')
    res.json({
      data: {
        hero_prompt: parsed.hero_prompt || fallbackImagePrompts(headline).hero_prompt,
        inline_prompt: parsed.inline_prompt || fallbackImagePrompts(headline).inline_prompt,
      },
    })
  } catch (error) {
    console.error('Image prompt generation failed, using fallback:', error)
    res.json({ data: fallbackImagePrompts(typeof req.body.headline === 'string' ? req.body.headline : 'AIRAB Money feature') })
  }
})

app.post('/api/generate-article-image', requireAdminAuth, async (req, res) => {
  try {
    const prompt = typeof req.body.prompt === 'string' ? req.body.prompt.trim() : ''
    const imageType = req.body.imageType === 'inline' ? 'inline' : 'hero'

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' })
    }

    if (!openai) {
      return res.json({
        data: {
          imageUrl: buildPlaceholderImage(prompt, imageType),
          fallback: true,
        },
      })
    }

    const image = await openai.images.generate({
      model: process.env.OPENAI_IMAGE_MODEL || 'dall-e-3',
      prompt,
      size: imageType === 'hero' ? '1792x1024' : '1024x1024',
    })

    const firstImage = image.data?.[0]
    const imageUrl = firstImage?.b64_json
      ? `data:image/png;base64,${firstImage.b64_json}`
      : firstImage?.url || buildPlaceholderImage(prompt, imageType)

    res.json({
      data: {
        imageUrl,
      },
    })
  } catch (error) {
    console.error('Image generation failed, using placeholder:', error)
    res.json({
      data: {
        imageUrl: buildPlaceholderImage(
          typeof req.body.prompt === 'string' ? req.body.prompt : 'AIRAB Money image',
          req.body.imageType === 'inline' ? 'inline' : 'hero',
        ),
        fallback: true,
      },
    })
  }
})

app.use(express.static(distPath))

app.get('{*path}', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'))
})

const PORT = Number(process.env.PORT || 3001)
const HOST = '0.0.0.0'
const FALLBACK_PORTS = [3000].filter((port) => port !== PORT)

const startServer = (port: number, { optional = false }: { optional?: boolean } = {}) => {
  const server = app.listen(port, HOST, () => {
    const address = server.address()
    const bind =
      address && typeof address === 'object'
        ? `${address.address}:${address.port}`
        : String(address)

    console.log(`Server is running on ${bind}`)
    console.log(`Serving static files from: ${distPath}`)
  })

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (optional && error.code === 'EADDRINUSE') {
      console.warn(`Skipping fallback port ${port}; already in use`)
      return
    }

    console.error(`Failed to bind server on port ${port}`, error)

    if (!optional) {
      process.exit(1)
    }
  })

  return server
}

startServer(PORT)
FALLBACK_PORTS.forEach((port) => {
  startServer(port, { optional: true })
})
