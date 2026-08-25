import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const CaseStudyCommentsBlock: Block = {
  slug: 'csComments',
  interfaceName: 'CaseStudyCommentsBlock',
  dbName: 'csCom',
  labels: {
    singular: 'Case Study Comments',
    plural: 'Case Study Comments',
  },
  fields: [
    {
      name: 'case_study_comment_title',
      type: 'text',
      label: 'Case Study Comment Title',
    },
    {
      name: 'case_study_comment_text',
      type: 'richText',
      label: 'Case Study Comment Text',
      editor: defaultTiptap,
    },
  ],
}
