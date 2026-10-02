import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Code } from '../../blocks/Code/config'
import { Content } from '../../blocks/Content/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { ServiceCommentsBlock } from '../../blocks/ServiceCommentsBlock/config'
import { ServiceGalleryBlock } from '../../blocks/ServiceGalleryBlock/config'
import { hierarchicalCategoryRelationshipAdmin } from '@/fields/hierarchicalCategoryRelationship'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from '../Posts/hooks/populateAuthors'
import { revalidateService, revalidateServiceDelete } from './hooks/revalidateService'
import {
  serviceEntryOfferFields,
  serviceFaqFields,
  serviceIntroductionFields,
  serviceOutcomesFields,
  servicePreviewFields,
  serviceProcessFields,
  serviceScopeFields,
  serviceSidebarFields,
  serviceSituationsFields,
  serviceTestimonialFields,
  serviceWorkingFormatFields,
} from './fields/structuredServiceFields'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Services: CollectionConfig = {
  slug: 'services',
  dbName: 'svc',
  labels: {
    singular: 'Service',
    plural: 'Services',
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
    service_preview_title: true,
    service_preview_description: true,
    service_preview_image: true,
    site_categories: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: 'Services',
    defaultColumns: ['title', 'featured', 'displayOrder', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'services',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'services',
        req,
      }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal document title.',
      },
    },
    {
      name: 'service_long_title',
      type: 'text',
      label: 'Service Long Title (H1)',
      admin: {
        description: 'SEO/content heading used as H1. Falls back to the internal title when empty.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Preview',
          fields: servicePreviewFields,
        },
        {
          label: 'Service Content',
          fields: [
            ...serviceIntroductionFields,
            ...serviceSituationsFields,
            ...serviceScopeFields,
            ...serviceProcessFields,
            ...serviceEntryOfferFields,
            ...serviceWorkingFormatFields,
            ...serviceOutcomesFields,
          ],
        },
        {
          label: 'Proof & FAQ',
          fields: [
            {
              name: 'relatedCaseStudies',
              type: 'relationship',
              label: 'Related Case Studies',
              hasMany: true,
              relationTo: 'case-studies',
              admin: {
                description: 'Existing Case Study collection. Preview title, text and image come from each case.',
              },
            },
            ...serviceTestimonialFields,
            ...serviceFaqFields,
            {
              name: 'relatedServices',
              type: 'relationship',
              label: 'Related Services',
              hasMany: true,
              relationTo: 'services',
              filterOptions: ({ id }) => ({
                id: { not_in: [id] },
              }),
              admin: {
                description: 'Optional Service-to-Service links. The current Service is excluded.',
              },
            },
          ],
        },
        {
          label: 'Layout',
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Additional Layout',
              admin: {
                initCollapsed: true,
                description: 'Optional extra blocks (gallery, comments, CTA). Structured sections above do not require this.',
              },
              blocks: [
                Content,
                ServiceGalleryBlock,
                ServiceCommentsBlock,
                CallToAction,
                MediaBlock,
                Archive,
                Code,
              ],
            },
          ],
        },
        {
          label: 'Taxonomy',
          fields: [
            {
              name: 'site_categories',
              type: 'relationship',
              label: 'Site Categories',
              hasMany: true,
              relationTo: 'site-categories',
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                description:
                  'Existing 4D site taxonomy (Services, Industrial, Solutions, Technology). No separate Service category collection.',
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
    ...serviceSidebarFields,
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
    afterChange: [revalidateService],
    afterRead: [populateAuthors],
    afterDelete: [revalidateServiceDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
