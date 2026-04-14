import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Play, Users, Globe, Lightbulb, TrendingUp, ArrowRight, Mail } from 'lucide-react'
import { getEpisodes, PodcastEpisode } from '../lib/api'
import NewsletterSignup from '../components/NewsletterSignup'
import AudioPlayer from '../components/AudioPlayer'

const HomePage = () => {
  const [featuredEpisodes, setFeaturedEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedEpisodes() {
      try {
        const response = await getEpisodes({
          status: 'published',
          featured: true,
          limit: 3,
        })
        setFeaturedEpisodes(response.data || [])
      } catch (error) {
        console.error('Error fetching featured episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedEpisodes()
  }, [])

  const valuePropositions = [
    {
      icon: <Lightbulb className="w-8 h-8 text-amber-500" />,
      title: 'AI-Native Content',
      description: 'Produced using cutting-edge AI technology with human expertise for unparalleled insights',
    },
    {
      icon: <Globe className="w-8 h-8 text-emerald-600" />,
      title: 'Regional Focus',
      description: 'Deep insights into GCC and Arab world AI developments with local market expertise',
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: 'Expert Access',
      description: 'Exclusive interviews with industry leaders, researchers, and innovators shaping the future',
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: 'Actionable Intelligence',
      description: 'Practical insights for business leaders, investors, and decision-makers in AI space',
    },
  ]

  const scheduleItems = [
    {
      day: 'Monday',
      title: 'Money Moves',
      duration_minutes: '30-40 min',
      description: 'AI investments, funding rounds, and market analysis',
      color: 'bg-blue-600',
    },
    {
      day: 'Wednesday',
      title: 'Wisdom Wednesday',
      duration_minutes: '60-75 min',
      description: 'Long-form interviews with industry leaders and visionaries',
      color: 'bg-emerald-600',
    },
    {
      day: 'Friday',
      title: 'Future Friday',
      duration_minutes: '45-50 min',
      description: 'Emerging technologies, research breakthroughs, and trend analysis',
      color: 'bg-amber-500',
    },
  ]

  return (
    <>
      <Helmet>
        <title>AIRAB Money - Where AI Meets Arabia | AI Intelligence Podcast</title>
        <meta
          name="description"
          content="The definitive podcast for AI intelligence across the Arab world and GCC region. Featuring expert insights, cutting-edge analysis, and exclusive interviews with industry leaders."
        />
        <meta name="keywords" content="AI, artificial intelligence, Arab world, GCC, podcast, technology, innovation, Middle East" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative bg-gradient-brand text-white overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-10"></div>
        <div className="relative container-custom py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Where AI Meets <span className="text-amber-300">Arabia</span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
                  The definitive podcast for AI intelligence across the Arab world and GCC region
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/episodes" className="btn-secondary inline-flex items-center justify-center">
                  <Play className="w-5 h-5 mr-2" />
                  Listen to Latest Episode
                </Link>
                <Link
                  to="#newsletter"
                  className="btn-outline bg-transparent border-white text-white hover:bg-white hover:text-blue-800 inline-flex items-center justify-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Subscribe Now
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="/images/avatars/nora/nora_professional_formal.png"
                    alt="Nora Al-Mansouri - AI Investment Expert"
                    className="w-full rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
                  />
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold text-lg">Nora Al-Mansouri</h3>
                    <p className="text-blue-100 text-sm">AI Investment Expert</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <img
                    src="/images/avatars/omar/omar_tech_executive.png"
                    alt="Omar Al-Rashid - AI Research Pioneer"
                    className="w-full rounded-2xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300"
                  />
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <h3 className="font-semibold text-lg">Omar Al-Rashid</h3>
                    <p className="text-blue-100 text-sm">AI Research Pioneer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why AIRAB Money?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We bridge the gap between global AI innovations and regional implementation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuePropositions.map((prop, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">{prop.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{prop.title}</h3>
                <p className="text-gray-600 leading-relaxed">{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Episodes */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Episodes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and insightful conversations with AI leaders
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-3">
                    <div className="bg-gray-200 h-4 rounded"></div>
                    <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                    <div className="bg-gray-200 h-3 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEpisodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEpisodes.map((episode) => (
                <div key={episode.id} className="card p-6 hover:shadow-xl transition-shadow duration-300">
                  {episode.thumbnail_url || episode.featured_image_url ? (
                    <img
                      src={episode.thumbnail_url || episode.featured_image_url || ''}
                      alt={episode.title}
                      className="aspect-video w-full object-cover rounded-lg mb-4"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  )}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{episode.show_type || episode.categories?.[0] || 'Podcast'}</span>
                      <span>{episode.duration_minutes} min</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{episode.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3">{episode.description}</p>

                    {activeAudioId === episode.id ? (
                      <AudioPlayer src={episode.audio_url} title={episode.title} />
                    ) : (
                      <div className="flex items-center justify-between pt-2">
                        <button
                          onClick={() => setActiveAudioId(episode.id)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
                          disabled={!episode.audio_url}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Listen Now
                        </button>
                        <Link to={`/episode/${episode.id}`} className="text-sm text-gray-500 hover:text-gray-700">
                          Details →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Featured episodes coming soon. Subscribe below to be notified when we launch.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/episodes" className="btn-primary inline-flex items-center">
              View All Episodes
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Show Schedule */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Weekly Schedule</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three episodes per week, each with a unique focus on different aspects of AI
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {scheduleItems.map((item, index) => (
              <div key={index} className="card p-8 hover:shadow-xl transition-shadow duration-300">
                <div className={`${item.color} text-white text-sm font-semibold px-3 py-1 rounded-full inline-block mb-4`}>
                  {item.day}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 font-medium mb-3">{item.duration_minutes}</p>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="newsletter" className="py-20">
        <div className="container-custom">
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}

export default HomePage
