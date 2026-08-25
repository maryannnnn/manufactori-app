import type { CaseStudy, CaseStudyPreviewBlock, Media } from '@/payload-types'

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

export type CaseStudyListPreview = {
  previewTitle: string | null
  previewText: string | null
  previewImage: Media | number | null
}

export const getCaseStudyListPreview = (
  doc: Pick<CaseStudy, 'layout' | 'meta'>,
): CaseStudyListPreview => {
  const previewBlock = doc.layout?.find(
    (block): block is CaseStudyPreviewBlock => block.blockType === 'csPreview',
  )

  const previewText =
    richTextToPlainText(previewBlock?.case_study_preview_text) || doc.meta?.description || null

  return {
    previewTitle: previewBlock?.case_study_preview_title || null,
    previewText,
    previewImage: previewBlock?.case_study_preview_image || doc.meta?.image || null,
  }
}
