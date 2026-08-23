import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const PostCommentsBlock: Block = {
  slug: 'postCommentsBlock',
  interfaceName: 'PostCommentsBlock',
  labels: {
    singular: 'Комментарии',
    plural: 'Комментарии',
  },
  fields: [
    {
      name: 'postCommentTitle',
      type: 'text',
      label: 'Post Comment Title',
    },
    {
      name: 'postCommentText',
      type: 'richText',
      label: 'Post Comment Text',
      editor: defaultTiptap,
    },
  ],
}
