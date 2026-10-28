import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { CaseStudyCardData } from '@/components/CaseStudyCard'
import type { CardPostData } from '@/components/Card'
import type { ServiceCardData } from '@/components/ServiceCard'
import type { CaseStudy, Media } from '@/payload-types'

import { getCaseStudyUrl, getTestimonialUrl } from './getContentUrls'
import { getCaseStudyListPreview } from './getCaseStudyListPreview'
import { getPostList } from './getPostList'
import { getRichTextPlainText } from './richText/getPlainText'

export const HOME_SERVICES_LIMIT = 7
export const HOME_CASE_STUDIES_LIMIT = 6
export const HOME_POSTS_LIMIT = 3

export type HomeTestimonial = {
  id: number | string
  quote: string
  author?: string | null
  position?: string | null
  company?: string | null
  testimonialHref: string
  caseHref?: string | null
  caseTitle?: string | null
  logo?: Media | null
}

export type HomePageData = {
  services: ServiceCardData[]
  caseStudies: CaseStudyCardData[]
  posts: CardPostData[]
  testimonials: HomeTestimonial[]
}

export const getHomePageData = cache(async (): Promise<HomePageData> => {
  const payload = await getPayload({ config: configPromise })

  const [services, caseStudies, posts, testimonials] = await Promise.all([
    payload.find({
      collection: 'services',
      depth: 1,
      draft: false,
      limit: HOME_SERVICES_LIMIT,
      overrideAccess: false,
      pagination: false,
      sort: ['displayOrder', 'title'],
      where: { _status: { equals: 'published' } },
      select: {
        title: true,
        slug: true,
        service_preview_title: true,
        service_preview_description: true,
        service_preview_image: true,
        service_card_image: true,
      },
    }),
    payload.find({
      collection: 'case-studies',
      depth: 1,
      draft: false,
      limit: HOME_CASE_STUDIES_LIMIT,
      overrideAccess: false,
      pagination: false,
      sort: ['displayOrder', '-publishedAt'],
      where: { featured: { equals: true } },
      select: {
        title: true,
        slug: true,
        case_study_long_title: true,
        case_study_categories: true,
        primary_case_study_category: true,
        featured: true,
        displayOrder: true,
        meta: true,
        layout: true,
      },
    }),
    getPostList({ page: 1 }),
    payload.find({
      collection: 'testimonials',
      depth: 2,
      draft: false,
      limit: 50,
      overrideAccess: false,
      pagination: false,
      where: { _status: { equals: 'published' } },
      select: {
        slug: true,
        testimonial: true,
        clientName: true,
        clientPosition: true,
        clientCompany: true,
        caseStudy: true,
      },
    }),
  ])

  return {
    services: services.docs,
    caseStudies: caseStudies.docs.map((doc) => {
      const preview = getCaseStudyListPreview(doc)
      return {
        title: doc.title,
        slug: doc.slug,
        case_study_categories: doc.case_study_categories,
        primary_case_study_category: doc.primary_case_study_category,
        meta: doc.meta,
        previewTitle: preview.previewTitle,
        previewText: preview.previewText,
        previewImage: preview.previewImage,
      }
    }),
    posts: posts.docs.slice(0, HOME_POSTS_LIMIT),
    testimonials: homeTestimonials(caseStudies.docs, testimonials.docs),
  }
})

const relationId = (value: unknown): string | null => {
  if (typeof value === 'number' || typeof value === 'string') return String(value)
  if (value && typeof value === 'object' && 'id' in value && value.id != null) return String(value.id)
  return null
}

const asLogo = (value: CaseStudy['company_logo']): Media | null => {
  if (!value || typeof value !== 'object' || !value.url) return null
  return value
}

const homeTestimonials = (
  caseStudies: Array<{ id: number | string }>,
  testimonials: Array<{
    id: number | string
    slug?: string | null
    testimonial?: unknown
    clientName?: string | null
    clientPosition?: string | null
    clientCompany?: string | null
    caseStudy?: number | CaseStudy | null
  }>,
): HomeTestimonial[] => {
  const order = new Map(caseStudies.map((doc, index) => [String(doc.id), index]))

  return testimonials
    .flatMap((doc) => {
      const caseStudy = doc.caseStudy && typeof doc.caseStudy === 'object' ? doc.caseStudy : null
      const caseId = relationId(doc.caseStudy)
      const testimonialHref = getTestimonialUrl(doc)
      const quote = getRichTextPlainText(doc.testimonial)
      if (!caseId || !order.has(caseId) || !testimonialHref || !quote) return []
      return [
        {
          id: doc.id,
          quote,
          author: doc.clientName || null,
          position: doc.clientPosition || null,
          company: doc.clientCompany || null,
          testimonialHref,
          caseHref: caseStudy ? getCaseStudyUrl(caseStudy) : null,
          caseTitle: caseStudy?.title || doc.clientCompany || null,
          logo: asLogo(caseStudy?.company_logo),
          order: order.get(caseId) ?? 0,
        },
      ]
    })
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...item }) => item)
}
