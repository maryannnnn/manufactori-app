import type { Block } from 'payload'

export const ServiceGalleryBlock: Block = {
  slug: 'svcGallery',
  interfaceName: 'ServiceGalleryBlock',
  dbName: 'svcGal',
  labels: {
    singular: 'Media Gallery',
    plural: 'Media Gallery',
  },
  fields: [
    {
      name: 'service_gallery_title',
      type: 'text',
      label: 'Service Gallery Title',
      defaultValue: 'Gallery',
    },
    {
      name: 'service_gallery_images',
      type: 'upload',
      label: 'Service Gallery Images',
      relationTo: 'media',
      hasMany: true,
      maxRows: 20,
      admin: {
        description: 'Up to 20 images from the existing Media collection.',
      },
    },
  ],
}
