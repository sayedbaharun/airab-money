import React from 'react'
import { ArrowRight, Calendar, User } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Article {
  id: string
  headline: string
  summary: string
  category?: string
  published_at?: string | null
  author?: string
  image_url?: string
  hero_image_url?: string
}

interface ArticleGridProps {
  articles: Article[]
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {articles.map((article, index) => {
        const coverImage = article.hero_image_url || article.image_url

        return (
        <Link key={article.id} to={`/article/${article.id}`} className="group editorial-panel overflow-hidden transition-colors hover:border-dusk-rose/30">
          {coverImage ? (
            <div className="aspect-[16/10] overflow-hidden border-b border-white/5">
              <img
                src={coverImage}
                alt={article.headline}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
          ) : null}

          <div className="space-y-5 p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-3">
                {article.category ? <div className="eyebrow">{article.category}</div> : null}
                <h3 className="font-serif text-2xl leading-tight tracking-[-0.04em] text-off-white">{article.headline}</h3>
              </div>
              <div className="font-serif text-3xl tracking-[-0.05em] text-brushed-silver/30">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>

            <p className="line-clamp-3 text-sm leading-7 text-brushed-silver">{article.summary}</p>

            <div className="flex flex-wrap items-center gap-4 border-t border-white/5 pt-4 text-xs uppercase tracking-[0.22em] text-brushed-silver/65">
              {article.published_at ? (
                <span className="inline-flex items-center gap-2">
                  <Calendar size={14} className="text-dusk-rose" />
                  {new Date(article.published_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              ) : null}
              {article.author ? (
                <span className="inline-flex items-center gap-2">
                  <User size={14} className="text-dusk-rose" />
                  {article.author}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-2 text-off-white">
                Read
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>
        )
      })}
    </div>
  )
}

export default ArticleGrid
