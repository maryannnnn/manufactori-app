import type { Block } from 'payload'

export const CaseStudyGalleryBlock: Block = {
  slug: 'csGallery',
  interfaceName: 'CaseStudyGalleryBlock',
  dbName: 'csGal',
  labels: {
    singular: 'Case Study Gallery',
    plural: 'Case Study Gallery',
  },
  fields: [
    {
      name: 'case_study_gallery_title',
      type: 'text',
      label: 'Case Study Gallery Title',
    },
    {
      name: 'case_study_gallery_images',
      type: 'upload',
      label: 'Case Study Gallery Images',
      relationTo: 'media',
      hasMany: true,
      maxRows: 20,
      admin: {
        description: 'Up to 20 images from Media.',
      },
    },
  ],
}
