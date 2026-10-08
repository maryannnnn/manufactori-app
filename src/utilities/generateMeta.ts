import type { Metadata } from 'next'

import type { CaseStudy, Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCaseStudyUrl, getPostUrl, getServiceUrl, getTestimonialUrl } from './getContentUrls'
import { resolveMediaSource } from './getMediaUrl'
import { noindexRobotsMetadata, siteRobotsMetadata } from './siteRobots'
import { brandTitle } from './siteIdentity'

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
  service_preview_image?: Media | Config['db']['defaultIDType'] | null
  testimonialLongTitle?: string | null
}

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  if (image && typeof image === 'object' && 'url' in image) {
    const { src } = resolveMediaSource(image, ['og', 'medium', 'large'])
    const path = src.split('?')[0]
    if (!path) return undefined
    return /^https?:\/\//i.test(path) ? path : getServerSideURL() + path
  }

  return undefined
}

const fallbackImage = (doc: MetaDoc | null | undefined) => {
  if (!doc) return undefined
  if (doc.meta?.image) return doc.meta.image
  if ('service_preview_image' in doc) return doc.service_preview_image
  return undefined
}

const pageTitleFromDoc = (doc: MetaDoc | null | undefined): string | undefined => {
  if (!doc) return undefined
  if (doc.meta?.title) return doc.meta.title
  if ('service_long_title' in doc && doc.service_long_title) return doc.service_long_title
  if ('pageLongTitle' in doc && doc.pageLongTitle) return doc.pageLongTitle
  if (doc.title) return doc.title
  return undefined
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

  if (!doc) {
    return {
      title: 'Page not found',
      robots: noindexRobotsMetadata,
    }
  }

  const ogImage = getImageURL(fallbackImage(doc))
  const pageTitle = pageTitleFromDoc(doc)
  const branded = brandTitle(pageTitle)
  const description = doc.meta?.description || undefined

  const collectionPath = (() => {
    if ('primary_case_study_category' in doc) return getCaseStudyUrl(doc as CaseStudy)
    if ('primary_category' in doc) return getPostUrl(doc as Post)
    if ('service_long_title' in doc) return getServiceUrl(doc)
    if ('testimonialLongTitle' in doc) return getTestimonialUrl(doc)
    return null
  })()
  const pagePath =
    Array.isArray(doc.slug) ? doc.slug.join('/') : doc.slug ? `/${doc.slug}` : '/'
  const path = url || collectionPath || pagePath
  const canonical = path.startsWith('http') ? path : path

  return {
    description,
    robots: siteRobotsMetadata,
    alternates: {
      canonical,
    },
    openGraph: mergeOpenGraph({
      description: description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title: branded,
      url: canonical,
    }),
    twitter: {
      card: 'summary_large_image',
      title: branded,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    title: {
      absolute: branded,
    },
  }
}
