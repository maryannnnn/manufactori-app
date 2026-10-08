import type { Metadata } from 'next'

import { HOME_DESCRIPTION, SITE_NAME } from './siteIdentity'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: HOME_DESCRIPTION,
  siteName: SITE_NAME,
  title: SITE_NAME,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
