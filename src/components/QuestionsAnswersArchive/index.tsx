'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useId, useState } from 'react'

import { excerptPlainText } from '@/utilities/excerptPlainText'
import type { AggregatedFaqItem } from '@/utilities/queryAggregatedFaqs'
import { cn } from '@/utilities/ui'

type Props = {
  items: AggregatedFaqItem[]
}

export const QuestionsAnswersArchive: React.FC<Props> = ({ items }) => {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const baseId = useId()

  if (!items.length) {
    return <p className="text-base text-muted-foreground">No matching questions found.</p>
  }

  return (
    <div className="border-t border-border">
      {items.map((item) => {
        const isOpen = item.key === openKey
        const panelId = `${baseId}-${item.key}`
        const preview = excerptPlainText(item.answerPlain, 160)

        return (
          <article
            className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 border-b border-border py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)] sm:gap-5"
            key={item.key}
          >
            <div className="relative aspect-square overflow-hidden rounded-[2px] bg-accent">
              {item.previewImage?.src ? (
                <Image
                  alt={item.previewImage.alt || item.sourceTitle}
                  className="object-cover"
                  fill
                  sizes="88px"
                  src={item.previewImage.src}
                />
              ) : (
                <div aria-hidden className="h-full w-full bg-muted" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-semibold leading-snug tracking-tight text-foreground sm:text-lg">
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="text-left transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  id={`${panelId}-trigger`}
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  type="button"
                >
                  {item.question}
                </button>
              </h2>

              {!isOpen ? (
                <p className="mt-2 max-w-[70ch] text-sm leading-6 text-muted-foreground">{preview}</p>
              ) : null}

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
                  <p className="mt-2 max-w-[70ch] text-sm leading-6 text-foreground">
                    {item.answerPlain}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  <span>{item.sourceKindLabel}</span>
                  {' · '}
                  <Link
                    className="text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    href={item.sourceHref}
                  >
                    {item.sourceTitle}
                  </Link>
                </p>
                <button
                  aria-controls={panelId}
                  aria-expanded={isOpen}
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                  onClick={() => setOpenKey(isOpen ? null : item.key)}
                  type="button"
                >
                  {isOpen ? 'Hide answer' : 'Read full answer'}
                </button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
