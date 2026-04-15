import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import ArticleGrid from '../components/ArticleGrid'
import HeroFeatureCard from '../components/HeroFeatureCard'
import PageIntro from '../components/PageIntro'
import { Article, getArticles } from '../lib/api'

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getArticles({
          status: 'published',
          sort: 'published_at',
          order: 'desc',
          limit: 24,
        })

        setArticles(data || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const featuredArticle = articles[0] || null
  const archiveArticles = featuredArticle ? articles.filter((article) => article.id !== featuredArticle.id) : articles

  const categories = useMemo(() => {
    return ['all', ...Array.from(new Set(archiveArticles.map((article) => article.category).filter(Boolean)))]
  }, [archiveArticles])

  const filteredArticles = archiveArticles.filter((article) => {
    const matchesSearch =
      article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const showFeatured = featuredArticle && selectedCategory === 'all' && searchTerm.trim().length === 0

  return (
    <>
      <Helmet>
        <title>Latest Coverage | AIRAB Money</title>
        <meta
          name="description"
          content="Browse AIRAB Money's archive of Gulf AI capital deployment, cross-border investment, compute build-out, and policy files across the Middle East."
        />
      </Helmet>

      <PageIntro
        eyebrow="Coverage archive"
        title="AI capital and infrastructure files from the AIRAB desk."
        description="Every story in one place, with the lead file pinned at the top. Search for Gulf fund deployment, regional compute build-out, company formation, and policy changes affecting AI execution."
        actions={
          <Link to="/markets" className="ghost-button">
            Open market tape
          </Link>
        }
        metrics={[
          { label: 'Published files', value: String(articles.length).padStart(2, '0') },
          { label: 'Active categories', value: String(categories.length - 1).padStart(2, '0') },
          { label: 'Archive mode', value: 'Live' },
        ]}
      />

      <section className="editorial-page pt-0">
        <div className="editorial-panel space-y-5 p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brushed-silver/45" />
              <input
                type="text"
                placeholder="Search capital, compute, companies, or policy"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="field-dark pl-11"
              />
            </div>
            <div className="text-sm text-brushed-silver">
              {filteredArticles.length} result{filteredArticles.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors ${
                  selectedCategory === category
                    ? 'border-dusk-rose/50 bg-dusk-rose/10 text-off-white'
                    : 'border-white/10 text-brushed-silver hover:border-dusk-rose/30 hover:text-off-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {showFeatured ? (
        <section className="editorial-page pt-0">
          <HeroFeatureCard
            headline={featuredArticle.headline}
            summary={featuredArticle.summary}
            imageUrl={featuredArticle.image_url || featuredArticle.hero_image_url}
            articleId={featuredArticle.id}
            category={featuredArticle.category}
            publishedAt={featuredArticle.published_at}
          />
        </section>
      ) : null}

      <section className="editorial-page pt-0">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="editorial-panel h-72 animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        ) : filteredArticles.length > 0 ? (
          <ArticleGrid articles={filteredArticles} />
        ) : (
          <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
            <div className="eyebrow">No match</div>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">Nothing surfaced in the archive.</h2>
            <p className="mx-auto mt-4 max-w-xl text-brushed-silver">
              Try a broader search term or switch back to all categories to reopen the full newsroom view.
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default ArticlesPage
