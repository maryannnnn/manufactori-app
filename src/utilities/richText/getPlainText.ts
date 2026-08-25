import { isLexicalRichText, isTiptapRichText } from './types'

const walkTiptap = (node: { content?: unknown[]; text?: string }): string[] => {
  const parts: string[] = []
  if (typeof node.text === 'string' && node.text.trim()) parts.push(node.text)
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      if (child && typeof child === 'object') {
        parts.push(...walkTiptap(child as { content?: unknown[]; text?: string }))
      }
    }
  }
  return parts
}

const walkLexical = (node: { children?: unknown[]; text?: string }): string[] => {
  const parts: string[] = []
  if (typeof node.text === 'string' && node.text.trim()) parts.push(node.text)
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      if (child && typeof child === 'object') {
        parts.push(...walkLexical(child as { children?: unknown[]; text?: string }))
      }
    }
  }
  return parts
}

export const getRichTextPlainText = (value: unknown): string => {
  if (!value) return ''

  if (isTiptapRichText(value)) {
    return walkTiptap(value).join(' ').replace(/\s+/g, ' ').trim()
  }

  if (isLexicalRichText(value)) {
    return walkLexical(value.root).join(' ').replace(/\s+/g, ' ').trim()
  }

  return ''
}
