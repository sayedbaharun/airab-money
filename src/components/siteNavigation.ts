import {
  BarChart3,
  BookOpenText,
  Headphones,
  Home,
  Info,
  Mail,
  Mic2,
  Newspaper,
  UserRoundPlus,
  type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
  href: string
  icon: LucideIcon
  label: string
  description: string
}

export const primaryNavigation: NavigationItem[] = [
  {
    href: '/',
    icon: Home,
    label: 'Home',
    description: 'Capital front page',
  },
  {
    href: '/articles',
    icon: Newspaper,
    label: 'Coverage',
    description: 'AI capital files',
  },
  {
    href: '/markets',
    icon: BarChart3,
    label: 'Markets',
    description: 'AI risk tape',
  },
  {
    href: '/episodes',
    icon: Headphones,
    label: 'Briefings',
    description: 'Daily audio/video',
  },
  {
    href: '/about',
    icon: Info,
    label: 'About',
    description: 'Thesis and workflow',
  },
  {
    href: '/contact',
    icon: Mail,
    label: 'Contact',
    description: 'Leads and partnerships',
  },
]

export const platformNavigation: NavigationItem[] = [
  {
    href: '/blog',
    icon: BookOpenText,
    label: 'Analysis',
    description: 'Capital notes',
  },
  {
    href: '/guest-application',
    icon: UserRoundPlus,
    label: 'Guest Desk',
    description: 'Pitch a briefing',
  },
  {
    href: '/demo',
    icon: Mic2,
    label: 'Studio',
    description: 'AI presenter demo',
  },
]

export const coverageSignals = [
  'Gulf capital deploying into global AI platforms, funds, and infrastructure.',
  'Regional build-out across compute, data centres, chips, power, and cloud.',
  'Policy, company formation, and operator signals shaping AI execution.',
]
