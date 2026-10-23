import type { Metadata } from 'next'

import { HomePageContent } from '@/components/Home'
import { JsonLd } from '@/components/JsonLd'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { buildWebPageGraph } from '@/utilities/jsonLd'
import { HOME_DESCRIPTION, HOME_TITLE } from '@/utilities/siteIdentity'
import { siteRobotsMetadata } from '@/utilities/siteRobots'

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  robots: siteRobotsMetadata,
  alternates: {
    canonical: '/',
  },
  openGraph: mergeOpenGraph({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: '/',
  }),
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  },
}

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={buildWebPageGraph({
          path: '/',
          name: HOME_TITLE,
          description: HOME_DESCRIPTION,
        })}
      />
      <HomePageContent />
    </>
  )
}
