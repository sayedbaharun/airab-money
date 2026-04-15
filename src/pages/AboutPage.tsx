import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Users, Award, Globe, Target, Heart, Lightbulb } from 'lucide-react'

const AboutPage = () => {
  const coreValues = [
    {
      icon: <Lightbulb className="w-8 h-8 text-dusk-rose" />,
      title: "Innovation First",
      description: "Embracing cutting-edge AI technologies in our content creation and delivery"
    },
    {
      icon: <Globe className="w-8 h-8 text-dusk-rose" />,
      title: "Regional Expertise",
      description: "Deep understanding of Arab and GCC market dynamics and cultural nuances"
    },
    {
      icon: <Heart className="w-8 h-8 text-dusk-rose" />,
      title: "Authentic Insights",
      description: "Providing genuine, unbiased analysis of AI developments and trends"
    },
    {
      icon: <Users className="w-8 h-8 text-dusk-rose" />,
      title: "Community Building",
      description: "Fostering connections within the regional AI ecosystem and beyond"
    },
    {
      icon: <Target className="w-8 h-8 text-dusk-rose" />,
      title: "Future-Forward",
      description: "Anticipating trends and preparing audiences for what's next in AI"
    }
  ]

  const hosts = [
    {
      name: "Nora Al-Mansouri",
      title: "AI Investment Expert & Former McKinsey Consultant",
      bio: "UAE national with Harvard MBA and MIT AI certification. Former McKinsey consultant turned AI venture capitalist, specializing in technology investment analysis and market strategy. Known for her analytical approach and ability to break down complex concepts for business leaders.",
      expertise: ["Investment Analysis", "Market Strategy", "Business Intelligence", "Startup Ecosystems"],
      image: "/images/avatars/nora/nora_professional_formal.png",
      background: "bg-dusk-rose"
    },
    {
      name: "Omar Al-Rashid",
      title: "AI Research Pioneer & Serial Entrepreneur",
      bio: "Former Google AI researcher and serial entrepreneur from Saudi Arabia. PhD in Computer Science from Stanford, founded two successful AI startups. Now focuses on AI research and development across MENA region, bridging technical innovation with business applications.",
      expertise: ["AI Research", "Machine Learning", "Entrepreneurship", "Technical Innovation"],
      image: "/images/avatars/omar/omar_tech_executive.png",
      background: "bg-charcoal"
    }
  ]

  return (
    <>
      <Helmet>
        <title>About AIRAB Money - Our Mission & AI-Powered Hosts</title>
        <meta name="description" content="Learn about AIRAB Money's mission to democratize AI knowledge across the Arab world. Meet our AI-powered hosts Nora Al-Mansouri and Omar Al-Rashid." />
        <meta name="keywords" content="AIRAB Money, about, AI hosts, Arab world AI, mission, vision, values" />
      </Helmet>

      {/* Hero Section */}
      <section className="py-20 bg-graphite text-off-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Where AI Meets{' '}
              <span className="text-amber-300">Arabia</span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 leading-relaxed">
              Bridging the gap between global AI innovations and regional implementation
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-off-white mb-6">Our Mission</h2>
              <p className="text-lg text-brushed-silver leading-relaxed mb-8">
                To democratize AI knowledge and insights across the Arab world by delivering 
                cutting-edge analysis, expert interviews, and strategic intelligence on artificial 
                intelligence developments, ensuring the region remains at the forefront of the global AI revolution.
              </p>
              
              <h3 className="text-2xl font-semibold text-off-white mb-4">Our Vision</h3>
              <p className="text-lg text-brushed-silver leading-relaxed">
                To become the definitive voice for AI discourse in the Arab world, bridging the gap 
                between global AI innovations and regional implementation, while fostering a thriving 
                ecosystem of AI entrepreneurs, investors, and innovators.
              </p>
            </div>
            
            <div className="relative">
              <div className="bg-charcoal border border-white/5 rounded-none p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dusk-rose mb-2">50+</div>
                    <div className="text-sm text-brushed-silver">Expert Guests</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dusk-rose mb-2">100+</div>
                    <div className="text-sm text-brushed-silver">Episodes Planned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dusk-rose mb-2">7</div>
                    <div className="text-sm text-brushed-silver">GCC Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-dusk-rose mb-2">3</div>
                    <div className="text-sm text-brushed-silver">Episodes/Week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-charcoal">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-off-white mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-brushed-silver">
              <p className="text-xl leading-relaxed mb-6">
                AIRAB Money was born from a simple observation: while the world talked about AI's global impact, 
                the Arab world's incredible innovations were happening in the shadows.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                From Saudi Arabia's NEOM city to the UAE's AI Strategy 2071, from Qatar's smart city initiatives 
                to the region's growing startup ecosystem, incredible developments were underway. Yet these 
                stories weren't being told with the depth and expertise they deserved.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                We created AIRAB Money to bridge this gap - combining cutting-edge AI technology with deep 
                regional expertise to deliver intelligence that matters to leaders, investors, and innovators 
                across the Arab world.
              </p>
              
              <div className="bg-charcoal border-l-2 border-dusk-rose p-6 my-8">
                <h3 className="text-xl font-semibold text-off-white mb-3">What Makes Us Different</h3>
                <ul className="space-y-2 text-brushed-silver">
                  <li>• First AI-powered podcast focused exclusively on the Arab world</li>
                  <li>• Hosted by AI avatars with deep regional knowledge and global perspective</li>
                  <li>• Weekly episodes featuring the most influential voices in regional AI development</li>
                  <li>• Actionable insights for business leaders, investors, and policy makers</li>
                  <li>• Content available in both English and Arabic</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-off-white mb-4">Our Core Values</h2>
            <p className="text-xl text-brushed-silver max-w-3xl mx-auto">
              These principles guide everything we do, from content creation to community building
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="card p-8 text-center hover:shadow-xl transition-shadow duration-300">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-off-white mb-3">{value.title}</h3>
                <p className="text-brushed-silver leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Hosts */}
      <section className="py-20 bg-charcoal">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-off-white mb-4">Meet Our AI-Powered Hosts</h2>
            <p className="text-xl text-brushed-silver max-w-3xl mx-auto">
              Our AI avatars combine cutting-edge technology with deep expertise to deliver 
              unparalleled insights into the AI landscape
            </p>
          </div>
          
          <div className="space-y-16">
            {hosts.map((host, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
              }`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className={`${host.background} rounded-2xl p-8 text-white`}>
                    <img 
                      src={host.image} 
                      alt={host.name} 
                      className="w-48 h-48 rounded-xl mx-auto mb-6 object-cover shadow-2xl"
                    />
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">{host.name}</h3>
                      <p className="text-lg opacity-90">{host.title}</p>
                    </div>
                  </div>
                </div>
                
                <div className={index % 2 === 1 ? 'lg:col-start-1' : ''}>
                  <div className="space-y-6">
                    <p className="text-lg text-brushed-silver leading-relaxed">{host.bio}</p>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-off-white mb-3">Areas of Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {host.expertise.map((skill, skillIndex) => (
                          <span 
                            key={skillIndex} 
                            className="px-3 py-1 bg-dusk-rose/20 text-dusk-rose border border-dusk-rose/30 rounded-none text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage