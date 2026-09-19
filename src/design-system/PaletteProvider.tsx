'use client'

import React, { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'

import type { Palette, PaletteId } from './types'

import {
  DEFAULT_PALETTE_ID,
  PALETTES,
  PALETTE_ATTRIBUTE,
  PALETTE_STORAGE_KEY,
  getPalette,
  isPaletteId,
} from './palettes'

export type PaletteContextValue = {
  paletteId: PaletteId
  palette: Palette
  palettes: readonly Palette[]
  setPaletteId: (id: PaletteId) => void
}

const PaletteContext = createContext<PaletteContextValue>({
  paletteId: DEFAULT_PALETTE_ID,
  palette: getPalette(DEFAULT_PALETTE_ID),
  palettes: PALETTES,
  setPaletteId: () => undefined,
})

const readStoredPaletteId = (): PaletteId | null => {
  const fromAttribute = document.documentElement.getAttribute(PALETTE_ATTRIBUTE)
  if (isPaletteId(fromAttribute)) return fromAttribute

  try {
    const stored = window.localStorage.getItem(PALETTE_STORAGE_KEY)
    if (isPaletteId(stored)) return stored
  } catch {
    // Private mode or storage disabled: fall back to the default palette.
  }

  return null
}

/**
 * Owns the active palette. Colour values themselves stay in CSS; this only
 * moves the `data-palette` attribute, which the generated token stylesheet
 * keys every palette off.
 *
 * State starts at the default palette so the first client render matches the
 * server. The stored preference is adopted in an effect, while the pre-paint
 * script in `InitPalette` has already applied the correct colours, so there is
 * no flash and no hydration mismatch.
 */
export const PaletteProvider = ({ children }: { children: React.ReactNode }) => {
  const [paletteId, setPaletteIdState] = useState<PaletteId>(DEFAULT_PALETTE_ID)

  useEffect(() => {
    const resolved = readStoredPaletteId() ?? DEFAULT_PALETTE_ID
    document.documentElement.setAttribute(PALETTE_ATTRIBUTE, resolved)
    setPaletteIdState(resolved)
  }, [])

  const setPaletteId = useCallback((next: PaletteId) => {
    setPaletteIdState(next)
    document.documentElement.setAttribute(PALETTE_ATTRIBUTE, next)

    try {
      window.localStorage.setItem(PALETTE_STORAGE_KEY, next)
    } catch {
      // Preference simply will not persist; switching still works.
    }
  }, [])

  const value = useMemo<PaletteContextValue>(
    () => ({
      paletteId,
      palette: getPalette(paletteId),
      palettes: PALETTES,
      setPaletteId,
    }),
    [paletteId, setPaletteId],
  )

  return <PaletteContext value={value}>{children}</PaletteContext>
}

export const usePalette = (): PaletteContextValue => use(PaletteContext)
