import type { RichTextAdapterProvider } from 'payload'
import { withNullableJSONSchemaType } from 'payload'

import { hasRichTextContent } from '@/utilities/richText/hasContent'

export type TiptapEditorArgs = {
  headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
  placeholder?: string
}

export const tiptapEditor =
  (args?: TiptapEditorArgs): RichTextAdapterProvider =>
  () => {
    const headingLevels = args?.headingLevels ?? [2, 3, 4]
    const placeholder = args?.placeholder

    return {
      CellComponent: '@/fields/tiptap/TiptapCell#TiptapCell',
      FieldComponent: {
        path: '@/fields/tiptap/TiptapField#TiptapField',
        serverProps: {
          headingLevels,
          placeholder,
        },
      },
      generateImportMap: ({ addToImportMap }) => {
        addToImportMap('@/fields/tiptap/TiptapField#TiptapField')
        addToImportMap('@/fields/tiptap/TiptapCell#TiptapCell')
        addToImportMap('@/components/RichEditor#RichEditor')
        addToImportMap('@/components/RichEditor/Toolbar#RichEditorToolbar')
      },
      outputSchema: ({ isRequired }) => ({
        type: withNullableJSONSchemaType('object', isRequired),
        additionalProperties: true,
      }),
      validate: async (value, options) => {
        const {
          req: { t },
          required,
        } = options

        if (required && !hasRichTextContent(value)) {
          return t('validation:required')
        }

        return true
      },
    }
  }

export const defaultTiptap = tiptapEditor()

export const tiptapEditorWithHeadings = tiptapEditor({
  headingLevels: [1, 2, 3, 4],
})
