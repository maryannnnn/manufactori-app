/**
 * Design System public surface.
 *
 * Components should consume semantic Tailwind utilities (bg-cta, text-main,
 * border-default, ...) and only reach for these exports when they need palette
 * metadata, such as the research panel and the palette selector.
 */
export { InitPalette } from './InitPalette'
export { PaletteProvider, usePalette } from './PaletteProvider'
export type { PaletteContextValue } from './PaletteProvider'
export {
  DEFAULT_PALETTE_ID,
  PALETTES,
  PALETTE_ATTRIBUTE,
  PALETTE_IDS,
  PALETTE_STORAGE_KEY,
  getPalette,
  isPaletteId,
} from './palettes'
export { auditPaletteContrast, cssVariableName, resolvePaletteTokens } from './tokens'
export type {
  Palette,
  PaletteBase,
  PaletteId,
  PaletteMeaning,
  PaletteRole,
  PaletteTokens,
  TokenName,
} from './types'
