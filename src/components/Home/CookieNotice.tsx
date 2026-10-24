'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

/** Wait before the bar appears. Matches the clinic site. Not a legal minimum. */
export const COOKIE_NOTICE_DELAY_MS = 10000
/** How long the compact bar stays before it hides itself. Not a legal minimum. */
export const COOKIE_NOTICE_VISIBLE_MS = 6000

const STORAGE_KEY = 'cookie-consent'

type Consent = {
  essential: true
  analytics: boolean
  marketing: boolean
}

type Props = {
  delayMs?: number
}

const readConsent = (): Consent | null => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Consent>
    if (parsed.essential !== true) return null
    return {
      essential: true,
      analytics: parsed.analytics === true,
      marketing: parsed.marketing === true,
    }
  } catch {
    return null
  }
}

const writeConsent = (consent: Consent) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
}

const CookieIcon: React.FC = () => (
  <svg aria-hidden className="size-5 shrink-0 text-[#ff9800]" viewBox="0 0 24 24">
    <path
      d="M12 2a10 10 0 1 0 9.8 8.1 2.4 2.4 0 0 1-3.3-3.1A10 10 0 0 0 12 2zm-1.1 6.1a1.15 1.15 0 1 1 0-2.3 1.15 1.15 0 0 1 0 2.3zM7.6 13.1a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm5.1 3.3a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2zM15.7 12.2a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
      fill="currentColor"
    />
  </svg>
)

const CloseIcon: React.FC = () => (
  <svg aria-hidden className="size-4" viewBox="0 0 24 24">
    <path
      d="M6.2 6.2a1 1 0 0 1 1.4 0L12 10.6l4.4-4.4a1 1 0 1 1 1.4 1.4L13.4 12l4.4 4.4a1 1 0 0 1-1.4 1.4L12 13.4l-4.4 4.4a1 1 0 0 1-1.4-1.4L10.6 12 6.2 7.6a1 1 0 0 1 0-1.4z"
      fill="currentColor"
    />
  </svg>
)

const Switch: React.FC<{
  checked: boolean
  disabled?: boolean
  label: string
  onChange: () => void
}> = ({ checked, disabled, label, onChange }) => (
  <button
    aria-checked={checked}
    aria-label={label}
    className="relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-border bg-surface-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-70 data-[checked=true]:border-cta data-[checked=true]:bg-cta"
    data-checked={checked ? 'true' : 'false'}
    disabled={disabled}
    onClick={onChange}
    role="switch"
    type="button"
  >
    <span
      className="pointer-events-none block size-3.5 translate-x-0.5 rounded-full bg-card shadow-sm transition-transform data-[checked=true]:translate-x-4"
      data-checked={checked ? 'true' : 'false'}
    />
  </button>
)

export const CookieNotice: React.FC<Props> = ({ delayMs = COOKIE_NOTICE_DELAY_MS }) => {
  const [visible, setVisible] = useState(false)
  const [compact, setCompact] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    if (readConsent()) return
    const timer = window.setTimeout(() => setVisible(true), delayMs)
    return () => window.clearTimeout(timer)
  }, [delayMs])

  useEffect(() => {
    if (!visible || !compact) return
    const timer = window.setTimeout(() => {
      try {
        writeConsent({ essential: true, analytics: false, marketing: false })
      } catch {
        // Private mode can block storage. Hide the bar for this view anyway.
      }
      setVisible(false)
    }, COOKIE_NOTICE_VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [visible, compact])

  const dismiss = (consent: Consent) => {
    try {
      writeConsent(consent)
    } catch {
      // Private mode can block storage. Hide the bar for this view anyway.
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <section
      aria-label="Cookies"
      className="border-t border-border bg-card text-foreground shadow-[0_-1px_4px_rgba(0,0,0,0.08)]"
    >
      <div className="container py-3">
        {compact ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <CookieIcon />
              <p className="text-sm leading-6 text-foreground">
                We use cookies to run this site and remember display preferences. You can accept them
                or choose what to allow.
              </p>
            </div>
            <div className="flex w-full shrink-0 items-center justify-end gap-2 sm:w-auto">
              <button
                className="px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={() => setCompact(false)}
                type="button"
              >
                Customize
              </button>
              <button
                className="rounded-[2px] bg-cta px-4 py-1.5 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={() => dismiss({ essential: true, analytics: true, marketing: true })}
                type="button"
              >
                Accept all
              </button>
              <button
                aria-label="Close and keep essential cookies only"
                className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={() => dismiss({ essential: true, analytics: false, marketing: false })}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <CookieIcon />
              <h2 className="flex-1 text-lg font-semibold tracking-tight">Cookies</h2>
              <button
                aria-label="Back to the short notice"
                className="inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-accent-soft hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                onClick={() => {
                  setShowSettings(false)
                  setCompact(true)
                }}
                type="button"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              We use cookies and browser storage for essential operation and display preferences.
              Analytics and advertising tools are described in the{' '}
              <Link
                className="text-link underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                href="/privacy-policy"
              >
                Privacy Policy
              </Link>
              .
            </p>
            {showSettings ? (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div className="flex gap-3">
                  <Switch checked disabled label="Essential cookies" onChange={() => undefined} />
                  <div>
                    <p className="text-sm font-medium">Essential cookies</p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Required for the site to operate and to remember display preferences. Always on.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Switch
                    checked={analytics}
                    label="Analytics cookies"
                    onChange={() => setAnalytics((value) => !value)}
                  />
                  <div>
                    <p className="text-sm font-medium">Analytics cookies</p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Google Analytics, as described in the Privacy Policy.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Switch
                    checked={marketing}
                    label="Marketing cookies"
                    onChange={() => setMarketing((value) => !value)}
                  />
                  <div>
                    <p className="text-sm font-medium">Marketing cookies</p>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Meta advertising measurement, as described in the Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              {showSettings ? (
                <>
                  <button
                    className="rounded-[2px] border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    onClick={() => setShowSettings(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-[2px] bg-cta px-4 py-2 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    onClick={() => dismiss({ essential: true, analytics, marketing })}
                    type="button"
                  >
                    Save settings
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="rounded-[2px] border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    onClick={() => setShowSettings(true)}
                    type="button"
                  >
                    Customize
                  </button>
                  <button
                    className="px-4 py-2 text-sm font-medium text-foreground transition-colors hover:text-link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    onClick={() => dismiss({ essential: true, analytics: false, marketing: false })}
                    type="button"
                  >
                    Essential only
                  </button>
                  <button
                    className="rounded-[2px] bg-cta px-4 py-2 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
                    onClick={() => dismiss({ essential: true, analytics: true, marketing: true })}
                    type="button"
                  >
                    Accept all
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
