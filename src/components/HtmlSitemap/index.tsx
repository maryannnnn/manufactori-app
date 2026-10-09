import Link from 'next/link'
import React from 'react'

import { getHtmlSitemapData, type HtmlSitemapLink } from '@/utilities/getHtmlSitemapData'

const linkClassName =
  'text-base text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

const SitemapSection = ({
  heading,
  links,
  emptyLabel,
}: {
  heading: string
  links: HtmlSitemapLink[]
  emptyLabel?: string
}) => {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{heading}</h2>
      {links.length > 0 ? (
        <ul className="mt-4 max-w-[60ch] divide-y divide-border border-y border-border">
          {links.map((item) => (
            <li key={`${item.href}-${item.label}`}>
              <Link className={`block py-3 ${linkClassName}`} href={item.href}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-base text-muted-foreground">{emptyLabel || 'None published.'}</p>
      )}
    </section>
  )
}

export const HtmlSitemap = async () => {
  const data = await getHtmlSitemapData()

  return (
    <div className="container pb-8">
      <SitemapSection heading="Main Navigation" links={data.mainNavigation} />
      <SitemapSection
        emptyLabel="No published services."
        heading="Services"
        links={data.services}
      />
      <SitemapSection
        emptyLabel="No published case studies."
        heading="Case Studies"
        links={data.caseStudies}
      />
      <SitemapSection emptyLabel="No published articles." heading="Blog" links={data.posts} />
      {data.additionalPages.length > 0 ? (
        <SitemapSection heading="Additional Public Pages" links={data.additionalPages} />
      ) : null}
      <SitemapSection heading="Legal and Utility Pages" links={data.legalPages} />
    </div>
  )
}
