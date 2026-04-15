import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Calendar,
  Clock3,
  FileText,
  Headphones,
  Newspaper,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import ArticleGrid from '../components/ArticleGrid'
import MarketDataWidget from '../components/MarketDataWidget'
import { Article, PodcastEpisode, getArticles, getEpisodes, getMarketData, type MarketData } from '../lib/api'

const fallbackArticles: Article[] = [
  {
    id: 'featured-1',
    headline: 'MGX Expands US Compute Exposure as Gulf Capital Pushes Deeper Into AI Infrastructure',
    content: 'Abu Dhabi-linked capital deepens its international AI infrastructure exposure, reinforcing the Gulf\'s role as a strategic allocator in the global compute race.',
    summary: 'The important signal is not just another AI deal. It is that Gulf capital is becoming a repeat buyer of the infrastructure layer behind global model development.',
    category: 'Outbound capital',
    tags: ['MGX', 'Abu Dhabi', 'Compute', 'AI Infrastructure'],
    source_name: 'MGX',
    status: 'published',
    published_at: '2026-04-15',
    created_at: '2026-04-15',
  },
  {
    id: 'sec-1',
    headline: 'Saudi-Backed Operator Finances New Riyadh Inference Campus',
    content: 'A Saudi-backed operator moves from planning to financing on a new AI compute site in Riyadh.',
    summary: 'This is the kind of regional build-out AIRAB cares about: real money moving into inference capacity, not just high-level national ambition.',
    category: 'Infrastructure',
    tags: ['Saudi Arabia', 'Riyadh', 'Inference', 'Compute'],
    source_name: 'Riyadh operator filing',
    status: 'published',
    published_at: '2026-04-14',
    created_at: '2026-04-14',
  },
  {
    id: 'sec-2',
    headline: 'Qatar-Linked Capital Joins European AI Data Centre Round',
    content: 'A Qatari investor joins a European AI data centre financing round aimed at hyperscale inference demand.',
    summary: 'Outbound deployment matters because it reveals how regional capital wants to own AI exposure across borders, not only within local markets.',
    category: 'Cross-border capital',
    tags: ['Qatar', 'Europe', 'Data Centres', 'Investment'],
    source_name: 'European data centre consortium',
    status: 'published',
    published_at: '2026-04-13',
    created_at: '2026-04-13',
  },
  {
    id: 'sec-3',
    headline: 'Abu Dhabi Capital Takes Position in Foundation-Model Tooling Company',
    content: 'An Abu Dhabi-linked investor backs a tooling company supplying infrastructure to foundation-model teams.',
    summary: 'The Gulf is not only chasing end-user apps. It is increasingly buying into the picks-and-shovels layer around models, deployment, and inference.',
    category: 'Company formation',
    tags: ['Abu Dhabi', 'AI Tooling', 'Capital', 'Models'],
    source_name: 'Abu Dhabi investment office',
    status: 'published',
    published_at: '2026-04-12',
    created_at: '2026-04-12',
  },
  {
    id: 'sec-4',
    headline: 'Dubai Sets New Rules for AI Data Centre Licensing and Grid Access',
    content: 'Dubai tightens the operating framework around new AI data centre projects.',
    summary: 'Policy becomes strategically important once real infrastructure money is on the table. Grid access, permitting, and compliance now affect deployment speed.',
    category: 'Policy',
    tags: ['Dubai', 'Data Centres', 'Policy', 'Grid'],
    source_name: 'Dubai regulatory circular',
    status: 'published',
    published_at: '2026-04-11',
    created_at: '2026-04-11',
  },
]

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
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [marketData, setMarketData] = useState<MarketData[]>([])
  const [marketUpdatedAt, setMarketUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const [articleData, episodeData, marketResponse] = await Promise.all([
          getArticles({
            status: 'published',
            sort: 'published_at',
            order: 'desc',
            limit: 12,
          }).catch(() => fallbackArticles),
          getEpisodes({
            status: 'published',
            limit: 3,
          }).catch(() => []),
          getMarketData().catch(() => null),
        ])

        const resolvedArticles = articleData.length > 0 ? articleData : fallbackArticles
        const leadArticle = resolvedArticles[0] || null
        const secondaryPool = resolvedArticles
          .filter((article) => article.id !== leadArticle?.id)
          .sort((left, right) => {
            const leftHasImage = Boolean(left.hero_image_url || left.image_url)
            const rightHasImage = Boolean(right.hero_image_url || right.image_url)

            if (leftHasImage === rightHasImage) return 0
            return leftHasImage ? -1 : 1
          })

        setFeaturedArticle(leadArticle)
        setSecondaryArticles(secondaryPool.slice(0, 4))
        setEpisodes(episodeData)

        if (marketResponse?.success) {
          setMarketData(marketResponse.data)
          setMarketUpdatedAt(marketResponse.updatedAt)
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
  const featuredBriefing = episodes[0] || null
  const queuedBriefings = episodes.slice(1, 3)
  const featuredBriefingPublishedAt = resolveDate(featuredBriefing?.publish_date)
  const marketFeedUpdatedAt = resolveDate(marketUpdatedAt)

  let deskUpdatedAt: Date | null = null
  for (const candidate of [featuredPublishedAt, featuredBriefingPublishedAt, marketFeedUpdatedAt]) {
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
      <Helmet>
        <title>AIRAB Money | Editorial Data Desk</title>
        <meta
          name="description"
          content="AIRAB Money tracks how Middle Eastern capital is deployed into AI globally and how AI companies, compute, and infrastructure are being financed across the region."
        />
      </Helmet>

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
          ) : null}

          <div className="space-y-6">
            <section className="editorial-panel p-6 md:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="eyebrow">Daily briefing</div>
                  <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">Today&apos;s AI-presented brief</h2>
                </div>
                <Link to="/episodes" className="editorial-link">
                  Archive
                </Link>
              </div>

              {featuredBriefing ? (
                <div className="mt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">{featuredBriefing.show_type}</span>
                      <span className="data-pill">AI presented</span>
                    </div>
                    <h3 className="font-serif text-3xl leading-tight tracking-[-0.04em] text-off-white">
                      {featuredBriefing.title}
                    </h3>
                    <p className="text-sm leading-7 text-brushed-silver">{featuredBriefing.description}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="border border-white/5 bg-white/[0.02] p-4">
                      <div className="stat-kicker">Published</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-off-white">
                        <Calendar size={14} className="text-dusk-rose" />
                        {featuredBriefingPublishedAt ? formatLongDate(featuredBriefingPublishedAt) : 'Awaiting release'}
                      </div>
                    </div>
                    <div className="border border-white/5 bg-white/[0.02] p-4">
                      <div className="stat-kicker">Runtime</div>
                      <div className="mt-2 inline-flex items-center gap-2 text-sm text-off-white">
                        <Clock3 size={14} className="text-dusk-rose" />
                        {featuredBriefing.duration_minutes} minutes
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <a href={featuredBriefing.audio_url} target="_blank" rel="noopener noreferrer" className="rose-button">
                      <Headphones size={16} />
                      Listen now
                    </a>
                    {featuredBriefing.transcript_url ? (
                      <a href={featuredBriefing.transcript_url} target="_blank" rel="noopener noreferrer" className="ghost-button">
                        <FileText size={16} />
                        Open transcript
                      </a>
                    ) : (
                      <Link to="/episodes" className="ghost-button">
                        <ArrowUpRight size={16} />
                        View archive
                      </Link>
                    )}
                  </div>

                  {queuedBriefings.length > 0 ? (
                    <div className="border-t border-white/5 pt-5">
                      <div className="stat-kicker">Also in the briefing queue</div>
                      <div className="mt-4 space-y-3">
                        {queuedBriefings.map((episode) => (
                          <a
                            key={episode.id}
                            href={episode.audio_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 text-sm text-brushed-silver last:border-b-0 last:pb-0"
                          >
                            <span className="leading-6">{episode.title}</span>
                            <span className="whitespace-nowrap text-xs uppercase tracking-[0.18em] text-dusk-rose">
                              {episode.duration_minutes}m
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="text-sm leading-7 text-brushed-silver">
                    The briefing pipeline is ready to turn the day&apos;s article stack into podcast and YouTube-ready output.
                  </p>
                  <Link to="/demo" className="ghost-button">
                    <Sparkles size={16} />
                    Open briefing studio
                  </Link>
                </div>
              )}
            </section>

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

        <ArticleGrid articles={secondaryArticles} />
      </section>

      <section className="editorial-page pt-0">
        <MarketDataWidget marketData={marketData} updatedAt={marketUpdatedAt} />
      </section>
    </>
  )
}

export default HomePage
