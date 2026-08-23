import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const PostVideoBlock: Block = {
  slug: 'postVideoBlock',
  interfaceName: 'PostVideoBlock',
  labels: {
    singular: 'Post Video',
    plural: 'Post Video',
  },
  fields: [
    {
      name: 'postVideoTitle',
      type: 'text',
      label: 'Post Video Title',
    },
    {
      name: 'postVideoDescription',
      type: 'richText',
      label: 'Post Video Description',
      editor: defaultTiptap,
    },
    {
      name: 'postVideoCode',
      type: 'textarea',
      label: 'Post Video Code',
      admin: {
        description: 'Код встраивания видео, например YouTube embed. Не файл.',
      },
    },
  ],
}
