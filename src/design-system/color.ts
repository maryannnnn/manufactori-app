/**
 * Dependency-free colour maths used to derive semantic tokens from the five
 * research colours. Contrast follows WCAG 2.1 relative luminance.
 */

export type Rgb = { r: number; g: number; b: number }

/** Near-black used as a candidate foreground on bright surfaces. */
export const INK = '#0B0B0C'
export const WHITE = '#FFFFFF'

const clamp255 = (value: number) => Math.min(255, Math.max(0, Math.round(value)))

export const hexToRgb = (hex: string): Rgb => {
  const normalized = hex.replace('#', '').trim()
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  if (full.length !== 6 || /[^0-9a-f]/i.test(full)) {
    throw new Error(`Invalid hex colour: "${hex}"`)
  }

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export const rgbToHex = ({ r, g, b }: Rgb): string =>
  `#${[r, g, b].map((channel) => clamp255(channel).toString(16).padStart(2, '0')).join('')}`

const channelToLinear = (channel: number): number => {
  const normalized = channel / 255
  return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4
}

export const relativeLuminance = (hex: string): number => {
  const { r, g, b } = hexToRgb(hex)
  return (
    0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b)
  )
}

export const contrastRatio = (a: string, b: string): number => {
  const luminanceA = relativeLuminance(a)
  const luminanceB = relativeLuminance(b)
  const lighter = Math.max(luminanceA, luminanceB)
  const darker = Math.min(luminanceA, luminanceB)
  return (lighter + 0.05) / (darker + 0.05)
}

export const isLight = (hex: string): boolean => relativeLuminance(hex) > 0.4

/**
 * Colours outside this range cannot move further in one direction perceptibly,
 * so their interactive states are forced the other way.
 */
const NEAR_BLACK_LUMINANCE = 0.08
const NEAR_WHITE_LUMINANCE = 0.85

const BLACK = '#000000'

/** Linear sRGB mix. `weight` is how much of `b` ends up in the result. */
export const mix = (a: string, b: string, weight: number): string => {
  const ratio = Math.min(1, Math.max(0, weight))
  const colorA = hexToRgb(a)
  const colorB = hexToRgb(b)

  return rgbToHex({
    r: colorA.r + (colorB.r - colorA.r) * ratio,
    g: colorA.g + (colorB.g - colorA.g) * ratio,
    b: colorA.b + (colorB.b - colorA.b) * ratio,
  })
}

export const shade = (hex: string, amount: number): string => mix(hex, '#000000', amount)
export const tint = (hex: string, amount: number): string => mix(hex, WHITE, amount)

/**
 * Derives a hover/active variant of `background` that moves *away* from the
 * text colour placed on it, so the state change can only improve legibility.
 * Colours already pinned at either end of the scale move the only way they can.
 */
export const stateShift = (background: string, foreground: string, amount: number): string => {
  const luminance = relativeLuminance(background)

  if (luminance < NEAR_BLACK_LUMINANCE) return tint(background, amount)
  if (luminance > NEAR_WHITE_LUMINANCE) return shade(background, amount)

  return relativeLuminance(foreground) > 0.5 ? shade(background, amount) : tint(background, amount)
}

/**
 * Pushes `foreground` in 2% steps until it clears `target` against *every*
 * supplied background, moving towards whichever of black/white improves the
 * worst case. Returns the original colour when it already passes, so research
 * colours are left untouched whenever they are already accessible.
 *
 * Text has to work on more than one background — body copy sits on both the
 * body and the surface token — so contrast is resolved against all of them at
 * once rather than against the lightest one.
 */
export const ensureContrastAll = (
  foreground: string,
  backgrounds: string[],
  target: number,
): string => {
  const worstRatio = (candidate: string) =>
    Math.min(...backgrounds.map((background) => contrastRatio(candidate, background)))

  if (worstRatio(foreground) >= target) return foreground

  const towards = worstRatio(BLACK) >= worstRatio(WHITE) ? BLACK : WHITE
  let result = foreground

  for (let step = 1; step <= 50; step += 1) {
    result = mix(foreground, towards, step * 0.02)
    if (worstRatio(result) >= target) return result
  }

  return result
}

export const ensureContrast = (foreground: string, background: string, target: number): string =>
  ensureContrastAll(foreground, [background], target)

/**
 * Picks the readable foreground for `background`, preferring white whenever it
 * already clears the target so dark surfaces keep light text. Falls back to a
 * nudged value when neither pure endpoint passes.
 */
export const readableOn = (background: string, target = 4.5): string => {
  const whiteRatio = contrastRatio(WHITE, background)
  if (whiteRatio >= target) return WHITE

  const inkRatio = contrastRatio(INK, background)
  if (inkRatio >= target) return INK

  return ensureContrast(whiteRatio >= inkRatio ? WHITE : INK, background, target)
}
