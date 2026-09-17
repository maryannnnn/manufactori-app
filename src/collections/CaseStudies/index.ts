import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { CaseStudyCommentsBlock } from '../../blocks/CaseStudyCommentsBlock/config'
import { CaseStudyContentBlock } from '../../blocks/CaseStudyContentBlock/config'
import { CaseStudyContentTitleBlock } from '../../blocks/CaseStudyContentTitleBlock/config'
import { CaseStudyFAQBlock } from '../../blocks/CaseStudyFAQBlock/config'
import { CaseStudyGalleryBlock } from '../../blocks/CaseStudyGalleryBlock/config'
import { CaseStudyPreviewBlock } from '../../blocks/CaseStudyPreviewBlock/config'
import { CaseStudyVideoBlock } from '../../blocks/CaseStudyVideoBlock/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from '../Posts/hooks/populateAuthors'
import { ensurePrimaryCaseStudyCategoryInCategories } from './hooks/ensurePrimaryCaseStudyCategory'
import { revalidateCaseStudy, revalidateCaseStudyDelete } from './hooks/revalidateCaseStudy'
import { getCategorySlug } from '../../utilities/getContentUrls'
import { hierarchicalCategoryRelationshipAdmin } from '@/fields/hierarchicalCategoryRelationship'
import {
  caseStudyDigitalTabFields,
  caseStudyProfileTabFields,
  caseStudyResultsTabFields,
  caseStudySidebarFields,
} from './fields/structuredCaseStudyFields'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  // Short DB name to stay under Postgres 63-char identifier limit for nested blocks.
  dbName: 'cs',
  labels: {
    singular: 'Case Study',
    plural: 'Case Studies',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    case_study_categories: true,
    primary_case_study_category: true,
    site_categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: 'Case Studies',
    defaultColumns: ['title', 'featured', 'displayOrder', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: async ({ data, req }) => {
        const primary = data?.primary_case_study_category
        let categorySlug = getCategorySlug(primary)

        if (!categorySlug && (typeof primary === 'number' || typeof primary === 'string')) {
          const category = await req.payload.findByID({
            collection: 'case-study-categories',
            id: primary,
            depth: 0,
            disableErrors: true,
            select: { slug: true },
          })
          categorySlug = category?.slug || null
        }

        return generatePreviewPath({
          slug: data?.slug,
          categorySlug,
          collection: 'case-studies',
          req,
        })
      },
    },
    preview: async (data, { req }) => {
      const primary = data?.primary_case_study_category
      let categorySlug = getCategorySlug(primary as Parameters<typeof getCategorySlug>[0])

      if (!categorySlug && (typeof primary === 'number' || typeof primary === 'string')) {
        const category = await req.payload.findByID({
          collection: 'case-study-categories',
          id: primary,
          depth: 0,
          disableErrors: true,
          select: { slug: true },
        })
        categorySlug = category?.slug || null
      }

      return generatePreviewPath({
        slug: data?.slug as string,
        categorySlug,
        collection: 'case-studies',
        req,
      })
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'case_study_long_title',
      type: 'text',
      label: 'Case Study Long Title (H1)',
      required: true,
      admin: {
        description: 'Main case study heading. Used as H1 on the frontend.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Layout',
              required: true,
              admin: {
                initCollapsed: true,
              },
              blocks: [
                CaseStudyPreviewBlock,
                CaseStudyContentBlock,
                CaseStudyContentTitleBlock,
                CaseStudyVideoBlock,
                CaseStudyGalleryBlock,
                CaseStudyCommentsBlock,
                CaseStudyFAQBlock,
                Code,
                CallToAction,
                MediaBlock,
                Archive,
              ],
            },
          ],
        },
        {
          label: 'Profile & Challenge',
          fields: caseStudyProfileTabFields,
        },
        {
          label: 'Digital & Marketing',
          fields: caseStudyDigitalTabFields,
        },
        {
          label: 'Results & Proof',
          fields: caseStudyResultsTabFields,
        },
        {
          label: 'Hero',
          fields: [hero],
        },
        {
          label: 'Meta',
          fields: [
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => ({
                id: { not_in: [id] },
              }),
              hasMany: true,
              relationTo: 'case-studies',
            },
            {
              name: 'primary_case_study_category',
              type: 'relationship',
              label: 'Primary Case Study Category',
              relationTo: 'case-study-categories',
              required: true,
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                allowCreate: false,
                position: 'sidebar',
                description:
                  'Used in the case study URL: /case-study/{category-slug}/{case-study-slug}. Browse the tree and pick one category.',
              },
              validate: (value: unknown) => {
                if (value == null || value === '') {
                  return 'Primary Case Study Category is required'
                }
                return true
              },
            },
            {
              name: 'case_study_categories',
              type: 'relationship',
              label: 'Case Study Categories',
              hasMany: true,
              relationTo: 'case-study-categories',
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                allowCreate: false,
                position: 'sidebar',
                description:
                  'Thematic case study categories. Browse the tree and add one or more.',
              },
            },
            {
              name: 'site_categories',
              type: 'relationship',
              label: 'Site Categories',
              hasMany: true,
              relationTo: 'site-categories',
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                position: 'sidebar',
                description:
                  'Site taxonomy nodes (independent from Case Study Categories). Browse the tree and add one or more.',
              },
            },
          ],
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    ...caseStudySidebarFields,
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: { position: 'sidebar' },
      hasMany: true,
      relationTo: 'users',
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      access: { update: () => false },
      admin: { disabled: true, readOnly: true },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    },
    slugField({
      required: true,
      useAsSlug: 'title',
    }),
  ],
  hooks: {
    beforeChange: [ensurePrimaryCaseStudyCategoryInCategories],
    afterChange: [revalidateCaseStudy],
    afterRead: [populateAuthors],
    afterDelete: [revalidateCaseStudyDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
