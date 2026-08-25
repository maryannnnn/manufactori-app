import type { Block } from 'payload'

export const CaseStudyContentTitleBlock: Block = {
  slug: 'csContentTitle',
  interfaceName: 'CaseStudyContentTitleBlock',
  dbName: 'csCT',
  labels: {
    singular: 'Case Study Content Title',
    plural: 'Case Study Content Title',
  },
  fields: [
    {
      name: 'case_study_content_title',
      type: 'text',
      label: 'Case Study Content Title',
      admin: {
        description: 'Additional content heading. Rendered as H2.',
      },
    },
  ],
}
