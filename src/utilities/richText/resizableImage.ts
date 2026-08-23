import { mergeAttributes } from '@tiptap/core'
import Image from '@tiptap/extension-image'

import {
  clampImageWidth,
  DEFAULT_IMAGE_ALIGN,
  DEFAULT_IMAGE_WIDTH,
  type EditorImageAttrs,
  getImageAlign,
  getImageClassName,
  type ImageAlign,
} from './imageTypes'

const isDomElement = (value: unknown): value is HTMLElement => {
  return typeof value === 'object' && value !== null && 'getAttribute' in value
}

const parseWidthFromStyle = (style: string | null): number | null => {
  if (!style) return null
  const match = style.match(/(?:^|;)\s*width:\s*([0-9.]+)%/)
  if (!match) return null
  return clampImageWidth(match[1])
}

const readImageAttrs = (element: HTMLElement): EditorImageAttrs | false => {
  const img = (element.tagName === 'IMG' ? element : element.querySelector('img')) as HTMLElement | null
  if (!img) return false
  const src = img.getAttribute('src')
  if (!src) return false

  const figure =
    element.closest?.('figure.rich-image') ||
    (element.classList?.contains('rich-image') ? element : null)
  const caption = figure?.querySelector('figcaption')?.textContent?.trim() || null

  return {
    src,
    alt: img.getAttribute('alt') || '',
    title: img.getAttribute('title'),
    caption,
    align: getImageAlign(figure?.getAttribute('data-align') || img.getAttribute('data-align')),
    width: clampImageWidth(
      figure?.getAttribute('data-width') ||
        img.getAttribute('data-width') ||
        parseWidthFromStyle(figure?.getAttribute('style') || img.getAttribute('style')) ||
        DEFAULT_IMAGE_WIDTH,
    ),
    mediaId: figure?.getAttribute('data-media-id') || img.getAttribute('data-media-id'),
    srcFull: figure?.getAttribute('data-full-src') || img.getAttribute('data-full-src') || src,
  }
}

export const ResizableImage = Image.extend({
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: '',
      },
      title: {
        default: null,
      },
      caption: {
        default: null,
        parseHTML: (element) => {
          if (element.tagName === 'FIGURE') {
            return element.querySelector('figcaption')?.textContent?.trim() || null
          }
          return element.getAttribute('data-caption')
        },
        renderHTML: () => ({}),
      },
      align: {
        default: DEFAULT_IMAGE_ALIGN,
        parseHTML: (element) => getImageAlign(element.getAttribute('data-align')),
        renderHTML: () => ({}),
      },
      width: {
        default: DEFAULT_IMAGE_WIDTH,
        parseHTML: (element) =>
          clampImageWidth(
            element.getAttribute('data-width') || parseWidthFromStyle(element.getAttribute('style')),
          ),
        renderHTML: () => ({}),
      },
      mediaId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-media-id'),
        renderHTML: () => ({}),
      },
      srcFull: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-full-src'),
        renderHTML: () => ({}),
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'figure.rich-image',
        getAttrs: (element) => {
          if (!isDomElement(element)) return false
          return readImageAttrs(element)
        },
      },
      {
        tag: this.options.allowBase64 ? 'img[src]' : 'img[src]:not([src^="data:"])',
        getAttrs: (element) => {
          if (!isDomElement(element)) return false
          if (element.closest?.('figure.rich-image')) return false
          return readImageAttrs(element)
        },
      },
    ]
  },

  renderHTML({ HTMLAttributes, node }) {
    const src = (node.attrs.src as string | null) || (HTMLAttributes.src as string)
    const alt = (node.attrs.alt as string | null) || ''
    const title = (node.attrs.title as string | null) || null
    const caption = (node.attrs.caption as string | null) || null
    const resolvedAlign: ImageAlign = getImageAlign(node.attrs.align)
    const resolvedWidth = clampImageWidth(node.attrs.width)
    const mediaId = node.attrs.mediaId as string | number | null
    const srcFull = (node.attrs.srcFull as string | null) || src

    const figureAttrs = mergeAttributes({
      class: getImageClassName(resolvedAlign),
      'data-align': resolvedAlign,
      'data-width': String(resolvedWidth),
      ...(mediaId ? { 'data-media-id': String(mediaId) } : {}),
      ...(srcFull ? { 'data-full-src': srcFull } : {}),
      style: `width: ${resolvedWidth}%; max-width: 100%;`,
    })

    const imgAttrs = mergeAttributes(this.options.HTMLAttributes, {
      src,
      alt: alt || '',
      ...(title ? { title } : {}),
    })

    const children: Array<[string, Record<string, unknown>] | [string, Record<string, unknown>, string]> = [
      ['img', imgAttrs],
    ]

    if (caption && String(caption).trim()) {
      children.push(['figcaption', { class: 'rich-image__caption' }, String(caption)])
    }

    return ['figure', figureAttrs, ...children]
  },
})
