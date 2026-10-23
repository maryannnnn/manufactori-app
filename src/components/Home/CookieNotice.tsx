'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

/** How long the notice stays fully open. Not a legal minimum. */
export const COOKIE_NOTICE_VISIBLE_MS = 6000
const MOTION_MS = 280

type Phase = 'closed' | 'open' | 'closing' | 'gone'

type Props = {
  visibleMs?: number
}

export const CookieNotice: React.FC<Props> = ({ visibleMs = COOKIE_NOTICE_VISIBLE_MS }) => {
  const [phase, setPhase] = useState<Phase>('closed')

  useEffect(() => {
    const openTimer = window.setTimeout(() => setPhase('open'), 40)
    const closeTimer = window.setTimeout(() => setPhase('closing'), 40 + visibleMs)
    return () => {
      window.clearTimeout(openTimer)
      window.clearTimeout(closeTimer)
    }
  }, [visibleMs])

  useEffect(() => {
    if (phase !== 'closing') return
    const doneTimer = window.setTimeout(() => setPhase('gone'), MOTION_MS)
    return () => window.clearTimeout(doneTimer)
  }, [phase])

  if (phase === 'gone') return null

  const open = phase === 'open'

  return (
    <section
      aria-label="Cookies"
      className="grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none"
      data-open={open ? 'true' : 'false'}
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        opacity: open ? 1 : 0,
      }}
    >
      <div className="overflow-hidden" inert={!open}>
        <div className="border-t border-border">
          <div className="container flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p className="text-sm leading-6 text-muted-foreground">
              This site uses cookies and browser storage for essential operation and display
              preferences.
            </p>
            <Link
              className="shrink-0 text-sm text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              href="/privacy-policy"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
