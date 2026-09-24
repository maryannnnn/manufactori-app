import Link from 'next/link'
import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { getCaseStudyCategoryUrl } from '@/utilities/getContentUrls'

import { FieldLabel } from './Section'

type CategoryRef = { slug?: string | null; title?: string | null }

type Props = Pick<CaseStudy, 'case_study_categories'>

/**
 * Full taxonomy footer. Case studies can carry a dozen-plus category
 * relationships, so they live here rather than crowding the hero, where only
 * the primary category is shown.
 *
 * `site_categories` is deliberately not rendered: it belongs to the hidden
 * site-wide taxonomy and is not case study categorization.
 */
export const CaseStudyTaxonomy: React.FC<Props> = ({ case_study_categories }) => {
  const groups = [
    {
      label: 'Case Study Categories',
      items: toCategoryRefs(case_study_categories),
      linked: true,
    },
  ].filter((group) => group.items.length > 0)

  if (groups.length === 0) return null

  return (
    <section aria-label="Taxonomy" className="border-t border-border pt-8 pb-4">
      <div className="grid gap-7 md:grid-cols-2">
        {groups.map(({ items, label, linked }) => (
          <div key={label}>
            <FieldLabel>{label}</FieldLabel>
            <ul className="flex flex-wrap gap-2">
              {items.map((item, index) => {
                const href = linked && item.slug ? getCaseStudyCategoryUrl({ slug: item.slug }) : null
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

/** Relationships arrive as ids when the query depth is too shallow; drop those. */
const toCategoryRefs = (value: unknown): CategoryRef[] => {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is CategoryRef => Boolean(item) && typeof item === 'object')
}
