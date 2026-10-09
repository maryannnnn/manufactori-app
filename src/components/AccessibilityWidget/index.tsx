'use client'

import { Accessibility, Minus, Plus, RotateCcw, X } from 'lucide-react'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

import {
  applyA11yPrefs,
  bumpTextScale,
  defaultA11yPrefs,
  readStoredA11yPrefs,
  writeStoredA11yPrefs,
  type A11yPrefs,
} from './prefs'

const TOGGLES: ReadonlyArray<{
  key: keyof Omit<A11yPrefs, 'textScale'>
  label: string
  description: string
}> = [
  {
    key: 'highContrast',
    label: 'High Contrast',
    description: 'Increase contrast between text, backgrounds and controls.',
  },
  {
    key: 'grayscale',
    label: 'Grayscale',
    description: 'View the page without color. Controls in this panel stay in color.',
  },
  {
    key: 'highlightLinks',
    label: 'Highlight Links',
    description: 'Underline links so they are easier to tell apart from surrounding text.',
  },
  {
    key: 'readableFont',
    label: 'Readable Font',
    description: 'Use a system font for body text. Code and icons are unchanged.',
  },
  {
    key: 'increaseSpacing',
    label: 'Increase Text Spacing',
    description: 'Add a little more space between letters, words and lines.',
  },
  {
    key: 'reduceMotion',
    label: 'Reduce Motion',
    description: 'Limit nonessential animation. The system reduced-motion setting is also respected.',
  },
]

export const AccessibilityWidget: React.FC = () => {
  const headingId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const launchRef = useRef<HTMLButtonElement>(null)
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs>(defaultA11yPrefs)
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    const stored = readStoredA11yPrefs()
    if (!stored) return
    setPrefs(stored)
    applyA11yPrefs(stored)
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      const closeButton = dialog.querySelector<HTMLElement>('[data-a11y-close]')
      closeButton?.focus()
    }
    if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  const closePanel = useCallback(() => {
    setOpen(false)
    queueMicrotask(() => launchRef.current?.focus())
  }, [])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const onClose = () => {
      setOpen(false)
      launchRef.current?.focus()
    }
    const onClick = (event: MouseEvent) => {
      if (event.target === dialog) closePanel()
    }

    dialog.addEventListener('close', onClose)
    dialog.addEventListener('click', onClick)
    return () => {
      dialog.removeEventListener('close', onClose)
      dialog.removeEventListener('click', onClick)
    }
  }, [closePanel])

  const commit = useCallback((next: A11yPrefs, message: string) => {
    setPrefs(next)
    applyA11yPrefs(next)
    writeStoredA11yPrefs(next)
    setAnnouncement(message)
  }, [])

  const setToggle = (key: (typeof TOGGLES)[number]['key'], value: boolean, label: string) => {
    commit({ ...prefs, [key]: value }, `${label} ${value ? 'on' : 'off'}`)
  }

  const setScale = (nextScale: number, message: string) => {
    commit({ ...prefs, textScale: nextScale }, message)
  }

  const reset = () => {
    commit({ ...defaultA11yPrefs }, 'Accessibility settings reset')
  }

  const scalePercent = Math.round(prefs.textScale * 100)

  return (
    <div className="a11y-widget">
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="Open accessibility settings"
        className="a11y-widget__launch inline-flex size-11 items-center justify-center rounded-[2px] border border-border bg-card text-foreground shadow-sm transition-colors hover:border-foreground/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setOpen(true)}
        ref={launchRef}
        title="Accessibility settings"
        type="button"
      >
        <Accessibility aria-hidden className="size-6" strokeWidth={2} />
      </button>

      <dialog
        aria-labelledby={headingId}
        className="a11y-widget__panel"
        ref={dialogRef}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
          <h2 className="text-base font-semibold tracking-tight" id={headingId}>
            Accessibility Settings
          </h2>
          <button
            aria-label="Close accessibility settings"
            className="a11y-widget__close inline-flex size-11 shrink-0 items-center justify-center rounded-[2px] text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            data-a11y-close
            onClick={closePanel}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-4 py-4">
          <section aria-labelledby={`${headingId}-text`}>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground" id={`${headingId}-text`}>
              Text Size
            </h3>
            <div className="flex items-center gap-2">
              <button
                aria-label="Decrease text size"
                className="a11y-widget__step inline-flex size-11 items-center justify-center rounded-[2px] border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                disabled={prefs.textScale <= 0.9}
                onClick={() =>
                  setScale(bumpTextScale(prefs.textScale, -1), `Text size ${Math.round(bumpTextScale(prefs.textScale, -1) * 100)} percent`)
                }
                type="button"
              >
                <Minus aria-hidden className="size-4" />
              </button>
              <p aria-live="polite" className="min-w-[4.5rem] text-center text-sm tabular-nums">
                {scalePercent}%
              </p>
              <button
                aria-label="Increase text size"
                className="a11y-widget__step inline-flex size-11 items-center justify-center rounded-[2px] border border-border hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
                disabled={prefs.textScale >= 1.5}
                onClick={() =>
                  setScale(bumpTextScale(prefs.textScale, 1), `Text size ${Math.round(bumpTextScale(prefs.textScale, 1) * 100)} percent`)
                }
                type="button"
              >
                <Plus aria-hidden className="size-4" />
              </button>
              <button
                aria-label="Reset text size"
                className="a11y-widget__step ml-auto inline-flex min-h-11 items-center rounded-[2px] border border-border px-3 text-sm hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setScale(1, 'Text size reset')}
                type="button"
              >
                Reset
              </button>
            </div>
          </section>

          <section aria-labelledby={`${headingId}-display`}>
            <h3 className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground" id={`${headingId}-display`}>
              Display
            </h3>
            <ul className="flex flex-col gap-1">
              {TOGGLES.map((item) => {
                const checked = prefs[item.key]
                const controlId = `${headingId}-${item.key}`
                return (
                  <li key={item.key}>
                    <label
                      className="flex min-h-11 cursor-pointer items-center justify-between gap-3 rounded-[2px] px-1 py-1 hover:bg-accent/60"
                      htmlFor={controlId}
                    >
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{item.label}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">{item.description}</span>
                      </span>
                      <input
                        checked={checked}
                        className="size-5 shrink-0 accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        id={controlId}
                        onChange={(event) => setToggle(item.key, event.target.checked, item.label)}
                        type="checkbox"
                      />
                    </label>
                  </li>
                )
              })}
            </ul>
          </section>

          <button
            className={cn(
              'a11y-widget__reset inline-flex min-h-11 items-center justify-center gap-2 rounded-[2px] border border-border px-3 text-sm',
              'hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            )}
            onClick={reset}
            type="button"
          >
            <RotateCcw aria-hidden className="size-4" />
            Reset Settings
          </button>
        </div>
      </dialog>
    </div>
  )
}
