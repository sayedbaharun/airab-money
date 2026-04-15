import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import OpenAI from 'openai'
import path from 'path'
import { randomUUID, timingSafeEqual } from 'crypto'
import { fileURLToPath } from 'url'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

dotenv.config()

const app = express()

const connectionString = process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock'
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const distPath = path.resolve(__dirname, '../../dist')
const ADMIN_PASSWORD_HEADER = 'x-admin-password'
const OPENAI_SETTING_KEYS = ['OPENAI_API_KEY', 'OPENAI_TEXT_MODEL', 'OPENAI_IMAGE_MODEL'] as const

app.use(cors())
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

const maskSecret = (value: string | null) => {
  if (!value) return null
  if (value.length <= 10) return `${value.slice(0, 2)}••••`
  return `${value.slice(0, 7)}…${value.slice(-4)}`
}

const getAdminSettingsMap = async () => {
  const settings = await prisma.adminSetting.findMany({
    where: {
      key: {
        in: [...OPENAI_SETTING_KEYS],
      },
    },
  })

  return settings.reduce<Record<string, string>>((accumulator, setting) => {
    if (typeof setting.value === 'string' && setting.value.trim()) {
      accumulator[setting.key] = setting.value.trim()
    }

    return accumulator
  }, {})
}

const getAiRuntimeConfig = async () => {
  const storedSettings = await getAdminSettingsMap()
  const storedApiKey = storedSettings.OPENAI_API_KEY
  const envApiKey = process.env.OPENAI_API_KEY?.trim()
  const apiKey = storedApiKey || envApiKey || null

  return {
    apiKey,
    apiKeyMasked: maskSecret(apiKey),
    apiKeySource: storedApiKey ? 'database' : envApiKey ? 'environment' : 'none',
    textModel: storedSettings.OPENAI_TEXT_MODEL || process.env.OPENAI_TEXT_MODEL || 'gpt-4o-mini',
    imageModel: storedSettings.OPENAI_IMAGE_MODEL || process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1',
  }
}

const getOpenAIClient = async () => {
  const config = await getAiRuntimeConfig()

  return {
    client: config.apiKey ? new OpenAI({ apiKey: config.apiKey }) : null,
    config,
  }
}

const upsertAdminSetting = async (key: (typeof OPENAI_SETTING_KEYS)[number], value: string | null) => {
  const nextValue = value?.trim() || null

  if (!nextValue) {
    await prisma.adminSetting.deleteMany({
      where: { key },
    })
    return
  }

  await prisma.adminSetting.upsert({
    where: { key },
    update: { value: nextValue },
    create: { key, value: nextValue },
  })
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

app.get('/api/admin/settings', requireAdminAuth, async (_req, res) => {
  try {
    const config = await getAiRuntimeConfig()

    res.json({
      data: {
        openaiApiKeyConfigured: Boolean(config.apiKey),
        openaiApiKeyMasked: config.apiKeyMasked,
        openaiApiKeySource: config.apiKeySource,
        openaiTextModel: config.textModel,
        openaiImageModel: config.imageModel,
      },
    })
  } catch (error) {
    handleError(res, error, 'Failed to fetch admin settings')
  }
})

app.put('/api/admin/settings', requireAdminAuth, async (req, res) => {
  try {
    if (req.body.openaiApiKey !== undefined) {
      if (req.body.openaiApiKey !== null && typeof req.body.openaiApiKey !== 'string') {
        return res.status(400).json({ error: 'openaiApiKey must be a string or null' })
      }

      await upsertAdminSetting('OPENAI_API_KEY', req.body.openaiApiKey)
    }

    if (req.body.openaiTextModel !== undefined) {
      if (req.body.openaiTextModel !== null && typeof req.body.openaiTextModel !== 'string') {
        return res.status(400).json({ error: 'openaiTextModel must be a string or null' })
      }

      await upsertAdminSetting('OPENAI_TEXT_MODEL', req.body.openaiTextModel)
    }

    if (req.body.openaiImageModel !== undefined) {
      if (req.body.openaiImageModel !== null && typeof req.body.openaiImageModel !== 'string') {
        return res.status(400).json({ error: 'openaiImageModel must be a string or null' })
      }

      await upsertAdminSetting('OPENAI_IMAGE_MODEL', req.body.openaiImageModel)
    }

    const config = await getAiRuntimeConfig()

    res.json({
      data: {
        openaiApiKeyConfigured: Boolean(config.apiKey),
        openaiApiKeyMasked: config.apiKeyMasked,
        openaiApiKeySource: config.apiKeySource,
        openaiTextModel: config.textModel,
        openaiImageModel: config.imageModel,
      },
    })
  } catch (error) {
    handleError(res, error, 'Failed to update admin settings')
  }
})

app.get('/api/articles', async (req, res) => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const sort = req.query.sort === 'published_at' ? 'published_at' : 'created_at'
    const order: Prisma.SortOrder = req.query.order === 'asc' ? 'asc' : 'desc'
    const limit = parseLimit(req.query.limit)

    const where: Prisma.ArticleWhereInput = {}
    if (status) where.status = status

    const orderBy = sort === 'published_at' ? { published_at: order } : { created_at: order }

    const articles = await prisma.article.findMany({
      where,
      orderBy,
      take: limit,
    })

    res.json({ data: articles })
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
    const limit = parseLimit(req.query.limit)

    if (status) where.status = status
    if (showType) where.show_type = showType
    if (category) where.categories = { has: category }
    if (featured !== undefined) where.featured = featured

    const episodes = await prisma.podcastEpisode.findMany({
      where,
      orderBy: { publish_date: 'desc' },
      take: limit,
    })

    res.json({ data: episodes })
  } catch (error) {
    handleError(res, error, 'Failed to fetch episodes')
  }
})

