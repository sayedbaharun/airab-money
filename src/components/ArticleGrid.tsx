import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User } from 'lucide-react'

interface Article {
  id: string
  headline: string
  summary: string
  category?: string
  published_at?: string
  author?: string
  image_url?: string
}

interface ArticleGridProps {
  articles: Article[]
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {articles.map((article) => (
        <Link
          key={article.id}
          to={`/article/${article.id}`}
          className="block group"
        >
          <article className="bg-graphite border border-white/5 hover:border-dusk-rose/30 transition-colors duration-300 overflow-hidden">
            {/* Image */}
            {article.image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={article.image_url}
                  alt={article.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Category */}
              {article.category && (
                <div className="text-dusk-rose text-xs uppercase tracking-widest mb-3">
                  {article.category}
                </div>
              )}

              {/* Headline */}
              <h3 className="text-off-white font-serif font-bold text-lg leading-tight mb-3 group-hover:text-brushed-silver transition-colors">
                {article.headline}
              </h3>

              {/* Summary */}
              <p className="text-brushed-silver text-sm leading-relaxed mb-4 line-clamp-3">
                {article.summary}
              </p>

              {/* Metadata */}
              <div className="flex items-center space-x-4 text-brushed-silver text-xs uppercase tracking-widest">
                {article.published_at && (
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{new Date(article.published_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                  </div>
                )}
                {article.author && (
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{article.author}</span>
                  </div>
                )}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}

export default ArticleGrid