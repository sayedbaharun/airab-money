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
    description: 'Front page',
  },
  {
    href: '/articles',
    icon: Newspaper,
    label: 'News',
    description: 'Latest coverage',
  },
  {
    href: '/markets',
    icon: BarChart3,
    label: 'Markets',
    description: 'Live data desk',
  },
  {
    href: '/episodes',
    icon: Headphones,
    label: 'Episodes',
    description: 'Program archive',
  },
  {
    href: '/about',
    icon: Info,
    label: 'About',
    description: 'Mission and hosts',
  },
  {
    href: '/contact',
    icon: Mail,
    label: 'Contact',
    description: 'Press and partnerships',
  },
]

export const platformNavigation: NavigationItem[] = [
  {
    href: '/blog',
    icon: BookOpenText,
    label: 'Analysis',
    description: 'Long-form notes',
  },
  {
    href: '/guest-application',
    icon: UserRoundPlus,
    label: 'Guest Desk',
    description: 'Apply to appear',
  },
  {
    href: '/demo',
    icon: Mic2,
    label: 'Voice Lab',
    description: 'Studio demo',
  },
]

export const coverageSignals = [
  'Capital flows across GCC AI and fintech.',
  'Policy moves shaping regional adoption.',
  'Founder, operator, and market intelligence.',
]
