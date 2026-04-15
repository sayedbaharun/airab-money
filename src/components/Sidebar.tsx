import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { coverageSignals, platformNavigation, primaryNavigation } from './siteNavigation'

const Sidebar = () => {
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [dubaiTime, setDubaiTime] = useState('')

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Dubai',
      hour: '2-digit',
      minute: '2-digit',
    })

    const tick = () => setDubaiTime(formatter.format(new Date()))
    tick()

    const intervalId = window.setInterval(tick, 60_000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const renderNavigationSection = (
    title: string,
    items: typeof primaryNavigation,
  ) => (
    <div className="space-y-3">
      <div className="stat-kicker">{title}</div>
      <ul className="space-y-1.5">
        {items.map((item) => {
          const Icon = item.icon
          const isActive =
            item.href === '/'
              ? location.pathname === item.href
              : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`)

          return (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`group flex items-start gap-3 border px-3 py-3 transition-colors duration-200 ${
                  isActive
                    ? 'border-dusk-rose/50 bg-white/[0.04] text-off-white'
                    : 'border-transparent text-brushed-silver hover:border-white/10 hover:bg-white/[0.03] hover:text-off-white'
                }`}
              >
                <Icon size={17} className={`mt-0.5 ${isActive ? 'text-dusk-rose' : 'text-brushed-silver/60 group-hover:text-dusk-rose'}`} />
                <span className="space-y-1">
                  <span className="block text-sm uppercase tracking-[0.22em]">{item.label}</span>
                  <span className="block text-xs text-brushed-silver/65">{item.description}</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )

  const panel = (
    <div className="flex h-full flex-col bg-[#171717]">
      <div className="border-b border-white/5 px-6 py-6">
        <Link to="/" className="block space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center border border-dusk-rose/50 bg-dusk-rose/10 font-serif text-xl tracking-[-0.05em] text-off-white">
              A
            </div>
            <div>
              <div className="eyebrow">AIRAB Money</div>
              <div className="mt-2 font-serif text-2xl leading-none tracking-[-0.06em] text-off-white">
                Editorial<br />
                data desk
              </div>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6 text-brushed-silver">
            Intelligence on markets, policy, and regional AI infrastructure for the Arab world.
          </p>
        </Link>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-6 py-6">
        <div className="editorial-panel p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="stat-kicker">Dubai live</div>
              <div className="mt-2 font-serif text-3xl tracking-[-0.05em] text-off-white">{dubaiTime || '--:--'}</div>
            </div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-dusk-rose">
              <span className="h-2 w-2 rounded-full bg-dusk-rose" />
              GST
            </div>
          </div>
        </div>

        {renderNavigationSection('Newsroom', primaryNavigation)}
        {renderNavigationSection('Platform', platformNavigation)}

        <div className="space-y-3">
          <div className="stat-kicker">Coverage signal</div>
          <div className="editorial-panel space-y-4 p-4">
            {coverageSignals.map((signal) => (
              <p key={signal} className="border-b border-white/5 pb-4 text-sm leading-6 text-brushed-silver last:border-b-0 last:pb-0">
                {signal}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/5 bg-graphite/95 px-5 py-4 backdrop-blur lg:hidden">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-dusk-rose/40 bg-dusk-rose/10 font-serif text-lg text-off-white">
            A
          </div>
          <div>
            <div className="eyebrow">AIRAB Money</div>
            <div className="mt-1 font-serif text-lg tracking-[-0.04em] text-off-white">Editorial desk</div>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center border border-white/10 text-off-white transition-colors hover:border-dusk-rose/40 hover:text-dusk-rose"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 border-r border-white/5 lg:block">
        {panel}
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/65"
            aria-label="Close navigation"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[19rem] border-r border-white/5">
            {panel}
          </div>
        </div>
      ) : null}
    </>
  )
}

export default Sidebar
