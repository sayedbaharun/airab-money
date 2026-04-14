import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Calendar, Clock, User, Tag, Search, Filter, ArrowRight, Eye } from 'lucide-react'
import { BlogPost, getBlogPosts } from '../lib/api'

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)

  const categories = ['all', 'AI News', 'Investment Analysis', 'Technology Deep Dive', 'Market Insights', 'Regional Focus', 'Startup Spotlight']

  useEffect(() => {
    async function fetchPosts() {
      try {
        const featured = await getBlogPosts({
          status: 'published',
          featured: true,
          limit: 1,
        })

        if (featured && featured.length > 0) {
          setFeaturedPost(featured[0])
        }

        let filteredData = await getBlogPosts({
          status: 'published',
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
        })
        
        if (searchTerm) {
          filteredData = filteredData.filter(post => 
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        
        if (featured[0]) {
          filteredData = filteredData.filter(post => post.id !== featured[0].id)
        }
        
        setPosts(filteredData)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [selectedCategory, searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'AI News': 'bg-blue-100 text-blue-800',
      'Investment Analysis': 'bg-green-100 text-green-800',
      'Technology Deep Dive': 'bg-purple-100 text-purple-800',
      'Market Insights': 'bg-amber-100 text-amber-800',
      'Regional Focus': 'bg-emerald-100 text-emerald-800',
      'Startup Spotlight': 'bg-pink-100 text-pink-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <>
      <Helmet>
        <title>AI Intelligence Blog - AIRAB Money Insights & Analysis</title>
        <meta name="description" content="Read the latest insights on AI developments, investment analysis, and technology trends across the Arab world and GCC region from AIRAB Money experts." />
        <meta name="keywords" content="AI blog, Arab world technology, GCC innovation, AI investments, technology analysis, startup insights" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-brand text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              AI Intelligence Blog
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Deep insights, expert analysis, and the latest developments in AI across 
              the Arab world and beyond
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles, topics, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-500 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      </section>

      {/* Featured Article */}
      {featuredPost && (
        <section className="py-16">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Article</h2>
              <p className="text-gray-600">Our editors' pick for must-read content</p>
            </div>
            
            <div className="max-w-6xl mx-auto">
              <div className="card overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div className="aspect-video lg:aspect-square bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                    {featuredPost.featured_image_url ? (
                      <img 
                        src={featuredPost.featured_image_url} 
                        alt={featuredPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-center p-8">
                        <Tag className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-xl font-semibold">Featured Article</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="space-y-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(featuredPost.category)}`}>
                        {featuredPost.category}
                      </span>
                      
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                        {featuredPost.title}
                      </h3>
                      
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {featuredPost.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            <span>{featuredPost.author_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{formatDate(featuredPost.published_at)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{featuredPost.estimated_read_time} min read</span>
                          </div>
                        </div>
                      </div>
                      
                      <button className="btn-primary inline-flex items-center mt-6">
                        Read Full Article
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Latest Articles</h2>
            <p className="text-gray-600">Stay updated with our latest insights and analysis</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="card overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    {post.featured_image_url ? (
                      <img 
                        src={post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Tag className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            <span>{post.author_name}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{post.estimated_read_time} min</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          <span>{post.view_count}</span>
                        </div>
                      </div>
                      
                      <div className="pt-3">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'New articles coming soon! Subscribe to our newsletter to be notified.'}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default BlogPage
