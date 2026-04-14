import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Tag, ArrowLeft, Share2, Bookmark } from 'lucide-react'
import { Article, getArticle } from '../lib/api'

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      if (!id) {
        setError('Article not found')
        setLoading(false)
        return
      }

      try {
        const data = await getArticle(id)
        setArticle(data)
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Article not found')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

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

  // Extract company name from URL domain
  const getCompanyNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url)
      let domain = urlObj.hostname.replace(/^www\./, '')
      
      // Remove TLD and get the main domain part
      const parts = domain.split('.')
      if (parts.length > 0) {
        // Capitalize first letter
        domain = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
        
        // Handle special cases
        const specialCases: Record<string, string> = {
          'microsoft': 'Microsoft',
          'google': 'Google',
          'amazon': 'Amazon',
          'nvidia': 'NVIDIA',
          'openai': 'OpenAI',
          'anthropic': 'Anthropic',
          'meta': 'Meta',
          'apple': 'Apple',
          'tesla': 'Tesla',
          'g42': 'G42',
          'tii': 'TII',
          'aws': 'AWS',
          'hub71': 'Hub71'
        }
        
        return specialCases[domain.toLowerCase()] || domain
      }
      return domain
    } catch {
      return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-32 rounded mb-8"></div>
            <div className="bg-gray-200 h-12 w-3/4 rounded mb-4"></div>
            <div className="bg-gray-200 h-96 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-4 rounded"></div>
              <div className="bg-gray-200 h-4 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <>
        <Helmet>
          <title>Article Not Found - AIRAB Money</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been removed.</p>
            <Link to="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{article.headline} - AIRAB Money</title>
        <meta name="description" content={article.summary} />
        <meta name="keywords" content={article.tags?.join(', ') || article.category} />
      </Helmet>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <Link to="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </header>

      {/* Article Content */}
      <article className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Category & Date */}
            <div className="flex items-center gap-4 mb-6">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                {article.category}
              </span>
              <span className="flex items-center text-gray-500 text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.published_at)}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {article.headline}
            </h1>

            {/* Summary */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {article.summary}
            </p>

            {/* Featured Image */}
            {article.image_url && (
              <div className="mb-10">
                <img 
                  src={article.image_url} 
                  alt={article.headline}
                  className="w-full rounded-xl shadow-lg"
                />
              </div>
            )}

            {/* AI Generated Badge & Original Source */}
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium">
                AI Generated
              </div>
              {article.article_url && (
                <div className="mt-3">
                  <span className="text-gray-600">Original Article: </span>
                  <a 
                    href={article.article_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {getCompanyNameFromUrl(article.article_url)}
                  </a>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                {article.content}
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Source */}
              {article.source_name && (
                <div className="mt-6 text-sm text-gray-500">
                  <p>Source: {article.source_name === 'seed_data' ? 'AI Generated' : article.source_name}</p>
                  {article.article_url && (
                    <a 
                      href={article.article_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Original Article
                    </a>
                  )}
                </div>
              )}

              {/* Share & Bookmark */}
              <div className="mt-8 pt-8 border-t border-gray-200 flex gap-4">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                  <Bookmark className="w-4 h-4 mr-2" />
                  Save
                </button>
              </div>
            </div>

            {/* Back to Articles */}
            <div className="mt-10 text-center">
              <Link to="/articles" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                View All Articles
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export default ArticleDetailPage
