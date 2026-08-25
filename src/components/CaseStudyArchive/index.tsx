import { cn } from '@/utilities/ui'
import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { getCaseStudyCategoryUrl, getCaseStudyUrl } from '@/utilities/getContentUrls'

export type CaseStudyCardData = {
  title?: string | null
  slug?: string | null
  primary_case_study_category?:
    | number
    | string
    | { id?: number | string; slug?: string | null; title?: string | null }
    | null
  case_study_categories?:
    | (
        | number
        | string
        | { id?: number | string; slug?: string | null; title?: string | null }
      )[]
    | null
  meta?: {
    description?: string | null
    image?: MediaType | number | null
  } | null
  previewTitle?: string | null
  previewText?: string | null
  previewImage?: MediaType | number | null
}

type Props = {
  docs: CaseStudyCardData[]
}

export const CaseStudyArchive: React.FC<Props> = ({ docs }) => {
  return (
    <div className={cn('container')}>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-8">
        {docs.map((doc, index) => {
          const href = getCaseStudyUrl({
            slug: doc.slug,
            primary_case_study_category: doc.primary_case_study_category,
          })
          const image = doc.previewImage || doc.meta?.image
          const text = doc.previewText || doc.meta?.description
          const categories = Array.isArray(doc.case_study_categories)
            ? doc.case_study_categories
            : []

          return (
            <article
              key={index}
              className="col-span-4 overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="relative w-full">
                {image && typeof image === 'object' ? (
                  <Media resource={image} size="33vw" />
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">No image</div>
                )}
              </div>
              <div className="p-4">
                {categories.length > 0 && (
                  <div className="mb-4 text-sm uppercase">
                    {categories.map((category, catIndex) => {
                      if (typeof category !== 'object' || !category) return null
                      const catHref = category.slug
                        ? getCaseStudyCategoryUrl({ slug: category.slug })
                        : null
                      const label = category.title || 'Untitled category'
                      return (
                        <React.Fragment key={catIndex}>
                          {catHref ? <Link href={catHref}>{label}</Link> : label}
                          {catIndex < categories.length - 1 ? ', ' : null}
                        </React.Fragment>
                      )
                    })}
                  </div>
                )}
                {doc.title && (
                  <h3 className="text-lg font-medium">
                    {href ? <Link href={href}>{doc.title}</Link> : doc.title}
                  </h3>
                )}
                {doc.previewTitle && doc.previewTitle !== doc.title && (
                  <div className="mt-2 text-sm font-medium">{doc.previewTitle}</div>
                )}
                {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
