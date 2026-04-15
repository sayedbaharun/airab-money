import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle, AlertCircle, Clock } from 'lucide-react'
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
  error?: {
    code: string
    message: string
  }
}

const ContactPage = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    messageType: 'general'
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const messageTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'media', label: 'Media & Press' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'guest', label: 'Guest Appearance' },
    { value: 'sponsorship', label: 'Sponsorship' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'technical', label: 'Technical Support' }
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      setStatus('error')
      setStatusMessage('Please fill in all required fields')
      return
    }

    setLoading(true)
    setStatus('idle')
    setStatusMessage('')

    try {
      const data = await submitContactForm({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || 'Contact Form Submission',
        message: formData.message.trim(),
        messageType: formData.messageType,
      }) as ContactResponse['data']

      if (data) {
        setStatus('success')
        setStatusMessage(data.message)
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          messageType: 'general'
        })
      }
    } catch (error: any) {
      setStatus('error')
      setStatusMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-dusk-rose" />,
      title: "Email Us",
      content: "hello@airabmoney.com",
      description: "Send us an email and we'll respond within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6 text-dusk-rose" />,
      title: "Call Us",
      content: "+971 4 123 4567",
      description: "Speak with our team during business hours (9 AM - 6 PM GST)"
    },
    {
      icon: <MapPin className="w-6 h-6 text-dusk-rose" />,
      title: "Visit Us",
      content: "Dubai Internet City, Dubai, UAE",
      description: "Schedule a meeting at our Dubai headquarters"
    },
    {
      icon: <Clock className="w-6 h-6 text-dusk-rose" />,
      title: "Business Hours",
      content: "Sunday - Thursday: 9 AM - 6 PM GST",
      description: "We're closed on weekends and UAE public holidays"
    }
  ]

  return (
    <>
      <Helmet>
        <title>Contact Us - AIRAB Money | Get In Touch</title>
        <meta name="description" content="Contact AIRAB Money for media inquiries, partnerships, guest appearances, or general questions. We're here to help with all your AI intelligence needs." />
        <meta name="keywords" content="contact AIRAB Money, media inquiries, partnerships, guest appearance, AI podcast contact" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-16 bg-graphite text-off-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-blue-100 leading-relaxed">
              Have a question, story idea, or want to collaborate? We'd love to hear from you. 
              Our team is here to help with all your AI intelligence needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-charcoal border border-white/5 rounded-none">
                    {info.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-off-white mb-2">{info.title}</h3>
                <p className="text-off-white font-medium mb-2">{info.content}</p>
                <p className="text-sm text-brushed-silver">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-charcoal">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-off-white mb-4">
                Send Us a Message
              </h2>
              <p className="text-xl text-brushed-silver">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>
            
            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-brushed-silver mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                      disabled={loading}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-brushed-silver mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="messageType" className="block text-sm font-medium text-brushed-silver mb-2">
                      Message Type
                    </label>
                    <select
                      id="messageType"
                      name="messageType"
                      value={formData.messageType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loading}
                    >
                      {messageTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-brushed-silver mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief subject line"
                      disabled={loading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-brushed-silver mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    placeholder="Please provide details about your inquiry, including any specific questions or requirements..."
                    disabled={loading}
                    minLength={10}
                  />
                  <p className="text-sm text-brushed-silver mt-2">
                    Minimum 10 characters. Be as detailed as possible to help us provide the best response.
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={loading || !formData.name || !formData.email || !formData.message}
                  className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Send className="w-5 h-5 mr-2" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              
              {status === 'success' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-green-800 font-medium">Message Sent Successfully!</h4>
                    <p className="text-green-700 text-sm mt-1">{statusMessage}</p>
                  </div>
                </div>
              )}
              
              {status === 'error' && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-800 font-medium">Error Sending Message</h4>
                    <p className="text-red-700 text-sm mt-1">{statusMessage}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-off-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-brushed-silver">
                Quick answers to common questions about AIRAB Money
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-off-white mb-3">
                  How can I be a guest on the podcast?
                </h3>
                <p className="text-brushed-silver">
                  We're always looking for AI experts, entrepreneurs, and industry leaders to share their insights. 
                  Please fill out our <a href="/guest-application" className="text-dusk-rose hover:text-brushed-silver underline">guest application form</a> 
                  with your background and proposed topics.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-off-white mb-3">
                  Do you accept story suggestions or news tips?
                </h3>
                <p className="text-brushed-silver">
                  Absolutely! We value input from our community. Send us your AI-related news tips, 
                  story suggestions, or regional developments you think we should cover.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-off-white mb-3">
                  Are you available for speaking engagements?
                </h3>
                <p className="text-brushed-silver">
                  Yes, our team is available for conferences, corporate events, and panel discussions 
                  about AI trends in the Arab world. Contact us with your event details and requirements.
                </p>
              </div>
              
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-off-white mb-3">
                  How can my company sponsor or partner with AIRAB Money?
                </h3>
                <p className="text-brushed-silver">
                  We offer various sponsorship and partnership opportunities including episode sponsorships, 
                  content partnerships, and event collaborations. Please contact us to discuss options 
                  that align with your business objectives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ContactPage
