import type { Block } from 'payload'

export const PostContentTitleBlock: Block = {
  slug: 'postContentTitleBlock',
  interfaceName: 'PostContentTitleBlock',
  labels: {
    singular: 'Post Content Title',
    plural: 'Post Content Title',
  },
  fields: [
    {
      name: 'postContentTitle',
      type: 'text',
      label: 'Post Content Title',
      admin: {
        description: 'Дополнительный заголовок для Content. При выводе используется как H2.',
      },
    },
  ],
}
