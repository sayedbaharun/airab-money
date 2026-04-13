import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

interface Presenter {
  id: string
  name: string
  nameAr: string
  role: string
  roleAr: string
  description: string
  descriptionAr: string
  image: string
  voice: string
  personality: string
}

const presenters: Presenter[] = [
  {
    id: 'ahmad',
    name: 'Ahmad',
    nameAr: 'أحمد',
    role: 'Lead Presenter',
    roleAr: 'المضيف الرئيسي',
    description: 'Emirati financial expert with 15 years of experience in GCC markets. Specializes in stocks, commodities, and economic analysis.',
    descriptionAr: 'خبير مالي إماراتي يتمتع بخبرة 15 عامًا في أسواق دول الخليج. متخصص في الأسهم والسلع والتحليل الاقتصادي.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    voice: ' Ahmad - Deep, authoritative voice with Emirati accent',
    personality: 'Professional, insightful, and engaging'
  },
  {
    id: 'aria',
    name: 'ARIA',
    nameAr: 'آريا',
    role: 'AI Co-Host',
    roleAr: 'مضيف ذكاء اصطناعي',
    description: 'Advanced AI presenter specializing in crypto markets, blockchain technology, and emerging financial trends.',
    descriptionAr: 'مقدمة ذكاء اصطناعي متقدمة متخصصة في أسواق العملات المشفرة وتقنية البلوكتشين والاتجاهات المالية الناشئة.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    voice: 'ARIA - Modern, friendly voice with neutral accent',
    personality: 'Innovative, tech-savvy, and approachable'
  },
  {
    id: 'khaled',
    name: 'Khaled',
    nameAr: 'خالد',
    role: 'Market Analyst',
    roleAr: 'محلل السوق',
    description: 'Saudi financial analyst with deep expertise in oil markets, petrochemicals, and Saudi Vision 2030 investments.',
    descriptionAr: 'محلل مالي سعودي يتمتع بخبرة عميقة في أسواق النفط والبتروكيماويات واستثمارات رؤية السعودية 2030.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    voice: 'Khaled - Clear, analytical voice with Saudi accent',
    personality: 'Analytical, detailed, and methodical'
  },
  {
    id: 'fatima',
    name: 'Fatima',
    nameAr: 'فاطمة',
    role: 'Tech & Crypto Expert',
    roleAr: 'خبيرة التقنية والعملات المشفرة',
    description: 'UAE-based tech analyst covering cryptocurrency, fintech innovations, and digital transformation in the Gulf.',
    descriptionAr: 'محللة تقنية مقرها الإمارات تغطي العملات المشفرة والابتكارات المالية والتحول الرقمي في الخليج.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
    voice: 'Fatima - Energetic, modern voice with UAE accent',
    personality: 'Dynamic, forward-thinking, and enthusiastic'
  }
]

const PresentersPage: React.FC = () => {
  const [selectedPresenter, setSelectedPresenter] = useState<Presenter | null>(null)
  const [language, setLanguage] = useState<'en' | 'ar'>('en')

  return (
    <>
      <Helmet>
        <title>AI Presenters - AIRAB Money 2026</title>
        <meta name="description" content="Meet our AI-powered financial presenters" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(102,126,234,0.15),transparent_70%)]"></div>
          
          <div className="relative max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              {language === 'en' ? 'AI Presenters' : 'مضيفو الذكاء الاصطناعي'}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {language === 'en' 
                ? 'Meet our revolutionary AI-powered financial presenters. Powered by advanced language models and voice synthesis.'
                : 'قابلوا مضيفينا الماليين الثوريين المدعومين بالذكاء الاصطناعي. مدعومين بنماذج لغوية متقدمة وتركيب الصوت.'
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

        {/* Presenters Grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {presenters.map((presenter) => (
                <div
                  key={presenter.id}
                  className="glass-card rounded-2xl p-6 cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedPresenter(presenter)}
                >
                  <div className="relative mb-4">
                    <img
                      src={presenter.image}
                      alt={presenter.name}
                      className="w-full h-48 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent rounded-xl"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {language === 'en' ? presenter.name : presenter.nameAr}
                  </h3>
                  <p className="text-primary text-sm mb-2">
                    {language === 'en' ? presenter.role : presenter.roleAr}
                  </p>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {language === 'en' ? presenter.description : presenter.descriptionAr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Voice Demo Section - ONLY section kept */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === 'en' ? 'Try Voice Demo' : 'جرب تجربة الصوت'}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Experience our text-to-speech technology with different presenter voices'
                : 'جرب تقنية تحويل النص إلى كلام مع أصوات مقدمين مختلفة'
              }
            </p>
            
            <Link
              to="/demo"
              className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {language === 'en' ? 'Go to Voice Demo Studio' : 'انتقل إلى استوديو الصوت'}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

export default PresentersPage
