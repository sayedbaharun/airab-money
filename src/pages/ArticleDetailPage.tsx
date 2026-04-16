import React, { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Calendar, Copy, Share2 } from 'lucide-react'
import PageSeo from '../components/PageSeo'
import { Article, getArticle } from '../lib/api'
import { parseArticleContent } from '../lib/articleContent'

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

  const contentBlocks = useMemo(() => {
    if (!article?.content) return []
    return parseArticleContent(article.content)
  }, [article?.content])

  const paragraphCount = useMemo(
    () => contentBlocks.filter((block) => block.type === 'paragraph').length,
    [contentBlocks],
  )

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

  const handleNativeShare = async () => {
    if (
      typeof window === 'undefined' ||
      typeof navigator === 'undefined' ||
      typeof navigator.share !== 'function' ||
      !article
    ) {
      return
    }

    try {
      await navigator.share({
        title: article.headline,
        text: article.summary,
        url: window.location.href,
      })
    } catch (shareError) {
      console.error('Failed to share article:', shareError)
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

  const coverImage = article.hero_image_url || article.image_url
  const inlineImageInsertAfter = paragraphCount > 3 ? 1 : 0
  const publishedAt = article.published_at || article.created_at
  const sourceLabel = article.article_url ? getCompanyNameFromUrl(article.article_url) : article.source_name || 'AIRAB desk'
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''
  const shareTargets = shareUrl
    ? [
        {
          label: 'X',
          href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.headline)}&url=${encodeURIComponent(shareUrl)}`,
        },
        {
          label: 'LinkedIn',
          href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
        },
        {
          label: 'Facebook',
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
          label: 'WhatsApp',
          href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.headline} ${shareUrl}`)}`,
        },
      ]
    : []

  return (
    <>
      <PageSeo
        title={article.headline}
        description={article.summary}
        path={`/article/${article.id}`}
        type="article"
        keywords={article.tags}
        publishedTime={article.published_at || article.created_at}
        image={coverImage || undefined}
      />

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

                <div className="space-y-3 border-t border-white/5 pt-5">
                  <div className="stat-kicker">Share</div>
                  {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
                    <button type="button" onClick={handleNativeShare} className="ghost-button w-full justify-center">
                      <Share2 size={16} />
                      Share story
                    </button>
                  ) : null}
                  <div className="grid grid-cols-2 gap-2">
                    {shareTargets.map((target) => (
                      <a
                        key={target.label}
                        href={target.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-white/10 px-3 py-2 text-center text-xs uppercase tracking-[0.18em] text-brushed-silver transition-colors hover:text-off-white"
                      >
                        {target.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <div className="editorial-panel overflow-hidden">
            {coverImage ? (
              <img src={coverImage} alt={article.headline} className="h-[22rem] w-full object-cover" />
            ) : (
              <div className="flex h-[22rem] items-end bg-[linear-gradient(135deg,rgba(166,124,116,0.2),rgba(37,37,37,1))] p-8">
                <div>
                  <div className="eyebrow">AIRAB coverage</div>
                  <div className="mt-3 max-w-2xl font-serif text-4xl tracking-[-0.05em] text-off-white">
                    Coverage designed to connect AI headlines to capital flows, compute build-out, and regional strategy.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="editorial-panel p-8 md:p-12">
              <div className="space-y-7 text-lg leading-8 text-brushed-silver">
                {contentBlocks.map((block, index) => {
                  const paragraphIndex =
                    block.type === 'paragraph'
                      ? contentBlocks.slice(0, index + 1).filter((item) => item.type === 'paragraph').length - 1
                      : -1

                  return (
                    <React.Fragment key={`${article.id}-${index}`}>
                      {block.type === 'heading' ? (
                        <h2 className="pt-4 font-serif text-2xl tracking-[-0.035em] text-off-white">{block.content}</h2>
                      ) : (
                        <p className={paragraphIndex === 0 ? 'text-xl leading-9 text-off-white' : ''}>{block.content}</p>
                      )}
                      {article.inline_image_url && paragraphIndex === inlineImageInsertAfter ? (
                      <figure className="overflow-hidden border border-white/10 bg-black/20">
                        <img
                          src={article.inline_image_url}
                          alt={`${article.headline} detail visual`}
                          className="w-full object-cover"
                        />
                        {article.inline_image_prompt ? (
                          <figcaption className="border-t border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-brushed-silver/80">
                            AI-generated supporting visual
                          </figcaption>
                        ) : null}
                      </figure>
                    ) : null}
                    </React.Fragment>
                  )
                })}
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
                  AIRAB stories are written to connect AI developments to capital allocation, infrastructure ownership, and the operating consequences for the Middle East.
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
