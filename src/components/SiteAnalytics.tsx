import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

const SiteAnalytics = () => {
  const location = useLocation()

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') {
      return
    }

    window.dataLayer = window.dataLayer || []
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args)
      }

    window.gtag('js', new Date())
    window.gtag('config', measurementId, {
      send_page_view: false,
    })

    const existingScript = document.querySelector(`script[data-analytics-id="${measurementId}"]`)
    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    script.dataset.analyticsId = measurementId
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!measurementId || typeof window === 'undefined' || typeof window.gtag !== 'function') {
      return
    }

    const pagePath = `${location.pathname}${location.search}${location.hash}`
    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: pagePath,
      page_title: document.title,
    })
  }, [location])

  return null
}

export default SiteAnalytics
