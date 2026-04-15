import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Globe, Heart, Lightbulb, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'

const coreValues = [
  {
    icon: <Lightbulb size={18} className="text-dusk-rose" />,
    title: 'Infrastructure over hype',
    description: 'We focus on systems, incentives, and deployment realities rather than novelty cycles.',
  },
  {
    icon: <Globe size={18} className="text-dusk-rose" />,
    title: 'Regional fluency',
    description: 'The desk is tuned to GCC and Arab world context, not just imported narratives.',
  },
  {
    icon: <Heart size={18} className="text-dusk-rose" />,
    title: 'Clear editorial judgment',
    description: 'We aim for authority without bluster and for signal without flattening nuance.',
  },
  {
    icon: <Users size={18} className="text-dusk-rose" />,
    title: 'Operator perspective',
    description: 'AIRAB is built for founders, investors, policy teams, and executives who need useful context.',
  },
  {
    icon: <Target size={18} className="text-dusk-rose" />,
    title: 'Future-facing but grounded',
    description: 'We care about what is becoming operational now, not just what is theoretically possible.',
  },
]

const hosts = [
  {
    name: 'Nora Al-Mansouri',
    title: 'AI Investment Expert and Former McKinsey Consultant',
    bio: 'UAE national with a Harvard MBA and MIT AI certification. Nora translates venture, capital allocation, and market strategy into language that business operators can act on.',
    expertise: ['Investment analysis', 'Market strategy', 'Business intelligence', 'Startup ecosystems'],
    image: '/images/avatars/nora/nora_professional_formal.png',
  },
  {
    name: 'Omar Al-Rashid',
    title: 'AI Research Pioneer and Serial Entrepreneur',
    bio: 'Former Google AI researcher from Saudi Arabia with a Stanford computer science PhD. Omar sits at the intersection of technical depth, operating experience, and regional deployment reality.',
    expertise: ['AI research', 'Machine learning', 'Entrepreneurship', 'Applied innovation'],
    image: '/images/avatars/omar/omar_tech_executive.png',
  },
]

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About AIRAB Money</title>
        <meta
          name="description"
          content="Learn about AIRAB Money's mission, editorial point of view, and the AI-powered hosts behind the desk."
        />
      </Helmet>

      <PageIntro
        eyebrow="About the desk"
        title="An editorial data brand built for the region’s AI economy."
        description="AIRAB Money exists to cover what happens when AI becomes infrastructure, policy, and capital allocation rather than just a talking point. The desk sits between journalism, market intelligence, and regional context."
        actions={
          <Link to="/contact" className="rose-button">
            Talk to the desk
          </Link>
        }
        metrics={[
          { label: 'Publishing languages', value: '02' },
          { label: 'Core hosts', value: '02' },
          { label: 'Regional focus', value: 'GCC+' },
        ]}
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="editorial-panel p-8">
            <div className="eyebrow">Mission</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">Translate the AI economy into a readable regional signal.</h2>
            <p className="mt-5 text-base leading-8 text-brushed-silver">
              We cover capital flows, regulation, infrastructure, and operator strategy so decision-makers in the Arab world can see the system beneath the headlines.
            </p>
          </div>

          <div className="editorial-panel p-8">
            <div className="eyebrow">Editorial thesis</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">AI is no longer a technology beat alone.</h2>
            <p className="mt-5 text-base leading-8 text-brushed-silver">
              It is a market structure story, a policy story, and an industrial capacity story. AIRAB is designed around that broader frame and around the region’s specific strategic posture.
            </p>
          </div>
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="editorial-panel p-8 md:p-10">
          <div className="eyebrow">Why now</div>
          <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1.1fr)_0.9fr]">
            <div className="space-y-5 text-base leading-8 text-brushed-silver">
              <p>
                AIRAB Money was built around a simple observation: the Arab world’s AI story is often discussed through outside narratives, while the region’s own operating logic gets under-covered.
              </p>
              <p>
                From sovereign compute bets to startup financing, from Arabic-language tooling to industrial deployment, the most important developments are often not the loudest ones.
              </p>
              <p>
                The desk exists to map that terrain clearly and consistently, with enough editorial restraint that the information remains useful after the headline cycle has moved on.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'State-backed infrastructure is becoming a decisive competitive layer.',
                'Regional regulation now shapes execution as much as raw model capability.',
                'Capital, language, and energy all matter more than generic AI boosterism.',
              ].map((point) => (
                <div key={point} className="border border-white/5 bg-white/[0.02] p-5 text-sm leading-7 text-brushed-silver">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="mb-6">
          <div className="eyebrow">Operating principles</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">What the desk optimizes for</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {coreValues.map((value) => (
            <div key={value.title} className="editorial-panel p-6">
              <div className="flex items-center gap-3">
                {value.icon}
                <h3 className="font-serif text-2xl tracking-[-0.04em] text-off-white">{value.title}</h3>
              </div>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="mb-6">
          <div className="eyebrow">Hosts</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">The AIRAB voices behind the desk</h2>
        </div>

        <div className="space-y-6">
          {hosts.map((host) => (
            <div key={host.name} className="editorial-panel overflow-hidden">
              <div className="grid xl:grid-cols-[18rem_minmax(0,1fr)]">
                <div className="border-b border-white/5 xl:border-b-0 xl:border-r">
                  <img src={host.image} alt={host.name} className="h-full w-full object-cover grayscale" />
                </div>
                <div className="space-y-5 p-8 md:p-10">
                  <div className="eyebrow">Host profile</div>
                  <div>
                    <h3 className="font-serif text-3xl tracking-[-0.04em] text-off-white">{host.name}</h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-dusk-rose">{host.title}</p>
                  </div>
                  <p className="max-w-3xl text-base leading-8 text-brushed-silver">{host.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {host.expertise.map((skill) => (
                      <span key={skill} className="data-pill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default AboutPage
