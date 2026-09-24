import type { Block } from 'payload'

import { defaultTiptap } from '@/fields/defaultTiptap'

/**
 * Threading is stored flat: every entry carries a `depth`, and a comment at
 * depth N is a reply to the nearest preceding comment at depth N-1. That keeps
 * the whole discussion in one reorderable list instead of nested arrays, which
 * would cap how deep a follow-up can go.
 */
export const CaseStudyCommentsBlock: Block = {
  slug: 'csComments',
  interfaceName: 'CaseStudyCommentsBlock',
  dbName: 'csCom',
  labels: {
    singular: 'Case Study Comments',
    plural: 'Case Study Comments',
  },
  fields: [
    {
      name: 'case_study_comment_title',
      type: 'text',
      label: 'Case Study Comment Title',
      admin: {
        description: 'Section heading. Falls back to "Discussion" when empty.',
      },
    },
    {
      name: 'case_study_comment_text',
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
                  'Parent/reply relationship: 0 is a new top-level branch. Depth N replies to the nearest preceding comment at depth N-1. The frontend builds the tree from this, not from visual indent.',
              },
            },
            {
              name: 'isExpert',
              type: 'checkbox',
              label: 'Expert reply',
              defaultValue: false,
              admin: {
                width: '50%',
                description: 'Marks the entry as an answer from the site expert.',
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
