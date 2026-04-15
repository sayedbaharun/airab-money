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
    headline: 'NEOM Unveils $500 Billion AI Infrastructure Initiative',
    content: 'Saudi Arabia\'s futuristic city NEOM announces the largest AI infrastructure investment in Middle East history, positioning the region as a global AI hub.',
    summary: 'NEOM launches an unprecedented AI infrastructure program, underscoring how capital, compute, and state strategy are converging in the region.',
    category: 'Infrastructure',
    tags: ['NEOM', 'Saudi Arabia', 'Investment', 'AI Infrastructure'],
    status: 'published',
    published_at: '2026-04-15',
    created_at: '2026-04-15',
  },
  {
    id: 'sec-1',
    headline: 'UAE AI Regulation Framework Approved',
    content: 'Dubai introduces a comprehensive AI governance framework.',
    summary: 'Dubai moves from policy signaling to operating rules, giving founders and investors a clearer regulatory baseline.',
    category: 'Policy',
    tags: ['UAE', 'AI Regulation', 'Dubai'],
    status: 'published',
    published_at: '2026-04-14',
    created_at: '2026-04-14',
  },
  {
    id: 'sec-2',
    headline: 'G42 Secures $2B Investment for AI Research',
    content: 'Abu Dhabi-based G42 receives major investment backing.',
    summary: 'Fresh capital into G42 suggests the region is still prioritizing long-horizon AI capacity over short-term noise.',
    category: 'Capital',
    tags: ['G42', 'Abu Dhabi', 'Investment'],
    status: 'published',
    published_at: '2026-04-13',
    created_at: '2026-04-13',
  },
  {
    id: 'sec-3',
    headline: 'Saudi Aramco AI Integration Complete',
    content: 'Aramco completes one of the sector\'s largest AI rollouts.',
    summary: 'Industrial AI is becoming less speculative and more operational, especially where scale advantages already exist.',
    category: 'Industry',
    tags: ['Aramco', 'Saudi Arabia', 'AI'],
    status: 'published',
    published_at: '2026-04-12',
    created_at: '2026-04-12',
  },
  {
    id: 'sec-4',
    headline: 'Middle East AI Talent Pool Expands',
    content: 'Regional universities graduate record numbers of AI specialists.',
    summary: 'The talent story is gradually catching up to the capital story, which matters more than headline funding rounds alone.',
    category: 'Talent',
    tags: ['Education', 'AI', 'Talent'],
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
          content="AIRAB Money is a dark editorial desk covering AI infrastructure, policy, markets, and regional technology developments across the Arab world."
        />
      </Helmet>

      <PageIntro
        eyebrow="AIRAB Money / Front page"
        title="Markets, policy, and the infrastructure story behind AI in the Arab world."
        description="AIRAB Money is built like a newsroom terminal: less noise, more signal. We track the market implications of AI across capital, policy, founders, and state-scale infrastructure in the region."
        actions={
          <>
            <Link to="/articles" className="rose-button">
              <Newspaper size={16} />
              Open latest coverage
            </Link>
            <Link to="/markets" className="ghost-button">
              <TrendingUp size={16} />
              Watch live markets
            </Link>
          </>
        }
        metrics={[
          { label: 'Coverage lanes', value: '04' },
          { label: 'Live desks', value: 'GCC' },
          { label: 'Publishing rhythm', value: 'Daily' },
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
                The AIRAB front page prioritizes the stories that shape allocation decisions and policy positioning, not just headline novelty.
              </p>
            </div>

            <div className="editorial-panel p-6">
              <div className="flex items-center justify-between">
                <div className="eyebrow">Latest audio</div>
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
                          {episode.guest_name ? `with ${episode.guest_name}` : `${episode.duration_minutes} minute program`}
                        </div>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-sm leading-7 text-brushed-silver">Episodes will appear here as the program archive expands.</p>
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
            <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">Latest coverage</h2>
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
