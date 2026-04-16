import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FileText,
  Newspaper,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import ArticleGrid from '../components/ArticleGrid'
import DeskBulletinSignup from '../components/DeskBulletinSignup'
import MarketDataWidget from '../components/MarketDataWidget'
import PageSeo from '../components/PageSeo'
import { Article, getArticles, getMarketData, type MarketData, type MarketFeedMode } from '../lib/api'

const getCompanyNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace(/^www\./, '')
    const [primary] = domain.split('.')

    const specialCases: Record<string, string> = {
      microsoft: 'Microsoft',
      google: 'Google',
      amazon: 'Amazon',
      nvidia: 'NVIDIA',
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      meta: 'Meta',
      apple: 'Apple',
      g42: 'G42',
      mgx: 'MGX',
      hub71: 'Hub71',
    }

    return specialCases[primary.toLowerCase()] || `${primary.charAt(0).toUpperCase()}${primary.slice(1)}`
  } catch {
    return 'Original source'
  }
}

const resolveDate = (value?: string | null) => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const formatDubaiDateTime = (date: Date) =>
  `${new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Dubai',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)} GST`

const formatLongDate = (date: Date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)

const getSourceLabel = (article: Article | null) => {
  if (!article) return 'AIRAB desk'
  if (article.source_name) return article.source_name
  if (article.article_url) return getCompanyNameFromUrl(article.article_url)
  if (article.source_url) return getCompanyNameFromUrl(article.source_url)
  return 'AIRAB desk'
}

