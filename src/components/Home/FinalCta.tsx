import Link from 'next/link'
import React from 'react'

import { ctaButtonClassName } from '@/design-system/ctaClasses'
import { headerCta } from '@/Header/navigation'

export const HomeFinalCta: React.FC = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container">
        <h2 className="max-w-3xl text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          Ready to Turn Your Manufacturing Expertise Into More Qualified Opportunities?
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Let&apos;s look at your website, search visibility and current marketing system and
          identify where the biggest opportunities are.
        </p>
        <Link className={`mt-8 ${ctaButtonClassName}`} href={headerCta.href}>
          {headerCta.label}
        </Link>
      </div>
    </section>
  )
}
