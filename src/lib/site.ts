export const siteConfig = {
  name: 'AIRAB Money',
  shortName: 'AIRAB',
  url: import.meta.env.VITE_SITE_URL || 'https://airabmoney.com',
  description:
    'AIRAB Money tracks Gulf AI capital, compute infrastructure, market signals, and the regional operators turning AI ambition into funded execution.',
  contactEmail: 'hello@airabmoney.com',
  defaultOgImage: '/images/logos/horizontal_layout.png',
  locale: 'en_GB',
} as const

export const buildAbsoluteUrl = (path = '/') => new URL(path, siteConfig.url).toString()
