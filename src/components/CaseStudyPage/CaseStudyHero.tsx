import Link from 'next/link'
import React from 'react'

import type { CaseStudy } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { getCaseStudyCategoryUrl } from '@/utilities/getContentUrls'

import { RichTextField } from './RichTextField'

type Props = {
  duration?: CaseStudy['duration']
  heading: string
  hero?: CaseStudy['hero']
  primaryCategory?: CaseStudy['primary_case_study_category']
}

/** '5_years' -> '5 Years', '6_months' -> '6 Months' */
const formatDuration = (value: NonNullable<CaseStudy['duration']>): string => {
  const [amount, unit] = value.split('_')
  const count = Number(amount)

  if (!count || !unit) return value

  if (unit === 'months') return `${count} Month${count === 1 ? '' : 's'}`
  return `${count} Year${count === 1 ? '' : 's'}`
}

const Tag: React.FC<{ children: React.ReactNode; href?: string | null }> = ({ children, href }) => {
  const className =
    'inline-flex items-center rounded-[2px] border border-border px-2.5 py-1 font-mono text-[11.5px] text-muted-foreground'

  if (href) {
    return (
      <Link
        className={`${className} transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
        href={href}
      >
        {children}
      </Link>
    )
  }

  return <span className={className}>{children}</span>
}

export const CaseStudyHero: React.FC<Props> = ({ duration, heading, hero, primaryCategory }) => {
  const category = typeof primaryCategory === 'object' ? primaryCategory : null
  const categoryHref = category?.slug ? getCaseStudyCategoryUrl({ slug: category.slug }) : null
  const heroMedia = hero?.media
  const heroLinks = hero?.links?.filter((item) => item?.link) ?? []

  return (
    <section className="pt-2 pb-10">
      {(category || duration) && (
        <div className="mb-6 flex flex-wrap gap-2">
          {category?.title ? <Tag href={categoryHref}>{category.title}</Tag> : null}
          {duration ? <Tag>{formatDuration(duration)}</Tag> : null}
        </div>
      )}

      {/* Long-form CMS titles are the norm here, so the measure is wider than a
          short marketing headline would need. */}
      <h1 className="max-w-[26ch] text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.08] font-semibold tracking-tight text-foreground">
        {heading}
      </h1>

      <RichTextField
        className="mt-5 max-w-[62ch] text-lg text-muted-foreground [&_p]:text-muted-foreground"
        value={hero?.richText}
      />

      {heroLinks.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          {heroLinks.map(({ link }, index) => (
            <CMSLink key={index} {...link} />
          ))}
        </div>
      )}

      {heroMedia && typeof heroMedia === 'object' ? (
        <div className="mt-10 overflow-hidden rounded-[2px] border border-border">
          <Media resource={heroMedia} size="100vw" />
        </div>
      ) : (
        <HeroRule />
      )}
    </section>
  )
}

/**
 * Stands in for the hero image when the case study has none, so the hero never
 * collapses into a bare block of text.
 */
const HeroRule: React.FC = () => (
  <div aria-hidden className="mt-10 max-w-[640px] text-muted-foreground">
    <svg className="h-auto w-full" viewBox="0 0 640 120" xmlns="http://www.w3.org/2000/svg">
      <line stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" x1="0" x2="640" y1="60" y2="60" />
      <g stroke="currentColor" strokeLinecap="round" strokeWidth="2">
        <line x1="40" x2="40" y1="60" y2="20" />
        <line x1="130" x2="130" y1="60" y2="95" />
        <line x1="220" x2="220" y1="60" y2="30" />
        <line x1="310" x2="310" y1="60" y2="90" />
        <line x1="400" x2="400" y1="60" y2="25" />
        <line x1="490" x2="490" y1="60" y2="85" />
        <line x1="580" x2="580" y1="60" y2="35" />
      </g>
    </svg>
  </div>
)
