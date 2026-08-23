'use client'

import { ReactNodeViewRenderer } from '@tiptap/react'

import { clampImageWidth } from '@/utilities/richText/imageTypes'
import { ResizableImage } from '@/utilities/richText/resizableImage'

import { ImageNodeView } from './ImageNodeView'

export const AdminImage = ResizableImage.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView, {
      as: 'figure',
      className: 'rich-image',
      attrs: ({ node }) => {
        const align = typeof node.attrs.align === 'string' ? node.attrs.align : 'full'
        const width = clampImageWidth(node.attrs.width)

        return {
          'data-align': align,
          'data-width': String(width),
          style: `width: ${width}%; max-width: 100%;`,
        }
      },
      stopEvent: ({ event }) => {
        const target = event.target as HTMLElement | null
        if (!target) return false
        return Boolean(target.closest('input, textarea, select, button, .rich-image__controls'))
      },
    })
  },
})
