import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const PostPreviewBlock: Block = {
  slug: 'postPreviewBlock',
  interfaceName: 'PostPreviewBlock',
  labels: {
    singular: 'Post Preview',
    plural: 'Post Preview',
  },
  fields: [
    {
      name: 'postPreviewTitle',
      type: 'text',
      label: 'Post Preview Title',
    },
    {
      name: 'postPreviewText',
      type: 'richText',
      label: 'Post Preview Text',
      editor: defaultTiptap,
    },
    {
      name: 'postPreviewImage',
      type: 'upload',
      label: 'Post Preview Image',
      relationTo: 'media',
    },
  ],
}
