import type { Metadata } from 'next'

import React from 'react'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ClientDirectory } from '@/components/ClientDirectory'
import { JsonLd } from '@/components/JsonLd'
import { generateMeta } from '@/utilities/generateMeta'
import { CLIENTS_PATH } from '@/utilities/getContentUrls'
import { getClientList } from '@/utilities/getClientList'
import { buildWebPageGraph, clientsBreadcrumbs } from '@/utilities/jsonLd'

import PageClient from './page.client'

const PAGE_TITLE = 'Clients'
const PAGE_DESCRIPTION =
  'Companies and businesses whose projects are featured in the portfolio, each linked to its case study.'

export default async function ClientsPage() {
  const clients = await getClientList()

  return (
    <div className="pt-16 pb-24">
      <PageClient />
      <JsonLd
        data={buildWebPageGraph({
          path: CLIENTS_PATH,
          name: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          breadcrumbs: clientsBreadcrumbs(),
          type: 'CollectionPage',
        })}
      />
      <div className="container mb-10">
        <div className="mb-5">
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: PAGE_TITLE },
            ]}
          />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {PAGE_TITLE}
        </h1>
        <p className="mt-4 max-w-[62ch] text-base leading-7 text-muted-foreground">
          Companies and businesses whose projects are featured in the portfolio. Open a card to
          read that company’s case study.
        </p>
      </div>
      <div className="container">
        {clients.length > 0 ? (
          <ClientDirectory clients={clients} />
        ) : (
          <p className="text-base text-muted-foreground">No clients available.</p>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generateMeta({
    doc: {
      meta: {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
      },
    },
    url: CLIENTS_PATH,
  })

  return { ...meta, alternates: { ...meta.alternates, canonical: CLIENTS_PATH } }
}
