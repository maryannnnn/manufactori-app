'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { Logo } from '@/components/Logo/Logo'

import { DesktopNav } from './Nav/DesktopNav'
import { MobileNav } from './Nav/MobileNav'

export const HeaderClient: React.FC = () => {
  const headerRef = useRef<HTMLElement>(null)
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const syncHeight = () => {
      el.style.setProperty('--site-header-height', `${el.offsetHeight}px`)
    }

    syncHeight()
    const observer = new ResizeObserver(syncHeight)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <header
      className="relative z-20 border-b border-default bg-body text-heading"
      ref={headerRef}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="flex min-h-[4.5rem] items-center justify-between gap-4 py-3 lg:min-h-[5.5rem] lg:py-5">
          <Link
            aria-label="Maryan Polyak Manufacturing Marketing Agency, home"
            className="min-w-0 shrink text-heading focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            href="/"
          >
            <Logo loading="eager" priority="high" />
          </Link>
          <DesktopNav />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
