import Link from 'next/link'
import React from 'react'

import { ContactStrip } from '@/components/ContactStrip'
import { cn } from '@/utilities/ui'
import {
  getIndustrialLandingCtaCopy,
  getIndustryCtaCopy,
  type IndustryCtaSlot,
} from '@/utilities/industryCtaCopy'

type Props = {
  className?: string
  /** Landing overview uses shared industrial copy instead of a single specialization title. */
  landing?: boolean
  slot: IndustryCtaSlot
  title?: string | null
}

/**
 * Contextual mid-page CTA for Industrial routes.
 * Reuses ContactStrip (WhatsApp / Telegram) plus a contact-page link.
 */
export const IndustryContextualCta: React.FC<Props> = ({
  className,
  landing = false,
  slot,
  title,
}) => {
  const copy = landing ? getIndustrialLandingCtaCopy(slot) : getIndustryCtaCopy(title, slot)

  return (
    <div className={cn('scroll-mt-24 py-8', className)}>
      <ContactStrip
        contained={false}
        description={copy.description}
        heading={copy.heading}
        idSuffix={landing ? `landing-${slot}` : `industry-${slot}`}
        variant="service"
      />
      <p className="mt-3 text-sm text-muted-foreground">
        Prefer email or a form?{' '}
        <Link
          className="font-medium text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          href="/contact"
        >
          Contact us
        </Link>
        .
      </p>
    </div>
  )
}
