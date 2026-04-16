import React, { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Copy, Mic2, Radio, Sparkles, Wand2 } from 'lucide-react'

interface AdminStudioLabProps {
  articleHeadline: string
  articleContent: string
}

const presenters = [
  {
    id: 'anchor',
    name: 'Anchor voice',
    description: 'Calm, authoritative, and best for the main daily rundown.',
  },
  {
    id: 'market',
    name: 'Market close',
    description: 'Faster delivery for tape moves, funding rounds, and market recaps.',
  },
  {
    id: 'operator',
    name: 'Operator brief',
    description: 'A tighter, sharper delivery for founders, investors, and infra operators.',
  },
]

const buildScript = (headline: string, content: string, presenterName: string) => {
  const cleanedBlocks = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .slice(0, 4)

  const lead = cleanedBlocks[0] || 'No article body is loaded yet. Bring an article into the studio to start shaping a briefing.'
  const takeaway = cleanedBlocks[1] || 'Use the studio to distill the money move, the infrastructure angle, and the regional consequence.'
  const close = cleanedBlocks[2] || 'End with what the audience should watch next: capital deployment, compute expansion, policy shifts, or operator execution.'

  return [
    `${presenterName} / AIRAB studio draft`,
    '',
    `Headline: ${headline || 'Untitled AIRAB file'}`,
    '',
    'Opening',
    `Today on AIRAB, the lead file is ${headline || 'still being prepared'}.`,
    '',
    'Core brief',
    lead,
    '',
    'Why it matters',
    takeaway,
    '',
    'What to watch',
    close,
    '',
    'Close',
    'That is the AIRAB read for now. Watch the next capital, infrastructure, or policy signal that moves this file forward.',
  ].join('\n')
}

const AdminStudioLab: React.FC<AdminStudioLabProps> = ({ articleHeadline, articleContent }) => {
  const [selectedPresenter, setSelectedPresenter] = useState(presenters[0].id)
  const [script, setScript] = useState('')

  const activePresenter = useMemo(
    () => presenters.find((presenter) => presenter.id === selectedPresenter) || presenters[0],
    [selectedPresenter],
  )

  useEffect(() => {
    setScript(buildScript(articleHeadline, articleContent, activePresenter.name))
  }, [activePresenter.name, articleContent, articleHeadline])

  const scriptMetrics = useMemo(() => {
    const words = script.trim() ? script.trim().split(/\s+/).length : 0
    return {
      words,
      estimatedMinutes: Math.max(1, Math.round(words / 150)),
    }
  }, [script])

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/5 bg-charcoal p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-dusk-rose/80">Studio lab</p>
            <h2 className="mt-2 text-2xl font-heading font-bold text-off-white">
              Internal workflow for briefings, voice tests, and publishing experiments
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-brushed-silver">
              This stays inside admin until the audio pipeline is real. Use it to shape presenter scripts,
              test packaging decisions, and define the release checklist before the public studio returns.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[22rem]">
            <div className="rounded-lg border border-white/5 bg-graphite p-4">
              <div className="stat-kicker">Loaded article</div>
              <div className="mt-2 text-sm font-semibold text-off-white">
                {articleHeadline ? 'Ready' : 'Waiting'}
              </div>
            </div>
            <div className="rounded-lg border border-white/5 bg-graphite p-4">
              <div className="stat-kicker">Script length</div>
              <div className="mt-2 text-sm font-semibold text-off-white">
                {scriptMetrics.words} words / ~{scriptMetrics.estimatedMinutes} min
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="space-y-6">
          <div className="rounded-xl border border-white/5 bg-charcoal p-5">
            <div className="stat-kicker mb-4">Presenter tracks</div>
            <div className="space-y-3">
              {presenters.map((presenter) => {
                const isActive = presenter.id === activePresenter.id

                return (
                  <button
                    key={presenter.id}
                    type="button"
                    onClick={() => setSelectedPresenter(presenter.id)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      isActive
                        ? 'border-dusk-rose/50 bg-dusk-rose/10 text-off-white'
                        : 'border-white/5 bg-graphite text-brushed-silver hover:border-dusk-rose/30 hover:text-off-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Mic2 size={16} className={isActive ? 'text-dusk-rose' : 'text-brushed-silver/60'} />
                      <div className="text-sm font-semibold">{presenter.name}</div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-brushed-silver">{presenter.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-charcoal p-5">
            <div className="stat-kicker mb-4">Production checklist</div>
            <div className="space-y-4 text-sm leading-7 text-brushed-silver">
              {[
                'Confirm the opening line leads with the money move, not generic context.',
                'Rewrite any section that sounds like a model summary rather than an AIRAB briefing.',
                'Flag whether the file needs a chart, a market line, or a supporting visual before recording.',
                'Decide if this becomes audio-only, YouTube, or a newsletter-linked release.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="mt-1 text-dusk-rose" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          <div className="rounded-xl border border-white/5 bg-charcoal p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="eyebrow">Script draft</div>
                <h3 className="mt-2 font-serif text-3xl tracking-[-0.04em] text-off-white">
                  {articleHeadline || 'Load an article to start a briefing draft'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(script)}
                className="ghost-button w-full justify-center lg:w-auto"
              >
                <Copy size={16} />
                Copy draft
              </button>
            </div>

            <textarea
              value={script}
              onChange={(event) => setScript(event.target.value)}
              className="mt-6 h-[28rem] w-full resize-none rounded-lg border border-white/5 bg-graphite px-4 py-4 text-off-white focus:border-dusk-rose focus:outline-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Briefing angle',
                detail: 'Shape the short version for audio without losing the capital logic.',
              },
              {
                icon: Radio,
                title: 'Distribution path',
                detail: 'Decide whether this belongs on the site, newsletter, YouTube, or all three.',
              },
              {
                icon: Wand2,
                title: 'Automation target',
                detail: 'Document what can be templated before adding a real TTS or publishing hook.',
              },
            ].map(({ icon: Icon, title, detail }) => (
              <div key={title} className="rounded-xl border border-white/5 bg-charcoal p-5">
                <Icon size={18} className="text-dusk-rose" />
                <div className="mt-4 font-serif text-2xl tracking-[-0.04em] text-off-white">{title}</div>
                <p className="mt-3 text-sm leading-7 text-brushed-silver">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminStudioLab
