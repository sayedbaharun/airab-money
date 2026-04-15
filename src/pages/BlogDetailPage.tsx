import React, { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, Calendar, Clock, Copy, User } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { BlogPost, getBlogPost } from '../lib/api'

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')

  useEffect(() => {
    if (!slug) {
      setError('Post not found')
      setLoading(false)
      return
    }

    async function fetchPost() {
      try {
        const data = await getBlogPost(slug)
        setPost(data)
      } catch (fetchError) {
        console.error('Failed to fetch blog post:', fetchError)
        setError('Post not found')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  const paragraphs = useMemo(() => {
    if (!post?.content) return []
    return post.content.split(/\n\s*\n/).filter(Boolean)
  }, [post?.content])

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return

    try {
      await window.navigator.clipboard.writeText(window.location.href)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch (copyError) {
      console.error('Failed to copy blog URL:', copyError)
    }
  }

  if (loading) {
    return (
      <div className="editorial-page">
        <div className="max-w-4xl animate-pulse space-y-4">
          <div className="h-4 w-32 bg-white/10" />
          <div className="h-16 w-3/4 bg-white/10" />
          <div className="h-72 bg-white/10" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="editorial-page">
        <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
          <div className="eyebrow mb-4">Analysis archive</div>
          <h1 className="font-serif text-4xl tracking-[-0.04em] text-off-white">Post not found</h1>
          <p className="mx-auto mt-4 max-w-xl text-brushed-silver">
            The analysis note you requested is unavailable. Return to the archive to keep browsing.
          </p>
          <Link to="/blog" className="editorial-link mt-8">
            <ArrowLeft size={16} />
            Back to analysis
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | AIRAB Money</title>
        <meta name="description" content={post.meta_description || post.excerpt} />
      </Helmet>

      <article className="editorial-page">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="space-y-6">
            <Link to="/blog" className="editorial-link">
              <ArrowLeft size={16} />
              Back to analysis
            </Link>

            <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_18rem]">
              <div className="space-y-5">
                <div className="eyebrow">{post.category}</div>
                <h1 className="font-serif text-4xl leading-[0.95] tracking-[-0.05em] text-off-white md:text-6xl">
                  {post.title}
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-brushed-silver">{post.excerpt}</p>
              </div>

              <aside className="editorial-panel p-6">
                <div className="space-y-5 text-sm text-brushed-silver">
                  <div className="space-y-2">
                    <div className="stat-kicker">Written by</div>
                    <div className="flex items-center gap-2 text-off-white">
                      <User size={16} className="text-dusk-rose" />
                      {post.author_name}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="stat-kicker">Published</div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-dusk-rose" />
                      {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="stat-kicker">Read time</div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-dusk-rose" />
                      {post.estimated_read_time} min
                    </div>
                  </div>
                  <button type="button" onClick={handleCopyLink} className="ghost-button w-full justify-center">
                    <Copy size={16} />
                    {copyState === 'copied' ? 'Link copied' : 'Copy link'}
                  </button>
                </div>
              </aside>
            </div>
          </div>

          <div className="editorial-panel overflow-hidden">
            {post.featured_image_url ? (
              <img
                src={post.featured_image_url}
                alt={post.title}
                className="h-[20rem] w-full object-cover grayscale"
              />
            ) : (
              <div className="flex h-[20rem] items-end bg-[linear-gradient(135deg,rgba(166,124,116,0.18),rgba(37,37,37,1))] p-8">
                <div>
                  <div className="eyebrow">AIRAB analysis</div>
                  <div className="mt-3 max-w-xl font-serif text-3xl tracking-[-0.04em] text-off-white">
                    Long-form commentary on capital, policy, and platform shifts in the region.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="editorial-panel p-8 md:p-12">
              <div className="space-y-7 text-lg leading-8 text-brushed-silver">
                {paragraphs.map((paragraph, index) => (
                  <p key={`${post.id}-${index}`} className={index === 0 ? 'text-xl leading-9 text-off-white' : ''}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="editorial-panel p-6">
                <div className="stat-kicker mb-4">Tags</div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="data-pill">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="editorial-panel p-6">
                <div className="stat-kicker mb-3">Archive note</div>
                <p className="text-sm leading-7 text-brushed-silver">
                  AIRAB analysis pieces are designed as slower, longer reads alongside the faster news desk coverage.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </>
  )
}

export default BlogDetailPage
