import Link from 'next/link'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { getServiceUrl } from '@/utilities/getContentUrls'
import { cn } from '@/utilities/ui'

export type ServiceCardData = {
  title?: string | null
  slug?: string | null
  service_preview_title?: string | null
  service_preview_description?: string | null
  service_preview_image?: MediaType | number | null
  service_card_image?: MediaType | number | null
  meta?: {
    description?: string | null
    image?: MediaType | number | null
  } | null
}

type Props = {
  className?: string
  ctaLabel?: string
  doc: ServiceCardData
  imageSizes?: string
  variant?: 'default' | 'compact'
}

export const ServiceCard: React.FC<Props> = ({
  className,
  ctaLabel,
  doc,
  imageSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  variant = 'default',
}) => {
  const href = getServiceUrl(doc)
  const title = doc.service_preview_title || doc.title
  const description = doc.service_preview_description || doc.meta?.description
  const image = doc.service_card_image
  const hasImage = image && typeof image === 'object'
  const compact = variant === 'compact'

  const inner = (
    <>
      {compact ? (
        hasImage ? (
          <div className="relative mx-5 mt-5 size-14 overflow-hidden rounded-[2px] bg-accent">
            <Media
              fill
              imgClassName="h-full w-full object-cover"
              resource={image}
              size="56px"
            />
          </div>
        ) : null
      ) : (
        <div className="relative aspect-[4/3] overflow-hidden bg-accent">
          {hasImage ? (
            <Media
              fill
              imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              resource={image}
              size={imageSizes}
            />
          ) : null}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col p-4">
        {title ? <div className="font-semibold tracking-tight">{title}</div> : null}
        {description ? (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{description}</p>
        ) : null}
        {ctaLabel ? (
          <span className="mt-auto pt-4 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground group-hover:text-foreground">
            {ctaLabel}
          </span>
        ) : null}
      </div>
    </>
  )

  const classNames = cn(
    'group flex h-full min-w-0 flex-col overflow-hidden rounded-[2px] border border-border bg-card',
    className,
  )

  if (!href) return <div className={classNames}>{inner}</div>

  return (
    <Link
      className={cn(classNames, 'transition-colors hover:border-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring')}
      href={href}
    >
      {inner}
    </Link>
  )
}
