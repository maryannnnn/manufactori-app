import Link from 'next/link'
import { getPayload } from 'payload'
import React, { cache } from 'react'

import type { CaseStudy, Media as MediaType, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import { getCaseStudyUrl, getPostUrl } from '@/utilities/getContentUrls'
import { getCaseStudyListPreview } from '@/utilities/getCaseStudyListPreview'
import { getPostListPreview } from '@/utilities/getPostListPreview'
import { cn } from '@/utilities/ui'

const LIMIT = 3

type Mode = 'posts' | 'case-studies'

type Item = {
  category: string | null
  cta: string
  description: string | null
  heading: string | null
  href: string | null
  image: MediaType | number | null
  key: string
  publishedAt: string | null
  publishedLabel: string | null
}

const COPY: Record<Mode, { eyebrow: string; headingId: string; lead: string; title: string }> = {
  posts: {
    eyebrow: 'Further reading',
    headingId: 'related-writing-heading',
    lead: 'Recent articles from the same field of work.',
    title: 'Latest writing on this subject',
  },
  'case-studies': {
    eyebrow: 'Case work',
    headingId: 'related-case-work-heading',
    lead: 'Recent case studies from the same field of work.',
    title: 'How this shows up in practice',
  },
}

/** Numeric ids from a hasMany site-categories relationship, populated or raw. */
export const siteCategoryIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return []

  const ids = value.flatMap((item) => {
    if (typeof item === 'number' && Number.isFinite(item)) return [item]
    if (typeof item === 'string' && /^\d+$/.test(item)) return [Number(item)]
    if (item && typeof item === 'object' && 'id' in item) {
      const id = (item as { id?: unknown }).id
      if (typeof id === 'number' && Number.isFinite(id)) return [id]
      if (typeof id === 'string' && /^\d+$/.test(id)) return [Number(id)]
    }
    return []
  })

  return [...new Set(ids)]
}

const categoryTitle = (value: unknown): string | null => {
  if (!value || typeof value !== 'object' || !('title' in value)) return null
  const title = (value as { title?: unknown }).title
  return typeof title === 'string' && title.trim() ? title : null
}

const publishedLabel = (value: string | null | undefined): string | null => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

const queryRelated = cache(async (mode: Mode, key: string) => {
  const ids = key.split(',').map(Number).filter((id) => Number.isFinite(id))
  if (!ids.length) return []

  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: mode,
    depth: 1,
    draft: false,
    limit: LIMIT,
    overrideAccess: false,
    pagination: false,
    sort: '-publishedAt',
    where: {
      site_categories: {
        in: ids,
      },
    },
  })

  return result.docs
})

const toPostItem = (post: Post): Item => {
  const preview = getPostListPreview(post)
  return {
    category: categoryTitle(post.primary_category),
    cta: 'Read article',
    description: preview.previewText,
    heading: preview.previewTitle || post.title,
    href: getPostUrl({
      primary_category: post.primary_category,
      slug: post.slug,
    }),
    image: preview.previewImage,
    key: `post-${post.id}`,
    publishedAt: post.publishedAt || null,
    publishedLabel: publishedLabel(post.publishedAt),
  }
}

const toCaseStudyItem = (doc: CaseStudy): Item => {
  const preview = getCaseStudyListPreview(doc)
  return {
    category: categoryTitle(doc.primary_case_study_category),
    cta: 'Read case study',
    description: preview.previewText,
    heading: preview.previewTitle || doc.title,
    href: getCaseStudyUrl({
      primary_case_study_category: doc.primary_case_study_category,
      slug: doc.slug,
    }),
    image: preview.previewImage,
    key: `case-${doc.id}`,
    publishedAt: doc.publishedAt || null,
    publishedLabel: publishedLabel(doc.publishedAt),
  }
}

/**
 * Three latest documents that share any hidden Site Category with the current page.
 * Public category labels stay on the cards. Site Category titles are never rendered.
 * The section is omitted when the page has no site categories or no matches.
 */
export const RelatedSiteContent: React.FC<{
  mode: Mode
  siteCategories: unknown
}> = async ({ mode, siteCategories }) => {
  const ids = siteCategoryIds(siteCategories)
  if (!ids.length) return null

  const docs = await queryRelated(mode, [...ids].sort((a, b) => a - b).join(','))
  const items =
    mode === 'posts'
      ? (docs as Post[]).map(toPostItem)
      : (docs as CaseStudy[]).map(toCaseStudyItem)

  if (!items.length) return null

  const copy = COPY[mode]

  return (
    <section aria-labelledby={copy.headingId} className="border-t border-border py-16 md:py-20">
      <div className="container">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {copy.eyebrow}
        </p>
        <h2
          className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          id={copy.headingId}
        >
          {copy.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">{copy.lead}</p>
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <PracticeCard item={item} key={item.key} />
          ))}
        </div>
      </div>
    </section>
  )
}

const PracticeCard: React.FC<{ item: Item }> = ({ item }) => {
  const hasImage = item.image && typeof item.image === 'object'
  const body = (
    <>
      <div className="relative aspect-[4/3] overflow-hidden bg-accent">
        {hasImage ? (
          <Media
            className="h-full w-full"
            fill
            imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            resource={item.image}
            showWatermark
            size="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        {item.category || item.publishedLabel ? (
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            {item.category ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-link">
                {item.category}
              </span>
            ) : null}
            {item.publishedLabel ? (
              <time
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                dateTime={item.publishedAt || undefined}
              >
                {item.publishedLabel}
              </time>
            ) : null}
          </div>
        ) : null}
        {item.heading ? (
          <h3 className="text-lg leading-snug font-semibold tracking-tight text-foreground">
            {item.heading}
          </h3>
        ) : null}
        {item.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
        ) : null}
        <span className="mt-auto pt-3 font-mono text-xs uppercase tracking-[0.16em] text-link group-hover:text-link-hover">
          {item.cta}
        </span>
      </div>
    </>
  )

  const shell = cn(
    'group flex h-full flex-col overflow-hidden rounded-[2px] border border-border bg-card transition-colors hover:border-cta',
  )

  if (!item.href) {
    return <article className={shell}>{body}</article>
  }

  return (
    <article className={shell}>
      <Link
        className="flex h-full flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        href={item.href}
      >
        {body}
      </Link>
    </article>
  )
}
