import React, { useState, useEffect, useCallback } from 'react'
import { Helmet } from 'react-helmet-async'
import { createClient } from '@supabase/supabase-js'

interface MarketData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  type: 'stock' | 'crypto' | 'commodity' | 'gcc' | 'index' | 'middleeast'
}

// Initialize Supabase client
const supabaseUrl = "https://legcfikbspvftdqpdvxg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxlZ2NmaWtic3B2ZnRkcXBkdnhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MzA5NDcsImV4cCI6MjA5MDIwNjk0N30.7kWYYWi0H2k1ARA0tK6x7o-KtAKdYhLb3AjV7y3MYDI";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MarketsPage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [activeTab, setActiveTab] = useState<'all' | 'indices' | 'crypto' | 'commodities' | 'middleeast'>('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [marketData, setMarketData] = useState<MarketData[]>([])

  const fetchMarketData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Call the Supabase edge function for market data
      const { data, error: fnError } = await supabase.functions.invoke('market-data', {
        method: 'GET'
      });

      if (fnError) {
        throw new Error(fnError.message)
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to fetch market data')
      }

      const fetchedData = data.data as MarketData[]
      
      if (fetchedData && fetchedData.length > 0) {
        setMarketData(fetchedData)
      } else {
        throw new Error('No market data received')
      }
    } catch (err: any) {
      console.error('Failed to fetch market data:', err)
      setError(err.message || 'Unable to load market data')
      setMarketData([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketData()
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchMarketData, 60000)
    return () => clearInterval(interval)
  }, [fetchMarketData])

  const filteredData = activeTab === 'all' 
    ? marketData 
    : marketData.filter(item => {
        if (activeTab === 'indices') return item.type === 'index'
        if (activeTab === 'middleeast') return item.type === 'middleeast'
        return item.type === activeTab
      })

  const formatPrice = (price: number): string => {
    if (price > 10000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (price > 1000) return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    if (price > 100) return price.toFixed(2)
    if (price > 1) return price.toFixed(2)
    return price.toFixed(4)
  }

  const getTabLabel = (tab: string): string => {
    if (language === 'ar') {
      const labels: Record<string, string> = {
        all: 'الكل',
        indices: 'المؤشرات',
        crypto: 'العملات المشفرة',
        commodities: 'السلع',
        middleeast: 'الخليج'
      }
      return labels[tab] || tab
    }
    const enLabels: Record<string, string> = {
      all: 'All',
      indices: 'Indices',
      crypto: 'Crypto',
      commodities: 'Commodities',
      middleeast: 'Middle East'
    }
    return enLabels[tab] || tab
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'crypto': return 'bg-orange-500/20 text-orange-500'
      case 'commodity': return 'bg-yellow-500/20 text-yellow-500'
      case 'middleeast': return 'bg-green-500/20 text-green-500'
      case 'index': return 'bg-blue-500/20 text-blue-500'
      case 'gcc': return 'bg-purple-500/20 text-purple-500'
      default: return 'bg-gray-500/20 text-gray-500'
    }
  }

  return (
    <>
      <Helmet>
        <title>Live Markets - AIRAB Money 2026</title>
        <meta name="description" content="Real-time financial market data including stocks, crypto, commodities, and Middle East markets" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-background to-primary/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,217,255,0.15),transparent_60%)]"></div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm text-green-500 font-medium">
                {language === 'en' ? 'Live Data' : 'بيانات حية'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              {language === 'en' ? 'Live Markets' : 'أسواق حية'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {language === 'en'
                ? 'Real-time financial data from global markets. Indices, cryptocurrencies, commodities, and Middle East markets - all in one place.'
                : 'بيانات مالية في الوقت الفعلي من الأسواق العالمية. المؤشرات والعملات المشفرة والسلع وأسواق الشرق الأوسط - كل شيء في مكان واحد.'
              }
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 rounded-full transition-all ${language === 'en' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-6 py-2 rounded-full transition-all ${language === 'ar' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              >
                العربية
              </button>
            </div>
          </div>
        </section>

        {/* Market Tabs */}
        <section className="px-4 mb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center">
              {['all', 'indices', 'crypto', 'commodities', 'middleeast'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-6 py-2 rounded-full transition-all ${
                    activeTab === tab 
                      ? 'bg-primary text-white' 
                      : 'bg-card text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {getTabLabel(tab)}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Market Data Grid */}
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                    <div className="h-4 bg-muted rounded w-1/3 mb-3"></div>
                    <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            ) : error && marketData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-red-500 text-lg mb-2">{error}</p>
                <button 
                  onClick={fetchMarketData}
                  className="px-6 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  {language === 'en' ? 'Retry' : 'إعادة المحاولة'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredData.map((item) => (
                  <div
                    key={item.symbol}
                    className="glass-card rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          {item.symbol}
                        </span>
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.name}
                        </h3>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                        {item.type === 'middleeast' ? 'ME' : item.type}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-2xl font-bold text-foreground">
                        {item.type === 'crypto' ? '$' : item.type === 'commodity' ? '$' : ''}
                        {formatPrice(item.price)}
                      </span>
                    </div>
                    
                    <div className={`flex items-center gap-1 ${
                      item.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      <svg 
                        className={`w-4 h-4 ${item.change < 0 ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      <span className="font-medium">
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                      </span>
                      <span className="text-sm">
                        ({item.change >= 0 ? '+' : ''}{item.changePercent?.toFixed(2) || 0}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Market Summary Cards */}
        <section className="px-4 pb-16 bg-card/50">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    {language === 'en' ? 'Global Indices' : 'المؤشرات العالمية'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {marketData.filter(i => i.type === 'index').length} 
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {language === 'en' ? 'indices' : 'مؤشر'}
                  </span>
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    {language === 'en' ? 'Crypto' : 'العملات المشفرة'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {marketData.filter(i => i.type === 'crypto').length}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {language === 'en' ? 'coins' : 'عملة'}
                  </span>
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    {language === 'en' ? 'Commodities' : 'السلع'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {marketData.filter(i => i.type === 'commodity').length}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {language === 'en' ? 'assets' : 'أصل'}
                  </span>
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-muted-foreground">
                    {language === 'en' ? 'Middle East' : 'الشرق الأوسط'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  {marketData.filter(i => i.type === 'middleeast' || i.type === 'gcc').length}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    {language === 'en' ? 'indices' : 'مؤشر'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default MarketsPage