const HomePage = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [secondaryArticles, setSecondaryArticles] = useState<Article[]>([])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [marketUpdatedAt, setMarketUpdatedAt] = useState<string | null>(null)
  const [marketFeedMode, setMarketFeedMode] = useState<MarketFeedMode>('snapshot')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const [articleData, marketResponse] = await Promise.all([
          getArticles({
            status: 'published',
            sort: 'published_at',
            order: 'desc',
            limit: 12,
          }).catch(() => []),
          getMarketData().catch(() => null),
        ])

        const leadArticle = articleData[0] || null
        const secondaryPool = articleData
          .filter((article) => article.id !== leadArticle?.id)
          .sort((left, right) => {
            const leftHasImage = Boolean(left.hero_image_url || left.image_url)
            const rightHasImage = Boolean(right.hero_image_url || right.image_url)

            if (leftHasImage === rightHasImage) return 0
            return leftHasImage ? -1 : 1
          })

        setFeaturedArticle(leadArticle)
        setSecondaryArticles(secondaryPool.slice(0, 4))

        if (marketResponse?.success) {
          setMarketData(marketResponse.data)
          setMarketUpdatedAt(marketResponse.updatedAt)
          setMarketFeedMode(marketResponse.feedMode || 'snapshot')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="editorial-page">
        <div className="max-w-5xl animate-pulse space-y-4">
          <div className="h-4 w-32 bg-white/10" />
          <div className="h-24 w-4/5 bg-white/10" />
          <div className="h-[34rem] bg-white/10" />
        </div>
      </div>
    )
  }

  const featuredSourceLabel = getSourceLabel(featuredArticle)
  const featuredPublishedAt = resolveDate(featuredArticle?.published_at || featuredArticle?.created_at)
  const marketFeedUpdatedAt = resolveDate(marketUpdatedAt)

  let deskUpdatedAt: Date | null = null
  for (const candidate of [featuredPublishedAt, marketFeedUpdatedAt]) {
    if (candidate && (!deskUpdatedAt || candidate.getTime() > deskUpdatedAt.getTime())) {
      deskUpdatedAt = candidate
    }
  }

  const trustMarkers = [
    {
      icon: FileText,
      title: 'Source trail',
      value: featuredArticle?.article_url ? 'Original source linked on file' : featuredSourceLabel,
      detail: `Lead story source: ${featuredSourceLabel}`,
    },
    {
      icon: Sparkles,
      title: 'Publishing method',
      value: 'AI-generated, desk reviewed',
      detail: 'Files begin in the AIRAB generation pipeline and are checked before publish.',
    },
    {
      icon: ShieldCheck,
      title: 'Desk update',
      value: deskUpdatedAt ? formatDubaiDateTime(deskUpdatedAt) : 'Awaiting live sync',
      detail: marketFeedUpdatedAt ? `Market tape latest: ${formatDubaiDateTime(marketFeedUpdatedAt)}` : 'Waiting for market refresh.',
    },
  ]

  return (
    <>
      <PageSeo
        title="Editorial Data Desk"
        description="AIRAB Money tracks Gulf AI capital, compute infrastructure, market signals, and the operators turning regional AI ambition into funded execution."
        path="/"
      />

      <section className="editorial-page pb-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="eyebrow">AIRAB Money / Front page</div>
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-brushed-silver/55">
            <span className="h-2 w-2 rounded-full bg-dusk-rose" />
            {deskUpdatedAt ? `Desk updated ${formatDubaiDateTime(deskUpdatedAt)}` : 'Desk sync pending'}
          </div>
        </div>

        <div className="mt-6 grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_0.85fr]">
          {featuredArticle ? (
            <article className="editorial-panel overflow-hidden">
              <div className="relative min-h-[36rem]">
                {featuredArticle.image_url || featuredArticle.hero_image_url ? (
                  <img
                    src={featuredArticle.image_url || featuredArticle.hero_image_url}
                    alt={featuredArticle.headline}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(166,124,116,0.22),transparent_34%),linear-gradient(140deg,#1f1f1f_12%,#171717_58%,#262626_100%)]" />
                )}

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,19,19,0.18)_0%,rgba(19,19,19,0.52)_40%,rgba(11,11,11,0.96)_100%)]" />

                <div className="relative flex min-h-[36rem] flex-col justify-between p-8 md:p-10 xl:p-12">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-2">
                      {featuredArticle.category ? (
                        <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">{featuredArticle.category}</span>
                      ) : null}
                      <span className="data-pill border-white/10 bg-black/20 text-brushed-silver">Lead file</span>
                    </div>
                    <div className="text-xs uppercase tracking-[0.22em] text-brushed-silver/55">Capital, compute, policy</div>
                  </div>

                  <div className="max-w-4xl space-y-6">
                    <div className="space-y-4">
                      <div className="eyebrow">Today&apos;s lead story</div>
                      <h1 className="max-w-4xl font-serif text-4xl leading-[0.92] tracking-[-0.06em] text-off-white md:text-6xl xl:text-[4.75rem]">
                        {featuredArticle.headline}
                      </h1>
                    </div>

                    <p className="max-w-3xl text-lg leading-8 text-brushed-silver md:text-xl md:leading-9">
                      {featuredArticle.summary}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                        <div className="stat-kicker">Source</div>
                        <div className="mt-2 text-sm leading-6 text-off-white">{featuredSourceLabel}</div>
                      </div>
                      <div className="border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                        <div className="stat-kicker">Published</div>
                        <div className="mt-2 text-sm leading-6 text-off-white">
                          {featuredPublishedAt ? formatLongDate(featuredPublishedAt) : 'Awaiting publish'}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/article/${featuredArticle.id}`} className="rose-button">
                        <Newspaper size={16} />
                        Read lead file
                      </Link>
                      <Link to="/markets" className="ghost-button">
                        <TrendingUp size={16} />
                        Watch market tape
                      </Link>
                      {featuredArticle.article_url ? (
                        <a href={featuredArticle.article_url} target="_blank" rel="noopener noreferrer" className="ghost-button">
                          <ArrowUpRight size={16} />
                          Open original source
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <article className="editorial-panel overflow-hidden">
              <div className="relative min-h-[36rem] bg-[radial-gradient(circle_at_top_left,rgba(166,124,116,0.22),transparent_34%),linear-gradient(140deg,#1f1f1f_12%,#171717_58%,#262626_100%)]">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(19,19,19,0.12)_0%,rgba(19,19,19,0.4)_40%,rgba(11,11,11,0.92)_100%)]" />
                <div className="relative flex min-h-[36rem] flex-col justify-between p-8 md:p-10 xl:p-12">
                  <div className="flex flex-wrap gap-2">
                    <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">Soft launch</span>
                    <span className="data-pill border-white/10 bg-black/20 text-brushed-silver">Desk opening</span>
                  </div>

                  <div className="max-w-4xl space-y-6">
                    <div className="space-y-4">
                      <div className="eyebrow">AIRAB Money</div>
                      <h1 className="max-w-4xl font-serif text-4xl leading-[0.92] tracking-[-0.06em] text-off-white md:text-6xl xl:text-[4.75rem]">
                        Tracking Gulf AI money before the market decides the story for you.
                      </h1>
                    </div>

                    <p className="max-w-3xl text-lg leading-8 text-brushed-silver md:text-xl md:leading-9">
                      The desk is soft-launching with a tight scope: selective coverage, the market tape, and the
                      fastest way to subscribe before the archive fills out.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <Link to="/articles" className="rose-button">
                        <Newspaper size={16} />
                        Open coverage
                      </Link>
                      <Link to="/about" className="ghost-button">
                        <ArrowUpRight size={16} />
                        Read the thesis
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          )}

          <div className="space-y-6">
            <DeskBulletinSignup />

            <section className="editorial-panel p-6 md:p-7">
              <div className="eyebrow">Trust markers</div>
              <div className="mt-6 space-y-4">
                {trustMarkers.map((marker) => {
                  const Icon = marker.icon
                  return (
                    <div key={marker.title} className="border border-white/5 bg-white/[0.02] p-4">
                      <div className="flex items-start gap-3">
                        <Icon size={17} className="mt-1 text-dusk-rose" />
                        <div className="space-y-2">
                          <div className="stat-kicker">{marker.title}</div>
                          <div className="text-sm leading-6 text-off-white">{marker.value}</div>
                          <div className="text-sm leading-6 text-brushed-silver">{marker.detail}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Newsroom rotation</div>
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">Latest AI capital files</h2>
          </div>
          <Link to="/articles" className="editorial-link">
            View full archive
          </Link>
        </div>

        {secondaryArticles.length > 0 ? (
          <ArticleGrid articles={secondaryArticles} />
        ) : (
          <div className="editorial-panel mx-auto max-w-3xl p-10 text-center">
            <div className="eyebrow">Archive buildout</div>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">
              The rotation is intentionally tight during the soft launch.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-brushed-silver">
              More files will appear as the desk replaces test content with the first run of real coverage.
            </p>
          </div>
        )}
      </section>

      <section className="editorial-page pt-0">
        <MarketDataWidget marketData={marketData} updatedAt={marketUpdatedAt} feedMode={marketFeedMode} />
      </section>
    </>
  )
}

export default HomePage
