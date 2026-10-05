'use client'

import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useState } from 'react'

import { cn } from '@/utilities/ui'

import {
  contactHref,
  getNavSections,
  mainNavigation,
  navItemHasMenu,
  type NavItem,
} from '../navigation'

const isCurrentPath = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const MobileNav: React.FC = () => {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const panelId = useId()

  const closeMenu = () => {
    setOpen(false)
    setExpandedId(null)
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
        document.getElementById(`${panelId}-open`)?.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, panelId])

  return (
    <div className="flex items-center gap-1 lg:hidden">
      <Link
        aria-label="Contact"
        className="inline-flex size-11 items-center justify-center text-main transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        href={contactHref}
      >
        <Phone className="size-5" />
      </Link>
      <button
        aria-controls={panelId}
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="inline-flex size-11 items-center justify-center text-main transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        id={`${panelId}-open`}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? <X className="size-6" /> : <Menu className="size-6" />}
      </button>

      <div
        className={cn(
          'fixed inset-x-0 top-[var(--site-header-height,4.5rem)] bottom-0 z-40 overflow-y-auto border-t border-default bg-body lg:hidden',
          open ? 'visible' : 'invisible pointer-events-none',
        )}
        hidden={!open}
        id={panelId}
      >
        <nav aria-label="Main" className="container py-4">
          <ul className="flex flex-col">
            {mainNavigation.map((item) => (
              <MobileItem
                expanded={expandedId === item.id}
                item={item}
                key={item.id}
                onToggle={() => setExpandedId((current) => (current === item.id ? null : item.id))}
                pathname={pathname}
              />
            ))}
          </ul>
        </nav>
      </div>
    </div>
  )
}

const MobileItem: React.FC<{
  expanded: boolean
  item: NavItem
  onToggle: () => void
  pathname: string
}> = ({ expanded, item, onToggle, pathname }) => {
  const disclosureId = useId()
  const hasMenu = navItemHasMenu(item)
  const current = isCurrentPath(pathname, item.href)

  if (!hasMenu) {
    return (
      <li className="border-b border-default">
        <Link
          aria-current={current ? 'page' : undefined}
          className="flex min-h-12 items-center py-3 text-base text-main break-words transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          href={item.href}
        >
          {item.label}
        </Link>
      </li>
    )
  }

  return (
    <li className="border-b border-default">
      <div className="flex items-stretch">
        <Link
          aria-current={current ? 'page' : undefined}
          className="flex min-h-12 min-w-0 flex-1 items-center py-3 text-base text-main break-words transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          href={item.href}
        >
          {item.label}
        </Link>
        <button
          aria-controls={disclosureId}
          aria-expanded={expanded}
          className="inline-flex size-12 shrink-0 items-center justify-center text-main transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          onClick={onToggle}
          type="button"
        >
          <span className="sr-only">{expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}</span>
          <ChevronDown
            aria-hidden
            className={cn('size-4 transition-transform duration-150', expanded && 'rotate-180')}
          />
        </button>
      </div>
      <div
        className={cn(expanded ? 'block' : 'hidden')}
        hidden={!expanded}
        id={disclosureId}
      >
        <ul className="pb-3 pl-3">
          {getNavSections(item).flatMap((section) =>
            section.links.map((link) => (
              <li key={link.href}>
                <Link
                  className="flex min-h-12 items-center py-2 text-base leading-snug text-muted break-words transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  href={link.href}
                >
                  {link.label}
                </Link>
              </li>
            )),
          )}
        </ul>
      </div>
    </li>
  )
}
