import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { Helmet } from 'react-helmet-async'
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react'
import { Article, getArticles } from '../lib/api'

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await getArticles({
          status: 'published',
          sort: 'published_at',
          order: 'desc',
          limit: 20,
        })

        if (data && data.length > 0) {
          setFeaturedArticle(data[0])
          setArticles(data.slice(1))
        }
      } catch (error) {
        console.error('Error fetching articles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    return 'bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30'
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex min-h-screen bg-graphite text-off-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex justify-between items-center mb-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-dusk-rose to-brushed-silver rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">AIRAB Money</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-brushed-silver hover:text-white transition-colors">Home</Link>
              <Link to="/articles" className="text-brushed-silver hover:text-white transition-colors">News</Link>
              <Link to="/markets" className="text-brushed-silver hover:text-white transition-colors">Markets</Link>
            </div>
          </header>

          {loading ? (
            <div className="text-center py-12">
              <Search className="w-8 h-8 text-dusk-rose animate-spin mx-auto mb-4" />
              <p className="text-brushed-silver">Loading articles...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/article/${article.id}`}
                  className="block bg-charcoal rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-white/5"
                >
                  <div className="aspect-video bg-gradient-to-br from-dusk-rose flex items-center justify-center overflow-hidden">
                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.headline}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Tag className="w-12 h-12 text-white opacity-60" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}>
                          {article.category}
                        </span>
                        <span className="flex items-center text-brushed-silver text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(article.published_at)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-off-white line-clamp-2 leading-tight">
                        {article.headline}
                      </h3>
                      <p className="text-brushed-silver text-sm line-clamp-3">
                        {article.summary}
                      </p>
                      <span className="inline-flex items-center text-dusk-rose hover:text-brushed-silver font-medium text-sm mt-2">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-brushed-silver mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-off-white mb-2">No Articles Found</h3>
              <p className="text-brushed-silver">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters.'
                  : 'New articles coming soon!'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ArticlesPage