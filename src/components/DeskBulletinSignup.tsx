import React, { useState } from 'react'
import { AlertCircle, CheckCircle2, Mail, Send } from 'lucide-react'
import { Link } from 'react-router-dom'
import { subscribeToNewsletter } from '../lib/api'

const DeskBulletinSignup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!email.trim()) {
      setStatus('error')
      setMessage('Email is required.')
      return
    }

    setLoading(true)
    setStatus('idle')
    setMessage('')

    try {
      const result = await subscribeToNewsletter({
        email: email.trim(),
        name: name.trim() || null,
        preferences: {
          article_alerts: true,
          market_updates: true,
          youtube_posts: true,
        },
      })

      setStatus('success')
      setMessage(result.message)
      setName('')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="editorial-panel overflow-hidden">
      <div className="border-b border-white/5 p-6 md:p-7">
        <div className="eyebrow">Desk bulletin</div>
        <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">
          Get each new file without watching the feed all day.
        </h2>
        <p className="mt-4 text-sm leading-7 text-brushed-silver">
          The soft launch list is simple: new articles, selective market notes, and YouTube releases when they go live.
        </p>
      </div>

      <div className="space-y-5 p-6 md:p-7">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            'Article alerts with the headline, summary, and source trail.',
            'Selective market notes when the tape changes the story.',
            'YouTube and briefing releases once distribution goes live.',
          ].map((item) => (
            <div key={item} className="border border-white/5 bg-white/[0.02] p-4 text-sm leading-6 text-brushed-silver">
              {item}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
          <label className="space-y-2">
            <span className="stat-kicker">Name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="field-dark"
              placeholder="Optional"
              disabled={loading}
            />
          </label>
          <label className="space-y-2">
            <span className="stat-kicker">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="field-dark"
              placeholder="name@company.com"
              disabled={loading}
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="rose-button mt-auto w-full justify-center lg:w-auto disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-brushed-silver/40"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
                Joining
              </>
            ) : (
              <>
                <Send size={16} />
                Join the list
              </>
            )}
          </button>
        </form>

        {status !== 'idle' ? (
          <div
            className={`flex items-center gap-3 border p-4 text-sm ${
              status === 'success'
                ? 'border-signal-green/35 bg-signal-green/10 text-off-white'
                : 'border-signal-red/35 bg-signal-red/10 text-off-white'
            }`}
          >
            {status === 'success' ? <CheckCircle2 size={18} className="text-signal-green" /> : <AlertCircle size={18} className="text-signal-red" />}
            <span>{message}</span>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-sm text-brushed-silver">
          <div className="inline-flex items-center gap-2">
            <Mail size={16} className="text-dusk-rose" />
            One email whenever the desk publishes something worth seeing.
          </div>
          <Link to="/privacy" className="editorial-link">
            Privacy policy
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DeskBulletinSignup
