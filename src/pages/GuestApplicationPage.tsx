import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Briefcase, Globe, Lightbulb, Send, Star, User } from 'lucide-react'
import PageIntro from '../components/PageIntro'
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
}

const expertiseOptions = [
  'Artificial Intelligence',
  'Machine Learning',
  'Natural Language Processing',
  'Computer Vision',
  'Robotics',
  'AI Ethics',
  'Investment and Venture Capital',
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
  'IoT and Edge Computing',
  'Blockchain and Web3',
  'Sustainability Tech',
]

const topicSuggestions = [
  'AI strategy in GCC markets',
  'Investment trends in Middle East AI',
  'Building AI startups in the Arab world',
  'Government AI initiatives',
  'AI for social good in MENA',
  'Women in AI leadership',
  'AI in traditional industries',
  'Cross-border AI collaboration',
  'AI talent development',
  'Regulatory frameworks for AI',
  'Arabic language processing',
  'Smart city implementations',
  'AI in financial services',
  'Healthcare innovation with AI',
  'AI ethics and cultural values',
]

const benefits = [
  {
    icon: <Star size={18} className="text-dusk-rose" />,
    title: 'Expert audience',
    description: 'Share perspective with leaders, operators, founders, and investors following the region closely.',
  },
  {
    icon: <Globe size={18} className="text-dusk-rose" />,
    title: 'Regional reach',
    description: 'Connect with a GCC and wider Arab world audience that cares about practical AI execution.',
  },
  {
    icon: <Lightbulb size={18} className="text-dusk-rose" />,
    title: 'Thought leadership',
    description: 'Position your work inside an editorial environment designed around signal rather than vanity.',
  },
  {
    icon: <User size={18} className="text-dusk-rose" />,
    title: 'Network effects',
    description: 'Appear alongside founders, researchers, policymakers, and investors shaping the region.',
  },
]

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
    proposedTopics: [],
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const toggleExpertise = (expertise: string) => {
    setFormData((current) => ({
      ...current,
      expertiseAreas: current.expertiseAreas.includes(expertise)
        ? current.expertiseAreas.filter((item) => item !== expertise)
        : [...current.expertiseAreas, expertise],
    }))
  }

  const toggleTopic = (topic: string) => {
    setFormData((current) => ({
      ...current,
      proposedTopics: current.proposedTopics.includes(topic)
        ? current.proposedTopics.filter((item) => item !== topic)
        : [...current.proposedTopics, topic],
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.bio) {
      setStatus('error')
      setStatusMessage('Please fill in all required fields.')
      return
    }

    if (formData.bio.length < 50) {
      setStatus('error')
      setStatusMessage('Your bio should be at least 50 characters long.')
      return
    }

    setLoading(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      const data = (await submitGuestApplication({
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.company.trim() || null,
        position: formData.position.trim() || null,
        bio: formData.bio.trim(),
        expertiseAreas: formData.expertiseAreas,
        linkedinUrl: formData.linkedinUrl.trim() || null,
        websiteUrl: formData.websiteUrl.trim() || null,
        proposedTopics: formData.proposedTopics,
      })) as GuestResponse['data']

      if (data) {
        setStatus('success')
        setStatusMessage(data.message)
        setFormData({
          name: '',
          email: '',
          company: '',
          position: '',
          bio: '',
          expertiseAreas: [],
          linkedinUrl: '',
          websiteUrl: '',
          proposedTopics: [],
        })
      }
    } catch (submitError: unknown) {
      setStatus('error')
      setStatusMessage(submitError instanceof Error ? submitError.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Guest Desk | AIRAB Money</title>
        <meta
          name="description"
          content="Apply to appear on AIRAB Money and share your perspective on AI, markets, infrastructure, and policy across the Arab world."
        />
      </Helmet>

      <PageIntro
        eyebrow="Guest desk"
        title="Bring a useful perspective to the AIRAB program."
        description="We look for guests with operator insight, technical depth, market context, or policy experience that adds signal for the audience. The more specific your angle, the better."
        metrics={[
          { label: 'Target audience', value: 'GCC+' },
          { label: 'Required bio', value: '50+' },
          { label: 'Review mode', value: 'Editorial' },
        ]}
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="editorial-panel p-5">
              <div className="flex items-center gap-3">
                {benefit.icon}
                <div className="stat-kicker">{benefit.title}</div>
              </div>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="editorial-panel p-8 md:p-10">
            <div className="eyebrow">Application form</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">Tell the desk who you are and what you can add.</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-8">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-dusk-rose" />
                  <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">Personal information</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-sm text-brushed-silver">
                      Full name *
                    </label>
                    <input id="name" name="name" value={formData.name} onChange={handleInputChange} required disabled={loading} className="field-dark" />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm text-brushed-silver">
                      Email address *
                    </label>
                    <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required disabled={loading} className="field-dark" />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Briefcase size={18} className="text-dusk-rose" />
                  <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">Professional context</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="company" className="mb-2 block text-sm text-brushed-silver">
                      Company or organization
                    </label>
                    <input id="company" name="company" value={formData.company} onChange={handleInputChange} disabled={loading} className="field-dark" />
                  </div>
                  <div>
                    <label htmlFor="position" className="mb-2 block text-sm text-brushed-silver">
                      Position or title
                    </label>
                    <input id="position" name="position" value={formData.position} onChange={handleInputChange} disabled={loading} className="field-dark" />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="mb-2 block text-sm text-brushed-silver">
                    Professional bio *
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="textarea-dark"
                    placeholder="Summarize your work, what you operate or research, and why your perspective would be useful to the AIRAB audience."
                  />
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">Areas of expertise</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {expertiseOptions.map((expertise) => (
                    <label key={expertise} className="flex items-start gap-3 border border-white/5 bg-white/[0.02] p-3 text-sm text-brushed-silver">
                      <input
                        type="checkbox"
                        checked={formData.expertiseAreas.includes(expertise)}
                        onChange={() => toggleExpertise(expertise)}
                        disabled={loading}
                        className="mt-1 h-4 w-4 accent-dusk-rose"
                      />
                      <span>{expertise}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Globe size={18} className="text-dusk-rose" />
                  <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">Links</h3>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label htmlFor="linkedinUrl" className="mb-2 block text-sm text-brushed-silver">
                      LinkedIn URL
                    </label>
                    <input id="linkedinUrl" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleInputChange} disabled={loading} className="field-dark" />
                  </div>
                  <div>
                    <label htmlFor="websiteUrl" className="mb-2 block text-sm text-brushed-silver">
                      Website URL
                    </label>
                    <input id="websiteUrl" name="websiteUrl" value={formData.websiteUrl} onChange={handleInputChange} disabled={loading} className="field-dark" />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <Lightbulb size={18} className="text-dusk-rose" />
                  <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">Potential discussion themes</h3>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {topicSuggestions.map((topic) => (
                    <label key={topic} className="flex items-start gap-3 border border-white/5 bg-white/[0.02] p-3 text-sm text-brushed-silver">
                      <input
                        type="checkbox"
                        checked={formData.proposedTopics.includes(topic)}
                        onChange={() => toggleTopic(topic)}
                        disabled={loading}
                        className="mt-1 h-4 w-4 accent-dusk-rose"
                      />
                      <span>{topic}</span>
                    </label>
                  ))}
                </div>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="rose-button w-full disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-brushed-silver/40"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit application
                  </>
                )}
              </button>
            </form>

            {status === 'success' ? (
              <div className="mt-6 border border-signal-green/30 bg-signal-green/10 p-4 text-sm text-brushed-silver">
                <div className="font-medium text-off-white">Application submitted</div>
                <div className="mt-1">{statusMessage}</div>
              </div>
            ) : null}

            {status === 'error' ? (
              <div className="mt-6 border border-signal-red/30 bg-signal-red/10 p-4 text-sm text-brushed-silver">
                <div className="font-medium text-off-white">Application incomplete</div>
                <div className="mt-1">{statusMessage}</div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="editorial-panel p-6">
              <div className="stat-kicker mb-3">What the desk values</div>
              <div className="space-y-3 text-sm leading-7 text-brushed-silver">
                <p>Clear operating experience or real research depth.</p>
                <p>A perspective that adds specificity rather than general optimism.</p>
                <p>Topics that matter to regional builders, investors, and decision-makers.</p>
              </div>
            </div>

            <div className="editorial-panel p-6">
              <div className="stat-kicker mb-3">Strong applications tend to include</div>
              <div className="space-y-3 text-sm leading-7 text-brushed-silver">
                <p>A concise bio with direct evidence of your work.</p>
                <p>One or two sharp topic angles rather than a broad list.</p>
                <p>Links the desk can use to verify context quickly.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

export default GuestApplicationPage
