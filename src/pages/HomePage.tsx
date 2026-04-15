import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Headphones, Newspaper, TrendingUp } from 'lucide-react'
import ArticleGrid from '../components/ArticleGrid'
import HeroFeatureCard from '../components/HeroFeatureCard'
import MarketDataWidget from '../components/MarketDataWidget'
import PageIntro from '../components/PageIntro'
import { Article, PodcastEpisode, getArticles, getEpisodes, getMarketData, type MarketData } from '../lib/api'

const fallbackArticles: Article[] = [
  {
    id: 'featured-1',
    headline: 'MGX Expands US Compute Exposure as Gulf Capital Pushes Deeper Into AI Infrastructure',
    content: 'Abu Dhabi-linked capital deepens its international AI infrastructure exposure, reinforcing the Gulf\'s role as a strategic allocator in the global compute race.',
    summary: 'The important signal is not just another AI deal. It is that Gulf capital is becoming a repeat buyer of the infrastructure layer behind global model development.',
    category: 'Outbound capital',
    tags: ['MGX', 'Abu Dhabi', 'Compute', 'AI Infrastructure'],
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
    status: 'published',
    published_at: '2026-04-11',
    created_at: '2026-04-11',
  },
]

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
            limit: 6,
          }).catch(() => fallbackArticles),
          getEpisodes({
            status: 'published',
            limit: 3,
          }).catch(() => []),
          getMarketData().catch(() => null),
        ])

        const resolvedArticles = articleData.length > 0 ? articleData : fallbackArticles
        setFeaturedArticle(resolvedArticles[0])
        setSecondaryArticles(resolvedArticles.slice(1))
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
          <div className="h-20 w-4/5 bg-white/10" />
          <div className="h-[24rem] bg-white/10" />
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>AIRAB Money | Editorial Data Desk</title>
        <meta
          name="description"
          content="AIRAB Money tracks how Middle Eastern capital is deployed into AI globally and how AI companies, compute, and infrastructure are being financed across the region."
        />
      </Helmet>

      <PageIntro
        eyebrow="AIRAB Money / Front page"
        title="Tracking where Middle Eastern AI capital goes and what it builds at home."
        description="AIRAB Money is built like a newsroom terminal: less noise, more signal. We cover Gulf and wider Middle Eastern capital flowing into global AI, plus the companies, compute, and policy infrastructure taking shape across the region."
        actions={
          <>
            <Link to="/articles" className="rose-button">
              <Newspaper size={16} />
              Open latest coverage
            </Link>
            <Link to="/markets" className="ghost-button">
              <TrendingUp size={16} />
              Watch market tape
            </Link>
          </>
        }
        metrics={[
          { label: 'Core lanes', value: '04' },
          { label: 'Regional lens', value: 'GCC+' },
          { label: 'Briefing cadence', value: 'Daily' },
        ]}
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.18fr)_20rem]">
          <div>
            {featuredArticle ? (
              <HeroFeatureCard
                headline={featuredArticle.headline}
                summary={featuredArticle.summary}
                imageUrl={featuredArticle.image_url || featuredArticle.hero_image_url}
                articleId={featuredArticle.id}
                category={featuredArticle.category}
                publishedAt={featuredArticle.published_at}
              />
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="editorial-panel p-6">
              <div className="eyebrow">Desk note</div>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">
                The AIRAB front page prioritizes fund deployment, compute build-out, and policy decisions that change the region&apos;s AI balance sheet.
              </p>
            </div>

            <div className="editorial-panel p-6">
              <div className="flex items-center justify-between">
                <div className="eyebrow">Latest briefing</div>
                <Link to="/episodes" className="editorial-link">
                  Archive
                </Link>
              </div>

              <div className="mt-5 space-y-4">
                {episodes.length > 0 ? (
                  episodes.map((episode) => (
                    <div key={episode.id} className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                      <a href={episode.audio_url} target="_blank" rel="noopener noreferrer" className="block space-y-2">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-dusk-rose">
                          <Headphones size={14} />
                          {episode.show_type}
                        </div>
                        <div className="font-serif text-2xl leading-tight tracking-[-0.04em] text-off-white">
                          {episode.title}
                        </div>
                        <div className="text-sm text-brushed-silver">
                          {episode.guest_name ? `with ${episode.guest_name}` : `${episode.duration_minutes} minute briefing`}
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-brushed-silver">Daily AI-presented briefings will appear here as the archive fills out.</p>
                )}
              </div>
            </div>
          </aside>
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
