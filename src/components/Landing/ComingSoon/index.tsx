import Link from 'next/link'
import React from 'react'

import { ComponentPreview } from './ComponentPreview'
import { PalettePanel } from './PalettePanel'
import { PaletteSelector } from './PaletteSelector'

export type LandingCategory = {
  title: string
  href: string
  description?: string
}

const pillars = [
  {
    title: 'Industrial SEO',
    description: 'Technical visibility for complex B2B manufacturing websites and product catalogs.',
  },
  {
    title: 'Demand Generation',
    description: 'Content and campaigns that turn engineering expertise into qualified pipeline.',
  },
  {
    title: 'Brand Authority',
    description: 'Positioning for manufacturers competing in crowded global markets.',
  },
] as const

const navItems = ['Services', 'Industries', 'Case Studies', 'Insights'] as const

type Props = {
  categories?: LandingCategory[]
}

/**
 * First implementation of the Design System.
 *
 * Every colour here comes from a semantic token, so switching the palette in the
 * selector restyles the whole page without any component change.
 */
export const ComingSoonLanding: React.FC<Props> = ({ categories = [] }) => {
  return (
    <main className="bg-body text-main">
      <header className="border-b border-default">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-baseline gap-3">
            <span className="text-lg font-semibold tracking-tight text-heading">Manufactori</span>
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Design System
            </span>
          </div>

          <nav aria-label="Placeholder navigation">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {navItems.map((item) => (
                <li key={item}>
                  <span className="cursor-default text-sm text-muted" title="Navigation placeholder">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <PaletteSelector />

      <section className="py-20 md:py-28">
        <div className="container">
          <div className="inline-flex items-center gap-2 rounded-full border border-default bg-surface px-3 py-1.5">
            <span aria-hidden className="h-2 w-2 rounded-full bg-cta" />
            <span className="font-mono text-xs uppercase tracking-[0.24em] text-main">
              Website Under Development
            </span>
          </div>

          <h1 className="mt-8 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight text-heading md:text-6xl">
            Manufacturing Digital Systems
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-main md:text-xl">
            Websites, SEO and digital marketing for manufacturing and industrial companies.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              className="rounded-md bg-cta px-5 py-2.5 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              href="#component-preview-heading"
            >
              Explore the System
            </a>

            <a
              className="rounded-md border border-border-strong px-5 py-2.5 text-sm font-medium text-heading transition-colors hover:bg-surface-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              href="#landing-resources"
            >
              View Case Studies
            </a>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {pillars.map((item) => (
              <article className="rounded-lg border border-default bg-surface p-6" key={item.title}>
                <h2 className="text-base font-medium text-heading">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ComponentPreview />

      <PalettePanel />

      {categories.length > 0 && (
        <section
          aria-labelledby="landing-resources"
          className="border-t border-default bg-surface py-20"
        >
          <div className="container">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Resources</p>

            <h2
              className="mt-3 text-2xl font-semibold tracking-tight text-heading md:text-3xl"
              id="landing-resources"
            >
              Blog categories
            </h2>

            <p className="mt-6 max-w-2xl text-base leading-7 text-main">
              Thematic guides and articles for manufacturing marketers. The full site is still in
              development, but these topics are already live.
            </p>

            <div className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
              {categories.map((category) => (
                <Link
                  className="group block border-t border-default pt-6 transition-colors hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  href={category.href}
                  key={category.href}
                >
                  <h3 className="text-lg font-medium text-heading">{category.title}</h3>

                  {category.description ? (
                    <p className="mt-3 text-sm leading-6 text-muted">{category.description}</p>
                  ) : null}

                  <span className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.24em] text-link transition-colors group-hover:text-link-hover">
                    Read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="border-t border-default py-10">
        <div className="container flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-muted">
            Launching soon. Full site, case studies, and insights are in production.
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Manufactori</p>
        </div>
      </footer>
    </main>
  )
}
