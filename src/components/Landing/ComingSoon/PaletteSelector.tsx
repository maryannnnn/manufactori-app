'use client'

import React from 'react'

import type { PaletteRole } from '@/design-system'

import { usePalette } from '@/design-system'
import { cn } from '@/utilities/ui'

const SWATCH_ORDER: readonly PaletteRole[] = ['primary', 'cta', 'secondary', 'surface', 'body']

/**
 * Switches the active Design System palette.
 *
 * Styled entirely with semantic tokens so it looks correct under every palette.
 * The only literal colours are the preview swatches, which read their values
 * from the central palette config rather than from hardcoded hex.
 */
export const PaletteSelector: React.FC = () => {
  const { paletteId, palettes, setPaletteId } = usePalette()

  return (
    <section aria-labelledby="palette-selector-heading" className="border-b border-default bg-surface">
      <div className="container py-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2
            className="font-mono text-xs uppercase tracking-[0.24em] text-muted"
            id="palette-selector-heading"
          >
            Design System Palette
          </h2>
          <p className="font-mono text-xs text-muted">
            {palettes.length} research palettes, one token set
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {palettes.map((palette) => {
            const isActive = palette.id === paletteId

            return (
              <li key={palette.id}>
                <button
                  aria-pressed={isActive}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                    isActive
                      ? 'border-border-strong bg-body'
                      : 'border-default bg-body/60 hover:bg-body',
                  )}
                  onClick={() => setPaletteId(palette.id)}
                  type="button"
                >
                  <span
                    className={cn(
                      'font-mono text-xs tabular-nums',
                      isActive ? 'text-heading' : 'text-muted',
                    )}
                  >
                    {palette.id}
                  </span>

                  <span
                    className={cn(
                      'min-w-0 flex-1 truncate text-sm',
                      isActive ? 'font-medium text-heading' : 'text-main',
                    )}
                  >
                    {palette.shortName}
                  </span>

                  <span aria-hidden className="flex shrink-0 items-center gap-1">
                    {SWATCH_ORDER.map((role) => (
                      <span
                        className="h-3 w-3 rounded-full ring-1 ring-inset ring-heading/25"
                        key={role}
                        style={{ backgroundColor: palette.base[role] }}
                      />
                    ))}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
