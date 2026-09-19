import type { Palette, PaletteTokens, TokenName } from './types'

import { contrastRatio, ensureContrastAll, mix, readableOn, shade, stateShift } from './color'

/** WCAG AA for normal-size text. */
const TEXT_AA = 4.5
/** WCAG AAA for body copy and headings, which carry the most reading load. */
const TEXT_AAA = 7
/** WCAG 1.4.11 for non-text UI boundaries such as input borders. */
const UI_BOUNDARY = 3

/**
 * Derives the full semantic token set from a palette's five base colours.
 *
 * The five research colours are passed through untouched. Every other token is
 * computed, and contrast-sensitive ones are nudged only as far as needed to
 * clear their WCAG target.
 */
export const resolvePaletteTokens = (palette: Palette): PaletteTokens => {
  const { body, cta, primary, secondary, surface } = palette.base

  // Text tokens must stay readable on both backgrounds they can land on, which
  // matters for palettes whose surface is a mid-tone rather than a light tint.
  const textOn = [body, surface]

  const heading = ensureContrastAll(primary, textOn, TEXT_AAA)
  const main = ensureContrastAll(mix(primary, body, 0.08), textOn, TEXT_AAA)
  const muted = ensureContrastAll(mix(main, body, 0.45), textOn, TEXT_AA)

  const link = ensureContrastAll(cta, textOn, TEXT_AA)

  // The text colour of each interactive surface is resolved first, then the
  // hover/active variants are shifted away from it so contrast only improves.
  const onPrimary = readableOn(primary, TEXT_AA)
  const onCta = readableOn(cta, TEXT_AA)
  const onSecondary = readableOn(secondary, TEXT_AA)

  return {
    // Research colours, verbatim.
    primary,
    cta,
    secondary,
    surface,
    body,

    surfaceStrong: mix(surface, main, 0.06),

    main,
    heading,
    muted,

    // Borders are mixed into the surface rather than the body so they stay
    // visible on cards as well as on the page background.
    border: mix(surface, main, 0.14),
    borderStrong: ensureContrastAll(mix(surface, main, 0.45), textOn, UI_BOUNDARY),

    link,
    linkHover: ensureContrastAll(shade(link, 0.18), textOn, TEXT_AA),

    ctaHover: stateShift(cta, onCta, 0.12),
    ctaActive: stateShift(cta, onCta, 0.22),
    primaryHover: stateShift(primary, onPrimary, 0.12),
    primaryActive: stateShift(primary, onPrimary, 0.22),
    secondaryHover: stateShift(secondary, onSecondary, 0.12),

    onPrimary,
    onCta,
    onSecondary,
    onSurface: ensureContrastAll(main, [surface], TEXT_AAA),

    focusRing: ensureContrastAll(cta, textOn, UI_BOUNDARY),
  }
}

const KEBAB = /[A-Z]/g

/** `ctaHover` -> `--ds-cta-hover` */
export const cssVariableName = (token: TokenName): string =>
  `--ds-${token.replace(KEBAB, (char) => `-${char.toLowerCase()}`)}`

/** Ordered CSS declarations for one palette, ready to drop into a rule body. */
export const tokensToCssDeclarations = (tokens: PaletteTokens): string[] =>
  (Object.keys(tokens) as TokenName[]).map(
    (token) => `${cssVariableName(token)}: ${tokens[token].toLowerCase()};`,
  )

export type ContrastReport = {
  pair: string
  ratio: number
  target: number
  passes: boolean
}

/**
 * Audits the contrast pairs that actually carry text or UI meaning.
 * Used by the verification script; not shipped to the browser.
 */
export const auditPaletteContrast = (palette: Palette): ContrastReport[] => {
  const tokens = resolvePaletteTokens(palette)

  const checks: Array<[string, string, string, number]> = [
    ['heading on body', tokens.heading, tokens.body, TEXT_AAA],
    ['heading on surface', tokens.heading, tokens.surface, TEXT_AAA],
    ['main on body', tokens.main, tokens.body, TEXT_AAA],
    ['main on surface', tokens.main, tokens.surface, TEXT_AAA],
    ['onSurface on surface', tokens.onSurface, tokens.surface, TEXT_AAA],
    ['muted on body', tokens.muted, tokens.body, TEXT_AA],
    ['muted on surface', tokens.muted, tokens.surface, TEXT_AA],
    ['link on body', tokens.link, tokens.body, TEXT_AA],
    ['link on surface', tokens.link, tokens.surface, TEXT_AA],
    ['link hover on body', tokens.linkHover, tokens.body, TEXT_AA],
    ['onCta on cta', tokens.onCta, tokens.cta, TEXT_AA],
    ['onCta on cta hover', tokens.onCta, tokens.ctaHover, TEXT_AA],
    ['onCta on cta active', tokens.onCta, tokens.ctaActive, TEXT_AA],
    ['onPrimary on primary', tokens.onPrimary, tokens.primary, TEXT_AA],
    ['onPrimary on primary hover', tokens.onPrimary, tokens.primaryHover, TEXT_AA],
    ['onPrimary on primary active', tokens.onPrimary, tokens.primaryActive, TEXT_AA],
    ['onSecondary on secondary', tokens.onSecondary, tokens.secondary, TEXT_AA],
    ['onSecondary on secondary hover', tokens.onSecondary, tokens.secondaryHover, TEXT_AA],
    ['borderStrong on body', tokens.borderStrong, tokens.body, UI_BOUNDARY],
    ['borderStrong on surface', tokens.borderStrong, tokens.surface, UI_BOUNDARY],
    ['focusRing on body', tokens.focusRing, tokens.body, UI_BOUNDARY],
    ['focusRing on surface', tokens.focusRing, tokens.surface, UI_BOUNDARY],
  ]

  return checks.map(([pair, foreground, background, target]) => {
    const ratio = contrastRatio(foreground, background)
    return {
      pair,
      ratio: Math.round(ratio * 100) / 100,
      target,
      passes: ratio >= target,
    }
  })
}
