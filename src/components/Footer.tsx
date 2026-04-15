import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Mail, MapPin, Twitter, Youtube } from 'lucide-react'
import { coverageSignals, platformNavigation, primaryNavigation } from './siteNavigation'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  const newsroomLinks = primaryNavigation.filter((item) => item.href !== '/')
  const companyLinks = platformNavigation.concat(primaryNavigation.filter((item) => item.href === '/about' || item.href === '/contact'))
  const socialLinks = [
    { href: 'https://twitter.com/airabmoney', label: 'X', icon: Twitter },
    { href: 'https://linkedin.com/company/airabmoney', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://instagram.com/airabmoney', label: 'Instagram', icon: Instagram },
    { href: 'https://youtube.com/@airabmoney', label: 'YouTube', icon: Youtube },
  ]

  return (
    <footer className="border-t border-white/5 bg-[#121212]">
      <div className="editorial-page py-12">
        <div className="rounded-[28px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-8 md:p-10">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_0.7fr_0.7fr_0.85fr]">
            <div className="space-y-6">
              <div className="eyebrow">AIRAB Money</div>
              <div className="space-y-4">
                <h2 className="max-w-3xl font-serif text-3xl leading-[0.96] tracking-[-0.05em] text-off-white">
                  The AI capital desk tracking Gulf money, compute build-out, and regional infrastructure signals.
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-brushed-silver">
                  AIRAB follows where capital is being allocated, which operators are building infrastructure,
                  and how policy and markets are shaping AI execution across the Middle East.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {coverageSignals.map((signal) => (
                  <div key={signal} className="rounded-2xl border border-white/6 bg-white/[0.02] p-4 text-sm leading-6 text-brushed-silver">
                    {signal}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="stat-kicker">Newsroom</div>
              <ul className="space-y-3">
                {newsroomLinks.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-sm text-brushed-silver transition-colors hover:text-off-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="stat-kicker">Company</div>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="text-sm text-brushed-silver transition-colors hover:text-off-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <div className="stat-kicker">Desk contact</div>
              <div className="space-y-4 text-sm text-brushed-silver">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="mt-1 text-dusk-rose" />
                  <div>
                    <div className="text-off-white">hello@airabmoney.com</div>
                    <div className="mt-1 text-brushed-silver/70">Editorial leads, partnerships, and guest desk enquiries.</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 text-dusk-rose" />
                  <div>
                    <div className="text-off-white">Dubai Internet City</div>
                    <div className="mt-1 text-brushed-silver/70">Dubai, United Arab Emirates</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/8 bg-white/[0.02] text-brushed-silver transition-colors hover:border-dusk-rose/50 hover:text-off-white"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/6 pt-5 text-xs uppercase tracking-[0.22em] text-brushed-silver/45 md:flex-row md:items-center md:justify-between">
            <div>© {currentYear} AIRAB Money</div>
            <div>Dubai desk / Daily AI briefings / AI-generated, desk reviewed</div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
