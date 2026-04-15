import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const MarketDataWidget = () => {
  const ksaIndex = {
    value: '2,841.50',
    change: '+2.4%',
    changeType: 'up'
  }

  const uaeIndex = {
    value: '1,892.30',
    change: '+1.8%',
    changeType: 'up'
  }

  const topMovers = [
    { ticker: 'ARAMCO-AI', change: '+1.2%', changeType: 'up' },
    { ticker: 'STC-TECH', change: '+0.8%', changeType: 'up' },
    { ticker: 'G42-INV', change: '-0.3%', changeType: 'down' },
    { ticker: 'NEOM-AI', change: '+3.1%', changeType: 'up' }
  ]

  const Sparkline = ({ data }: { data: number[] }) => (
    <svg className="w-full h-16" viewBox="0 0 100 40">
      <path
        d={`M0 ${40 - data[0]} ${data.map((point, i) =>
          `L${(i / (data.length - 1)) * 100} ${40 - point}`
        ).join(' ')}`}
        fill="none"
        stroke="#A67C74"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  // Sample data for sparklines
  const ksaData = [25, 28, 22, 35, 30, 38, 32, 40]
  const uaeData = [20, 25, 18, 30, 28, 35, 32, 38]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* KSA AI Index */}
      <div className="bg-graphite border border-white/5 p-6 rounded-none">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-brushed-silver text-xs uppercase tracking-widest">KSA AI Index</h3>
            <p className="text-4xl font-light mt-1 text-off-white">{ksaIndex.value}</p>
          </div>
          <div className={`flex items-center space-x-1 ${ksaIndex.changeType === 'up' ? 'text-dusk-rose' : 'text-gray-500'}`}>
            {ksaIndex.changeType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-bold">{ksaIndex.change}</span>
          </div>
        </div>

        <div className="h-24 w-full bg-gradient-to-t from-dusk-rose/5 to-transparent border-b border-dusk-rose/30 relative">
          <Sparkline data={ksaData} />
        </div>
      </div>

      {/* UAE Tech Index */}
      <div className="bg-graphite border border-white/5 p-6 rounded-none">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-brushed-silver text-xs uppercase tracking-widest">UAE Tech Index</h3>
            <p className="text-4xl font-light mt-1 text-off-white">{uaeIndex.value}</p>
          </div>
          <div className={`flex items-center space-x-1 ${uaeIndex.changeType === 'up' ? 'text-dusk-rose' : 'text-gray-500'}`}>
            {uaeIndex.changeType === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="text-sm font-bold">{uaeIndex.change}</span>
          </div>
        </div>

        <div className="h-24 w-full bg-gradient-to-t from-dusk-rose/5 to-transparent border-b border-dusk-rose/30 relative">
          <Sparkline data={uaeData} />
        </div>
      </div>

      {/* Top AI Movers Table */}
      <div className="lg:col-span-2 bg-graphite border border-white/5 p-6">
        <h3 className="text-brushed-silver text-xs uppercase tracking-widest mb-4">Top AI Movers</h3>
        <div className="space-y-3">
          {topMovers.map((stock) => (
            <div key={stock.ticker} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-b-0">
              <span className="text-brushed-silver font-mono text-sm tracking-wide">{stock.ticker}</span>
              <span className={`text-sm font-bold ${stock.changeType === 'up' ? 'text-dusk-rose' : 'text-gray-500'}`}>
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketDataWidget