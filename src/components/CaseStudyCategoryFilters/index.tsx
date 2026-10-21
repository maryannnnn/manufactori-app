'use client'

import { ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useId, useRef, useState } from 'react'

import { buildCaseStudyArchiveUrl } from '@/utilities/caseStudyArchiveUrl'
import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { cn } from '@/utilities/ui'

type Filter = {
  slug: string
  title: string
}

type Props = {
  activeSlug?: string
  filters: Filter[]
  search?: string
}

const chipClass =
  'inline-flex min-h-9 items-center justify-center rounded-full border px-3 py-1.5 text-center text-xs leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'

const chipState = (selected: boolean) =>
  selected
    ? 'border-foreground bg-foreground text-background'
    : 'border-border bg-card text-muted-foreground hover:border-cta hover:text-foreground'

export const CaseStudyCategoryFilters: React.FC<Props> = ({ activeSlug, filters, search }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()
  const active = filters.find((filter) => filter.slug === activeSlug)

  const select = (slug?: string) => {
    setOpen(false)
    if (slug === activeSlug || (!slug && !activeSlug)) return
    router.push(buildCaseStudyArchiveUrl(CASE_STUDIES_ARCHIVE_PATH, { search, category: slug }), {
      scroll: false,
    })
  }

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="mt-4">
      <div className="md:hidden">
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className={cn(
            'flex min-h-11 w-full items-center justify-between gap-3 rounded-[2px] border px-3 py-2 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
            active
              ? 'border-foreground bg-card text-foreground'
              : 'border-border bg-card text-muted-foreground hover:border-cta hover:text-foreground',
          )}
          onClick={() => setOpen((value) => !value)}
          ref={toggleRef}
          type="button"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
              Filter by industry
            </span>
            <span className="mt-0.5 block truncate text-sm text-foreground">
              {active?.title ?? 'All Case Studies'}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className={cn('size-4 shrink-0 transition-transform', open && 'rotate-180')}
          />
        </button>

        {open ? (
          <div className="mt-2 rounded-[2px] border border-border bg-card p-3" id={panelId}>
            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Industries">
              <FilterButton label="All Case Studies" onSelect={() => select()} selected={!activeSlug} />
              {filters.map((filter) => (
                <FilterButton
                  key={filter.slug}
                  label={filter.title}
                  onSelect={() => select(filter.slug)}
                  selected={filter.slug === activeSlug}
                />
              ))}
            </div>
            <button
              className="mt-3 min-h-11 w-full rounded-[2px] border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-cta hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              onClick={() => select()}
              type="button"
            >
              Reset
            </button>
          </div>
        ) : null}
      </div>

      <div
        aria-label="Filter case studies by industry"
        className="hidden flex-wrap gap-2 md:flex"
        role="toolbar"
      >
        <button
          aria-pressed={!activeSlug}
          className={cn(chipClass, chipState(!activeSlug))}
          onClick={() => select()}
          type="button"
        >
          All Case Studies
        </button>
        {filters.map((filter) => {
          const selected = filter.slug === activeSlug
          return (
            <button
              aria-pressed={selected}
              className={cn(chipClass, 'max-w-full', chipState(selected))}
              key={filter.slug}
              onClick={() => select(filter.slug)}
              type="button"
            >
              {filter.title}
            </button>
          )
        })}
      </div>
    </div>
  )
}

const FilterButton: React.FC<{
  label: string
  onSelect: () => void
  selected: boolean
}> = ({ label, onSelect, selected }) => (
  <button
    aria-pressed={selected}
    className={cn(
      'flex min-h-11 items-center justify-center rounded-[2px] border px-2 py-2 text-center text-xs leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
      chipState(selected),
    )}
    onClick={onSelect}
    type="button"
  >
    {label}
  </button>
)
