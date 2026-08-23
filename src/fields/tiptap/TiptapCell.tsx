'use client'

import type { DefaultCellComponentProps } from 'payload'

import { hasRichTextContent } from '@/utilities/richText/hasContent'

export const TiptapCell: React.FC<DefaultCellComponentProps> = ({ cellData }) => {
  if (!hasRichTextContent(cellData)) {
    return null
  }

  return <span>Rich text</span>
}
