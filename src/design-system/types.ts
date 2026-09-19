/**
 * Design System colour-token contracts.
 *
 * A palette is described by exactly five research colours. Everything else
 * (text, borders, links, hover/active states, on-colours) is derived from those
 * five by `resolvePaletteTokens` so that a palette can never drift out of sync
 * with the interface built on top of it.
 */

export type PaletteId =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'

/** The five immutable research colours. These are never altered by derivation. */
export type PaletteBase = {
  primary: string
  cta: string
  secondary: string
  surface: string
  body: string
}

export type PaletteRole = keyof PaletteBase

/** Human-readable meaning of each base colour, shown in the research panel. */
export type PaletteMeaning = Record<PaletteRole, string>

export type Palette = {
  id: PaletteId
  /** Full display name, e.g. "Machine Shop Heavy". */
  name: string
  /** Short label for the compact selector, e.g. "Machine Shop". */
  shortName: string
  base: PaletteBase
  meaning: PaletteMeaning
  /** Optional caveat surfaced in the research panel. */
  note?: string
}

/**
 * Full semantic token set derived from a palette.
 * Keys map 1:1 onto `--ds-<kebab-case-key>` CSS custom properties.
 */
export type PaletteTokens = {
  // Base roles (verbatim from research)
  primary: string
  cta: string
  secondary: string
  surface: string
  body: string

  // Surfaces
  surfaceStrong: string

  // Text
  main: string
  heading: string
  muted: string

  // Borders
  border: string
  borderStrong: string

  // Links
  link: string
  linkHover: string

  // Interactive states
  ctaHover: string
  ctaActive: string
  primaryHover: string
  primaryActive: string
  secondaryHover: string

  // Readable foregrounds for coloured surfaces
  onPrimary: string
  onCta: string
  onSecondary: string
  onSurface: string

  focusRing: string
}

export type TokenName = keyof PaletteTokens
