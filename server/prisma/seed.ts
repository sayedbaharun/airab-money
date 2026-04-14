import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('DATABASE_URL is required to run seed.')
  process.exit(1)
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const presenters = [
  {
    name: 'Nora Al-Mansouri',
    slug: 'nora-al-mansouri',
    role: 'AI Investment Lead',
    bio: 'Emirati investment strategist focused on AI capital flows across the GCC. Previously led regional ventures at a Tier-1 sovereign fund.',
    photo_url: '/images/avatars/nora/nora_professional_formal.png',
    show_types: ['Money Moves', 'Wisdom Wednesday'],
    featured: true,
    display_order: 1,
  },
  {
    name: 'Omar Al-Rashid',
    slug: 'omar-al-rashid',
    role: 'AI Research Pioneer',
    bio: 'Saudi AI researcher who has advised government programs on large-model adoption, Arabic NLP, and responsible AI deployment.',
    photo_url: '/images/avatars/omar/omar_tech_executive.png',
    show_types: ['Future Friday', 'Wisdom Wednesday'],
    featured: true,
    display_order: 2,
  },
  {
    name: 'Khaled Al-Harbi',
    slug: 'khaled-al-harbi',
    role: 'Market Analyst',
    bio: 'Focuses on energy, petrochemicals, and the intersection of Vision 2030 capex with AI-driven industrial operations.',
    show_types: ['Money Moves'],
    display_order: 3,
  },
  {
    name: 'Fatima Al-Qassimi',
    slug: 'fatima-al-qassimi',
    role: 'Tech & Crypto Expert',
    bio: 'Covers digital assets, fintech infrastructure, and regional regulatory shifts across the UAE and wider GCC.',
    show_types: ['Future Friday'],
    display_order: 4,
  },
]

const episodes = [
  {
    title: 'GCC AI Capital Flows, Q1 Recap',
    description:
      'A data-led look at where AI capital is concentrating across the GCC — the largest rounds, the patient capital, and what each signals about the next 12 months.',
    episode_number: 1,
    season_number: 1,
    show_type: 'Money Moves',
    duration_minutes: 34,
    audio_url: '',
    publish_date: new Date('2026-04-07'),
    status: 'published',
    topics: ['AI Investment', 'GCC', 'Venture Capital'],
    categories: ['Investment'],
    featured: true,
  },
  {
    title: 'Arabic LLMs: Where the Real Moats Are',
    description:
      'Deep dive with an Arabic-NLP researcher on what it takes to ship a production Arabic LLM — data, dialect coverage, evaluation, and regulatory posture.',
    episode_number: 2,
    season_number: 1,
    show_type: 'Wisdom Wednesday',
    duration_minutes: 62,
    audio_url: '',
    publish_date: new Date('2026-04-09'),
    status: 'published',
    guest_name: 'Omar Al-Rashid',
    topics: ['Arabic NLP', 'Large Language Models'],
    categories: ['Research', 'Technology'],
    featured: true,
  },
  {
    title: 'Compute, Chips, and Sovereignty',
    description:
      'How UAE and Saudi Arabia are positioning on compute, datacenter geography, and chip access — and why this matters for AI sovereignty in the region.',
    episode_number: 3,
    season_number: 1,
    show_type: 'Future Friday',
    duration_minutes: 47,
    audio_url: '',
    publish_date: new Date('2026-04-11'),
    status: 'published',
    topics: ['Compute', 'Sovereignty', 'Datacenters'],
    categories: ['Government', 'Technology'],
    featured: true,
  },
]

const articles = [
  {
    headline: 'UAE launches regional AI compute alliance with three new datacenters',
    summary: 'A new federation of UAE-backed compute operators will pool capacity to serve regional model builders and enterprises.',
    content:
      'The UAE has unveiled a regional compute alliance pooling three new hyperscale datacenters to serve AI workloads for Gulf enterprises and sovereign research programs.\n\nThe move positions the country as the default compute hub for regional LLM training and inference, and responds directly to rising demand from Arabic model builders.',
    category: 'AI',
    tags: ['UAE', 'Compute', 'Infrastructure'],
  },
  {
    headline: 'Saudi PIF-backed fund closes $500M for AI-native industrial startups',
    summary: 'The new fund will write growth checks into AI-native industrial and energy plays aligned with Vision 2030.',
    content:
      'A new $500M growth vehicle anchored by the Public Investment Fund has officially closed, targeting AI-native industrial, energy, and logistics companies building for the Kingdom\'s Vision 2030 agenda.\n\nThe fund is expected to deploy over 24 months with an average ticket of $20M.',
    category: 'Investment',
    tags: ['Saudi Arabia', 'PIF', 'Investment'],
  },
  {
    headline: 'Arabic LLM benchmark results reshape enterprise procurement shortlists',
    summary: 'The latest Arabic reasoning benchmarks are changing which models GCC enterprises actually deploy in production.',
    content:
      'A new independent Arabic reasoning benchmark has materially reshuffled the enterprise procurement shortlist across GCC financial institutions.\n\nRegional providers have closed the gap significantly on dialect coverage, while the delta on complex legal-Arabic reasoning remains meaningful for the top commercial models.',
    category: 'Research',
    tags: ['Arabic NLP', 'Benchmarks'],
  },
  {
    headline: 'DFM and ADX see record AI-themed ETF inflows in Q1',
    summary: 'AI-themed ETFs listed on Dubai and Abu Dhabi exchanges registered their strongest-ever quarterly inflows.',
    content:
      'AI-themed ETFs listed on the Dubai Financial Market and Abu Dhabi Securities Exchange posted their strongest-ever quarter of net inflows, signalling growing retail conviction in the regional AI narrative.\n\nInstitutional allocators remained more measured, citing concentration risk.',
    category: 'Markets',
    tags: ['DFM', 'ADX', 'ETF'],
  },
  {
    headline: 'Regional banks accelerate AI underwriting pilots',
    summary: 'Major GCC banks have moved AI underwriting from PoC into limited-rollout retail lending.',
    content:
      'Several tier-one GCC banks have moved their AI underwriting models out of proof-of-concept and into limited production rollouts on retail lending.\n\nEarly cohort data suggests default rates are broadly in line with expectations, though regulators are watching explainability and auditability closely.',
    category: 'Finance',
    tags: ['Banking', 'Underwriting'],
  },
  {
    headline: 'Abu Dhabi announces sovereign AI evaluation sandbox',
    summary: 'A new government sandbox will allow model providers to evaluate against sovereign data under supervision.',
    content:
      'Abu Dhabi has formally announced a sovereign AI evaluation sandbox where model providers can be benchmarked against curated sovereign datasets under regulator supervision.\n\nParticipation is expected to become a de-facto requirement for government-sector procurement.',
    category: 'Government',
    tags: ['Abu Dhabi', 'Regulation'],
  },
]

