import type { Media, Post, PostPreviewBlock } from '@/payload-types'

import { isLexicalRichText, isTiptapRichText } from '@/utilities/richText/types'

const richTextToPlainText = (value: unknown): string => {
  if (!value || typeof value !== 'object') return ''

  const walk = (node: { children?: unknown[]; content?: unknown[]; text?: string }): string => {
    const text = typeof node.text === 'string' ? node.text : ''
    const children = node.children || node.content || []
    return `${text}${children.map((child) => walk(child as typeof node)).join('')}`
  }

  if (isTiptapRichText(value)) {
    return walk(value).replace(/\s+/g, ' ').trim()
  }

  if (isLexicalRichText(value)) {
    return walk(value.root).replace(/\s+/g, ' ').trim()
  }

  return ''
}

export type PostListPreview = {
  previewTitle: string | null
  previewText: string | null
  previewImage: Media | number | null
}

export const getPostListPreview = (
  post: Pick<Post, 'layout' | 'meta'>,
): PostListPreview => {
  const previewBlock = post.layout?.find(
    (block): block is PostPreviewBlock => block.blockType === 'postPreviewBlock',
  )

  const previewText =
    richTextToPlainText(previewBlock?.postPreviewText) || post.meta?.description || null

  return {
    previewTitle: previewBlock?.postPreviewTitle || null,
    previewText,
    previewImage: previewBlock?.postPreviewImage || post.meta?.image || null,
  }
}
