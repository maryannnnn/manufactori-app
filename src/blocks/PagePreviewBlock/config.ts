import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const PagePreviewBlock: Block = {
  slug: 'pagePreviewBlock',
  interfaceName: 'PagePreviewBlock',
  labels: {
    singular: 'Page Preview',
    plural: 'Page Preview',
  },
  fields: [
    {
      name: 'pagePreviewTitle',
      type: 'text',
      label: 'Page Preview Title',
    },
    {
      name: 'pagePreviewText',
      type: 'richText',
      label: 'Page Preview Text',
      editor: defaultTiptap,
    },
    {
      name: 'pagePreviewImage',
      type: 'upload',
      label: 'Page Preview Image',
      relationTo: 'media',
    },
  ],
}
