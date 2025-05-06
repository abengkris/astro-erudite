import type { IconMap, SocialLink, Site } from '@/types'

export const SITE: Site = {
  title: 'Abengkris',
  description:
    'Dengan membaca aku belajar, dan dengan menulis aku berbicara kepada dunia.',
  href: 'https://abeng.xyz',
  author: 'abeng',
  locale: 'id-ID',
  featuredPostCount: 2,
  postsPerPage: 3,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: '/blog',
    label: 'blog',
  },
  {
    href: '/karya',
    label: 'karya',
  },
  {
    href: '/support',
    label: 'dukung',
  },
  {
    href: '/about',
    label: 'tentang',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://instagram.com/abengkriss',
    label: 'Instagram',
  },
  {
    href: 'https://www.threads.net/@abengkriss',
    label: 'Threads',
  },
  {
    href: 'https://github.com/abengkris',
    label: 'GitHub',
  },
  {
    href: 'https://twitter.com/abengisme',
    label: 'Twitter',
  },
  {
    href: 'mailto:hello.abengkris@gmail.com',
    label: 'Email',
  },
  {
    href: '/rss.xml',
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Threads: 'threads',
  Instagram: 'lucide:instagram',
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}
