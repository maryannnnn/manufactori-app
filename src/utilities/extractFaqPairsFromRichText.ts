import { isLexicalRichText, isTiptapRichText } from '@/utilities/richText/types'

type Pair = { question: string; answer: string }

const textOf = (node: unknown): string => {
  if (!node || typeof node !== 'object') return ''
  const value = node as { text?: unknown; content?: unknown[]; children?: unknown[] }
  const parts: string[] = []
  if (typeof value.text === 'string') parts.push(value.text)
  for (const child of value.content ?? value.children ?? []) {
    const nested = textOf(child)
    if (nested) parts.push(nested)
  }
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

/**
 * Pulls question/answer pairs from Post FAQ rich text where questions are headings
 * (typically h3) followed by paragraph answers — the format used by populate scripts.
 */
export const extractFaqPairsFromRichText = (value: unknown): Pair[] => {
  if (!value || typeof value !== 'object') return []

  const pairs: Pair[] = []
  let currentQuestion: string | null = null
  let answerParts: string[] = []

  const flush = () => {
    if (!currentQuestion) return
    const answer = answerParts.join(' ').replace(/\s+/g, ' ').trim()
    if (answer) pairs.push({ question: currentQuestion, answer })
    currentQuestion = null
    answerParts = []
  }

  const visitBlock = (block: unknown) => {
    if (!block || typeof block !== 'object') return
    const node = block as { type?: string; attrs?: { level?: number }; content?: unknown[] }
    const type = node.type || ''

    if (type === 'heading' || type.startsWith('heading')) {
      flush()
      currentQuestion = textOf(block)
      return
    }

    if (currentQuestion) {
      const text = textOf(block)
      if (text) answerParts.push(text)
    }
  }

  if (isTiptapRichText(value)) {
    for (const block of value.content ?? []) visitBlock(block)
    flush()
    return pairs
  }

  if (isLexicalRichText(value)) {
    for (const block of value.root.children ?? []) {
      const node = block as { type?: string; tag?: string }
      if (node.type === 'heading' || (typeof node.tag === 'string' && /^h[1-6]$/i.test(node.tag))) {
        flush()
        currentQuestion = textOf(block)
      } else if (currentQuestion) {
        const text = textOf(block)
        if (text) answerParts.push(text)
      }
    }
    flush()
    return pairs
  }

  return pairs
}
