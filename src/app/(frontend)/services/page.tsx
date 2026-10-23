import type { Metadata } from 'next'

import Link from 'next/link'
import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ContactStrip } from '@/components/ContactStrip'
import { JsonLd } from '@/components/JsonLd'
import { Media } from '@/components/Media'
import { generateMeta } from '@/utilities/generateMeta'
import { getServiceUrl, SERVICES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { buildWebPageGraph, serviceArchiveBreadcrumbs } from '@/utilities/jsonLd'

import PageClient from './page.client'

const paragraphs = (value: string | null | undefined): string[] =>
  (value ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

export default async function ServicesArchivePage() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({
    collection: 'services',
    depth: 1,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: ['displayOrder', 'title'],
    select: {
      title: true,
      slug: true,
      service_preview_title: true,
      service_preview_description: true,
      service_card_image: true,
    },
    where: {
      _status: { equals: 'published' },
    },
  })

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <JsonLd
        data={buildWebPageGraph({
          path: SERVICES_ARCHIVE_PATH,
          name: 'Services',
          description:
            'SEO, technical content, and AI-powered search for manufacturing companies. Ordinary search remains the foundation.',
          breadcrumbs: serviceArchiveBreadcrumbs(),
          type: 'CollectionPage',
        })}
      />
      <div className="container mb-10">
        <div className="mb-5">
          <Breadcrumbs items={[{ name: 'Home', href: '/' }, { name: 'Services' }]} />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Services
        </h1>
        <p className="mt-6 max-w-[65ch] text-base leading-7 text-muted-foreground">
          Industrial marketing works better when the website, technical content, search, and
          client acquisition operate as one system. The work starts from what the company
          actually manufactures, the products it sells, the markets it serves, and what its buyers
          need. Ordinary SEO remains the foundation. AI search optimization extends that same
          product information. It is not a shortcut around it.
        </p>
      </div>

      <div className="container">
        {services.docs.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {services.docs.map((doc) => {
              const href = getServiceUrl(doc)
              const title = doc.service_preview_title || doc.title
              const parts = paragraphs(doc.service_preview_description)
              const image =
                doc.service_card_image && typeof doc.service_card_image === 'object'
                  ? doc.service_card_image
                  : null
              if (!title) return null

              return (
                <article
                  className="flex min-w-0 flex-col overflow-hidden rounded-[2px] border border-border bg-card"
                  key={doc.slug ?? title}
                >
                  {image?.url || image?.filename ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-accent">
                      <Media
                        className="h-full w-full"
                        fill
                        imgClassName="h-full w-full object-cover"
                        resource={image}
                        size="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                  <div className="flex min-w-0 flex-1 flex-col p-5">
                    <h2 className="text-lg font-semibold tracking-tight text-foreground">
                      {href ? (
                        <Link
                          className="transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                          href={href}
                        >
                          {title}
                        </Link>
                      ) : (
                        title
                      )}
                    </h2>
                    {parts.map((part) => (
                      <p className="mt-3 text-sm leading-6 text-muted-foreground" key={part}>
                        {part}
                      </p>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <p className="text-base text-muted-foreground">No services available.</p>
        )}

        <section className="mt-16 max-w-[65ch]">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            One System
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Website structure helps buyers find products. Technical content explains how those
            products are used. SEO improves visibility in ordinary search, and the same clarity
            helps AI-powered search retrieve the right information. A citation is not guaranteed.
            Advertising adds further ways to reach buyers. A sales process helps the company
            handle the inquiries that arrive.
          </p>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Not every company needs every service at once. The sensible start is a look at the
            current website, the product range, the target markets, and the commercial tasks.
          </p>
        </section>

        <ContactStrip
          className="mt-16"
          contained={false}
          description="Talk through the current website, your marketing priorities, and the most sensible next steps."
          heading="Discuss your manufacturing marketing"
        />
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    doc: {
      meta: {
        title: 'Services',
        description: 'SEO, technical content, and AI-powered search for manufacturing companies. Ordinary search remains the foundation.',
      },
    },
    url: SERVICES_ARCHIVE_PATH,
  })

  return { ...meta, alternates: { ...meta.alternates, canonical: SERVICES_ARCHIVE_PATH } }
}
