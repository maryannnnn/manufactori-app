'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

import { getNavSections, mainNavigation, navItemHasMenu, type NavItem } from '../navigation'

const navLinkClass =
  'inline-flex min-h-11 items-center px-2 text-sm font-medium text-main transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'

const isCurrentPath = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const DesktopNav: React.FC = () => {
  const pathname = usePathname()
  const [openId, setOpenId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const closeTimer = useRef<number | null>(null)
  const megaId = useId()

  const clearCloseTimer = () => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openMenu = (id: string) => {
    clearCloseTimer()
    setOpenId(id)
  }

  const closeMenu = () => {
    clearCloseTimer()
    setOpenId(null)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => {
      setOpenId(null)
      closeTimer.current = null
    }, 120)
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    if (!openId) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        const trigger = navRef.current?.querySelector<HTMLButtonElement>(
          `button[aria-controls="${megaId}-${openId}"]`,
        )
        closeMenu()
        trigger?.focus()
      }
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && navRef.current && !navRef.current.contains(target)) {
        closeMenu()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [megaId, openId])

  useEffect(() => () => clearCloseTimer(), [])

  return (
    <nav
      aria-label="Main"
      className="hidden min-w-0 lg:block"
      onMouseLeave={scheduleClose}
      ref={navRef}
    >
      <ul className="flex flex-wrap items-center justify-end gap-1">
        {mainNavigation.map((item) => {
          const hasMenu = navItemHasMenu(item)
          const isOpen = openId === item.id
          const current = isCurrentPath(pathname, item.href)
          const panelId = `${megaId}-${item.id}`

          if (!hasMenu) {
            return (
              <li key={item.id}>
                <Link
                  aria-current={current ? 'page' : undefined}
                  className={navLinkClass}
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            )
          }

          return (
            <li key={item.id} onMouseEnter={() => openMenu(item.id)}>
              <div className="flex items-center">
                <Link
                  aria-current={current ? 'page' : undefined}
                  className={navLinkClass}
                  href={item.href}
                >
                  {item.label}
                </Link>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  aria-label={`${item.label} menu`}
                  className="inline-flex size-11 items-center justify-center text-main transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  onClick={() => (isOpen ? closeMenu() : openMenu(item.id))}
                  type="button"
                >
                  <ChevronDown
                    aria-hidden
                    className={cn('size-4 transition-transform duration-150', isOpen && 'rotate-180')}
                  />
                </button>
              </div>
              {isOpen ? (
                <MegaPanel
                  id={panelId}
                  item={item}
                  onMouseEnter={() => openMenu(item.id)}
                  open
                />
              ) : null}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

const MegaPanel: React.FC<{
  id: string
  item: NavItem
  onMouseEnter: () => void
  open: boolean
}> = ({ id, item, onMouseEnter, open }) => {
  const sections = getNavSections(item)
  const columnCount = Math.min(3, Math.max(1, sections.length > 1 ? sections.length : 2))

  return (
    <div
      className="absolute top-full right-0 left-0 z-30 border-y border-default bg-body py-8 shadow-sm"
      id={id}
      onMouseEnter={onMouseEnter}
    >
      <div
        className={cn(
          'container grid gap-x-10 gap-y-6',
          columnCount === 1 && 'grid-cols-1',
          columnCount === 2 && 'grid-cols-1 md:grid-cols-2',
          columnCount >= 3 && 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
        )}
      >
        {sections.map((section, sectionIndex) => (
          <div key={section.heading ?? `section-${sectionIndex}`}>
            {section.heading ? (
              <p className="mb-3 font-mono text-[11px] tracking-wide text-muted uppercase">
                {section.heading}
              </p>
            ) : null}
            <ul className="grid grid-cols-1 gap-x-10 gap-y-1 md:grid-cols-2">
              {section.links.map((link) => (
                <li key={link.href}>
                  <Link
                    className="block min-h-11 py-2 text-sm leading-snug text-main break-words transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    href={link.href}
                    tabIndex={open ? 0 : -1}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