app.get('/api/blogs', async (req, res) => {
  try {
    const where: Prisma.BlogPostWhereInput = {}
    const status = typeof req.query.status === 'string' ? req.query.status : undefined
    const category = typeof req.query.category === 'string' ? req.query.category : undefined
    const featured = parseBoolean(req.query.featured)
    const limit = parseLimit(req.query.limit)

    if (status) where.status = status
    if (category) where.category = category
    if (featured !== undefined) where.featured = featured

    const posts = await prisma.blogPost.findMany({
      where,
      orderBy: { published_at: 'desc' },
      take: limit,
    })

    res.json({ data: posts })
  } catch (error) {
    handleError(res, error, 'Failed to fetch blog posts')
  }
})

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    })

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' })
    }

    res.json({ data: post })
  } catch (error) {
    handleError(res, error, 'Failed to fetch blog post')
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

    if (!email) {
      return res.status(400).json({ error: 'email is required' })
    }

    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: {
        name: name || undefined,
        preferences: typeof preferences === 'object' && preferences !== null ? preferences : {},
        subscription_status: 'active',
      },
      create: {
        email,
        name: name || null,
        preferences: typeof preferences === 'object' && preferences !== null ? preferences : {},
        subscription_status: 'active',
        unsubscribe_token: randomUUID(),
      },
    })

    res.status(201).json({
      data: {
        message: 'You are subscribed to the AIRAB Money newsletter.',
        status: 'success',
        subscriber_id: subscriber.id,
      },
    })
  } catch (error) {
    handleError(res, error, 'Failed to subscribe to newsletter')
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

app.get('/api/market-data', (_req, res) => {
  res.json({
    success: true,
    updatedAt: new Date().toISOString(),
    data: [
      { symbol: 'TASI', name: 'Saudi Tadawul Index', price: 12294.18, change: 74.22, changePercent: 0.61, type: 'middleeast' },
      { symbol: 'DFMGI', name: 'Dubai Financial Market', price: 4318.57, change: -12.09, changePercent: -0.28, type: 'middleeast' },
      { symbol: 'ADX', name: 'Abu Dhabi Securities Exchange', price: 9398.12, change: 21.88, changePercent: 0.23, type: 'middleeast' },
      { symbol: 'BTC', name: 'Bitcoin', price: 84215.33, change: 1365.18, changePercent: 1.65, type: 'crypto' },
      { symbol: 'ETH', name: 'Ethereum', price: 4021.61, change: -48.42, changePercent: -1.19, type: 'crypto' },
      { symbol: 'XAU', name: 'Gold', price: 2364.2, change: 18.41, changePercent: 0.78, type: 'commodity' },
      { symbol: 'BRENT', name: 'Brent Crude', price: 88.12, change: -0.57, changePercent: -0.64, type: 'commodity' },
      { symbol: 'SPX', name: 'S&P 500', price: 5281.48, change: 22.91, changePercent: 0.44, type: 'index' },
    ],
  })
})

app.post('/api/generate-article', requireAdminAuth, async (req, res) => {
  try {
    const topic = typeof req.body.topic === 'string' ? req.body.topic.trim() : ''
    const wordCount = Number(req.body.word_count) || 750
    const style = typeof req.body.style === 'string' ? req.body.style : 'Professional'

    if (!topic) {
      return res.status(400).json({ error: 'topic is required' })
    }

    const { client: openai, config } = await getOpenAIClient()

    if (!openai) {
      const fallback = buildFallbackArticle(topic, wordCount, style)
      return res.json({
        headline: fallback.headline,
        content: fallback.content,
        fallback: true,
      })
    }

    const completion = await openai.chat.completions.create({
      model: config.textModel,
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

    const { client: openai, config } = await getOpenAIClient()

    if (!openai) {
      return res.json({ data: fallbackImagePrompts(headline) })
    }

    const completion = await openai.chat.completions.create({
      model: config.textModel,
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

    const { client: openai, config } = await getOpenAIClient()

    if (!openai) {
      return res.json({
        data: {
          imageUrl: buildPlaceholderImage(prompt, imageType),
          fallback: true,
        },
      })
    }

    const image = await openai.images.generate({
      model: config.imageModel,
      prompt,
      size: imageType === 'hero' ? '1536x1024' : '1024x1024',
      output_format: 'png',
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
