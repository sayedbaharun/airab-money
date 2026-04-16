import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { legalNavigation, platformNavigation, primaryNavigation } from './siteNavigation'

const deskSignals = ['Gulf capital', 'Compute build-out', 'Policy signals']

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const newsroomLinks = primaryNavigation.filter((item) => item.href === '/' || item.href === '/articles' || item.href === '/markets')
  const companyLinks = platformNavigation.concat(
    primaryNavigation.filter((item) => item.href === '/about' || item.href === '/contact'),
  )

  return (
    <footer className="border-t border-white/5 bg-[#111111]">
      <div className="editorial-page py-8 md:py-10">
        <div className="overflow-hidden border border-white/6 bg-[radial-gradient(circle_at_top_left,rgba(166,124,116,0.14),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))]">
          <div className="grid gap-8 border-b border-white/6 px-6 py-6 md:px-8 md:py-7 xl:grid-cols-[minmax(0,1.3fr)_0.8fr] xl:items-start">
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-dusk-rose/45 bg-dusk-rose/10 font-serif text-xl tracking-[-0.05em] text-off-white">
                  A
                </div>
                <div className="space-y-3">
                  <div className="eyebrow">AIRAB Money</div>
                  <div className="font-serif text-3xl leading-[0.95] tracking-[-0.06em] text-off-white md:text-[2.15rem]">
                    Editorial data desk
                  </div>
                  <p className="max-w-2xl text-sm leading-7 text-brushed-silver">
                    Coverage of Gulf AI capital, compute infrastructure, market context, and the policy signals shaping regional execution.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {deskSignals.map((signal) => (
                  <span key={signal} className="data-pill border-white/8 bg-white/[0.02] px-3 py-1 text-[10px] tracking-[0.24em] text-brushed-silver/85">
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <a
                href="mailto:hello@airabmoney.com"
                className="group border border-white/8 bg-black/15 p-4 transition-colors hover:border-dusk-rose/35 hover:bg-white/[0.03]"
              >
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-0.5 text-dusk-rose" />
                  <div className="min-w-0">
                    <div className="stat-kicker">Desk contact</div>
                    <div className="mt-2 truncate text-sm text-off-white">hello@airabmoney.com</div>
                    <div className="mt-1 text-xs leading-5 text-brushed-silver/65">
                      Editorial leads, guest desk enquiries, and launch notes.
                    </div>
                  </div>
                </div>
              </a>

              <div className="border border-white/8 bg-black/15 p-4">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-0.5 text-dusk-rose" />
                  <div>
                    <div className="stat-kicker">Desk base</div>
                    <div className="mt-2 text-sm text-off-white">Dubai, United Arab Emirates</div>
                    <div className="mt-1 text-xs leading-5 text-brushed-silver/65">
                      Independent soft-launch desk with regional market focus.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-5 md:grid-cols-3 md:px-8 md:py-6">
            <div className="space-y-4">
              <div className="stat-kicker">Explore</div>
              <ul className="space-y-2">
                {newsroomLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group flex items-center justify-between gap-4 border-b border-white/6 py-2 text-sm text-brushed-silver transition-colors hover:text-off-white"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={14} className="text-brushed-silver/35 transition-colors group-hover:text-dusk-rose" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="stat-kicker">Desk</div>
              <ul className="space-y-2">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group flex items-center justify-between gap-4 border-b border-white/6 py-2 text-sm text-brushed-silver transition-colors hover:text-off-white"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={14} className="text-brushed-silver/35 transition-colors group-hover:text-dusk-rose" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="stat-kicker">Policies</div>
              <ul className="space-y-2">
                {legalNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className="group flex items-center justify-between gap-4 border-b border-white/6 py-2 text-sm text-brushed-silver transition-colors hover:text-off-white"
                    >
                      <span>{item.label}</span>
                      <ArrowUpRight size={14} className="text-brushed-silver/35 transition-colors group-hover:text-dusk-rose" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-white/6 px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-brushed-silver/45 md:flex-row md:items-center md:justify-between md:px-8">
            <div>© {currentYear} AIRAB Money</div>
            <div>Dubai desk / Soft launch / AI-assisted, desk reviewed</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
