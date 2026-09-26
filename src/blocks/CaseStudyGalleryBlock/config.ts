import type { Block } from 'payload'

export const CaseStudyGalleryBlock: Block = {
  slug: 'csGallery',
  interfaceName: 'CaseStudyGalleryBlock',
  dbName: 'csGal',
  labels: {
    singular: 'Media Gallery',
    plural: 'Media Gallery',
  },
  fields: [
    {
      name: 'case_study_gallery_title',
      type: 'text',
      label: 'Case Study Gallery Title',
      defaultValue: 'Gallery',
      admin: {
        description:
          'Section heading. Defaults to Gallery. Change it for a specific set, for example Manufacturing Gallery or Before & After.',
      },
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
