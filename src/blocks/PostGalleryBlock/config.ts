import type { Block } from 'payload'

export const PostGalleryBlock: Block = {
  slug: 'postGalleryBlock',
  interfaceName: 'PostGalleryBlock',
  labels: {
    singular: 'Post Gallery',
    plural: 'Post Gallery',
  },
  fields: [
    {
      name: 'postGalleryTitle',
      type: 'text',
      label: 'Post Gallery Title',
    },
    {
      name: 'postGalleryImages',
      type: 'upload',
      label: 'Post Gallery Images',
      relationTo: 'media',
      hasMany: true,
      maxRows: 20,
      admin: {
        description: 'До 20 изображений из Media. Можно выбрать существующие или загрузить новые.',
      },
    },
  ],
}
