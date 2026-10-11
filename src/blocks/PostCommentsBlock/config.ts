import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

/**
 * Same flat depth-based discussion model as Case Study Comments.
 * Not a separate comments collection.
 */
export const PostCommentsBlock: Block = {
  slug: 'postCommentsBlock',
  interfaceName: 'PostCommentsBlock',
  labels: {
    singular: 'Comments',
    plural: 'Comments',
  },
  fields: [
    {
      name: 'postCommentTitle',
      type: 'text',
      label: 'Post Comment Title',
      admin: {
        description: 'Admin label only. The public heading is always "Comments".',
      },
    },
    {
      name: 'postCommentText',
      type: 'richText',
      label: 'Intro Text (optional)',
      editor: defaultTiptap,
      admin: {
        description: 'Optional lead-in above the thread. Individual entries go in Discussion.',
      },
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
              admin: {
                width: '40%',
                description: 'Job title or industry perspective.',
              },
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
              admin: {
                width: '50%',
                description:
                  'Parent/reply relationship: 0 is a new top-level branch. Depth N replies to the nearest preceding comment at depth N-1.',
              },
            },
            {
              name: 'isExpert',
              type: 'checkbox',
              label: 'Expert reply',
              defaultValue: false,
              admin: {
                width: '50%',
                description: 'Marks the entry as an answer from Maryan Polyak.',
              },
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
