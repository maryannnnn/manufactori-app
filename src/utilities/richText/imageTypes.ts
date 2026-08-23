export const IMAGE_ALIGNS = ['full', 'left', 'center', 'right', 'float-left', 'float-right'] as const

export type ImageAlign = (typeof IMAGE_ALIGNS)[number]

export type EditorImageAttrs = {
  src: string
  alt?: string | null
  title?: string | null
  caption?: string | null
  align?: ImageAlign | null
  width?: number | null
  mediaId?: string | number | null
  srcFull?: string | null
}

export const DEFAULT_IMAGE_ALIGN: ImageAlign = 'full'
export const DEFAULT_IMAGE_WIDTH = 100
export const MIN_IMAGE_WIDTH = 20
export const MAX_IMAGE_WIDTH = 100
export const FLOAT_IMAGE_WIDTH = 50

export const isImageAlign = (value: unknown): value is ImageAlign => {
  return typeof value === 'string' && IMAGE_ALIGNS.includes(value as ImageAlign)
}

export const clampImageWidth = (value: unknown): number => {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(numeric)) return DEFAULT_IMAGE_WIDTH
  return Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, Math.round(numeric)))
}

export const getImageAlign = (value: unknown): ImageAlign => {
  return isImageAlign(value) ? value : DEFAULT_IMAGE_ALIGN
}

export const getImageClassName = (align: unknown): string => {
  return `rich-image rich-image--${getImageAlign(align)}`
}

export const isFloatAlign = (align: unknown): boolean => {
  return align === 'float-left' || align === 'float-right'
}
