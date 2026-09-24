import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { getCaseStudyUrl } from '@/utilities/getContentUrls'
import { cn } from '@/utilities/ui'

type CategoryRef =
  | number
  | string
  | { id?: number | string; slug?: string | null; title?: string | null }
  | null

/**
 * Card-shaped subset of a Case Study. Preview values are resolved by
 * `getCaseStudyListPreview` from the `csPreview` layout block, so the card
 * itself never has to know about blocks.
 */
export type CaseStudyCardData = {
  title?: string | null
  slug?: string | null
  primary_case_study_category?: CategoryRef
  case_study_categories?: CategoryRef[] | null
  meta?: {
    description?: string | null
    image?: MediaType | number | null
  } | null
  previewTitle?: string | null
  previewText?: string | null
  previewImage?: MediaType | number | null
}

type Props = {
  className?: string
  doc: CaseStudyCardData
  /** Image `sizes` attribute; depends on the grid the card sits in. */
  imageSizes?: string
  showCategory?: boolean
}

export const CaseStudyCard: React.FC<Props> = ({
  className,
  doc,
  imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  showCategory = true,
}) => {
  const href = getCaseStudyUrl({
    slug: doc.slug,
    primary_case_study_category: doc.primary_case_study_category,
  })

  const image = doc.previewImage || doc.meta?.image
  const hasImage = image && typeof image === 'object'
  // Preview title is the editorial headline for listings; the internal title is the fallback.
  const heading = doc.previewTitle || doc.title
  const description = doc.previewText || doc.meta?.description
  const category = resolveCategoryLabel(doc)

  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-accent">
        {hasImage ? (
          <Media
            className="h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            resource={image}
            size={imageSizes}
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {showCategory && category ? (
          <div className="font-mono text-[11px] text-muted-foreground">{category}</div>
        ) : null}

        {heading ? (
          <h3 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
            {heading}
          </h3>
        ) : null}

        {description ? (
          <p className="line-clamp-3 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </>
  )

  const shell = cn(
    'group flex h-full flex-col overflow-hidden rounded-[2px] border border-border bg-card',
    className,
  )

  // The whole card is one link, so nothing inside it may be a link of its own.
  if (!href) {
    return <article className={shell}>{body}</article>
  }

  return (
    <article className={shell}>
      <Link
        className="flex h-full flex-col transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        href={href}
      >
        {body}
      </Link>
    </article>
  )
}

/** Prefers the primary category, falling back to the first populated relationship. */
const resolveCategoryLabel = (doc: CaseStudyCardData): string | null => {
  const primary = doc.primary_case_study_category
  if (primary && typeof primary === 'object' && primary.title) return primary.title

  const first = doc.case_study_categories?.find(
    (category): category is Exclude<CategoryRef, number | string | null> =>
      Boolean(category) && typeof category === 'object',
  )

  return first?.title || null
}
