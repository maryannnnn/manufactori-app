import type { Block, Field } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'
import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      { label: 'One Third', value: 'oneThird' },
      { label: 'Half', value: 'half' },
      { label: 'Two Thirds', value: 'twoThirds' },
      { label: 'Full', value: 'full' },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: defaultTiptap,
    label: false,
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
      },
    },
  }),
]

export const CaseStudyContentBlock: Block = {
  slug: 'csContent',
  interfaceName: 'CaseStudyContentBlock',
  dbName: 'csCont',
  labels: {
    singular: 'Case Study Content',
    plural: 'Case Study Content',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
  ],
}
