import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Linkedin, Twitter, Globe } from 'lucide-react'
import { getPresenters, Presenter } from '../lib/api'

const PresentersPage: React.FC = () => {
  const [presenters, setPresenters] = useState<Presenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      try {
        const data = await getPresenters()
        if (!cancelled) setPresenters(data || [])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load presenters')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>Presenters - AIRAB Money</title>
        <meta name="description" content="Meet the presenters behind AIRAB Money's AI-focused shows for the Arab world and GCC region." />
      </Helmet>

      <section className="py-16 bg-gradient-brand text-white">
        <div className="container-custom text-center max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">Our Presenters</h1>
          <p className="text-xl text-blue-100 leading-relaxed">
            The voices behind Money Moves, Wisdom Wednesday, and Future Friday.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-xl mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-gray-600">{error}</div>
          ) : presenters.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              Presenter profiles coming soon.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {presenters.map((p) => (
                <div key={p.id} className="card p-6 hover:shadow-xl transition-shadow">
                  {p.photo_url ? (
                    <img src={p.photo_url} alt={p.name} className="w-full aspect-square object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="w-full aspect-square rounded-xl mb-4 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {p.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{p.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-2">{p.role}</p>
                  <p className="text-gray-600 text-sm line-clamp-4 mb-3">{p.bio}</p>
                  {p.show_types?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.show_types.map((show) => (
                        <span key={show} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {show}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3 text-gray-400">
                    {p.linkedin_url && (
                      <a href={p.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-gray-700">
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {p.twitter_url && (
                      <a href={p.twitter_url} target="_blank" rel="noreferrer" className="hover:text-gray-700">
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                    {p.website_url && (
                      <a href={p.website_url} target="_blank" rel="noreferrer" className="hover:text-gray-700">
                        <Globe className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default PresentersPage
