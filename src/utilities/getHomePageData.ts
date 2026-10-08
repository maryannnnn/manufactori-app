import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { CaseStudyCardData } from '@/components/CaseStudyCard'
import type { CardPostData } from '@/components/Card'
import type { ServiceCardData } from '@/components/ServiceCard'
import type { Media } from '@/payload-types'

import { getCaseStudyListPreview } from './getCaseStudyListPreview'
import { getPostList } from './getPostList'
import { getRichTextPlainText } from './richText/getPlainText'

export const HOME_SERVICES_LIMIT = 6
export const HOME_CASE_STUDIES_LIMIT = 3
export const HOME_POSTS_LIMIT = 3
export const HOME_TESTIMONIALS_LIMIT = 3

export type HomeTestimonial = {
  id: number | string
  quote: string
  author?: string | null
  position?: string | null
  company?: string | null
  date?: string | null
  photo?: Media | null
}

export type HomePageData = {
  services: ServiceCardData[]
  caseStudies: CaseStudyCardData[]
  posts: CardPostData[]
  testimonials: HomeTestimonial[]
}

export const getHomePageData = async (): Promise<HomePageData> => {
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
      depth: 1,
      draft: false,
      limit: HOME_TESTIMONIALS_LIMIT,
      overrideAccess: false,
      pagination: false,
      sort: ['-publishedAt', '-createdAt'],
      where: { featured: { equals: true } },
      select: {
        testimonial: true,
        testimonialPreviewImage: true,
        clientName: true,
        clientPosition: true,
        clientCompany: true,
        testimonialDate: true,
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
    testimonials: testimonials.docs.flatMap((doc) => {
      const quote = getRichTextPlainText(doc.testimonial)
      if (!quote) return []
      const photo =
        doc.testimonialPreviewImage && typeof doc.testimonialPreviewImage === 'object'
          ? doc.testimonialPreviewImage
          : null
      return [
        {
          id: doc.id,
          quote,
          author: doc.clientName || null,
          position: doc.clientPosition || null,
          company: doc.clientCompany || null,
          date: doc.testimonialDate || null,
          photo,
        },
      ]
    }),
  }
}
