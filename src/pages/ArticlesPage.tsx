import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Tag, ArrowRight, Search, Filter } from 'lucide-react'
import { Article, getArticles } from '../lib/api'

function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)

  const categories = ['all', 'AI', 'Technology', 'Finance', 'Healthcare', 'Investment']

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
        // Fallback data
        const fallbackArticles: Article[] = [
          {
            id: '1',
            headline: 'Microsoft Launches AI Research Hub in Dubai, Fueling $1 Billion Middle East Investment',
            content: 'In a strategic move to bolster its presence in the Gulf, Microsoft has unveiled a cutting-edge AI research and development center in Dubai, marking the cornerstone of a sweeping $1 billion investment across the Middle East.',
            summary: 'Microsoft opens AI research center in Dubai as part of $1B Middle East investment',
            category: 'AI',
            tags: ['Microsoft', 'Dubai', 'Investment'],
            status: 'published',
            published_at: '2026-03-27',
            created_at: '2026-03-27'
          },
          {
            id: '2',
            headline: 'UAE\'s G42 and Microsoft Join Forces with $1 Billion AI Infrastructure Fund',
            content: 'In a groundbreaking move to transform the Middle East\'s technological landscape, Abu Dhabi-based G42 and Microsoft have announced a strategic partnership to establish a $1 billion AI infrastructure fund.',
            summary: 'G42 and Microsoft partner on $1B AI infrastructure fund for Middle East',
            category: 'AI',
            tags: ['G42', 'Microsoft', 'UAE'],
            status: 'published',
            published_at: '2026-03-27',
            created_at: '2026-03-27'
          },
          {
            id: '3',
            headline: 'Saudi Arabia Unveils Ambitious $10 Billion AI Initiative to Lead Global AI Innovation',
            content: 'Saudi Arabia is making a significant stride toward becoming a global leader in artificial intelligence with the launch of a $10 billion AI initiative.',
            summary: 'Saudi Arabia launches $10B AI initiative through Public Investment Fund',
            category: 'AI',
            tags: ['Saudi Arabia', 'AI', 'Vision 2030'],
            status: 'published',
            published_at: '2026-03-27',
            created_at: '2026-03-27'
          },
          {
            id: '4',
            headline: 'Google Cloud\'s Ambitious AI Skills Program Targets 1 Million Learners in the Middle East',
            content: 'In a bold move to bolster the Middle East\'s digital economy, Google Cloud has announced a $50 million initiative aimed at training one million residents in AI skills across the region.',
            summary: 'Google Cloud launches AI skills program for 1 million Middle East residents',
            category: 'AI',
            tags: ['Google Cloud', 'Training', 'Skills'],
            status: 'published',
            published_at: '2026-03-27',
            created_at: '2026-03-27'
          },
          {
            id: '5',
            headline: 'AI Surge: Abu Dhabi\'s Hub71-Backed Startup Secures $50 Million in Series B Funding',
            content: 'In a significant boost to the Middle East\'s burgeoning tech landscape, an AI startup backed by Abu Dhabi\'s Hub71 has successfully raised $50 million in a Series B funding round.',
            summary: 'Hub71 Abu Dhabi-backed AI startup raises $50M Series B funding',
            category: 'AI',
            tags: ['Hub71', 'Startup', 'Funding'],
            status: 'published',
            published_at: '2026-03-27',
            created_at: '2026-03-27'
          }
        ]
        setFeaturedArticle(fallbackArticles[0])
        setArticles(fallbackArticles.slice(1))
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
    const colors: { [key: string]: string } = {
      'AI': 'bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30',
      'Technology': 'bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30',
      'Finance': 'bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30',
      'Healthcare': 'bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30',
      'Investment': 'bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30'
    }
    return colors[category] || 'bg-charcoal text-brushed-silver border border-white/5'
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
    <React.Fragment>
      <Helmet>
        <title>AI News from the Middle East - AIRAB Money</title>
        <meta name="description" content="Latest AI news, insights, and developments from across the Middle East and GCC region. Stay informed with AIRAB Money." />
        <meta name="keywords" content="AI news, Middle East, GCC, artificial intelligence, technology, UAE, Saudi Arabia" />
      </Helmet>

      {/* Header */}
      <header className="bg-charcoal border-b border-white/5">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-off-white">AIRAB Money</h1>
              <p className="text-brushed-silver mt-1">AI News from the Middle East</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brushed-silver w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-white/5 rounded-lg focus:border-dusk-rose text-sm w-64"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-white/5 rounded-lg focus:border-dusk-rose text-sm"
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
        <section className="py-12 bg-graphite">
          <div className="container-custom">
            <div className="text-center mb-8">
              <span className="inline-block bg-dusk-rose text-off-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Featured
              </span>
            </div>
            <div className="max-w-4xl mx-auto">
              <Link to={`/article/${featuredArticle.id}`} className="block bg-charcoal rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="aspect-video md:aspect-auto bg-gradient-to-br from-dusk-rose flex items-center justify-center overflow-hidden">
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
                        <span className="flex items-center text-brushed-silver text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(featuredArticle.published_at)}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-off-white leading-tight">
                        {featuredArticle.headline}
                      </h2>
                      <p className="text-brushed-silver leading-relaxed">
                        {featuredArticle.summary}
                      </p>
                      <span className="inline-flex items-center text-dusk-rose hover:text-brushed-silver font-medium mt-2">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Latest News Grid */}
      <section className="py-12">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-off-white mb-2">Latest News</h2>
            <p className="text-brushed-silver">Stay updated with the latest AI developments across the Middle East</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-charcoal rounded-lg p-6 animate-pulse">
                  <div className="bg-charcoal h-40 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-charcoal h-4 rounded"></div>
                    <div className="bg-charcoal h-4 rounded w-3/4"></div>
                    <div className="bg-charcoal h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article) => (
                <Link to={`/article/${article.id}`} className="block bg-charcoal rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-dusk-rose flex items-center justify-center overflow-hidden">
                    {article.image_url ? (
                      <img 
                        src={article.image_url} 
                        alt={article.headline}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Tag className="w-12 h-12 text-off-white opacity-60" />
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
                        <ArrowRight className="w-3 h-3 ml-1" />
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
      </section>

      {/* Footer */}
      <footer className="bg-graphite text-off-white py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AIRAB Money</h3>
              <p className="text-brushed-silver leading-relaxed">
                Your trusted source for AI news and insights from the Middle East and GCC region.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-brushed-silver hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-brushed-silver hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="text-brushed-silver hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-brushed-silver">
                <li>Email: info@airabmoney.com</li>
                <li>Phone: +971 4 123 4567</li>
                <li>Dubai, United Arab Emirates</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-8 text-center text-brushed-silver text-sm">
            <p>&copy; 2026 AIRAB Money. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default ArticlesPage;
