import Link from 'next/link'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { FooterChannels } from '@/Footer/Channels'
import { legalFooterLinks } from '@/Footer/legalLinks'
import { headerCta, mainNavigation } from '@/Header/navigation'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
import { getCachedGlobal } from '@/utilities/getGlobals'

const fallbackLinks = [
  ...mainNavigation.map((item) => ({ label: item.label, href: item.href })),
  { label: 'Contact', href: headerCta.href },
]

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const cmsItems = footerData?.navItems || []
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border bg-card text-foreground" data-site-footer>
      <div className="container grid gap-10 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
        <div className="max-w-sm">
          <Link
            className="inline-flex text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            href="/"
          >
            <Logo />
          </Link>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Manufacturing marketing, SEO and digital growth for industrial companies.
          </p>
          <FooterChannels channels={footerData?.channels} />
        </div>

        <div className="flex flex-col gap-6 md:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-3">
            {cmsItems.length > 0
              ? cmsItems.map(({ link }, index) => (
                  <CMSLink className="text-sm text-muted-foreground" key={index} {...link} />
                ))
              : fallbackLinks.map((item) => (
                  <Link
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </Link>
                ))}
          </nav>
          <ThemeSelector />
        </div>
      </div>
      <div className="container border-t border-border py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
            © {year} Maryan Polyak
          </p>
          <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2">
            {legalFooterLinks.map((item) => (
              <Link
                className="text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  )
}
