import type { Metadata } from 'next'

import Link from 'next/link'
import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { generateMeta } from '@/utilities/generateMeta'
import { getServiceUrl, SERVICES_ARCHIVE_PATH } from '@/utilities/getContentUrls'

import PageClient from './page.client'

export default async function ServicesArchivePage() {
  const payload = await getPayload({ config: configPromise })
  const services = await payload.find({
    collection: 'services',
    depth: 0,
    draft: false,
    limit: 100,
    overrideAccess: false,
    pagination: false,
    sort: ['displayOrder', 'title'],
    select: {
      title: true,
      slug: true,
      service_preview_title: true,
    },
    where: {
      _status: { equals: 'published' },
    },
  })

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <div className="container mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Services
        </h1>
      </div>
      <div className="container">
        {services.docs.length > 0 ? (
          <ul className="max-w-[60ch] divide-y divide-border border-y border-border">
            {services.docs.map((doc) => {
              const href = getServiceUrl(doc)
              const label = doc.title || doc.service_preview_title
              if (!href || !label) return null

              return (
                <li key={doc.slug ?? doc.title}>
                  <Link
                    className="block py-3 text-base text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={href}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="text-base text-muted-foreground">No services available.</p>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    doc: {
      meta: {
        title: 'Services',
        description: 'Industrial and digital marketing services for manufacturing companies.',
      },
    },
    url: SERVICES_ARCHIVE_PATH,
  })

  return { ...meta, alternates: { ...meta.alternates, canonical: SERVICES_ARCHIVE_PATH } }
}
