import React, { useMemo } from 'react'
import { ArrowUpRight, TrendingDown, TrendingUp } from 'lucide-react'
import { MarketData, MarketFeedMode } from '../lib/api'

interface MarketDataWidgetProps {
  marketData?: MarketData[]
  updatedAt?: string | null
  feedMode?: MarketFeedMode
}

const MarketDataWidget: React.FC<MarketDataWidgetProps> = ({ marketData, updatedAt, feedMode = 'snapshot' }) => {
  const data = useMemo(() => (marketData && marketData.length > 0 ? marketData : []), [marketData])

  const highlights = useMemo(
    () =>
      data
        .filter((item) => ['middleeast', 'index', 'commodity', 'crypto'].includes(item.type))
        .slice(0, 4),
    [data],
  )

  const movers = useMemo(
    () => [...data].sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 6),
    [data],
  )

  const regionalCount = data.filter((item) => item.type === 'middleeast' || item.type === 'gcc').length

  const typeLabel = (type: MarketData['type']) => {
    if (type === 'middleeast' || type === 'gcc') return 'Regional'
    if (type === 'index') return 'Index'
    if (type === 'commodity') return 'Commodity'
    if (type === 'crypto') return 'Crypto'
    return 'Equity'
  }

  const priceLabel = (item: MarketData) => {
    const prefix = item.type === 'crypto' || item.type === 'commodity' || item.type === 'stock' ? '$' : ''
    return `${prefix}${item.price.toLocaleString('en-US', {
      maximumFractionDigits: item.price > 100 ? 2 : 4,
      minimumFractionDigits: item.price > 100 ? 2 : 4,
    })}`
  }

  if (data.length === 0) {
    return (
      <section className="space-y-6">
        <div>
          <div className="eyebrow">Signal board</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.05em] text-off-white md:text-4xl">
            The market desk is wired, but the feed is not publishing yet.
          </h2>
        </div>

        <div className="editorial-panel max-w-3xl p-8">
          <p className="text-base leading-8 text-brushed-silver">
            Markets stay visible during the soft launch, but the feed has to be honest. Once the final data source is
            connected, AIRAB will surface the live tape here.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="eyebrow">Signal board</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.05em] text-off-white md:text-4xl">
            The market tape behind AI capital deployment.
          </h2>
        </div>
        <div className="space-y-2 text-sm text-brushed-silver">
          <div className="stat-kicker">{feedMode === 'live' ? 'Live feed' : 'Soft-launch snapshot'}</div>
          <div>{regionalCount} regional instruments in current rotation.</div>
          <div>
            {updatedAt
              ? `Updated ${new Date(updatedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}`
              : 'Feed timing unavailable.'}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_0.85fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {highlights.map((item) => {
            const positive = item.change >= 0
            const barWidth = Math.min(100, Math.max(14, 52 + item.changePercent * 8))

            return (
              <div key={item.symbol} className="editorial-panel p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="stat-kicker">{typeLabel(item.type)}</div>
                    <h3 className="mt-2 text-lg uppercase tracking-[0.18em] text-off-white">{item.symbol}</h3>
                    <p className="mt-2 text-sm leading-6 text-brushed-silver">{item.name}</p>
                  </div>
                  <div className={`mt-1 flex items-center gap-2 text-xs uppercase tracking-[0.22em] ${positive ? 'text-signal-green' : 'text-signal-red'}`}>
                    {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {Math.abs(item.changePercent).toFixed(2)}%
                  </div>
                </div>

                <div className="mt-7 font-serif text-4xl tracking-[-0.05em] text-off-white">{priceLabel(item)}</div>
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

        <div className="editorial-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="eyebrow">Fast movers</div>
              <h3 className="mt-2 font-serif text-2xl tracking-[-0.04em] text-off-white">Rotation check</h3>
            </div>
            <ArrowUpRight size={18} className="text-dusk-rose" />
          </div>

          <div className="mt-6 space-y-4">
            {movers.map((item) => {
              const positive = item.change >= 0

              return (
                <div key={item.symbol} className="flex items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
                  <div>
                    <div className="text-sm uppercase tracking-[0.2em] text-off-white">{item.symbol}</div>
                    <div className="mt-1 text-sm text-brushed-silver/75">{item.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-off-white">{priceLabel(item)}</div>
                    <div className={`mt-1 text-sm ${positive ? 'text-signal-green' : 'text-signal-red'}`}>
                      {positive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default MarketDataWidget
