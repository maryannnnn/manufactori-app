import Link from 'next/link'
import React from 'react'

import { headerCta } from '@/Header/navigation'

export const HomeHero: React.FC = () => {
  return (
    <section className="border-b border-border">
      <div className="container py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Manufacturing marketing agency
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
          Marketing That Turns Manufacturing Expertise Into Qualified Pipeline
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
          Digital marketing, SEO, websites and lead generation built for manufacturers and
          industrial companies.
        </p>
        <div className="mt-10">
          <Link
            className="inline-flex min-h-11 items-center rounded-[2px] bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href={headerCta.href}
          >
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
