import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { generateJSON } from '@tiptap/html'
import type { JSONContent } from '@tiptap/core'

import { getTiptapExtensions } from './extensions'
import { isLexicalRichText, isTiptapRichText } from './types'

export const emptyTiptapDocument = (): JSONContent => ({
  type: 'doc',
  content: [{ type: 'paragraph' }],
})

export const normalizeRichTextToTiptap = (value: unknown): JSONContent => {
  if (isTiptapRichText(value)) {
    return value
  }

  if (isLexicalRichText(value)) {
    try {
      const html = convertLexicalToHTML({ data: value as DefaultTypedEditorState })
      if (!html.trim()) {
        return emptyTiptapDocument()
      }
      return generateJSON(
        html,
        getTiptapExtensions({ headingLevels: [1, 2, 3, 4, 5, 6] }),
      )
    } catch {
      return emptyTiptapDocument()
    }
  }

  return emptyTiptapDocument()
}
