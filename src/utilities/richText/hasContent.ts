import { isLexicalRichText, isTiptapRichText } from './types'

const lexicalHasContent = (value: unknown): boolean => {
  if (!isLexicalRichText(value)) return false

  const walk = (node: { children?: unknown[]; text?: string; type?: string }): boolean => {
    if (typeof node.text === 'string' && node.text.trim().length > 0) return true
    if (!node.children?.length) return false
    return node.children.some((child) => walk(child as typeof node))
  }

  return walk(value.root)
}

const tiptapHasContent = (value: unknown): boolean => {
  if (!isTiptapRichText(value)) return false

  const walk = (node: { attrs?: { src?: unknown }; content?: unknown[]; text?: string; type?: string }): boolean => {
    if (node.type === 'image' && typeof node.attrs?.src === 'string' && node.attrs.src.length > 0) {
      return true
    }
    if (node.text && node.text.trim().length > 0) return true
    if (!node.content?.length) return false
    return node.content.some((child) => walk(child as typeof node))
  }

  return walk(value)
}

export const hasRichTextContent = (value: unknown): boolean => {
  if (!value) return false
  if (isLexicalRichText(value)) return lexicalHasContent(value)
  if (isTiptapRichText(value)) return tiptapHasContent(value)
  return false
}
