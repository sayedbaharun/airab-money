import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

interface HeroFeatureCardProps {
  headline: string
  summary: string
  imageUrl?: string
  articleId: string
  category?: string
  publishedAt?: string
}

const HeroFeatureCard: React.FC<HeroFeatureCardProps> = ({
  headline,
  summary,
  imageUrl,
  articleId,
  category,
  publishedAt
}) => {
  return (
    <div className="bg-graphite border border-white/5 overflow-hidden mb-12">
      <Link to={`/article/${articleId}`} className="block hover:opacity-95 transition-opacity">
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Image Section (60%) */}
          <div className="lg:col-span-3 relative h-64 lg:h-96">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={headline}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-dusk-rose/20 to-graphite flex items-center justify-center">
                <div className="text-dusk-rose/40 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z"/>
                    </svg>
                  </div>
                  <p className="text-sm font-medium">AI News</p>
                </div>
              </div>
            )}

            {/* Category Badge */}
            {category && (
              <div className="absolute top-4 left-4 bg-dusk-rose/90 text-off-white px-3 py-1 text-xs uppercase tracking-widest rounded-sm">
                {category}
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-graphite/50 via-transparent to-transparent" />
          </div>

          {/* Content Section (40%) */}
          <div className="lg:col-span-2 p-8 flex flex-col justify-center">
            <div className="space-y-4">
              {/* Metadata */}
              {publishedAt && (
                <div className="text-brushed-silver text-xs uppercase tracking-widest">
                  {new Date(publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}

              {/* Headline */}
              <h2 className="text-2xl lg:text-3xl font-serif font-bold text-off-white leading-tight">
                {headline}
              </h2>

              {/* Summary */}
              <p className="text-brushed-silver leading-relaxed text-sm lg:text-base">
                {summary}
              </p>

              {/* CTA */}
              <div className="pt-4">
                <span className="inline-flex items-center space-x-2 text-dusk-rose font-semibold tracking-wide hover:text-brushed-silver transition-colors">
                  <span>READ MORE</span>
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default HeroFeatureCard