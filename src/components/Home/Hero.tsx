import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { ctaButtonClassName } from '@/design-system/ctaClasses'
import { headerCta } from '@/Header/navigation'

export const HomeHero: React.FC = () => {
  return (
    <section className="border-b border-border">
      <div className="container py-12 md:py-20">
        <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="relative min-h-[320px] overflow-hidden bg-card sm:min-h-[420px] lg:min-h-full">
            <Image
              alt="Maryan Polyak"
              className="object-cover object-[center_28%]"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="/media/maryan-polyak.jpg"
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Maryan Polyak
            </p>
            <p className="mt-3 text-base font-medium text-foreground md:text-lg">
              Manufacturing Marketing Strategist
            </p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl">
              Marketing That Turns Manufacturing Expertise Into Qualified Pipeline
            </h1>
            <p className="mt-6 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              I help manufacturing and industrial companies attract qualified B2B inquiries through
              strategic SEO, high-performance websites, Google Ads and AI Search optimization.
            </p>
            <p className="mt-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              With 20 years of experience in digital marketing and website development, I understand
              how to present complex products, technical capabilities and manufacturing expertise to
              the buyers who matter.
            </p>
            <div className="mt-8">
              <Link className={ctaButtonClassName} href={headerCta.href}>
                {headerCta.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
