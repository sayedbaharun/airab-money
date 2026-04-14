import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Tag, ArrowRight, Search, Filter } from 'lucide-react'
import { Article, getArticles } from '../lib/api'

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)

  const categories = ['all', 'AI', 'Technology', 'Finance', 'Healthcare', 'Investment']

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await getArticles({
          status: 'published',
          sort: 'published_at',
          order: 'desc',
          limit: 20,
        })

        const data = response.data || []
        if (data.length > 0) {
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
    const colors: Record<string, string> = {
      'AI': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-purple-100 text-purple-800',
      'Finance': 'bg-green-100 text-green-800',
      'Healthcare': 'bg-red-100 text-red-800',
      'Investment': 'bg-amber-100 text-amber-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <Helmet>
        <title>AI News from the Middle East - AIRAB Money</title>
        <meta name="description" content="Latest AI news, insights, and developments from across the Middle East and GCC region. Stay informed with AIRAB Money." />
        <meta name="keywords" content="AI news, Middle East, GCC, artificial intelligence, technology, UAE, Saudi Arabia" />
      </Helmet>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">AIRAB Money</h1>
              <p className="text-gray-500 mt-1">AI News from the Middle East</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-64"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-8">
              <span className="inline-block bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Featured
              </span>
            </div>
            <div className="max-w-4xl mx-auto">
              <a href={`/article/${featuredArticle.id}`} className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center overflow-hidden">
                    {featuredArticle.image_url ? (
                      <img 
                        src={featuredArticle.image_url} 
                        alt={featuredArticle.headline}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-center p-8">
                        <Tag className="w-16 h-16 mx-auto mb-4 opacity-80" />
                        <p className="text-lg font-medium">AI News</p>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(featuredArticle.category)}`}>
                          {featuredArticle.category}
                        </span>
                        <span className="flex items-center text-gray-500 text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(featuredArticle.published_at)}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                        {featuredArticle.headline}
                      </h2>
                      <p className="text-gray-600 leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                      <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mt-2">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest News</h2>
            <p className="text-gray-600">Stay updated with the latest AI developments across the Middle East</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                  <div className="bg-gray-200 h-40 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link to={`/article/${article.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center overflow-hidden">
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
                        <span className="flex items-center text-gray-500 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(article.published_at)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {article.headline}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {article.summary}
                      </p>
                      <span className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm mt-2">
                        Read More
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Try adjusting your search or filters.'
                  : 'New articles coming soon!'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AIRAB Money</h3>
              <p className="text-gray-400 leading-relaxed">
                Your trusted source for AI news and insights from the Middle East and GCC region.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: info@airabmoney.com</li>
                <li>Phone: +971 4 123 4567</li>
                <li>Dubai, United Arab Emirates</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; 2026 AIRAB Money. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default ArticlesPage
