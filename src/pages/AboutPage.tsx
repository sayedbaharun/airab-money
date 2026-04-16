import React from 'react'
import { Globe, Lightbulb, Target, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageSeo from '../components/PageSeo'
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
    icon: <Lightbulb size={18} className="text-dusk-rose" />,
    title: 'AI-assisted production',
    description: 'The desk uses AI to accelerate drafting and packaging, but the public promise is still clarity, relevance, and editorial judgment.',
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
    title: 'Desk distribution',
    description: 'Send the finished file through the site, the mailing list, and the next selective distribution channel.',
  },
]

const AboutPage = () => {
  return (
    <>
      <PageSeo
        title="About"
        description="Learn AIRAB Money's editorial thesis, soft-launch scope, and production workflow for Middle East AI capital coverage."
        path="/about"
      />

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
                'A tighter, operator-first desk can compress this signal faster than legacy media.',
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
        <div className="editorial-panel p-8 md:p-10">
          <div className="eyebrow">Soft-launch scope</div>
          <div className="mt-5 grid gap-8 xl:grid-cols-[minmax(0,1fr)_0.8fr]">
            <div className="space-y-5 text-base leading-8 text-brushed-silver">
              <p>
                AIRAB is deliberately launching with a narrower public surface than the long-term product vision.
                The site is starting with coverage, the markets desk, contact and guest intake, and the supporting
                pages needed to run the desk cleanly.
              </p>
              <p>
                Briefings, long-form capital notes, and the public studio return only after they are operationally
                real, not because the interface is already designed.
              </p>
            </div>

            <div className="space-y-4">
              {[
                'Coverage and markets stay public for the soft launch.',
                'The archive is intentionally small while test content is replaced with real files.',
                'The next layers reopen only when they can be operated consistently.',
              ].map((point) => (
                <div key={point} className="border border-white/5 bg-white/[0.02] p-5 text-sm leading-7 text-brushed-silver">
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage
