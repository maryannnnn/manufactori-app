import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const CaseStudyPreviewBlock: Block = {
  slug: 'csPreview',
  interfaceName: 'CaseStudyPreviewBlock',
  dbName: 'csPrev',
  labels: {
    singular: 'Case Study Preview',
    plural: 'Case Study Preview',
  },
  fields: [
    {
      name: 'case_study_preview_title',
      type: 'text',
      label: 'Case Study Preview Title',
    },
    {
      name: 'case_study_preview_text',
      type: 'richText',
      label: 'Case Study Preview Text',
      editor: defaultTiptap,
    },
    {
      name: 'case_study_preview_image',
      type: 'upload',
      label: 'Case Study Preview Image',
      relationTo: 'media',
    },
  ],
}
