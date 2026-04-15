import React from 'react'
import { ArrowRight, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeroFeatureCardProps {
  headline: string
  summary: string
  imageUrl?: string
  articleId: string
  category?: string
  publishedAt?: string | null
}

const HeroFeatureCard: React.FC<HeroFeatureCardProps> = ({
  headline,
  summary,
  imageUrl,
  articleId,
  category,
  publishedAt,
}) => {
  return (
    <div className="editorial-panel overflow-hidden">
      <Link to={`/article/${articleId}`} className="grid xl:grid-cols-[minmax(0,1.25fr)_0.95fr]">
        <div className="relative min-h-[20rem] border-b border-white/5 xl:border-b-0 xl:border-r">
          {imageUrl ? (
            <img src={imageUrl} alt={headline} className="h-full w-full object-cover grayscale" />
          ) : (
            <div className="flex h-full min-h-[20rem] items-end bg-[linear-gradient(135deg,rgba(166,124,116,0.22),rgba(37,37,37,1))] p-8">
              <div>
                <div className="eyebrow">Lead story</div>
                <div className="mt-4 max-w-lg font-serif text-4xl leading-none tracking-[-0.05em] text-off-white">
                  Where Gulf capital meets compute, policy, and company formation.
                </div>
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-transparent to-transparent" />

          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-3 p-6 md:p-8">
            {category ? <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">{category}</span> : null}
            {publishedAt ? (
              <span className="data-pill border-white/10 bg-black/20 text-brushed-silver">
                <Calendar size={14} />
                {new Date(publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col justify-between p-8 md:p-10">
          <div className="space-y-5">
            <div className="eyebrow">Lead story</div>
            <h2 className="font-serif text-3xl leading-[0.96] tracking-[-0.05em] text-off-white md:text-[2.7rem]">
              {headline}
            </h2>
            <p className="text-base leading-8 text-brushed-silver">{summary}</p>
          </div>

          <span className="editorial-link mt-8">
            Read article
            <ArrowRight size={16} />
          </span>
        </div>
      </Link>
    </div>
  )
}

export default HeroFeatureCard
