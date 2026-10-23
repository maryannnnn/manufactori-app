import 'dotenv/config'
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import { generateJSON } from '@tiptap/html'
import config from '@payload-config'
import { getPayload } from 'payload'

import { getTiptapExtensions } from '../utilities/richText/extensions'

const rt = (text: string) =>
  generateJSON(`<p>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>`, getTiptapExtensions({ headingLevels: [2, 3, 4] }))

type Row = {
  slug: string
  company: string
  caseStudyId: number
  quote: string
  description: string
}

const rows: Row[] = [
  {
    slug: 'testimonial-laser-made',
    company: 'Laser Made',
    caseStudyId: 3,
    quote:
      'We worked with Maryan Polyak on website development and online promotion. He helped us develop our online presence and present our products and services more clearly to potential customers. He understood our business and took a practical approach to website structure, design, and SEO. We appreciated his technical expertise and attention to the specific needs of our company.',
    description:
      'Laser Made describes working with Maryan Polyak on website development and online promotion for its products and services.',
  },
  {
    slug: 'testimonial-pnevmomachta',
    company: 'Pnevmomachta',
    caseStudyId: 4,
    quote:
      'We have worked with Maryan Polyak for many years on our website development and SEO. Our business specializes in industrial equipment, and Maryan helped us improve how our products are presented online and make our website more useful for potential customers. He paid attention to our product range, website structure, and search visibility. We appreciated his experience, technical knowledge, and consistent approach to the work.',
    description:
      'Pnevmomachta describes a long collaboration with Maryan Polyak on website development and SEO for its industrial equipment.',
  },
  {
    slug: 'testimonial-merkan-invest-stroy',
    company: 'Merkan Invest Stroy',
    caseStudyId: 8,
    quote:
      'We worked with Maryan Polyak for five years on our website development and online promotion. Our business provides ventilation and air conditioning systems, air duct production, installation, and maintenance. Maryan helped us organize the website and present our services more clearly so customers could better understand the full range of our work. He also worked on SEO, keyword research, and website structure. We appreciated his practical approach, technical knowledge, and effort to understand the specifics of our business.',
    description:
      'Merkan Invest Stroy describes five years of website development and online promotion with Maryan Polyak for ventilation and air-conditioning work.',
  },
  {
    slug: 'testimonial-aleks-sf',
    company: 'Aleks SF',
    caseStudyId: 12,
    quote:
      'Maryan Polyak helped us improve our website and online presence for our business specializing in the production and installation of equipment for jewelry stores. He understood the specific needs of our business and helped present our products and services more clearly to potential customers. His practical approach to website development and SEO helped us organize our online information more effectively. We appreciated his technical knowledge and attention to detail.',
    description:
      'Aleks SF describes working with Maryan Polyak on the website and online presence for jewelry-store equipment.',
  },
  {
    slug: 'testimonial-alumatrix',
    company: 'Alumatrix',
    caseStudyId: 13,
    quote:
      'Maryan Polyak worked on our website and online promotion, helping us present our aluminum composite panels and facade systems more clearly. Our business combines product supply with technical solutions for building facades, so it was important to explain our products and their applications in a structured way. Maryan took a practical approach to website organization and SEO, helping us communicate our capabilities to potential customers more effectively. We appreciated his understanding of the relationship between technical products and online presentation.',
    description:
      'Alumatrix describes website and online promotion work with Maryan Polyak for aluminum composite panels and facade systems.',
  },
  {
    slug: 'testimonial-geotermal',
    company: 'Geotermal',
    caseStudyId: 20,
    quote:
      'Maryan Polyak helped us improve our website and online visibility. He approached the work with attention to our business and the services we provide, focusing on website structure, content, and SEO. He worked to make the information easier for potential customers to understand and find online. We appreciated his professional approach, technical knowledge, and attention to the practical needs of our business.',
    description:
      'Geotermal describes website and online-visibility work with Maryan Polyak, focused on structure, content, and SEO.',
  },
  {
    slug: 'testimonial-siblux',
    company: 'Siblux',
    caseStudyId: 21,
    quote:
      'Maryan Polyak helped us present our wooden house construction business online. He worked on the website structure and SEO, with a focus on explaining our products and services clearly to potential customers. For a business involving custom building solutions, it is important to communicate the available options and the value of the work in an understandable way. We appreciated his practical approach and his attention to how our business was represented online.',
    description:
      'Siblux describes website structure and SEO work with Maryan Polyak for its wooden house construction business.',
  },
  {
    slug: 'testimonial-areks',
    company: 'AREKS',
    caseStudyId: 23,
    quote:
      'Maryan Polyak helped us with website development and online promotion, focusing on the way our business and services were presented online. He approached the work methodically, paying attention to website structure, content, and SEO. His aim was to make our information clearer and easier for potential customers to find. We appreciated his technical expertise and practical approach to digital marketing.',
    description:
      'AREKS describes website development and online promotion with Maryan Polyak, including structure, content, and SEO.',
  },
  {
    slug: 'testimonial-ivicom',
    company: 'Ivicom',
    caseStudyId: 25,
    quote:
      'Maryan Polyak worked on improving our website and online presence. He focused on website organization, content, and SEO to help present our business more clearly to potential customers. He took a practical approach to the work and considered how the website could better communicate our services and business capabilities. We appreciated his technical knowledge, attention to detail, and commitment to improving our online presentation.',
    description:
      'Ivicom describes website organization, content, and SEO work with Maryan Polyak.',
  },
]

const dataFor = (row: Row) => {
  const title = `Testimonial: Maryan Polyak | ${row.company}`
  const longTitle = `Testimonial from ${row.company} about Working with Maryan Polyak`
  return {
    title,
    slug: row.slug,
    generateSlug: false,
    testimonialLongTitle: longTitle,
    testimonialContentTitle: longTitle,
    testimonialPreviewTitle: row.company,
    testimonialPreviewDescription: row.description,
    testimonial: rt(row.quote),
    clientCompany: row.company,
    caseStudy: row.caseStudyId,
    testimonialType: 'client' as const,
    verified: false,
    featured: false,
    _status: 'published' as const,
    meta: {
      title,
      description: row.description,
    },
  }
}

const run = async () => {
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'testimonials',
    depth: 0,
    draft: true,
    limit: 100,
    overrideAccess: true,
    pagination: false,
  })
  const backupDir = path.resolve('docs/website-maintenance/backups/2026-10-23-testimonials')
  mkdirSync(backupDir, { recursive: true })
  writeFileSync(
    path.join(backupDir, 'testimonials-before.json'),
    JSON.stringify(existing.docs, null, 2),
  )

  for (const row of rows) {
    const caseStudy = await payload.findByID({
      collection: 'case-studies',
      id: row.caseStudyId,
      depth: 0,
      overrideAccess: true,
    })
    if (!caseStudy?.slug) throw new Error(`Case study ${row.caseStudyId} missing for ${row.company}`)

    const found = existing.docs.find((doc) => doc.slug === row.slug)
    const data = dataFor(row)
    if (found) {
      await payload.update({
        collection: 'testimonials',
        id: found.id,
        draft: false,
        overrideAccess: true,
        context: { disableRevalidate: true },
        data,
      })
      payload.logger.info(`Updated ${row.slug} → case ${caseStudy.slug} logo=${caseStudy.company_logo ?? 'none'}`)
      continue
    }

    await payload.create({
      collection: 'testimonials',
      draft: false,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data,
    })
    payload.logger.info(`Created ${row.slug} → case ${caseStudy.slug} logo=${caseStudy.company_logo ?? 'none'}`)
  }

  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
