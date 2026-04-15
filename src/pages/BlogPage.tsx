import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, Eye, Search, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { BlogPost, getBlogPosts } from '../lib/api'

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getBlogPosts({
          status: 'published',
          limit: 50,
        })

        const publishedPosts = data || []
        const featured = publishedPosts.find((post) => post.featured) || publishedPosts[0] || null

        setFeaturedPost(featured)
        setPosts(featured ? publishedPosts.filter((post) => post.id !== featured.id) : publishedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))],
    [posts],
  )

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  return (
    <>
      <Helmet>
        <title>Capital Notes | AIRAB Money</title>
        <meta
          name="description"
          content="Long-form AIRAB Money notes on Gulf AI capital, compute infrastructure, outbound investment, and regional policy strategy."
        />
      </Helmet>

      <PageIntro
        eyebrow="Capital notes"
        title="Longer reads on Gulf AI money, compute, and power."
        description="Where the desk steps back from the daily file flow and writes slower. These pieces connect headlines to fund strategy, infrastructure ownership, energy constraints, and regional positioning."
      />

      <section className="editorial-page pt-0">
        <div className="editorial-panel space-y-5 p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brushed-silver/45" />
              <input
                type="text"
                placeholder="Search notes by capital theme, market, or company"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="field-dark pl-11"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="select-dark"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {featuredPost && selectedCategory === 'all' && searchTerm.trim().length === 0 ? (
        <section className="editorial-page pt-0">
          <Link to={`/blog/${featuredPost.slug}`} className="editorial-panel block overflow-hidden transition-colors hover:border-dusk-rose/30">
            <div className="grid xl:grid-cols-[minmax(0,1.2fr)_0.9fr]">
              <div className="border-b border-white/5 xl:border-b-0 xl:border-r">
                {featuredPost.featured_image_url ? (
                  <img src={featuredPost.featured_image_url} alt={featuredPost.title} className="h-full w-full object-cover grayscale" />
                ) : (
                  <div className="flex h-full min-h-[20rem] items-end bg-[linear-gradient(135deg,rgba(166,124,116,0.2),rgba(37,37,37,1))] p-8">
                    <div>
                      <div className="eyebrow">Featured note</div>
                      <div className="mt-3 font-serif text-4xl tracking-[-0.05em] text-off-white">Long-form AIRAB notes on AI capital and infrastructure</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5 p-8 md:p-10">
                <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">{featuredPost.category}</span>
                <h2 className="font-serif text-3xl tracking-[-0.05em] text-off-white md:text-5xl">{featuredPost.title}</h2>
                <p className="text-base leading-8 text-brushed-silver">{featuredPost.excerpt}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-brushed-silver/65">
                  <span className="inline-flex items-center gap-2">
                    <User size={14} className="text-dusk-rose" />
                    {featuredPost.author_name}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={14} className="text-dusk-rose" />
                    {formatDate(featuredPost.published_at || featuredPost.created_at)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-dusk-rose" />
                    {featuredPost.estimated_read_time} min
                  </span>
                </div>
                <span className="editorial-link">Read note</span>
              </div>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="editorial-page pt-0">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="editorial-panel h-80 animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group editorial-panel overflow-hidden transition-colors hover:border-dusk-rose/30">
                {post.featured_image_url ? (
                  <div className="aspect-[16/9] border-b border-white/5">
                    <img src={post.featured_image_url} alt={post.title} className="h-full w-full object-cover grayscale" />
                  </div>
                ) : null}

                <div className="space-y-5 p-6">
                  <span className="data-pill">{post.category}</span>
                  <div>
                    <h3 className="font-serif text-3xl tracking-[-0.04em] text-off-white">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-brushed-silver">{post.excerpt}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-brushed-silver/65">
                    <span className="inline-flex items-center gap-2">
                      <User size={14} className="text-dusk-rose" />
                      {post.author_name}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock size={14} className="text-dusk-rose" />
                      {post.estimated_read_time} min
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Eye size={14} className="text-dusk-rose" />
                      {post.view_count}
                    </span>
                  </div>
                  <span className="editorial-link">Read note</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
            <div className="eyebrow">No match</div>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">No capital notes surfaced.</h2>
            <p className="mx-auto mt-4 max-w-xl text-brushed-silver">
              Try a broader search or reopen all categories to return to the full archive.
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default BlogPage
