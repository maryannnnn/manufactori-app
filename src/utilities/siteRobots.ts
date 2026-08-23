import type { Metadata } from 'next'
import type { MetadataRoute } from 'next'

/** Block search engines and AI crawlers while the site is in development. */
export const BLOCK_SITE_INDEXING = true

export const siteRobotsMetadata: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    'max-video-preview': -1,
    'max-image-preview': 'none',
    'max-snippet': -1,
  },
}

const AI_AND_SCRAPER_BOTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'ClaudeBot',
  'anthropic-ai',
  'Bytespider',
  'CCBot',
  'cohere-ai',
  'PerplexityBot',
  'Applebot-Extended',
  'FacebookBot',
  'Diffbot',
  'ImagesiftBot',
  'Meta-ExternalAgent',
] as const

export const getRobotsTxtRules = (): MetadataRoute.Robots['rules'] => {
  const disallowAll = { disallow: '/' as const }

  return [
    { userAgent: '*', ...disallowAll },
    ...AI_AND_SCRAPER_BOTS.map((userAgent) => ({ userAgent, ...disallowAll })),
  ]
}

export const xRobotsTagValue =
  'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai'
