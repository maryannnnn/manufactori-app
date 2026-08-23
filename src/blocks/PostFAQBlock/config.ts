import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const PostFAQBlock: Block = {
  slug: 'postFAQBlock',
  interfaceName: 'PostFAQBlock',
  labels: {
    singular: 'Post FAQ',
    plural: 'Post FAQ',
  },
  fields: [
    {
      name: 'postFAQTitle',
      type: 'text',
      label: 'Post FAQ Title',
    },
    {
      name: 'postFAQText',
      type: 'richText',
      label: 'Post FAQ Text',
      editor: defaultTiptap,
    },
  ],
}
