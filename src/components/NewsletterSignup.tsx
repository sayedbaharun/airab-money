import React, { useState } from 'react'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface SubscriptionResponse {
  data?: {
    message: string
    status: string
    subscriber_id?: string
  }
  error?: {
    code: string
    message: string
  }
}

const NewsletterSignup = () => {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setStatus('error')
      setMessage('Email is required')
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const { data, error } = await supabase.functions.invoke('newsletter-subscribe', {
        body: {
          email: email.trim(),
          name: name.trim() || null,
          preferences: {
            weekly_newsletter: true,
            episode_notifications: true,
            ai_updates: true
          }
        }
      }) as { data: SubscriptionResponse['data'], error: SubscriptionResponse['error'] }

      if (error) {
        throw new Error(error.message || 'Subscription failed')
      }

      if (data) {
        setStatus('success')
        setMessage(data.message)
        setEmail('')
        setName('')
      }
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gradient-brand text-white rounded-2xl p-8 lg:p-12">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Mail className="w-16 h-16 text-amber-300 mx-auto mb-4" />
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Get Weekly AI Intelligence
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Join thousands of AI leaders, investors, and innovators who rely on our weekly insights 
            to stay ahead in the rapidly evolving AI landscape.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
              disabled={loading}
            />
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent text-gray-900"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !email}
            className="w-full md:w-auto px-8 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            ) : (
              <Mail className="w-5 h-5 mr-2" />
            )}
            {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
          </button>
        </form>

        {status === 'success' && (
          <div className="mt-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center justify-center text-green-100">
            <CheckCircle className="w-5 h-5 mr-2" />
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center justify-center text-red-100">
            <AlertCircle className="w-5 h-5 mr-2" />
            {message}
          </div>
        )}

        <p className="text-sm text-blue-200 mt-6">
          We respect your privacy. Unsubscribe at any time. 
          Read our <a href="#" className="underline hover:text-white">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default NewsletterSignup