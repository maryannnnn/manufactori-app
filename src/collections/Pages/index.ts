import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Code } from '../../blocks/Code/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { PagePreviewBlock } from '../../blocks/PagePreviewBlock/config'
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a page is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'pages'>
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'pageLongTitle',
      type: 'text',
      label: 'Длинный заголовок (H1)',
      required: true,
      admin: {
        description: 'Длинный основной заголовок страницы. Используется как H1.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                PagePreviewBlock,
                Code,
              ],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
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
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField({
      required: true,
      overrides: (field) => {
        field.fields = field.fields.map((subfield) => {
          if ('name' in subfield && subfield.name === 'generateSlug' && subfield.type === 'checkbox') {
            return {
              ...subfield,
              defaultValue: false,
              hooks: {
                beforeChange: [() => false],
              },
            }
          }

          if ('name' in subfield && subfield.name === 'slug' && subfield.type === 'text') {
            const { components: _components, ...restAdmin } = subfield.admin || {}

            return {
              ...subfield,
              unique: true,
              index: true,
              required: true,
              minLength: 1,
              label: 'Slug',
              admin: {
                ...restAdmin,
                description:
                  'Короткий сегмент URL сразу после домена, например: about, services, manufacturing. Задаётся вручную и не зависит от заголовка.',
              },
              validate: (value: unknown) => {
                if (typeof value !== 'string' || value.trim() === '') {
                  return 'Slug обязателен'
                }
                return true
              },
              hooks: {
                beforeValidate: [
                  ({ value }) => {
                    if (typeof value !== 'string') return value
                    return value
                      .trim()
                      .replace(/ /g, '-')
                      .replace(/[^\w-]+/g, '')
                      .toLowerCase()
                  },
                ],
              },
            }
          }

          return subfield
        })

        return field
      },
    }),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
