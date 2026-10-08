import Link from 'next/link'
import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { getCaseStudyCategoryUrl, getCategoryUrl } from '@/utilities/getContentUrls'

import { FieldLabel } from './Section'

type CategoryRef = { slug?: string | null; title?: string | null }

type TaxonomyGroup = {
  hrefFor?: (item: CategoryRef) => string | null
  items: CategoryRef[]
  label: string
}

type TaxonomyChipsProps = {
  groups: TaxonomyGroup[]
  labelledBy?: string
}

/**
 * Shared chip list for public taxonomies. Used by Case Studies and Posts.
 * `site_categories` is never passed here.
 */
export const TaxonomyChips: React.FC<TaxonomyChipsProps> = ({ groups, labelledBy = 'Taxonomy' }) => {
  const visible = groups.filter((group) => group.items.length > 0)
  if (visible.length === 0) return null

  return (
    <section aria-label={labelledBy} className="border-t border-border pt-8 pb-4">
      <div className="grid gap-7 md:grid-cols-2">
        {visible.map(({ hrefFor, items, label }) => (
          <div key={label}>
            <FieldLabel>{label}</FieldLabel>
            <ul className="flex flex-wrap gap-2">
              {items.map((item, index) => {
                const href = hrefFor?.(item) ?? null
                const title = item.title || item.slug

                if (!title) return null

                return (
                  <li key={`${title}-${index}`}>
                    {href ? (
                      <Link
                        className="inline-flex rounded-[2px] border border-border px-2.5 py-1 font-mono text-[11.5px] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        href={href}
                      >
                        {title}
                      </Link>
                    ) : (
                      <span className="inline-flex rounded-[2px] border border-border px-2.5 py-1 font-mono text-[11.5px] text-muted-foreground">
                        {title}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

type Props = Pick<CaseStudy, 'case_study_categories'>

export const CaseStudyTaxonomy: React.FC<Props> = ({ case_study_categories }) => {
  return (
    <TaxonomyChips
      groups={[
        {
          label: 'Case Study Categories',
          items: toCategoryRefs(case_study_categories),
          hrefFor: (item) => (item.slug ? getCaseStudyCategoryUrl({ slug: item.slug }) : null),
        },
      ]}
    />
  )
}

export const PostTaxonomy: React.FC<{ categories?: unknown }> = ({ categories }) => {
  return (
    <TaxonomyChips
      labelledBy="Categories"
      groups={[
        {
          label: 'Categories',
          items: toCategoryRefs(categories),
          hrefFor: (item) => (item.slug ? getCategoryUrl({ slug: item.slug }) : null),
        },
      ]}
    />
  )
}

/** Relationships arrive as ids when the query depth is too shallow; drop those. */
const toCategoryRefs = (value: unknown): CategoryRef[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is CategoryRef => Boolean(item) && typeof item === 'object')
}
