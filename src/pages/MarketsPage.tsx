import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import PageIntro from '../components/PageIntro'
import { MarketData, getMarketData } from '../lib/api'

const MarketsPage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState<'all' | 'indices' | 'crypto' | 'commodities' | 'middleeast'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [marketData, setMarketData] = useState<MarketData[]>([])

  const fetchMarketData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getMarketData()

      if (!data?.success) {
        throw new Error('Failed to fetch market data')
      }

      setMarketData(data.data || [])
      setUpdatedAt(data.updatedAt)
    } catch (fetchError: unknown) {
      console.error('Failed to fetch market data:', fetchError)
      setError(fetchError instanceof Error ? fetchError.message : 'Unable to load market data')
      setMarketData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 60_000)
    return () => clearInterval(interval)
  }, [fetchMarketData])

  const filteredData =
    activeTab === 'all'
      ? marketData
      : marketData.filter((item) => {
          if (activeTab === 'indices') return item.type === 'index'
          if (activeTab === 'middleeast') return item.type === 'middleeast' || item.type === 'gcc'
          if (activeTab === 'commodities') return item.type === 'commodity'
          return item.type === activeTab
        })

  const getTabLabel = (tab: typeof activeTab) => {
    if (language === 'ar') {
      const labels: Record<typeof activeTab, string> = {
        all: 'الكل',
        indices: 'المؤشرات',
        crypto: 'العملات المشفرة',
        commodities: 'السلع',
        middleeast: 'الخليج',
      }
      return labels[tab]
    }

    const labels: Record<typeof activeTab, string> = {
      all: 'All',
      indices: 'Indices',
      crypto: 'Crypto',
      commodities: 'Commodities',
      middleeast: 'Middle East',
    }
    return labels[tab]
  }

  const priceLabel = (item: MarketData) => {
    const prefix = item.type === 'crypto' || item.type === 'commodity' || item.type === 'stock' ? '$' : ''
    const digits = item.price >= 100 ? 2 : 4
    return `${prefix}${item.price.toLocaleString('en-US', {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    })}`
  }

  const typeLabel = (type: MarketData['type']) => {
    if (type === 'middleeast' || type === 'gcc') return 'Regional'
    if (type === 'commodity') return 'Commodity'
    if (type === 'crypto') return 'Crypto'
    if (type === 'index') return 'Index'
    return 'Equity'
  }

  return (
    <>
      <Helmet>
        <title>Markets Desk | AIRAB Money</title>
        <meta
          name="description"
          content="Live financial market context from global and Middle East markets, presented in AIRAB Money's editorial data-desk format."
        />
      </Helmet>

      <PageIntro
        eyebrow="Markets desk"
        title="Live prices, trimmed into editorial signal."
        description="This desk is designed for readers who want context faster than a terminal but with more density than a marketing dashboard. Track the region, key global indicators, and risk tone in one place."
        actions={
          <div className="flex flex-wrap gap-2">
            {(['en', 'ar'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`border px-4 py-3 text-sm uppercase tracking-[0.22em] transition-colors ${
                  language === code
                    ? 'border-dusk-rose/50 bg-dusk-rose/10 text-off-white'
                    : 'border-white/10 text-brushed-silver hover:border-dusk-rose/30 hover:text-off-white'
                }`}
              >
                {code === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        }
        aside={
          <div className="space-y-5 text-sm text-brushed-silver">
            <div>
              <div className="stat-kicker">Refresh cadence</div>
              <div className="mt-2 text-off-white">60 seconds</div>
            </div>
            <div>
              <div className="stat-kicker">Current universe</div>
              <div className="mt-2 text-off-white">{marketData.length || '--'} instruments</div>
            </div>
            <div>
              <div className="stat-kicker">Last update</div>
              <div className="mt-2 text-off-white">
                {updatedAt
                  ? new Date(updatedAt).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--:--'}
              </div>
            </div>
          </div>
        }
      />

      <section className="editorial-page pt-0">
        <div className="editorial-panel flex flex-wrap gap-2 p-4">
          {(['all', 'indices', 'crypto', 'commodities', 'middleeast'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border px-3 py-2 text-xs uppercase tracking-[0.22em] transition-colors ${
                activeTab === tab
                  ? 'border-dusk-rose/50 bg-dusk-rose/10 text-off-white'
                  : 'border-white/10 text-brushed-silver hover:border-dusk-rose/30 hover:text-off-white'
              }`}
            >
              {getTabLabel(tab)}
            </button>
          ))}
        </div>
      </section>

      <section className="editorial-page pt-0">
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((card) => (
              <div key={card} className="editorial-panel h-48 animate-pulse bg-white/[0.03]" />
            ))}
          </div>
        ) : error && marketData.length === 0 ? (
          <div className="editorial-panel mx-auto max-w-2xl p-10 text-center">
            <div className="eyebrow">Desk unavailable</div>
            <h2 className="mt-4 font-serif text-4xl tracking-[-0.05em] text-off-white">Market feed interrupted</h2>
            <p className="mx-auto mt-4 max-w-xl text-brushed-silver">{error}</p>
            <button type="button" onClick={fetchMarketData} className="rose-button mt-8">
              Retry feed
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredData.map((item) => {
              const positive = item.change >= 0
              const barWidth = Math.min(100, Math.max(14, 54 + item.changePercent * 7))

              return (
                <div key={item.symbol} className="editorial-panel p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="stat-kicker">{typeLabel(item.type)}</div>
                      <h3 className="mt-2 text-lg uppercase tracking-[0.18em] text-off-white">{item.symbol}</h3>
                      <p className="mt-2 text-sm leading-6 text-brushed-silver">{item.name}</p>
                    </div>
                    <span
                      className={`border px-2 py-1 text-[11px] uppercase tracking-[0.22em] ${
                        positive
                          ? 'border-signal-green/35 bg-signal-green/10 text-signal-green'
                          : 'border-signal-red/35 bg-signal-red/10 text-signal-red'
                      }`}
                    >
                      {positive ? 'Up' : 'Down'}
                    </span>
                  </div>

                  <div className="mt-7 font-serif text-4xl tracking-[-0.05em] text-off-white">{priceLabel(item)}</div>

                  <div className="mt-3 text-sm text-brushed-silver">
                    {positive ? '+' : ''}
                    {item.change.toFixed(2)} ({positive ? '+' : ''}
                    {item.changePercent.toFixed(2)}%)
                  </div>

                  <div className="mt-4 h-px bg-white/10">
                    <div
                      className={`h-px ${positive ? 'bg-signal-green' : 'bg-signal-red'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="editorial-page pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="editorial-panel p-5">
            <div className="stat-kicker">Indices</div>
            <div className="mt-3 font-serif text-4xl tracking-[-0.05em] text-off-white">
              {marketData.filter((item) => item.type === 'index').length}
            </div>
          </div>
          <div className="editorial-panel p-5">
            <div className="stat-kicker">Crypto</div>
            <div className="mt-3 font-serif text-4xl tracking-[-0.05em] text-off-white">
              {marketData.filter((item) => item.type === 'crypto').length}
            </div>
          </div>
          <div className="editorial-panel p-5">
            <div className="stat-kicker">Commodities</div>
            <div className="mt-3 font-serif text-4xl tracking-[-0.05em] text-off-white">
              {marketData.filter((item) => item.type === 'commodity').length}
            </div>
          </div>
          <div className="editorial-panel p-5">
            <div className="stat-kicker">Regional</div>
            <div className="mt-3 font-serif text-4xl tracking-[-0.05em] text-off-white">
              {marketData.filter((item) => item.type === 'middleeast' || item.type === 'gcc').length}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default MarketsPage
