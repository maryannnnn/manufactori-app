import type { Metadata } from 'next'

import { ComingSoonLanding } from '@/components/Landing/ComingSoon'
import { blogCategories } from '@/data/blogCategories'
import { getCategoryUrl } from '@/utilities/getContentUrls'
import { getRichTextPlainText } from '@/utilities/richText/getPlainText'
import { siteRobotsMetadata } from '@/utilities/siteRobots'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

import PageClient from './page.client'

export const metadata: Metadata = {
  title: 'Manufacturing Marketing Agency | Coming Soon',
  description:
    'Manufacturing marketing agency website under development. Industrial SEO, demand generation, and brand authority for B2B manufacturers.',
  robots: siteRobotsMetadata,
}

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'categories',
    depth: 0,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    select: {
      title: true,
      slug: true,
      category_description: true,
    },
  })

  const seedOrder = new Map(blogCategories.map((category, index) => [category.slug, index]))

  const categories = docs
    .filter((doc) => Boolean(doc.slug && doc.title))
    .sort((a, b) => {
      const aOrder = seedOrder.get(a.slug as string) ?? Number.MAX_SAFE_INTEGER
      const bOrder = seedOrder.get(b.slug as string) ?? Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) return aOrder - bOrder
      return (a.title || '').localeCompare(b.title || '')
    })
    .map((doc) => ({
      title: doc.title,
      href: getCategoryUrl(doc) as string,
      description: getRichTextPlainText(doc.category_description),
    }))

  return (
    <>
      <PageClient />
      <ComingSoonLanding categories={categories} />
    </>
  )
}
