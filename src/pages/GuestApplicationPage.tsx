import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { User, Briefcase, Globe, Lightbulb, Send, CheckCircle, AlertCircle, Star } from 'lucide-react'
import { submitGuestApplication } from '../lib/api'

interface GuestFormData {
  name: string
  email: string
  company: string
  position: string
  bio: string
  expertiseAreas: string[]
  linkedinUrl: string
  websiteUrl: string
  proposedTopics: string[]
}

interface GuestResponse {
  data?: {
    message: string
    status: string
    application_id?: string
  }
  error?: {
    code: string
    message: string
  }
}

const GuestApplicationPage = () => {
  const [formData, setFormData] = useState<GuestFormData>({
    name: '',
    email: '',
    company: '',
    position: '',
    bio: '',
    expertiseAreas: [],
    linkedinUrl: '',
    websiteUrl: '',
    proposedTopics: []
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const expertiseOptions = [
    'Artificial Intelligence',
    'Machine Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Robotics',
    'AI Ethics',
    'Investment & Venture Capital',
    'Startup Development',
    'Digital Transformation',
    'Government Policy',
    'Healthcare AI',
    'Fintech',
    'Smart Cities',
    'Education Technology',
    'Cybersecurity',
    'Data Science',
    'Cloud Computing',
    'IoT & Edge Computing',
    'Blockchain & Web3',
    'Sustainability Tech'
  ]

  const topicSuggestions = [
    'AI Strategy in GCC Markets',
    'Investment Trends in Middle East AI',
    'Building AI Startups in the Arab World',
    'Government AI Initiatives',
    'AI for Social Good in MENA',
    'Women in AI Leadership',
    'AI in Traditional Industries',
    'Cross-Border AI Collaboration',
    'AI Talent Development',
    'Regulatory Frameworks for AI',
    'AI in Arabic Language Processing',
    'Smart City Implementations',
    'AI in Financial Services',
    'Healthcare Innovation with AI',
    'AI Ethics and Cultural Values'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleExpertiseChange = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: prev.expertiseAreas.includes(expertise)
        ? prev.expertiseAreas.filter(item => item !== expertise)
        : [...prev.expertiseAreas, expertise]
    }))
  }

  const handleTopicChange = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      proposedTopics: prev.proposedTopics.includes(topic)
        ? prev.proposedTopics.filter(item => item !== topic)
        : [...prev.proposedTopics, topic]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.bio) {
      setStatus('error')
      setStatusMessage('Please fill in all required fields')
      return
    }

    if (formData.bio.length < 50) {
      setStatus('error')
      setStatusMessage('Bio must be at least 50 characters long')
      return
    }

    setLoading(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      const data = await submitGuestApplication({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        position: formData.position.trim() || null,
        bio: formData.bio.trim(),
        expertiseAreas: formData.expertiseAreas,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        websiteUrl: formData.websiteUrl.trim() || null,
        proposedTopics: formData.proposedTopics,
      }) as GuestResponse['data']

      if (data) {
        setStatus('success')
        setStatusMessage(data.message)
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          position: '',
          bio: '',
          expertiseAreas: [],
          linkedinUrl: '',
          websiteUrl: '',
          proposedTopics: []
        })
      }
    } catch (error: any) {
      setStatus('error')
      setStatusMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    {
      icon: <Star className="w-6 h-6 text-amber-500" />,
      title: "Expert Platform",
      description: "Share your expertise with thousands of AI leaders, investors, and innovators across the Arab world"
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-600" />,
      title: "Regional Reach",
      description: "Connect with decision-makers and thought leaders across the GCC and broader MENA region"
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-emerald-600" />,
      title: "Thought Leadership",
      description: "Establish yourself as a thought leader in AI innovation and regional market development"
    },
    {
      icon: <User className="w-6 h-6 text-purple-600" />,
      title: "Professional Network",
      description: "Build valuable connections with other industry experts, investors, and AI pioneers"
    }
  ]

  return (
    <>
      <Helmet>
        <title>Be a Guest on AIRAB Money Podcast | Guest Application</title>
        <meta name="description" content="Apply to be a guest on AIRAB Money podcast. Share your AI expertise with leaders across the Arab world and GCC region. Apply now for interview opportunities." />
        <meta name="keywords" content="AIRAB Money guest, podcast guest application, AI expert interview, Arab world AI, GCC technology" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-brand text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Be a Guest on AIRAB Money
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed mb-8">
              Share your AI expertise with thousands of leaders, investors, and innovators 
              across the Arab world and GCC region
            </p>
            <div className="inline-flex items-center space-x-4 text-blue-100">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-amber-400 mr-2" />
                <span>50+ Expert Guests</span>
              </div>
              <div className="flex items-center">
                <User className="w-5 h-5 text-amber-400 mr-2" />
                <span>10,000+ Monthly Listeners</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 text-amber-400 mr-2" />
                <span>7 GCC Countries</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Be a Guest?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join our community of AI experts and thought leaders shaping the future of technology in the Arab world
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Guest Application Form
              </h2>
              <p className="text-xl text-gray-600">
                Tell us about yourself and the insights you'd like to share with our audience
              </p>
            </div>
            
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-emerald-600" />
                    Professional Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your company or organization"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                        Position/Title
                      </label>
                      <input
                        type="text"
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your current position"
                        disabled={loading}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                      Professional Bio *
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                      placeholder="Tell us about your background, experience, and achievements in AI and related fields. Minimum 50 characters."
                      disabled={loading}
                      minLength={50}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      {formData.bio.length}/50 minimum characters. Include your educational background, 
                      professional experience, and notable achievements.
                    </p>
                  </div>
                </div>

                {/* Expertise Areas */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Areas of Expertise
                  </h3>
                  <p className="text-gray-600 mb-4">Select all areas that apply to your expertise:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {expertiseOptions.map((expertise) => (
                      <label key={expertise} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.expertiseAreas.includes(expertise)}
                          onChange={() => handleExpertiseChange(expertise)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={loading}
                        />
                        <span className="text-sm text-gray-700">{expertise}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Online Presence */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-purple-600" />
                    Online Presence
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        id="linkedinUrl"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/in/yourprofile"
                        disabled={loading}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-2">
                        Personal/Company Website
                      </label>
                      <input
                        type="url"
                        id="websiteUrl"
                        name="websiteUrl"
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Proposed Topics */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-amber-500" />
                    Proposed Discussion Topics
                  </h3>
                  <p className="text-gray-600 mb-4">Select topics you'd like to discuss on the podcast:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {topicSuggestions.map((topic) => (
                      <label key={topic} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.proposedTopics.includes(topic)}
                          onChange={() => handleTopicChange(topic)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          disabled={loading}
                        />
                        <span className="text-sm text-gray-700">{topic}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.email || !formData.bio}
                  className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Submitting Application...' : 'Submit Guest Application'}
                </button>
              </form>
              
              {status === 'success' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-green-800 font-medium">Application Submitted Successfully!</h4>
                    <p className="text-green-700 text-sm mt-1">{statusMessage}</p>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-800 font-medium">Error Submitting Application</h4>
                    <p className="text-red-700 text-sm mt-1">{statusMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              What to Expect After Applying
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  1
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Review Process</h3>
                <p className="text-gray-600">Our team reviews applications within 5-7 business days</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  2
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Pre-Interview</h3>
                <p className="text-gray-600">Selected candidates have a brief pre-interview call</p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto font-bold text-lg">
                  3
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Recording</h3>
                <p className="text-gray-600">Schedule and record your podcast episode</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default GuestApplicationPage
