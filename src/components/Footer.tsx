import React from 'react'
import { Link } from 'react-router-dom'
import { Instagram, Linkedin, Mail, MapPin, Twitter, Youtube } from 'lucide-react'
import { platformNavigation, primaryNavigation } from './siteNavigation'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/5 bg-[#151515]">
      <div className="editorial-page py-12">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.2fr)_0.8fr_0.8fr]">
          <div className="space-y-5">
            <div className="eyebrow">AIRAB Money</div>
            <h2 className="font-serif text-3xl leading-none tracking-[-0.05em] text-off-white">
              An AI-native desk for Gulf capital, compute, and infrastructure intelligence.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-brushed-silver">
              We track how Middle Eastern capital is deployed into AI globally and how AI companies, data centres, and policy stacks are being built across the region.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-brushed-silver">
              <a
                href="https://twitter.com/airabmoney"
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-button"
              >
                <Twitter size={16} />
                X
              </a>
              <a
                href="https://linkedin.com/company/airabmoney"
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-button"
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
              <a
                href="https://instagram.com/airabmoney"
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-button"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href="https://youtube.com/@airabmoney"
                target="_blank"
                rel="noopener noreferrer"
                className="ghost-button"
              >
                <Youtube size={16} />
                YouTube
              </a>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-1">
            <div>
              <div className="stat-kicker mb-4">Newsroom</div>
              <ul className="space-y-3">
                {primaryNavigation.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="group flex items-start justify-between gap-3 text-sm text-brushed-silver transition-colors hover:text-off-white">
                      <span>{item.label}</span>
                      <span className="text-xs uppercase tracking-[0.22em] text-brushed-silver/40 group-hover:text-dusk-rose">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="stat-kicker mb-4">Platform</div>
              <ul className="space-y-3">
                {platformNavigation.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href} className="group flex items-start justify-between gap-3 text-sm text-brushed-silver transition-colors hover:text-off-white">
                      <span>{item.label}</span>
                      <span className="text-xs uppercase tracking-[0.22em] text-brushed-silver/40 group-hover:text-dusk-rose">
                        {item.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            <div className="stat-kicker">Desk contact</div>
            <div className="editorial-panel space-y-4 p-5 text-sm text-brushed-silver">
              <div className="flex items-start gap-3">
                <Mail size={16} className="mt-1 text-dusk-rose" />
                <div>
                  <div className="text-off-white">hello@airabmoney.com</div>
                  <div className="mt-1 text-brushed-silver/70">Editorial, partnerships, and guest desk enquiries.</div>
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
            <p className="text-xs uppercase tracking-[0.24em] text-brushed-silver/50">
              © {currentYear} AIRAB Money
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
