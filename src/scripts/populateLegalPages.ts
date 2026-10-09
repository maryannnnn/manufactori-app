import 'dotenv/config'
import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'
import {
  accessibilityHtml,
  accessibilitySeo,
  privacyHtml,
  privacySeo,
  sitemapIntroHtml,
  sitemapSeo,
} from './legalPageContent'

/**
 * Creates or updates the public Accessibility, Privacy Policy, and HTML Sitemap
 * pages in the existing Pages collection. Re-runnable: layout and SEO are replaced.
 */
const rt = (html: string) => generateJSON(html, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

const pages = [
  {
    slug: 'accessibility',
    title: 'Accessibility Statement',
    seo: accessibilitySeo,
    html: accessibilityHtml,
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    seo: privacySeo,
    html: privacyHtml,
  },
  {
    slug: 'sitemap',
    title: 'Sitemap',
    seo: sitemapSeo,
    html: sitemapIntroHtml,
  },
] as const

const contentLayout = (html: string) => [
  {
    blockType: 'content' as const,
    columns: [
      {
        size: 'full' as const,
        richText: rt(html),
      },
    ],
  },
]

const populate = async () => {
  const payload = await getPayload({ config })

  const forms = await payload.find({
    collection: 'forms',
    depth: 0,
    limit: 50,
    pagination: false,
    select: { title: true },
  })
  payload.logger.info(`Forms in CMS (${forms.docs.length}):`)
  for (const form of forms.docs) {
    payload.logger.info(`  - ${form.title}`)
  }

  const contactPage = await payload.find({
    collection: 'pages',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: 'contact' } },
    select: { title: true, slug: true, layout: true, _status: true },
  })
  const contactDoc = contactPage.docs[0]
  const contactHasForm = Boolean(
    contactDoc?.layout?.some((block) => block && 'blockType' in block && block.blockType === 'formBlock'),
  )
  payload.logger.info(
    `Contact page: ${contactDoc ? `${contactDoc.title} [/${contactDoc.slug}] formBlock=${contactHasForm}` : 'not found'}`,
  )

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      pagination: false,
      where: { slug: { equals: page.slug } },
    })

    const data = {
      title: page.title,
      pageLongTitle: page.title,
      slug: page.slug,
      generateSlug: false,
      _status: 'published' as const,
      hero: {
        type: 'none' as const,
      },
      layout: contentLayout(page.html()),
      meta: {
        title: page.seo.title,
        description: page.seo.description,
      },
    }

    const found = existing.docs[0]
    if (found) {
      const updated = await payload.update({
        collection: 'pages',
        id: found.id,
        depth: 0,
        context: { disableRevalidate: true },
        data,
      })
      payload.logger.info(`Updated page: ${updated.title} → /${updated.slug}`)
      continue
    }

    const created = await payload.create({
      collection: 'pages',
      depth: 0,
      context: { disableRevalidate: true },
      data,
    })
    payload.logger.info(`Created page: ${created.title} → /${created.slug}`)
  }

  process.exit(0)
}

void populate().catch((error) => {
  console.error(error)
  process.exit(1)
})
