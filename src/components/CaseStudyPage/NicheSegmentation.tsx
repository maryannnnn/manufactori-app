'use client'

import React, { useId, useState } from 'react'

import { cn } from '@/utilities/ui'

export type NicheItem = {
  name: string
  /** Pre-rendered on the server so Tiptap stays out of the client bundle. */
  description: React.ReactNode
  marketingApproach: React.ReactNode
}

type Props = {
  niches: NicheItem[]
}

/**
 * One production capability, several commercial directions. The selector is the
 * centrepiece of the case study, so it stays a real control: a vertical list on
 * desktop, a horizontally scrollable row of the same buttons on mobile.
 */
export const CaseStudyNiches: React.FC<Props> = ({ niches }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const baseId = useId()
  const active = niches[activeIndex] ?? niches[0]

  // Arrow-key traversal, as expected of a tablist.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0
    if (!step) return

    event.preventDefault()
    const next = (activeIndex + step + niches.length) % niches.length
    setActiveIndex(next)
    document.getElementById(`${baseId}-tab-${next}`)?.focus()
  }

  if (!active) return null

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(200px,260px)_1fr] lg:gap-9">
      <div>
        <NicheBranches count={niches.length} />

        <div
          aria-label="Commercial directions"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:mt-4 lg:flex-col lg:overflow-visible lg:px-0"
          onKeyDown={handleKeyDown}
          role="tablist"
        >
          {niches.map((niche, index) => {
            const isActive = index === activeIndex

            return (
              <button
                aria-controls={`${baseId}-panel`}
                aria-selected={isActive}
                className={cn(
                  'shrink-0 rounded-[2px] border px-3.5 py-2.5 text-left text-sm font-medium whitespace-nowrap transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:whitespace-normal',
                  isActive
                    ? 'border-foreground/40 bg-accent text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                id={`${baseId}-tab-${index}`}
                key={niche.name}
                onClick={() => setActiveIndex(index)}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
              >
                {niche.name}
              </button>
            )
          })}
        </div>
      </div>

      <div
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        className="rounded-[2px] border border-border bg-card p-6 md:p-8"
        id={`${baseId}-panel`}
        role="tabpanel"
      >
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{active.name}</h3>

        <div className="mt-5 space-y-5">
          {active.description}
          {active.marketingApproach}
        </div>
      </div>
    </div>
  )
}

/**
 * Decorative fan-out from the shared production capability to each direction.
 * Branch count follows the data, so it never shows more lines than there are
 * niches. Hidden on mobile where the button row already communicates the split.
 */
const NicheBranches: React.FC<{ count: number }> = ({ count }) => {
  if (count < 2) return null

  const height = 40 * count
  const centre = height / 2

  return (
    <div aria-hidden className="hidden text-muted-foreground lg:block">
      <svg className="h-auto w-full" viewBox={`0 0 200 ${height}`} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy={centre} fill="currentColor" r="4" />
        <g fill="none" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1">
          {Array.from({ length: count }, (_, index) => {
            const y = 20 + index * 40
            return <path d={`M12 ${centre} C 70 ${centre}, 70 ${y}, 128 ${y}`} key={index} />
          })}
        </g>
        <g fill="currentColor">
          {Array.from({ length: count }, (_, index) => (
            <circle cx="128" cy={20 + index * 40} key={index} r="2.5" />
          ))}
        </g>
      </svg>
    </div>
  )
}
