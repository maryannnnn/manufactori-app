import { isLexicalRichText, isTiptapRichText } from './types'

const walk = (node: unknown, parts: string[]): void => {
  if (!node || typeof node !== 'object') return

  const value = node as {
    text?: unknown
    children?: unknown[]
    content?: unknown[]
  }

  if (typeof value.text === 'string' && value.text.trim()) {
    parts.push(value.text)
  }

  value.children?.forEach((child) => walk(child, parts))
  value.content?.forEach((child) => walk(child, parts))
}

export const richTextToPlainText = (value: unknown): string => {
  if (!value) return ''

  const parts: string[] = []

  if (isLexicalRichText(value)) walk(value.root, parts)
  else walk(value, parts)

  if (!isLexicalRichText(value) && !isTiptapRichText(value) && parts.length === 0) {
    return ''
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim()
}
