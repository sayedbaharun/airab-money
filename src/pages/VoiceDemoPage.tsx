import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

interface Presenter {
  id: string
  name: string
  nameAr: string
  voice: string
}

const presenters: Presenter[] = [
  { id: 'ahmad', name: 'Ahmad', nameAr: 'أحمد', voice: 'Deep, authoritative with Emirati accent' },
  { id: 'aria', name: 'ARIA', nameAr: 'آريا', voice: 'Modern, friendly with neutral accent' },
  { id: 'khaled', name: 'Khaled', nameAr: 'خالد', voice: 'Clear, analytical with Saudi accent' },
  { id: 'fatima', name: 'Fatima', nameAr: 'فاطمة', voice: 'Energetic, modern with UAE accent' }
]

const VoiceDemoPage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [selectedPresenter, setSelectedPresenter] = useState<string>('ahmad')
  const [script, setScript] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleGenerate = () => {
    if (!script.trim()) return
    
    setIsGenerating(true)
    // Simulate audio generation
    setTimeout(() => {
      setIsGenerating(false)
      setGeneratedAudio('demo-audio-url')
    }, 2000)
  }

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const sampleScripts = language === 'en' 
    ? [
        'Welcome to AIRAB Money 2026, your premier source for financial news and market analysis.',
        'Bitcoin reaches new heights as institutional investors continue to show interest.',
        'Oil prices stabilize amid ongoing geopolitical tensions in the Middle East.',
        'Saudi Arabia announces new initiatives to boost foreign investment.'
      ]
    : [
        'مرحباً بكم في آيراب موني 2026، مصدركم الأول للأخبار المالية وتحليلات السوق.',
        'يصل البيتكوين إلى مستويات جديدة مع استمرار اهتمام المستثمرين المؤسسيين.',
        'تستقر أسعار النفط وسط التوترات الجيوسياسية المستمرة في الشرق الأوسط.',
        'تعلن المملكة العربية السعودية عن مبادرات جديدة لتعزيز الاستثمار الأجنبي.'
      ]

  return (
    <>
      <Helmet>
        <title>Voice Demo Studio - AIRAB Money 2026</title>
        <meta name="description" content="Experience AI voice synthesis with customizable presenters" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-background to-primary/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(118,75,162,0.15),transparent_60%)]"></div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              {language === 'en' ? 'Voice Demo Studio' : 'استوديو الصوت'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {language === 'en'
                ? 'Experience our advanced text-to-speech technology. Create natural, human-like voiceovers with our AI presenters.'
                : 'جرب تقنية تحويل النص إلى كلام المتقدمة. أنشئصوتاً طبيعياً يشبه الصوت البشري مع مقدمي الذكاء الاصطناعي لدينا.'
              }
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setLanguage('en')}
                className={`px-6 py-2 rounded-full transition-all ${language === 'en' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-6 py-2 rounded-full transition-all ${language === 'ar' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
              >
                العربية
              </button>
            </div>
          </div>
        </section>

        {/* Demo Studio */}
        <section className="px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                {language === 'en' ? 'Create Your Voiceover' : 'أنشئ صوتك'}
              </h2>

              {/* Presenter Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  {language === 'en' ? 'Select Presenter' : 'اختر المقدم'}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {presenters.map((presenter) => (
                    <button
                      key={presenter.id}
                      onClick={() => setSelectedPresenter(presenter.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedPresenter === presenter.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {language === 'en' ? presenter.name[0] : presenter.nameAr[0]}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        {language === 'en' ? presenter.name : presenter.nameAr}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Script Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  {language === 'en' ? 'Enter Script' : 'أدخل النص'}
                </label>
                <textarea
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  placeholder={language === 'en' 
                    ? 'Enter your script here...' 
                    : 'أدخل النص هنا...'
                  }
                  className="w-full h-40 p-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Sample Scripts */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-muted-foreground mb-3">
                  {language === 'en' ? 'Sample Scripts' : 'نصوص نموذجية'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {sampleScripts.map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => setScript(sample)}
                      className="px-4 py-2 bg-muted text-muted-foreground rounded-full text-sm hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      {sample.substring(0, 40)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleGenerate}
                  disabled={!script.trim() || isGenerating}
                  className={`px-8 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                    script.trim() && !isGenerating
                      ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === 'en' ? 'Generating...' : 'جاري التوليد...'}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      {language === 'en' ? 'Generate Audio' : 'توليد الصوت'}
                    </>
                  )}
                </button>
              </div>

              {/* Generated Audio Player */}
              {generatedAudio && (
                <div className="mt-8 p-6 bg-card rounded-xl border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    {language === 'en' ? 'Generated Audio' : 'الصوت المُولَّد'}
                  </h3>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handlePlay}
                      className="w-14 h-14 bg-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: isPlaying ? '45%' : '0%' }}></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {selectedPresenter} - {language === 'en' ? 'Generated Voice' : 'صوت مُولَّد'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 pb-16 bg-card/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {language === 'en' ? 'Voice Features' : 'ميزات الصوت'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'en' ? 'Natural Voices' : 'أصوات طبيعية'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Advanced neural networks generate human-like speech with natural intonation and emotion.'
                    : 'توليد الشبكات العصبية المتقدمة للكلام الشبيه بالبشر مع نبرة وعاطفة طبيعية.'
                  }
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'en' ? 'Multi-Language' : 'متعدد اللغات'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Support for English, Arabic, and multiple languages with proper pronunciation.'
                    : 'دعم اللغة الإنجليزية والعربية ولغات متعددة مع نطق صحيح.'
                  }
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'en' ? 'Multiple Formats' : 'تنسيقات متعددة'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Export to MP3, WAV, and other formats suitable for all platforms.'
                    : 'تصدير إلى MP3 و WAV وتنسيقات أخرى مناسبة لجميع المنصات.'
                  }
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {language === 'en' ? 'Fast Processing' : 'معالجة سريعة'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'en'
                    ? 'Generate professional voiceovers in seconds, not hours.'
                    : 'توليد أصوات احترافية في ثوانٍ وليس ساعات.'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default VoiceDemoPage
