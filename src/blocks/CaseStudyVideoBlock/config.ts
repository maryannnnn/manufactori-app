import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

export const CaseStudyVideoBlock: Block = {
  slug: 'csVideo',
  interfaceName: 'CaseStudyVideoBlock',
  dbName: 'csVid',
  labels: {
    singular: 'Case Study Video',
    plural: 'Case Study Video',
  },
  fields: [
    {
      name: 'case_study_video_title',
      type: 'text',
      label: 'Case Study Video Title',
    },
    {
      name: 'case_study_video_description',
      type: 'richText',
      label: 'Case Study Video Description',
      editor: defaultTiptap,
    },
    {
      name: 'case_study_video_code',
      type: 'textarea',
      label: 'Case Study Video Code',
      admin: {
        description: 'Embed code (e.g. YouTube iframe). Not a video file upload.',
      },
    },
  ],
}
