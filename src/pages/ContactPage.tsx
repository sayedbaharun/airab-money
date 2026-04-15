import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { AlertCircle, CheckCircle, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import { submitContactForm } from '../lib/api'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  messageType: string
}

interface ContactResponse {
  data?: {
    message: string
    status: string
    message_id?: string
  }
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    messageType: 'general',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const messageTypes = [
    { value: 'general', label: 'General inquiry' },
    { value: 'media', label: 'Media and press' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'guest', label: 'Guest appearance' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'technical', label: 'Technical support' },
  ]

  const contactInfo = [
    {
      icon: <Mail size={18} className="text-dusk-rose" />,
      title: 'Editorial and partnerships',
      content: 'hello@airabmoney.com',
      description: 'For press requests, collaboration conversations, and general desk enquiries.',
    },
    {
      icon: <Phone size={18} className="text-dusk-rose" />,
      title: 'Office line',
      content: '+971 4 123 4567',
      description: 'Sunday to Thursday, 9 AM to 6 PM GST.',
    },
    {
      icon: <MapPin size={18} className="text-dusk-rose" />,
      title: 'Location',
      content: 'Dubai Internet City',
      description: 'Dubai, United Arab Emirates.',
    },
    {
      icon: <Clock size={18} className="text-dusk-rose" />,
      title: 'Response window',
      content: 'Within 24 hours',
      description: 'Faster for live editorial matters and scheduled appearances.',
    },
  ]

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      setStatusMessage('Please fill in all required fields.')
      return
    }

    setLoading(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      const data = (await submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'AIRAB Money contact form',
        message: formData.message.trim(),
        messageType: formData.messageType,
      })) as ContactResponse['data']

      if (data) {
        setStatus('success')
        setStatusMessage(data.message)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          messageType: 'general',
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
        <title>Contact the Desk | AIRAB Money</title>
        <meta
          name="description"
          content="Get in touch with AIRAB Money for editorial enquiries, partnerships, guest appearances, or sponsorship conversations."
        />
      </Helmet>

      <PageIntro
        eyebrow="Contact the desk"
        title="Editorial, partnerships, guest requests, and everything in between."
        description="Use the desk form for press enquiries, collaboration ideas, sponsorship discussions, or story leads. If you want to appear on the program, you can also go directly to the guest desk."
        actions={
          <Link to="/guest-application" className="ghost-button">
            Open guest desk
          </Link>
        }
        metrics={[
          { label: 'Response target', value: '24h' },
          { label: 'Desk base', value: 'Dubai' },
          { label: 'Business days', value: 'Sun-Thu' },
        ]}
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {contactInfo.map((info) => (
            <div key={info.title} className="editorial-panel p-5">
              <div className="flex items-center gap-3">
                {info.icon}
                <div className="stat-kicker">{info.title}</div>
              </div>
              <div className="mt-4 font-serif text-2xl tracking-[-0.04em] text-off-white">{info.content}</div>
              <p className="mt-3 text-sm leading-7 text-brushed-silver">{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="editorial-panel p-8 md:p-10">
            <div className="eyebrow">Message form</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">Send a note to AIRAB Money</h2>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm text-brushed-silver">
                    Full name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="field-dark"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block text-sm text-brushed-silver">
                    Email address *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className="field-dark"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="messageType" className="mb-2 block text-sm text-brushed-silver">
                    Message type
                  </label>
                  <select
                    id="messageType"
                    name="messageType"
                    value={formData.messageType}
                    onChange={handleChange}
                    disabled={loading}
                    className="select-dark"
                  >
                    {messageTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm text-brushed-silver">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={loading}
                    className="field-dark"
                    placeholder="Short subject line"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm text-brushed-silver">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  minLength={10}
                  className="textarea-dark"
                  placeholder="Tell us what you need, what the context is, and any deadlines we should know."
                />
              </div>

              <button
                type="submit"
                disabled={loading || !formData.name || !formData.email || !formData.message}
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
                    Send message
                  </>
                )}
              </button>
            </form>

            {status === 'success' ? (
              <div className="mt-6 flex gap-3 border border-signal-green/30 bg-signal-green/10 p-4 text-sm text-off-white">
                <CheckCircle size={18} className="mt-0.5 text-signal-green" />
                <div>
                  <div className="font-medium">Message sent</div>
                  <div className="mt-1 text-brushed-silver">{statusMessage}</div>
                </div>
              </div>
            ) : null}

            {status === 'error' ? (
              <div className="mt-6 flex gap-3 border border-signal-red/30 bg-signal-red/10 p-4 text-sm text-off-white">
                <AlertCircle size={18} className="mt-0.5 text-signal-red" />
                <div>
                  <div className="font-medium">Unable to send</div>
                  <div className="mt-1 text-brushed-silver">{statusMessage}</div>
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6">
            <div className="editorial-panel p-6">
              <div className="stat-kicker mb-3">Best use cases</div>
              <div className="space-y-3 text-sm leading-7 text-brushed-silver">
                <p>Press requests and executive commentary.</p>
                <p>Brand, content, and event partnerships.</p>
                <p>Guest appearances, sponsorships, and speaker invites.</p>
                <p>Story leads and regional market tips.</p>
              </div>
            </div>

            <div className="editorial-panel p-6">
              <div className="stat-kicker mb-3">Need the program specifically?</div>
              <p className="text-sm leading-7 text-brushed-silver">
                If you already know you want to appear on AIRAB Money, go straight to the guest application flow and tell the desk what perspective you can bring.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="mb-6">
          <div className="eyebrow">FAQ</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">Common desk questions</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              question: 'How do I become a guest on the podcast?',
              answer:
                'Use the guest desk application so the editorial team can review your background, topics, and availability in one place.',
            },
            {
              question: 'Do you accept story suggestions or market leads?',
              answer:
                'Yes. The newsroom actively reviews leads, especially on policy, infrastructure, capital, and regional operating trends.',
            },
            {
              question: 'Can AIRAB Money support events or panels?',
              answer:
                'Yes. Use the contact form for speaking invitations, panel moderation, and regional conference participation.',
            },
            {
              question: 'Do you offer sponsorship and commercial partnerships?',
              answer:
                'Yes. The desk works with aligned partners on programs, series sponsorships, and selective commercial collaborations.',
            },
          ].map((item) => (
            <div key={item.question} className="editorial-panel p-6">
              <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">{item.question}</h3>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default ContactPage
