import React from 'react'

import RichText from '@/components/RichText'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

import { FieldLabel } from './Section'

type Props = {
  className?: string
  label?: string
  value: unknown
}

/**
 * Renders one rich-text CMS field with an optional label, and nothing at all
 * when the field is empty. Every structured section is built from these, which
 * is what keeps the template safe for case studies that only fill in some tabs.
 */
export const RichTextField: React.FC<Props> = ({ className, label, value }) => {
  if (!hasRichTextContent(value)) return null

  return (
    <div className={className}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <RichText
        className="max-w-none prose-sm md:prose-base"
        data={value as Record<string, unknown>}
        enableGutter={false}
      />
    </div>
  )
}

/**
 * Server-side render of a rich-text field into a node, so interactive client
 * components can receive already-converted content and Tiptap stays out of the
 * client bundle.
 */
export const renderRichTextField = (value: unknown, label?: string): React.ReactNode => {
  if (!hasRichTextContent(value)) return null
  return <RichTextField label={label} value={value} />
}
