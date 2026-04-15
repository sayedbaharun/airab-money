import React, { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mic2, Play, Square, Volume2 } from 'lucide-react'
import PageIntro from '../components/PageIntro'

interface Presenter {
  id: string
  name: string
  nameAr: string
  voice: string
}

const presenters: Presenter[] = [
  { id: 'ahmad', name: 'Ahmad', nameAr: 'أحمد', voice: 'Deep, authoritative, Emirati inflection' },
  { id: 'aria', name: 'ARIA', nameAr: 'آريا', voice: 'Modern, friendly, neutral delivery' },
  { id: 'khaled', name: 'Khaled', nameAr: 'خالد', voice: 'Analytical, clear, Saudi inflection' },
  { id: 'fatima', name: 'Fatima', nameAr: 'فاطمة', voice: 'Energetic, modern, UAE inflection' },
]

const VoiceDemoPage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [selectedPresenter, setSelectedPresenter] = useState<string>('ahmad')
  const [script, setScript] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedVoice = useMemo(
    () => presenters.find((presenter) => presenter.id === selectedPresenter) || presenters[0],
    [selectedPresenter],
  )

  const sampleScripts =
    language === 'en'
      ? [
          'Today on AIRAB: Abu Dhabi capital deepens exposure to US AI compute as Gulf money pushes further into the infrastructure layer.',
          'Saudi financing for a new Riyadh inference campus suggests local deployment is moving from strategy decks to funded capacity.',
          'Dubai\'s latest permitting rules matter because grid access and compliance now shape AI data-centre speed to market.',
          'This briefing maps where Middle Eastern AI capital is moving globally and what it is building across the region.',
        ]
      : [
          'في آيراب اليوم: يعمق رأس المال القادم من أبوظبي انكشافه على البنية التحتية الحاسوبية للذكاء الاصطناعي في الولايات المتحدة.',
          'يشير تمويل موقع استدلال جديد في الرياض إلى أن النشر المحلي ينتقل من الخطط إلى السعة الممولة فعلياً.',
          'أصبحت قواعد الترخيص والوصول إلى الكهرباء في دبي عاملاً مباشراً في سرعة بناء مراكز بيانات الذكاء الاصطناعي.',
          'تشرح هذه الإحاطة أين يتحرك رأس المال الشرق أوسطي في الذكاء الاصطناعي عالمياً وماذا يبني داخل المنطقة.',
        ]

  const handleGenerate = () => {
    if (!script.trim()) return

    setIsGenerating(true)
    window.setTimeout(() => {
      setIsGenerating(false)
      setGeneratedAudio('demo-audio-url')
    }, 1800)
  }

  return (
    <>
      <Helmet>
        <title>Briefing Studio | AIRAB Money</title>
        <meta name="description" content="Preview the AIRAB Money AI presenter system used to turn daily articles into podcast and YouTube-ready briefings." />
      </Helmet>

      <PageIntro
        eyebrow="Briefing studio"
        title="The AI presenter system behind the daily AIRAB brief."
        description="This studio turns the daily article file into podcast and YouTube-ready scripts. Pick a presenter, shape the tone, and preview how AIRAB sounds when the desk goes to audio and video."
        actions={
          <div className="flex flex-wrap gap-2">
            {(['en', 'ar'] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                className={`border px-4 py-3 text-sm uppercase tracking-[0.22em] transition-colors ${
                  language === code
                    ? 'border-dusk-rose/50 bg-dusk-rose/10 text-off-white'
                    : 'border-white/10 text-brushed-silver hover:border-dusk-rose/30 hover:text-off-white'
                }`}
              >
                {code === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        }
        metrics={[
          { label: 'Voices', value: '04' },
          { label: 'Outputs', value: 'Audio + video' },
          { label: 'Studio mode', value: 'Daily brief' },
        ]}
      />

      <section className="editorial-page pt-0">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="editorial-panel p-8 md:p-10">
            <div className="eyebrow">Studio controls</div>
            <h2 className="mt-4 font-serif text-3xl tracking-[-0.04em] text-off-white">Create a daily briefing sample</h2>

            <div className="mt-8 space-y-8">
              <section className="space-y-4">
                <div className="stat-kicker">Select presenter</div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {presenters.map((presenter) => {
                    const isSelected = selectedPresenter === presenter.id
                    return (
                      <button
                        key={presenter.id}
                        type="button"
                        onClick={() => setSelectedPresenter(presenter.id)}
                        className={`border p-5 text-left transition-colors ${
                          isSelected
                            ? 'border-dusk-rose/50 bg-dusk-rose/10 text-off-white'
                            : 'border-white/10 bg-white/[0.02] text-brushed-silver hover:border-dusk-rose/30 hover:text-off-white'
                        }`}
                      >
                        <div className="flex h-12 w-12 items-center justify-center border border-current font-serif text-xl">
                          {language === 'en' ? presenter.name[0] : presenter.nameAr[0]}
                        </div>
                        <div className="mt-4 font-serif text-2xl tracking-[-0.04em]">
                          {language === 'en' ? presenter.name : presenter.nameAr}
                        </div>
                        <p className="mt-3 text-sm leading-6 text-brushed-silver">{presenter.voice}</p>
                      </button>
                    )
                  })}
                </div>
              </section>

              <section className="space-y-4">
                <div className="stat-kicker">Script</div>
                <textarea
                  value={script}
                  onChange={(event) => setScript(event.target.value)}
                  placeholder={language === 'en' ? 'Paste or write a short script here...' : 'أدخل نصاً قصيراً هنا...'}
                  className="textarea-dark"
                />
              </section>

              <section className="space-y-4">
                <div className="stat-kicker">Quick prompts</div>
                <div className="flex flex-wrap gap-2">
                  {sampleScripts.map((sample) => (
                    <button
                      key={sample}
                      type="button"
                      onClick={() => setScript(sample)}
                      className="border border-white/10 px-3 py-2 text-left text-xs uppercase tracking-[0.18em] text-brushed-silver transition-colors hover:border-dusk-rose/30 hover:text-off-white"
                    >
                      {sample.slice(0, 48)}...
                    </button>
                  ))}
                </div>
              </section>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={!script.trim() || isGenerating}
                className="rose-button w-full disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.02] disabled:text-brushed-silver/40"
              >
                {isGenerating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border border-current border-t-transparent" />
                    Generating sample
                  </>
                ) : (
                  <>
                    <Mic2 size={16} />
                    Generate voice sample
                  </>
                )}
              </button>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="editorial-panel p-6">
              <div className="stat-kicker mb-3">Selected voice</div>
              <div className="font-serif text-3xl tracking-[-0.04em] text-off-white">
                {language === 'en' ? selectedVoice.name : selectedVoice.nameAr}
              </div>
              <p className="mt-4 text-sm leading-7 text-brushed-silver">{selectedVoice.voice}</p>
            </div>

            <div className="editorial-panel p-6">
              <div className="stat-kicker mb-3">Lab notes</div>
              <div className="space-y-3 text-sm leading-7 text-brushed-silver">
                <p>Write for a 4-6 minute capital briefing rather than a generic marketing voiceover.</p>
                <p>Lead with the money move, then the infrastructure, policy, or market consequence.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {generatedAudio ? (
        <section className="editorial-page pt-0">
          <div className="editorial-panel p-8">
            <div className="eyebrow">Generated sample</div>
            <div className="mt-4 grid gap-6 md:grid-cols-[auto_minmax(0,1fr)] md:items-center">
              <button
                type="button"
                onClick={() => setIsPlaying((current) => !current)}
                className="flex h-16 w-16 items-center justify-center border border-dusk-rose/50 bg-dusk-rose/10 text-off-white transition-colors hover:bg-dusk-rose"
              >
                {isPlaying ? <Square size={20} /> : <Play size={20} className="ml-1" />}
              </button>

              <div>
                <div className="flex items-center gap-3">
                  <Volume2 size={18} className="text-dusk-rose" />
                  <div className="font-serif text-3xl tracking-[-0.04em] text-off-white">
                    {language === 'en' ? selectedVoice.name : selectedVoice.nameAr}
                  </div>
                </div>
                <div className="mt-4 h-px bg-white/10">
                  <div className="h-px bg-dusk-rose" style={{ width: isPlaying ? '48%' : '0%' }} />
                </div>
                <p className="mt-4 text-sm leading-7 text-brushed-silver">
                  Demo playback is simulated in this environment, but the studio surface is ready for a real TTS and distribution hook.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="editorial-page pt-0">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            'Daily podcast and YouTube workflow from the same script.',
            'English and Arabic prompt handling in the same interface.',
            'Presenter personas aligned to AIRAB tone and pacing.',
            'A studio surface designed for future automated publishing.',
          ].map((feature) => (
            <div key={feature} className="editorial-panel p-5 text-sm leading-7 text-brushed-silver">
              {feature}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default VoiceDemoPage
