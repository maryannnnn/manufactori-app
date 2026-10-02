import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { tiptapEditorWithHeadings } from '@/fields/defaultTiptap'
import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'

import { Page, Post, CaseStudy } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { getCaseStudyUrl, getPostUrl, getServiceUrl, getTestimonialUrl } from '@/utilities/getContentUrls'

type SeoDoc = (Post | Page | CaseStudy) & {
  service_long_title?: string | null
  testimonialLongTitle?: string | null
  introduction?: unknown
}

const generateTitle: GenerateTitle<SeoDoc> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payload Website Template` : 'Payload Website Template'
}

const generateURL: GenerateURL<SeoDoc> = ({ doc }) => {
  const url = getServerSideURL()
  if (!doc || typeof doc !== 'object') return url

  if ('primary_case_study_category' in doc) {
    const path = getCaseStudyUrl(doc as CaseStudy)
    if (path) return `${url}${path}`
  }

  if ('primary_category' in doc) {
    const path = getPostUrl(doc as Post)
    if (path) return `${url}${path}`
  }

  if ('service_long_title' in doc || 'introduction' in doc) {
    const path = getServiceUrl(doc)
    if (path) return `${url}${path}`
  }

  if ('testimonialLongTitle' in doc) {
    const path = getTestimonialUrl(doc)
    if (path) return `${url}${path}`
  }

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'case-studies', 'services', 'testimonials'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories', 'case-study-categories', 'site-categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: tiptapEditorWithHeadings,
            }
          }
          return field
        })
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
]
