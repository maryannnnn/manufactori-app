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
      admin: {
        description:
          'Section heading, e.g. "Frequently Asked Questions About Laser Made". Falls back to a generic heading when empty.',
      },
    },
    {
      name: 'case_study_faq_text',
      type: 'richText',
      label: 'Intro Text (optional)',
      editor: defaultTiptap,
      admin: {
        description: 'Optional lead-in above the questions. Individual questions go in Questions.',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Questions',
      labels: { singular: 'Question', plural: 'Questions' },
      admin: {
        initCollapsed: true,
        description: 'Each entry renders as one accordion row.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          required: true,
          editor: defaultTiptap,
        },
      ],
    },
  ],
}
