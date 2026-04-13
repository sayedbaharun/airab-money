import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Play, Download, Filter, Search, Calendar, Clock, User, Tag } from 'lucide-react'
import { supabase, PodcastEpisode } from '../lib/supabase'

const EpisodesPage = () => {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedShowType, setSelectedShowType] = useState('all')

  const categories = ['all', 'Investment', 'Technology', 'Government', 'Startups', 'Research']
  const showTypes = ['all', 'Money Moves', 'Wisdom Wednesday', 'Future Friday']

  useEffect(() => {
    async function fetchEpisodes() {
      try {
        let query = supabase
          .from('podcast_episodes')
          .select('*')
          .eq('status', 'published')
          .order('publish_date', { ascending: false })
        
        if (selectedCategory !== 'all') {
          query = query.contains('categories', [selectedCategory])
        }
        
        if (selectedShowType !== 'all') {
          query = query.eq('show_type', selectedShowType)
        }

        const { data, error } = await query
        
        if (error) throw error
        
        let filteredData = data || []
        
        if (searchTerm) {
          filteredData = filteredData.filter(episode => 
            episode.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            episode.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            episode.guest_name?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }
        
        setEpisodes(filteredData)
      } catch (error) {
        console.error('Error fetching episodes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEpisodes()
  }, [selectedCategory, selectedShowType, searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getShowTypeColor = (showType: string) => {
    switch (showType) {
      case 'Money Moves': return 'bg-blue-600'
      case 'Wisdom Wednesday': return 'bg-emerald-600'
      case 'Future Friday': return 'bg-amber-500'
      default: return 'bg-gray-600'
    }
  }

  return (
    <>
      <Helmet>
        <title>All Episodes - AIRAB Money Podcast Archive</title>
        <meta name="description" content="Browse all episodes of AIRAB Money podcast. Find insights on AI investments, technology trends, and expert interviews from across the Arab world and GCC region." />
        <meta name="keywords" content="podcast episodes, AI interviews, Arab world technology, GCC innovation, AI investments" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-brand text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Podcast Episodes
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Explore our complete archive of AI intelligence conversations with industry leaders, 
              researchers, and innovators across the Arab world
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search episodes, guests, topics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="text-gray-500 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Show Type Filter */}
            <div>
              <select
                value={selectedShowType}
                onChange={(e) => setSelectedShowType(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {showTypes.map(showType => (
                  <option key={showType} value={showType}>
                    {showType === 'all' ? 'All Shows' : showType}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Episodes List */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
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
          ) : episodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {episodes.map((episode) => (
                <div key={episode.id} className="card p-6 hover:shadow-xl transition-shadow duration-300">
                  {/* Episode Image/Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    {episode.featured_image_url ? (
                      <img 
                        src={episode.featured_image_url} 
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Play className="w-12 h-12 text-white" />
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Play className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  
                  {/* Episode Info */}
                  <div className="space-y-3">
                    {/* Episode Meta */}
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${getShowTypeColor(episode.show_type)} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {episode.show_type}
                      </span>
                      <span className="text-gray-500">Episode {episode.episode_number}</span>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {episode.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {episode.description}
                    </p>
                    
                    {/* Guest Info */}
                    {episode.guest_name && (
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1" />
                        <span>with {episode.guest_name}</span>
                      </div>
                    )}
                    
                    {/* Episode Details */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(episode.publish_date)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{episode.duration_minutes} min</span>
                      </div>
                    </div>
                    
                    {/* Categories */}
                    {episode.categories && episode.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {episode.categories.slice(0, 2).map((category, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {category}
                          </span>
                        ))}
                        {episode.categories.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{episode.categories.length - 2} more
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                        <Play className="w-4 h-4 mr-1" />
                        Listen Now
                      </button>
                      <div className="flex space-x-2">
                        <button className="text-gray-500 hover:text-gray-700 p-1">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700 p-1">
                          <Tag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Episodes Found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || selectedCategory !== 'all' || selectedShowType !== 'all' 
                    ? 'Try adjusting your search criteria or filters.'
                    : 'New episodes coming soon! Subscribe to our newsletter to be notified.'}
                </p>
                <button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('all')
                    setSelectedShowType('all')
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default EpisodesPage