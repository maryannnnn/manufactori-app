import Link from 'next/link'
import React from 'react'

import { ctaButtonClassName } from '@/design-system/ctaClasses'
import { headerCta } from '@/Header/navigation'

export const HomeHero: React.FC = () => {
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <p className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-cta" />
          Manufacturing marketing agency
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
          Marketing That Turns Manufacturing Expertise Into Qualified Pipeline
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
          SEO, websites, technical content, and lead generation for manufacturers and industrial
          companies, prepared so ordinary search and AI-powered search can use the same product
          information.
        </p>
        <div className="mt-10">
          <Link className={ctaButtonClassName} href={headerCta.href}>
            {headerCta.label}
          </Link>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            Built around real manufacturing expertise, technical products and complex B2B buying
            journeys.
          </p>
        </div>
      </div>
    </section>
  )
}
