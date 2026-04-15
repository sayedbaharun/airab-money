import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Globe, Lightbulb, Mic2, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'

const coreValues = [
  {
    icon: <Lightbulb size={18} className="text-dusk-rose" />,
    title: 'Capital-aware coverage',
    description: 'We treat ownership, funding, and deployment as the center of the AI story rather than background detail.',
  },
  {
    icon: <Globe size={18} className="text-dusk-rose" />,
    title: 'Regional first',
    description: 'The desk starts from Gulf and Middle Eastern incentives, not imported narratives about the region.',
  },
  {
    icon: <Target size={18} className="text-dusk-rose" />,
    title: 'Infrastructure over hype',
    description: 'Compute, power, cloud, semiconductors, and regulation matter more than generic AI boosterism.',
  },
  {
    icon: <Users size={18} className="text-dusk-rose" />,
    title: 'Operator usefulness',
    description: 'AIRAB is built for investors, founders, policymakers, and executives who need signal they can act on.',
  },
  {
    icon: <Mic2 size={18} className="text-dusk-rose" />,
    title: 'AI-native publishing',
    description: 'The product is designed for AI-generated articles and daily AI-presented briefings across audio and video.',
  },
]

const workflowSteps = [
  {
    step: '01',
    title: 'Source intake',
    description: 'Track fund deployment, company rounds, infrastructure announcements, policy changes, and market signals tied to AI.',
  },
  {
    step: '02',
    title: 'AI article generation',
    description: 'Turn structured inputs into first-pass articles focused on capital flows, ownership, and operating consequences.',
  },
  {
    step: '03',
    title: 'Editorial QA',
    description: 'Check framing, sourcing, tags, and strategic relevance before the file hits the public desk.',
  },
  {
    step: '04',
    title: 'Daily AI briefing',
    description: 'Convert the day\'s file stack into podcast and YouTube-ready scripts delivered by AI presenters.',
  },
]

const presenterStack = [
  {
    name: 'Ahmad',
    role: 'Anchor voice',
    description: 'Used for calm, authoritative daily briefings on capital deployment and infrastructure financing.',
  },
  {
    name: 'ARIA',
    role: 'Fast file voice',
    description: 'Designed for concise market and company updates when the desk needs tighter turnaround.',
  },
  {
    name: 'Khaled',
    role: 'Saudi lens',
    description: 'Best suited to policy, industrial AI, compute, and capital formation stories anchored in Saudi Arabia.',
  },
  {
    name: 'Fatima',
    role: 'Distribution voice',
    description: 'Optimized for energetic recaps, YouTube cuts, and shorter formats without losing AIRAB tone.',
  },
]

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>About AIRAB Money</title>
        <meta
          name="description"
          content="Learn AIRAB Money's editorial thesis, AI-native production workflow, and presenter system for Middle East AI capital coverage."
        />
      </Helmet>

      <PageIntro
        eyebrow="About the desk"
        title="An AI-native intelligence desk for Middle East AI capital."
        description="AIRAB tracks where Gulf and wider Middle Eastern capital is being deployed into AI globally, and how regional AI companies, compute clusters, and infrastructure are being financed at home."
        actions={
          <Link to="/contact" className="rose-button">
            Talk to the desk
          </Link>
        }
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="editorial-panel p-8">
            <div className="eyebrow">Mission</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">Track the balance sheet behind regional AI.</h2>
            <p className="mt-5 text-base leading-8 text-brushed-silver">
              We focus on outbound capital, inbound investment, infrastructure financing, and the policy moves that change how AI gets funded and deployed across the Middle East.
            </p>
          </div>

          <div className="editorial-panel p-8">
            <div className="eyebrow">Editorial thesis</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">If capital moves, it belongs on the desk.</h2>
            <p className="mt-5 text-base leading-8 text-brushed-silver">
              The center of the AIRAB story is ownership, compute, energy, regulation, and execution. We care less about generic AI commentary and more about who is funding what, where, and why.
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
                Gulf capital is no longer only financing local technology stories. It is becoming a meaningful shareholder in the global AI stack, from compute and data centres to model tooling and strategic equity positions.
              </p>
              <p>
                At the same time, the region is financing its own AI build-out across data centres, inference capacity, industrial deployments, cloud partnerships, and national policy frameworks.
              </p>
              <p>
                AIRAB exists to map those two movements together: where Middle Eastern money goes internationally, and what is being built with AI capital inside the region itself.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Gulf capital is becoming a global AI shareholder.',
                'Regional AI build-out depends on compute, power, cloud, and permitting.',
                'A daily AI-native briefing format can compress this signal faster than legacy media.',
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
          <div className="eyebrow">Publishing workflow</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">How AIRAB turns signal into output</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {workflowSteps.map((step) => (
            <div key={step.step} className="editorial-panel p-6">
              <div className="font-serif text-4xl tracking-[-0.05em] text-dusk-rose">{step.step}</div>
              <h3 className="mt-4 font-serif text-2xl tracking-[-0.04em] text-off-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-page pt-0">
        <div className="mb-6">
          <div className="eyebrow">Presenter system</div>
          <h2 className="mt-3 font-serif text-3xl tracking-[-0.04em] text-off-white">The AI voices used for daily briefings</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {presenterStack.map((presenter) => (
            <div key={presenter.name} className="editorial-panel p-6">
              <div className="flex h-12 w-12 items-center justify-center border border-dusk-rose/40 bg-dusk-rose/10 font-serif text-xl text-off-white">
                {presenter.name[0]}
              </div>
              <h3 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">{presenter.name}</h3>
              <div className="mt-2 text-sm uppercase tracking-[0.18em] text-dusk-rose">{presenter.role}</div>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">{presenter.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default AboutPage
