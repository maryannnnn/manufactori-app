import type { Metadata } from 'next'
import type { MetadataRoute } from 'next'

/**
 * Staging / preview / local builds stay out of the index.
 * Vercel production is indexable unless SITE_INDEXING=false.
 * Set SITE_INDEXING=true to preview production robots locally.
 */
const indexingFlag = process.env.SITE_INDEXING ?? process.env.NEXT_PUBLIC_SITE_INDEXING

export const isProductionIndexingEnabled = (): boolean => {
  if (indexingFlag === 'true') return true
  if (indexingFlag === 'false') return false
  return process.env.VERCEL_ENV === 'production'
}

export const BLOCK_SITE_INDEXING = !isProductionIndexingEnabled()

export const siteRobotsMetadata: Metadata['robots'] = BLOCK_SITE_INDEXING
  ? {
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
  : {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    }

export const noindexRobotsMetadata: Metadata['robots'] = {
  index: false,
  follow: false,
}

const AI_SEARCH_BOTS = [
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
  if (!BLOCK_SITE_INDEXING) {
    return {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/search'],
    }
  }

  const disallowAll = { disallow: '/' as const }

  return [
    { userAgent: '*', ...disallowAll },
    ...AI_SEARCH_BOTS.map((userAgent) => ({ userAgent, ...disallowAll })),
  ]
}

export const xRobotsTagValue =
  'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai'
