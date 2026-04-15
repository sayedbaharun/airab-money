import React, { useState, useEffect, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, Download, Headphones, Search, User } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import { PodcastEpisode, getEpisodes } from '../lib/api'

const EpisodesPage = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedShowType, setSelectedShowType] = useState('all')

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        const data = await getEpisodes({ status: 'published' })
        setEpisodes(data || [])
      } catch (error) {
        console.error('Error fetching episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [])

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(episodes.flatMap((episode) => episode.categories || [])))],
    [episodes],
  )

  const showTypes = useMemo(
    () => ['all', ...Array.from(new Set(episodes.map((episode) => episode.show_type).filter(Boolean)))],
    [episodes],
  )

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesCategory = selectedCategory === 'all' || episode.categories.includes(selectedCategory)
    const matchesShowType = selectedShowType === 'all' || episode.show_type === selectedShowType
    const matchesSearch =
      episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.guest_name?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesShowType && matchesSearch
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
        <title>Program Archive | AIRAB Money</title>
        <meta
          name="description"
          content="Browse AIRAB Money's archive of daily AI-presented briefings, interviews, and program episodes focused on Middle East AI capital and infrastructure."
        />
      </Helmet>

      <PageIntro
        eyebrow="Briefing archive"
        title="Daily AI-presented briefings plus selective interviews."
        description="Each day AIRAB can turn the article file into podcast and YouTube-ready briefings voiced by AI presenters. This archive also holds deeper interview-led programs when the story warrants them."
      />

      <section className="editorial-page pt-0">
        <div className="editorial-panel space-y-5 p-5">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_16rem_16rem]">
            <div className="relative">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brushed-silver/45" />
              <input
                type="text"
                placeholder="Search briefings, guests, or capital themes"
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

            <select
              value={selectedShowType}
              onChange={(event) => setSelectedShowType(event.target.value)}
              className="select-dark"
            >
              {showTypes.map((showType) => (
                <option key={showType} value={showType}>
                  {showType === 'all' ? 'All shows' : showType}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-brushed-silver">
            {filteredEpisodes.length} result{filteredEpisodes.length === 1 ? '' : 's'}
          </div>
        </div>
      </section>

      <section className="editorial-page pt-0">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((card) => (
              <div key={card} className="editorial-panel h-80 animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        ) : filteredEpisodes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredEpisodes.map((episode) => (
              <article key={episode.id} className="editorial-panel overflow-hidden">
                {episode.featured_image_url ? (
                  <div className="aspect-[16/9] border-b border-white/5">
                    <img src={episode.featured_image_url} alt={episode.title} className="h-full w-full object-cover grayscale" />
                  </div>
                ) : (
                  <div className="flex aspect-[16/9] items-end border-b border-white/5 bg-[linear-gradient(135deg,rgba(166,124,116,0.2),rgba(37,37,37,1))] p-6">
                    <div>
                      <div className="eyebrow">{episode.show_type}</div>
                      <div className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">AIRAB daily briefing</div>
                    </div>
                  </div>
                )}

                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="data-pill border-dusk-rose/40 bg-dusk-rose/10 text-off-white">{episode.show_type}</span>
                    <span className="data-pill">Episode {episode.episode_number}</span>
                  </div>

                  <div>
                    <h2 className="font-serif text-3xl tracking-[-0.04em] text-off-white">{episode.title}</h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-brushed-silver">{episode.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-brushed-silver/65">
                    {episode.guest_name ? (
                      <span className="inline-flex items-center gap-2">
                        <User size={14} className="text-dusk-rose" />
                        {episode.guest_name}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-2">
                      <Calendar size={14} className="text-dusk-rose" />
                      {formatDate(episode.publish_date)}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Clock size={14} className="text-dusk-rose" />
                      {episode.duration_minutes} min
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {episode.categories.slice(0, 3).map((category) => (
                      <span key={category} className="data-pill">
                        {category}
                      </span>
                    ))}
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <a href={episode.audio_url} target="_blank" rel="noopener noreferrer" className="rose-button">
                      <Headphones size={16} />
                      Listen audio
                    </a>
                    {episode.transcript_url ? (
                      <a href={episode.transcript_url} target="_blank" rel="noopener noreferrer" className="ghost-button">
                        <Download size={16} />
                        Transcript
                      </a>
                    ) : (
                      <a href={episode.audio_url} download className="ghost-button">
                        <Download size={16} />
                        Download
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
            <div className="eyebrow">No match</div>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">Nothing surfaced in the briefing archive.</h2>
            <p className="mx-auto mt-4 max-w-xl text-brushed-silver">
              Clear the search or widen the filters to reopen the full program catalog.
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default EpisodesPage
