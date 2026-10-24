import Link from 'next/link'
import React from 'react'

import type { Media } from '@/payload-types'

import { Media as MediaComponent } from '@/components/Media'

type Props = {
  company: string
  excerpt: string
  href: string
  logo: Media | null
  name?: string
  position?: string
}

export const testimonialExcerpt = (text: string, max = 200): string => {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (normalized.length <= max) return normalized
  const lastSpace = normalized.slice(0, max + 1).lastIndexOf(' ')
  const cut = (lastSpace > 0 ? normalized.slice(0, lastSpace) : normalized.slice(0, max)).replace(
    /[\s.,;:!?—-]+$/u,
    '',
  )
  return `${cut}…`
}

export const TestimonialCard: React.FC<Props> = ({ company, excerpt, href, logo, name, position }) => {
  return (
    <article className="min-w-0 rounded-[2px] border border-border bg-card">
      <Link
        className="group flex flex-col gap-4 p-5 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        href={href}
      >
        {logo?.url ? (
          <div className="flex h-12 items-center">
            <MediaComponent
              className="flex h-full w-full items-center"
              imgClassName="h-auto max-h-12 w-auto max-w-full object-contain object-left"
              resource={logo}
              size="(max-width: 768px) 50vw, 240px"
            />
          </div>
        ) : null}
        {company ? (
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{company}</h2>
        ) : null}
        {name || position ? (
          <p className="text-sm text-foreground">
            {name ? <span className="font-medium">{name}</span> : null}
            {name && position ? <span className="text-muted-foreground">, </span> : null}
            {position ? <span className="text-muted-foreground">{position}</span> : null}
          </p>
        ) : null}
        {excerpt ? (
          <p className="text-sm leading-6 text-muted-foreground">{excerpt}</p>
        ) : null}
        <span className="text-sm text-link underline-offset-4 group-hover:underline">
          Read the full testimonial
        </span>
      </Link>
    </article>
  )
}
