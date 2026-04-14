import React, { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { confirmNewsletterSubscription } from '../lib/api'

const NewsletterConfirmPage = () => {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setState('error')
      setMessage('Missing confirmation token.')
      return
    }
    confirmNewsletterSubscription(token)
      .then((res) => {
        setState('ok')
        setMessage(res.message || 'Subscription confirmed.')
      })
      .catch((err: Error) => {
        setState('error')
        setMessage(err.message || 'Unable to confirm subscription.')
      })
  }, [token])

  return (
    <section className="py-24">
      <div className="container-custom max-w-lg text-center">
        {state === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Confirming your subscription…</p>
          </>
        )}
        {state === 'ok' && (
          <>
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">You're in.</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/" className="btn-primary inline-block">Back to home</Link>
          </>
        )}
        {state === 'error' && (
          <>
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link to="/" className="btn-primary inline-block">Back to home</Link>
          </>
        )}
      </div>
    </section>
  )
}

export default NewsletterConfirmPage
