import type { Metadata } from 'next'

import { ComingSoonLanding } from '@/components/Landing/ComingSoon'
import { siteRobotsMetadata } from '@/utilities/siteRobots'

import PageClient from './page.client'

export const metadata: Metadata = {
  title: 'Manufacturing Marketing Agency | Coming Soon',
  description:
    'Manufacturing marketing agency website under development. Industrial SEO, demand generation, and brand authority for B2B manufacturers.',
  robots: siteRobotsMetadata,
}

export default function HomePage() {
  return (
    <>
      <PageClient />
      <ComingSoonLanding />
    </>
  )
}
