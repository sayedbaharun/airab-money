import {
  BarChart3,
  Home,
  Info,
  Mail,
  Scale,
  Shield,
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
    href: '/guest-application',
    icon: UserRoundPlus,
    label: 'Guest Desk',
    description: 'Pitch an appearance',
  },
]

export const legalNavigation: NavigationItem[] = [
  {
    href: '/privacy',
    icon: Shield,
    label: 'Privacy',
    description: 'Data and email policy',
  },
  {
    href: '/terms',
    icon: Scale,
    label: 'Terms',
    description: 'Editorial use terms',
  },
]

export const coverageSignals = [
  'Gulf capital deploying into global AI platforms, funds, and infrastructure.',
  'Regional build-out across compute, data centres, chips, power, and cloud.',
  'Policy, company formation, and operator signals shaping AI execution.',
]
