import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

/**
 * Same flat depth-based discussion model as Case Study Comments.
 * Not a separate comments collection.
 */
export const ServiceCommentsBlock: Block = {
  slug: 'svcComments',
  interfaceName: 'ServiceCommentsBlock',
  dbName: 'svcCom',
  labels: {
    singular: 'Service Comments',
    plural: 'Service Comments',
  },
  fields: [
    {
      name: 'service_comment_title',
      type: 'text',
      label: 'Service Comment Title',
      admin: {
        description: 'Section heading. Falls back to "Discussion" when empty.',
      },
    },
    {
      name: 'service_comment_text',
      type: 'richText',
      label: 'Intro Text (optional)',
      editor: defaultTiptap,
    },
    {
      name: 'comments',
      type: 'array',
      label: 'Discussion',
      labels: { singular: 'Comment', plural: 'Comment' },
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/blocks/CaseStudyCommentsBlock/CommentRowLabel#CommentRowLabel',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'author',
              type: 'text',
              required: true,
              admin: { width: '40%' },
            },
            {
              name: 'role',
              type: 'text',
              admin: { width: '40%' },
            },
            {
              name: 'date',
              type: 'date',
              admin: {
                width: '20%',
                date: { pickerAppearance: 'dayOnly' },
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'depth',
              type: 'number',
              defaultValue: 0,
              min: 0,
              max: 3,
              admin: { width: '50%' },
            },
            {
              name: 'isExpert',
              type: 'checkbox',
              label: 'Expert reply',
              defaultValue: false,
              admin: { width: '50%' },
            },
          ],
        },
        {
          name: 'body',
          type: 'richText',
          required: true,
          editor: defaultTiptap,
        },
      ],
    },
  ],
}
