import type { Metadata } from 'next'

import type { CaseStudy, Media, Page, Post, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'
import { getCaseStudyUrl, getPostUrl } from './getContentUrls'
import { getPublicMediaPath } from './getMediaUrl'
import { siteRobotsMetadata } from './siteRobots'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()

  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const publicPath = getPublicMediaPath(image.sizes?.og?.filename || image.filename)
    const ogUrl = image.sizes?.og?.url

    url = publicPath
      ? serverUrl + publicPath
      : ogUrl
        ? serverUrl + ogUrl
        : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | Partial<CaseStudy> | null
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

  const isCaseStudy = Boolean(doc && 'primary_case_study_category' in doc)
  const collectionPath = doc
    ? isCaseStudy
      ? getCaseStudyUrl(doc as CaseStudy)
      : getPostUrl(doc as Post)
    : null
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
