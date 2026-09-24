'use client'

import React, { useId, useState } from 'react'

import { cn } from '@/utilities/ui'

export type AccordionItem = {
  key: string
  /** Optional badge next to the title, e.g. a channel name. */
  tag?: string
  title: string
  /** Pre-rendered on the server so Tiptap stays out of the client bundle. */
  content: React.ReactNode
}

type Props = {
  className?: string
  /** Key of the row open on first render. Pass null to start fully collapsed. */
  defaultOpenKey?: string | null
  /** Trigger heading level, so the accordion fits the surrounding outline. */
  headingLevel?: 'h3' | 'h4'
  items: AccordionItem[]
}

/**
 * Single-open accordion shared by the case study marketing strategy and FAQ.
 *
 * Triggers are real buttons, so keyboard and screen-reader behaviour comes for
 * free. Panels animate on grid-template-rows rather than a max-height cap, so
 * content of any length opens fully.
 */
export const Accordion: React.FC<Props> = ({
  className,
  defaultOpenKey,
  headingLevel = 'h3',
  items,
}) => {
  const [openKey, setOpenKey] = useState<string | null>(defaultOpenKey ?? null)
  const baseId = useId()
  const Heading = headingLevel

  if (items.length === 0) return null

  return (
    <div className={cn('border-t border-border', className)}>
      {items.map((item) => {
        const isOpen = item.key === openKey
        const panelId = `${baseId}-${item.key}`

        return (
          <div className="border-b border-border" key={item.key}>
            <Heading>
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 py-4 text-left text-[15px] font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                id={`${panelId}-trigger`}
                onClick={() => setOpenKey(isOpen ? null : item.key)}
                type="button"
              >
                <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  {item.title}
                  {item.tag ? (
                    <span className="font-mono text-[11px] font-normal text-muted-foreground">
                      {item.tag}
                    </span>
                  ) : null}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'shrink-0 font-mono text-base text-muted-foreground transition-transform duration-200',
                    isOpen && 'rotate-45',
                  )}
                >
                  +
                </span>
              </button>
            </Heading>

            <div
              aria-labelledby={`${panelId}-trigger`}
              className={cn(
                'grid transition-[grid-template-rows] duration-200 ease-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
              id={panelId}
              inert={!isOpen}
              role="region"
            >
              <div className="overflow-hidden">
                <div className="max-w-[68ch] pb-5 [&_li]:text-sm [&_li]:text-muted-foreground [&_p]:text-sm [&_p]:text-muted-foreground">
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
