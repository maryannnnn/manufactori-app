export const A11Y_STORAGE_KEY = 'site-a11y-prefs'
export const A11Y_TEXT_VAR = '--a11y-text-scale'

export const A11Y_ATTR = {
  contrast: 'data-a11y-contrast',
  grayscale: 'data-a11y-grayscale',
  links: 'data-a11y-links',
  font: 'data-a11y-font',
  spacing: 'data-a11y-spacing',
  motion: 'data-a11y-motion',
} as const

export const TEXT_SCALE_MIN = 0.9
export const TEXT_SCALE_MAX = 1.5
export const TEXT_SCALE_STEP = 0.1

export type A11yPrefs = {
  textScale: number
  highContrast: boolean
  grayscale: boolean
  highlightLinks: boolean
  readableFont: boolean
  increaseSpacing: boolean
  reduceMotion: boolean
}

export const defaultA11yPrefs: A11yPrefs = {
  textScale: 1,
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  increaseSpacing: false,
  reduceMotion: false,
}

const clampScale = (value: number): number => {
  const stepped = Math.round(value / TEXT_SCALE_STEP) * TEXT_SCALE_STEP
  return Math.min(TEXT_SCALE_MAX, Math.max(TEXT_SCALE_MIN, Number(stepped.toFixed(1))))
}

export const normalizeA11yPrefs = (value: unknown): A11yPrefs => {
  if (!value || typeof value !== 'object') return { ...defaultA11yPrefs }
  const input = value as Partial<A11yPrefs>
  return {
    textScale: typeof input.textScale === 'number' && Number.isFinite(input.textScale)
      ? clampScale(input.textScale)
      : defaultA11yPrefs.textScale,
    highContrast: Boolean(input.highContrast),
    grayscale: Boolean(input.grayscale),
    highlightLinks: Boolean(input.highlightLinks),
    readableFont: Boolean(input.readableFont),
    increaseSpacing: Boolean(input.increaseSpacing),
    reduceMotion: Boolean(input.reduceMotion),
  }
}

export const applyA11yPrefs = (prefs: A11yPrefs, root: HTMLElement = document.documentElement) => {
  root.style.setProperty(A11Y_TEXT_VAR, String(prefs.textScale))
  const toggle = (name: string, on: boolean) => {
    if (on) root.setAttribute(name, '')
    else root.removeAttribute(name)
  }
  toggle(A11Y_ATTR.contrast, prefs.highContrast)
  toggle(A11Y_ATTR.grayscale, prefs.grayscale)
  toggle(A11Y_ATTR.links, prefs.highlightLinks)
  toggle(A11Y_ATTR.font, prefs.readableFont)
  toggle(A11Y_ATTR.spacing, prefs.increaseSpacing)
  toggle(A11Y_ATTR.motion, prefs.reduceMotion)
}

export const readStoredA11yPrefs = (): A11yPrefs | null => {
  try {
    const raw = window.localStorage.getItem(A11Y_STORAGE_KEY)
    if (!raw) return null
    return normalizeA11yPrefs(JSON.parse(raw))
  } catch {
    return null
  }
}

export const writeStoredA11yPrefs = (prefs: A11yPrefs) => {
  try {
    window.localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    // Private mode or blocked storage — keep the session-only presentation.
  }
}

export const bumpTextScale = (current: number, direction: -1 | 1): number =>
  clampScale(current + direction * TEXT_SCALE_STEP)
