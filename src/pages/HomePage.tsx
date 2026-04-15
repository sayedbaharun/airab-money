import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import Sidebar from '../components/Sidebar'
import HeroFeatureCard from '../components/HeroFeatureCard'
import ArticleGrid from '../components/ArticleGrid'
import MarketDataWidget from '../components/MarketDataWidget'
import { getArticles, Article } from '../lib/api'

const HomePage = () => {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [secondaryArticles, setSecondaryArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      try {
        const data = await getArticles({
          status: 'published',
          sort: 'published_at',
          order: 'desc',
          limit: 7, // 1 featured + 6 grid articles
        })

        if (data && data.length > 0) {
          setFeaturedArticle(data[0])
          setSecondaryArticles(data.slice(1))
        } else {
          // Fallback content
          const fallbackArticle: Article = {
            id: 'featured-1',
            headline: 'NEOM Unveils $500 Billion AI Infrastructure Initiative',
            content: 'Saudi Arabia\'s futuristic city NEOM announces the largest AI infrastructure investment in Middle East history, positioning the region as a global AI hub.',
            summary: 'NEOM launches unprecedented $500B AI infrastructure program, transforming the Middle East\'s technological landscape.',
            category: 'AI',
            tags: ['NEOM', 'Saudi Arabia', 'Investment', 'AI Infrastructure'],
            status: 'published',
            published_at: '2026-04-15',
            created_at: '2026-04-15'
          }

          const fallbackSecondary: Article[] = [
            {
              id: 'sec-1',
              headline: 'UAE AI Regulation Framework Approved',
              content: 'Dubai introduces comprehensive AI governance framework...',
              summary: 'Dubai\'s new AI regulation framework sets global standards for responsible AI development.',
              category: 'Regulation',
              tags: ['UAE', 'AI Regulation', 'Dubai'],
              status: 'published',
              published_at: '2026-04-14',
              created_at: '2026-04-14'
            },
            {
              id: 'sec-2',
              headline: 'G42 Secures $2B Investment for AI Research',
              content: 'Abu Dhabi-based G42 receives major investment...',
              summary: 'G42\'s $2B funding round accelerates AI research initiatives across healthcare and finance.',
              category: 'Investment',
              tags: ['G42', 'Abu Dhabi', 'Investment', 'AI Research'],
              status: 'published',
              published_at: '2026-04-13',
              created_at: '2026-04-13'
            },
            {
              id: 'sec-3',
              headline: 'Saudi Aramco AI Integration Complete',
              content: 'Aramco successfully deploys AI across operations...',
              summary: 'Saudi Aramco completes largest AI integration in energy sector, boosting efficiency by 40%.',
              category: 'Energy',
              tags: ['Aramco', 'Saudi Arabia', 'AI', 'Energy'],
              status: 'published',
              published_at: '2026-04-12',
              created_at: '2026-04-12'
            },
            {
              id: 'sec-4',
              headline: 'Middle East AI Talent Pool Expands',
              content: 'Regional universities graduate record number of AI specialists...',
              summary: 'Middle East universities produce 50% more AI graduates, strengthening regional tech workforce.',
              category: 'Education',
              tags: ['Education', 'AI', 'Middle East', 'Talent'],
              status: 'published',
              published_at: '2026-04-11',
              created_at: '2026-04-11'
            }
          ]

          setFeaturedArticle(fallbackArticle)
          setSecondaryArticles(fallbackSecondary)

          setFeaturedArticle(fallbackArticle)
          setSecondaryArticles(fallbackSecondary)
        }
      } catch (error) {
        console.error('Error fetching content:', error)
        // Use fallback content on error
        setFeaturedArticle({
          id: 'featured-1',
          headline: 'NEOM Unveils $500 Billion AI Infrastructure Initiative',
          content: 'Saudi Arabia\'s futuristic city NEOM announces the largest AI infrastructure investment in Middle East history.',
          summary: 'NEOM launches unprecedented $500B AI infrastructure program, transforming the Middle East\'s technological landscape.',
          category: 'AI',
          tags: ['NEOM', 'Saudi Arabia', 'Investment', 'AI Infrastructure'],
          status: 'published',
          published_at: '2026-04-15',
          created_at: '2026-04-15'
        })
        setSecondaryArticles([])
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-graphite flex items-center justify-center">
        <div className="text-brushed-silver">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Deep Tech Home - AIRAB Money</title>
        <meta name="description" content="AI-powered financial media platform covering Middle East and GCC markets" />
      </Helmet>

      <div className="flex min-h-screen bg-graphite font-sans text-off-white">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="ml-64 p-10 w-full">
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <h1 className="text-3xl font-serif text-brushed-silver">Deep Tech Home</h1>
            <div className="text-sm text-brushed-silver">LIVE • {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Dubai'
            })} GST</div>
          </header>

          {/* Hero Feature Card */}
          {featuredArticle && (
            <HeroFeatureCard
              headline={featuredArticle.headline}
              summary={featuredArticle.summary}
              imageUrl={featuredArticle.image_url}
              articleId={featuredArticle.id}
              category={featuredArticle.category}
              publishedAt={featuredArticle.published_at}
            />
          )}

          {/* Article Grid */}
          {secondaryArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-serif text-brushed-silver mb-6">Latest Coverage</h2>
              <ArticleGrid articles={secondaryArticles} />
            </div>
          )}

          {/* Market Data Widget */}
          <MarketDataWidget />
        </main>
      </div>
    </>
  )
}

export default HomePage