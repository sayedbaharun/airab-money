import React from 'react'

interface IntroMetric {
  label: string
  value: string
}

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  actions?: React.ReactNode
  metrics?: IntroMetric[]
  aside?: React.ReactNode
}

const PageIntro: React.FC<PageIntroProps> = ({
  eyebrow,
  title,
  description,
  actions,
  metrics = [],
  aside,
}) => {
  const hasAside = Boolean(aside) || metrics.length > 0

  const renderAside = () => {
    if (aside) {
      return <div className="editorial-panel p-6">{aside}</div>
    }

    if (metrics.length === 0) {
      return null
    }

    return (
      <div className="editorial-panel p-6">
        <div className="grid gap-5 sm:grid-cols-3 xl:grid-cols-1">
          {metrics.map((metric) => (
            <div key={metric.label} className="space-y-2 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
              <div className="stat-kicker">{metric.label}</div>
              <div className="font-serif text-3xl tracking-[-0.04em] text-off-white">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="editorial-page pb-8 md:pb-10">
      <div className={`grid items-start gap-8 ${hasAside ? 'xl:grid-cols-[minmax(0,1.6fr)_22rem]' : ''}`}>
        <div className="space-y-6">
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="page-title">{title}</h1>
          <p className="page-copy">{description}</p>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {renderAside()}
      </div>
    </section>
  )
}

export default PageIntro
