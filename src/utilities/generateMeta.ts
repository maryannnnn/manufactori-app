import type { Metadata } from 'next'

import type { CaseStudy, Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCaseStudyUrl, getPostUrl, getServiceUrl, getTestimonialUrl } from './getContentUrls'
import { resolveMediaSource } from './getMediaUrl'
import { siteRobotsMetadata } from './siteRobots'

type MetaDoc = Partial<Page> | Partial<Post> | Partial<CaseStudy> | {
  slug?: string | null
  title?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: Media | Config['db']['defaultIDType'] | null
  } | null
  primary_category?: unknown
  primary_case_study_category?: unknown
  service_long_title?: string | null
  testimonialLongTitle?: string | null
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const { src } = resolveMediaSource(image, ['og', 'medium', 'large'])
    const path = src.split('?')[0]
    if (path) url = /^https?:\/\//i.test(path) ? path : serverUrl + path
  }

  return url
}

export const generateMeta = async (args: {
  doc: MetaDoc | null
  /**
   * Explicit path for collection archives and other routes that are not backed
   * by a document slug. Takes precedence over the slug-derived path.
   */
  url?: string
}): Promise<Metadata> => {
  const { doc, url } = args

  const ogImage = getImageURL(doc?.meta?.image)

  const title = doc?.meta?.title
    ? doc?.meta?.title + ' | Payload Website Template'
    : 'Payload Website Template'

  const collectionPath = (() => {
    if (!doc) return null
    if ('primary_case_study_category' in doc) return getCaseStudyUrl(doc as CaseStudy)
    if ('primary_category' in doc) return getPostUrl(doc as Post)
    if ('service_long_title' in doc) return getServiceUrl(doc)
    if ('testimonialLongTitle' in doc) return getTestimonialUrl(doc)
    return null
  })()
  const pagePath =
    Array.isArray(doc?.slug) ? doc?.slug.join('/') : doc?.slug ? `/${doc.slug}` : '/'

  return {
    description: doc?.meta?.description,
    robots: siteRobotsMetadata,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      title,
      url: url || collectionPath || pagePath,
    }),
    title,
  }
}
