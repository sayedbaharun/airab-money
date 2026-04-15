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

const fallbackPalettes = [
  ['#6c4b44', '#1b1b1b'],
  ['#8d6a57', '#1f1f1f'],
  ['#5b6d75', '#161616'],
  ['#7b5c72', '#181818'],
]

const buildFallbackCover = (headline: string, category?: string) => {
  const seed = `${headline}${category || ''}`
  const palette = fallbackPalettes[
    Array.from(seed).reduce((total, char) => total + char.charCodeAt(0), 0) % fallbackPalettes.length
  ]
  const title = headline.length > 74 ? `${headline.slice(0, 71)}...` : headline
  const label = (category || 'AI capital file').toUpperCase()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette[0]}" />
          <stop offset="100%" stop-color="${palette[1]}" />
        </linearGradient>
        <linearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(0,0,0,0.08)" />
          <stop offset="100%" stop-color="rgba(0,0,0,0.72)" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#bg)" />
      <circle cx="1260" cy="210" r="230" fill="rgba(255,255,255,0.08)" />
      <circle cx="310" cy="120" r="160" fill="rgba(255,255,255,0.05)" />
      <rect x="0" y="0" width="1600" height="1000" fill="url(#fade)" />
      <rect x="84" y="84" width="190" height="40" rx="20" fill="rgba(255,255,255,0.14)" />
      <text x="112" y="110" fill="#f4efe8" font-family="Georgia, serif" font-size="24" letter-spacing="4">${label}</text>
      <text x="90" y="760" fill="#f4efe8" font-family="Georgia, serif" font-size="74">${title}</text>
      <text x="90" y="900" fill="rgba(244,239,232,0.72)" font-family="Arial, sans-serif" font-size="28" letter-spacing="6">AIRAB MONEY</text>
    </svg>
  `)}`
}

const ArticleGrid: React.FC<ArticleGridProps> = ({ articles }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {articles.map((article, index) => {
        const coverImage = article.hero_image_url || article.image_url || buildFallbackCover(article.headline, article.category)

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
