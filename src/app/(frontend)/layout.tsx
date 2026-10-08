import type { Metadata, Viewport } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { InitPalette } from '@/design-system'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { JsonLd } from '@/components/JsonLd'
import { jsonLdGraph, organizationNode, websiteNode } from '@/utilities/jsonLd'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { HOME_DESCRIPTION, SITE_NAME } from '@/utilities/siteIdentity'
import { siteRobotsMetadata } from '@/utilities/siteRobots'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <InitPalette />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
          <JsonLd data={jsonLdGraph([organizationNode(), websiteNode()])} />
        </Providers>
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  robots: siteRobotsMetadata,
  openGraph: mergeOpenGraph({
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: HOME_DESCRIPTION,
  }),
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: HOME_DESCRIPTION,
  },
}
