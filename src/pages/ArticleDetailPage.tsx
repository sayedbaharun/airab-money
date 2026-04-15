import React, { useMemo, useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowUpRight, Calendar, Copy } from 'lucide-react'
import { Article, getArticle } from '../lib/api'

const getCompanyNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const domain = urlObj.hostname.replace(/^www\./, '')
    const [primary] = domain.split('.')

    const specialCases: Record<string, string> = {
      microsoft: 'Microsoft',
      google: 'Google',
      amazon: 'Amazon',
      nvidia: 'NVIDIA',
      openai: 'OpenAI',
      anthropic: 'Anthropic',
      meta: 'Meta',
      apple: 'Apple',
      tesla: 'Tesla',
      g42: 'G42',
      tii: 'TII',
      aws: 'AWS',
      hub71: 'Hub71',
    }

    return specialCases[primary.toLowerCase()] || `${primary.charAt(0).toUpperCase()}${primary.slice(1)}`
  } catch {
    return 'Original source'
  }
}

const ArticleDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

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
      } catch (fetchError) {
        console.error('Error fetching article:', fetchError)
        setError('Article not found')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [id])

  const paragraphs = useMemo(() => {
    if (!article?.content) return []
    return article.content.split(/\n\s*\n/).filter(Boolean)
  }, [article?.content])

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return

    try {
      await window.navigator.clipboard.writeText(window.location.href)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch (copyError) {
      console.error('Failed to copy article URL:', copyError)
    }
  }

  if (loading) {
    return (
      <div className="editorial-page">
        <div className="max-w-5xl animate-pulse space-y-4">
          <div className="h-4 w-28 bg-white/10" />
          <div className="h-16 w-4/5 bg-white/10" />
          <div className="h-[24rem] bg-white/10" />
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="editorial-page">
        <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
          <div className="eyebrow">Coverage archive</div>
          <h1 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">Article not found</h1>
          <p className="mx-auto mt-4 max-w-xl text-brushed-silver">
            The requested file is unavailable. Return to the archive and continue from the latest desk view.
          </p>
          <Link to="/articles" className="editorial-link mt-8">
            <ArrowLeft size={16} />
            Back to coverage
          </Link>
        </div>
      </div>
    )
  }

  const coverImage = article.hero_image_url || article.image_url || article.inline_image_url
  const publishedAt = article.published_at || article.created_at
  const sourceLabel = article.article_url ? getCompanyNameFromUrl(article.article_url) : article.source_name || 'AIRAB desk'

  return (
    <>
      <Helmet>
        <title>{article.headline} | AIRAB Money</title>
        <meta name="description" content={article.summary} />
        <meta name="keywords" content={article.tags?.join(', ') || article.category} />
      </Helmet>

      <article className="editorial-page">
        <div className="mx-auto max-w-6xl space-y-10">
          <Link to="/articles" className="editorial-link">
            <ArrowLeft size={16} />
            Back to coverage
          </Link>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.45fr)_18rem]">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">{article.category}</span>
                <span className="data-pill">AI generated</span>
              </div>
              <h1 className="font-serif text-4xl leading-[0.95] tracking-[-0.055em] text-off-white md:text-6xl">
                {article.headline}
              </h1>
              <p className="max-w-3xl text-xl leading-9 text-brushed-silver">{article.summary}</p>
            </div>

            <aside className="editorial-panel p-6">
              <div className="space-y-5 text-sm text-brushed-silver">
                <div className="space-y-2">
                  <div className="stat-kicker">Published</div>
                  <div className="flex items-center gap-2 text-off-white">
                    <Calendar size={16} className="text-dusk-rose" />
                    {new Date(publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="stat-kicker">Source</div>
                  <div className="text-off-white">{sourceLabel}</div>
                  {article.article_url ? (
                    <a
                      href={article.article_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-link"
                    >
                      Open original source
                      <ArrowUpRight size={14} />
                    </a>
                  ) : null}
                </div>

                <button type="button" onClick={handleCopyLink} className="ghost-button w-full justify-center">
                  <Copy size={16} />
                  {copyState === 'copied' ? 'Link copied' : 'Copy link'}
                </button>
              </div>
            </aside>
          </div>

          <div className="editorial-panel overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt={article.headline} className="h-[22rem] w-full object-cover grayscale" />
            ) : (
              <div className="flex h-[22rem] items-end bg-[linear-gradient(135deg,rgba(166,124,116,0.2),rgba(37,37,37,1))] p-8">
                <div>
                  <div className="eyebrow">AIRAB coverage</div>
                  <div className="mt-3 max-w-2xl font-serif text-4xl tracking-[-0.05em] text-off-white">
                    Reporting designed to bridge fast headlines with slower regional context.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="editorial-panel p-8 md:p-12">
              <div className="space-y-7 text-lg leading-8 text-brushed-silver">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${article.id}-${index}`} className={index === 0 ? 'text-xl leading-9 text-off-white' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              {article.tags && article.tags.length > 0 ? (
                <div className="editorial-panel p-6">
                  <div className="stat-kicker mb-4">File tags</div>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="data-pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="editorial-panel p-6">
                <div className="stat-kicker mb-3">Why this piece matters</div>
                <p className="text-sm leading-7 text-brushed-silver">
                  AIRAB stories are written to connect headline developments to capital allocation, regional strategy, and operating consequences.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}

export default ArticleDetailPage
