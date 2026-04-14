import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { Calendar, Clock, User, Tag, ArrowLeft } from 'lucide-react'
import { getEpisode, PodcastEpisode } from '../lib/api'
import AudioPlayer from '../components/AudioPlayer'

const EpisodeDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    async function fetchEpisode() {
      try {
        const data = await getEpisode(id!)
        if (!cancelled) setEpisode(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load episode')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchEpisode()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <section className="py-20">
        <div className="container-custom max-w-3xl animate-pulse">
          <div className="bg-gray-200 h-8 rounded w-1/3 mb-6" />
          <div className="bg-gray-200 h-64 rounded mb-6" />
          <div className="bg-gray-200 h-4 rounded mb-3" />
          <div className="bg-gray-200 h-4 rounded w-3/4" />
        </div>
      </section>
    )
  }

  if (error || !episode) {
    return (
      <section className="py-20">
        <div className="container-custom max-w-3xl text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Episode not found</h1>
          <p className="text-gray-600 mb-6">{error || 'This episode may have been removed.'}</p>
          <Link to="/episodes" className="btn-primary inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to episodes
          </Link>
        </div>
      </section>
    )
  }

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <Helmet>
        <title>{`${episode.title} - AIRAB Money`}</title>
        <meta name="description" content={episode.description.slice(0, 160)} />
      </Helmet>

      <article className="py-16">
        <div className="container-custom max-w-3xl">
          <Link to="/episodes" className="text-sm text-gray-500 hover:text-gray-700 inline-flex items-center mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> All episodes
          </Link>

          <div className="mb-6 flex items-center gap-3 text-sm">
            <span className="bg-blue-600 text-white px-2 py-1 rounded">{episode.show_type}</span>
            <span className="text-gray-500">Episode {episode.episode_number}</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{episode.title}</h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
            <span className="inline-flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> {formatDate(episode.publish_date)}
            </span>
            <span className="inline-flex items-center">
              <Clock className="w-4 h-4 mr-1" /> {episode.duration_minutes} min
            </span>
            {episode.guest_name && (
              <span className="inline-flex items-center">
                <User className="w-4 h-4 mr-1" /> with {episode.guest_name}
              </span>
            )}
          </div>

          {(episode.featured_image_url || episode.thumbnail_url) && (
            <img
              src={episode.featured_image_url || episode.thumbnail_url || ''}
              alt={episode.title}
              className="w-full rounded-lg mb-6 aspect-video object-cover"
            />
          )}

          <AudioPlayer src={episode.audio_url} title={episode.title} className="mb-8" />

          <p className="text-lg text-gray-700 whitespace-pre-line leading-relaxed">{episode.description}</p>

          {episode.guest_bio && (
            <div className="mt-10 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">About the guest</h3>
              <p className="text-gray-700 whitespace-pre-line">{episode.guest_bio}</p>
            </div>
          )}

          {episode.topics?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {episode.topics.map((topic) => (
                <span key={topic} className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                  <Tag className="w-3 h-3 mr-1" /> {topic}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </>
  )
}

export default EpisodeDetailPage