const blogs = [
  {
    title: 'What Arabic-first LLMs actually change for enterprise buyers',
    slug: 'arabic-first-llms-enterprise-buyers',
    excerpt: 'A practical look at how Arabic-first model capability reshapes the enterprise buying conversation — and where it still doesn\'t.',
    content:
      'Enterprise buyers in the GCC are facing a new decision point: whether to default to a frontier model or commit to an Arabic-first system. Here is a practical framing…',
    author_name: 'Nora Al-Mansouri',
    category: 'AI News',
    tags: ['Arabic NLP', 'Enterprise'],
    featured: true,
    estimated_read_time: 6,
  },
  {
    title: 'Three signals that an AI investment round is strategic, not financial',
    slug: 'ai-investment-round-strategic-signals',
    excerpt: 'Not every AI round is a bet on the company — sometimes it\'s a bet on the ecosystem. Here are the signals that matter.',
    content:
      'Reading an AI term sheet in 2026 requires separating financial conviction from strategic positioning. The cap table is the first tell. The second is who leads.\n\nThe third — and most overlooked — is what gets left out of the press release.',
    author_name: 'Khaled Al-Harbi',
    category: 'Investment Analysis',
    tags: ['Venture Capital', 'Strategy'],
    estimated_read_time: 5,
  },
  {
    title: 'Why compute geography is becoming a GCC policy question',
    slug: 'compute-geography-gcc-policy',
    excerpt: 'Where your tokens are processed is no longer a pure infra question — it is starting to be a sovereignty question.',
    content:
      'Compute geography used to be an infra cost optimization. In 2026, it is becoming a sovereignty and regulatory question for GCC governments and the enterprises they oversee.\n\nThe trade-offs are tightening, and the next round of procurement cycles will show it.',
    author_name: 'Fatima Al-Qassimi',
    category: 'Regional Focus',
    tags: ['Infrastructure', 'Policy'],
    estimated_read_time: 7,
  },
]

const run = async () => {
  console.log('Seeding presenters…')
  for (const p of presenters) {
    await prisma.presenter.upsert({
      where: { slug: p.slug },
      update: {
        role: p.role,
        bio: p.bio,
        photo_url: p.photo_url ?? null,
        show_types: p.show_types,
        featured: p.featured ?? false,
        display_order: p.display_order,
      },
      create: {
        name: p.name,
        slug: p.slug,
        role: p.role,
        bio: p.bio,
        photo_url: p.photo_url ?? null,
        show_types: p.show_types,
        featured: p.featured ?? false,
        display_order: p.display_order,
      },
    })
  }

  console.log('Seeding articles…')
  for (const a of articles) {
    const existing = await prisma.article.findFirst({ where: { headline: a.headline } })
    if (existing) continue
    await prisma.article.create({
      data: {
        headline: a.headline,
        summary: a.summary,
        content: a.content,
        category: a.category,
        tags: a.tags,
        status: 'published',
        published_at: new Date(),
      },
    })
  }

  console.log('Seeding blog posts…')
  for (const b of blogs) {
    await prisma.blogPost.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        title: b.title,
        slug: b.slug,
        content: b.content,
        excerpt: b.excerpt,
        author_name: b.author_name,
        category: b.category,
        tags: b.tags,
        status: 'published',
        featured: b.featured ?? false,
        estimated_read_time: b.estimated_read_time,
        published_at: new Date(),
      },
    })
  }

  console.log('Seeding episodes…')
  for (const e of episodes) {
    const existing = await prisma.podcastEpisode.findFirst({ where: { title: e.title } })
    if (existing) continue
    await prisma.podcastEpisode.create({
      data: {
        title: e.title,
        description: e.description,
        episode_number: e.episode_number,
        season_number: e.season_number,
        show_type: e.show_type,
        duration_minutes: e.duration_minutes,
        audio_url: e.audio_url,
        publish_date: e.publish_date,
        status: e.status,
        guest_name: e.guest_name ?? null,
        topics: e.topics,
        categories: e.categories,
        featured: e.featured ?? false,
      },
    })
  }

  console.log('Seed complete.')
}

run()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
