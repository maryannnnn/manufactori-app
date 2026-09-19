'use client'

import React from 'react'

import type { PaletteRole } from '@/design-system'

import { usePalette } from '@/design-system'

const ROLES: readonly { role: PaletteRole; label: string }[] = [
  { role: 'primary', label: 'Primary' },
  { role: 'cta', label: 'CTA' },
  { role: 'secondary', label: 'Secondary' },
  { role: 'surface', label: 'Surface' },
  { role: 'body', label: 'Body' },
]

/**
 * Research panel listing the five base colours of the active palette.
 *
 * Purely informational: it reads the palette config and can be deleted without
 * touching the token architecture.
 */
export const PalettePanel: React.FC = () => {
  const { palette } = usePalette()

  return (
    <section aria-labelledby="palette-panel-heading" className="border-t border-default py-16">
      <div className="container">
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">Research Panel</p>
        <h2
          className="mt-3 text-2xl font-semibold tracking-tight text-heading md:text-3xl"
          id="palette-panel-heading"
        >
          {palette.id} {palette.name}
        </h2>

        <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {ROLES.map(({ label, role }) => (
            <div className="rounded-lg border border-default bg-surface p-4" key={role}>
              <div
                aria-hidden
                className="mb-4 h-16 w-full rounded-md ring-1 ring-inset ring-heading/20"
                style={{ backgroundColor: palette.base[role] }}
              />
              <dt className="text-sm font-medium text-heading">{label}</dt>
              <dd className="mt-1 font-mono text-xs uppercase tabular-nums text-main">
                {palette.base[role]}
              </dd>
              <dd className="mt-2 text-xs leading-5 text-muted">{palette.meaning[role]}</dd>
            </div>
          ))}
        </dl>

        {palette.note ? (
          <p className="mt-6 max-w-3xl border-l-2 border-border-strong pl-4 text-sm leading-6 text-muted">
            {palette.note}
          </p>
        ) : null}

        <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">
          These five values stay exactly as researched. Text, border, link and hover tokens are
          derived from them and adjusted only where WCAG contrast requires it.
        </p>
      </div>
    </section>
  )
}
