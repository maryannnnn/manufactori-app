import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const CaseStudyFAQBlock: Block = {
  slug: 'csFAQ',
  interfaceName: 'CaseStudyFAQBlock',
  dbName: 'csFAQ',
  labels: {
    singular: 'Case Study FAQ',
    plural: 'Case Study FAQ',
  },
  fields: [
    {
      name: 'case_study_faq_title',
      type: 'text',
      label: 'Case Study FAQ Title',
    },
    {
      name: 'case_study_faq_text',
      type: 'richText',
      label: 'Case Study FAQ Text',
      editor: defaultTiptap,
    },
  ],
}
