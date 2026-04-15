import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Newspaper, BarChart3, Headphones } from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const navigation = [
    { name: 'HOME', href: '/', icon: Home },
    { name: 'DEEP TECH NEWS', href: '/articles', icon: Newspaper },
    { name: 'MARKET ANALYSIS', href: '/markets', icon: BarChart3 },
    { name: 'EPISODES', href: '/episodes', icon: Headphones },
  ]

  const trending = [
    'NEOM AI Hub',
    'UAE Data Policy',
    'G42 Investment',
    'Saudi AI Strategy'
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-dusk-rose flex flex-col p-8 fixed h-full shadow-2xl">
      {/* Logo */}
      <div className="mb-12">
        <Link to="/" className="block">
          <h1 className="text-2xl font-serif font-bold text-brushed-silver tracking-tighter">
            AIRAB MONEY
          </h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        <ul className="space-y-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-sm transition-all duration-200 ${
                    active
                      ? 'text-white border-l-2 border-brushed-silver bg-dusk-rose/80'
                      : 'text-brushed-silver hover:text-white hover:bg-dusk-rose/60'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium tracking-wide">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Trending Section */}
      <div className="mt-auto border-t border-white/20 pt-6">
        <p className="text-xs text-white/60 tracking-widest uppercase mb-4">Trending</p>
        <ul className="text-sm space-y-2 text-white/80">
          {trending.map((item) => (
            <li key={item} className="hover:underline cursor-pointer">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar