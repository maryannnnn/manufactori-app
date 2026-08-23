import type { JSONContent } from '@tiptap/core'

export type LexicalRichTextValue = {
  root: {
    type: string
    children: unknown[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type TiptapRichTextValue = JSONContent

export type RichTextValue = LexicalRichTextValue | TiptapRichTextValue | null | undefined

export const isLexicalRichText = (value: unknown): value is LexicalRichTextValue => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'root' in value &&
    typeof (value as LexicalRichTextValue).root === 'object' &&
    (value as LexicalRichTextValue).root !== null
  )
}

export const isTiptapRichText = (value: unknown): value is TiptapRichTextValue => {
  return typeof value === 'object' && value !== null && (value as JSONContent).type === 'doc'
}
