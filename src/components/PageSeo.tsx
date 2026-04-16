import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { buildAbsoluteUrl, siteConfig } from '../lib/site'

interface PageSeoProps {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  keywords?: string[]
  publishedTime?: string
  modifiedTime?: string
  robots?: string
}

const PageSeo: React.FC<PageSeoProps> = ({
  title,
  description,
  path,
  image,
  type = 'website',
  keywords,
  publishedTime,
  modifiedTime,
  robots = 'index,follow',
}) => {
  const location = useLocation()
  const resolvedPath = path || `${location.pathname}${location.search}`
  const canonicalUrl = buildAbsoluteUrl(resolvedPath)
  const imageUrl = buildAbsoluteUrl(image || siteConfig.defaultOgImage)
  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      {keywords?.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content={siteConfig.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {type === 'article' && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === 'article' && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
    </Helmet>
  )
}

export default PageSeo
