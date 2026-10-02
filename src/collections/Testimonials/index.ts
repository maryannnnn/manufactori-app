import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { hierarchicalCategoryRelationshipAdmin } from '@/fields/hierarchicalCategoryRelationship'
import { defaultTiptap } from '@/fields/defaultTiptap'
import { revalidateTestimonial, revalidateTestimonialDelete } from './hooks/revalidateTestimonial'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const TESTIMONIAL_TYPE_OPTIONS = [
  { label: 'Client Testimonial', value: 'client' },
  { label: 'Project Testimonial', value: 'project' },
  { label: 'Service Testimonial', value: 'service' },
  { label: 'General Testimonial', value: 'general' },
] as const

export const TESTIMONIAL_SOURCE_TYPE_OPTIONS = [
  { label: 'Direct Client Testimonial', value: 'direct' },
  { label: 'Email', value: 'email' },
  { label: 'Website', value: 'website' },
  { label: 'Google', value: 'google' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Other', value: 'other' },
] as const

export const TESTIMONIAL_RATING_OPTIONS = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
] as const

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  dbName: 'tstm',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
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
    testimonialLongTitle: true,
    testimonialContentTitle: true,
    testimonialPreviewTitle: true,
    testimonialPreviewDescription: true,
    testimonialPreviewImage: true,
    testimonial: true,
    clientName: true,
    clientPosition: true,
    clientCompany: true,
    rating: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: 'Testimonials',
    defaultColumns: ['title', 'clientName', 'clientCompany', 'slug', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Internal document title. Same Payload title field as Post and Case Study.',
      },
    },
    {
      name: 'testimonialLongTitle',
      type: 'text',
      label: 'Testimonial Long Title (H1)',
      required: true,
      admin: {
        description:
          'Longer editorial/SEO title, same role as Post Long Title and Case Study Long Title.',
      },
    },
    {
      name: 'testimonialContentTitle',
      type: 'text',
      label: 'Testimonial Content Title',
      admin: {
        description:
          'In-page heading. Separate from the internal title, long title and preview title.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Preview',
          fields: [
            {
              name: 'testimonialPreviewTitle',
              type: 'text',
              label: 'Testimonial Preview Title',
              admin: {
                description:
                  'Short title for cards, sliders and related lists. Not the page H1.',
              },
            },
            {
              name: 'testimonialPreviewDescription',
              type: 'textarea',
              label: 'Testimonial Preview Description',
              admin: {
                description:
                  'Compact card text. Independent from the full testimonial; not auto-filled from it.',
              },
            },
            {
              name: 'testimonialPreviewImage',
              type: 'upload',
              label: 'Testimonial Preview Image',
              relationTo: 'media',
              admin: {
                description:
                  'Existing Media collection. Portrait, company or project image. Optional.',
              },
            },
          ],
        },
        {
          label: 'Testimonial',
          fields: [
            {
              name: 'testimonial',
              type: 'richText',
              label: 'Testimonial',
              required: true,
              editor: defaultTiptap,
              admin: {
                description: 'Authentic client statement. Do not rewrite or invent wording.',
              },
            },
          ],
        },
        {
          label: 'Client',
          fields: [
            {
              name: 'clientName',
              type: 'text',
              label: 'Client Name',
            },
            {
              name: 'clientPosition',
              type: 'text',
              label: 'Client Position',
            },
            {
              name: 'clientCompany',
              type: 'text',
              label: 'Company',
            },
            {
              name: 'clientCompanyWebsite',
              type: 'text',
              label: 'Company Website',
            },
            {
              name: 'clientLocation',
              type: 'text',
              label: 'Location',
            },
          ],
        },
        {
          label: 'Project Context',
          fields: [
            {
              name: 'projectContext',
              type: 'textarea',
              label: 'Project / Engagement',
            },
            {
              name: 'service',
              type: 'relationship',
              label: 'Service',
              relationTo: 'services',
              admin: {
                description: 'Existing Services collection. Optional.',
              },
            },
            {
              name: 'caseStudy',
              type: 'relationship',
              label: 'Case Study',
              relationTo: 'case-studies',
              admin: {
                description: 'Existing Case Study collection. Optional.',
              },
            },
          ],
        },
        {
          label: 'Classification',
          fields: [
            {
              name: 'testimonialType',
              type: 'select',
              label: 'Testimonial Type',
              options: [...TESTIMONIAL_TYPE_OPTIONS],
            },
            {
              name: 'site_categories',
              type: 'relationship',
              label: 'Site Categories',
              hasMany: true,
              relationTo: 'site-categories',
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                description:
                  'Existing 4D site taxonomy. No separate Testimonial category collection.',
              },
            },
          ],
        },
        {
          label: 'Source',
          fields: [
            {
              name: 'sourceType',
              type: 'select',
              label: 'Source Type',
              options: [...TESTIMONIAL_SOURCE_TYPE_OPTIONS],
            },
            {
              name: 'sourceUrl',
              type: 'text',
              label: 'Source URL',
            },
            {
              name: 'verified',
              type: 'checkbox',
              label: 'Verified',
              defaultValue: false,
              admin: {
                description: 'Never set automatically.',
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
    {
      name: 'testimonialDate',
      type: 'date',
      label: 'Testimonial Date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
        description: 'Date of the original statement. Separate from createdAt.',
      },
    },
    {
      name: 'rating',
      type: 'select',
      label: 'Rating',
      options: [...TESTIMONIAL_RATING_OPTIONS],
      admin: {
        position: 'sidebar',
        description: 'Optional. Leave empty when there is no rating. Do not default to 5.',
      },
    },
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
    slugField({
      required: true,
      useAsSlug: 'title',
    }),
  ],
  hooks: {
    afterChange: [revalidateTestimonial],
    afterDelete: [revalidateTestimonialDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
