import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Code } from '../../blocks/Code/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { PostCommentsBlock } from '../../blocks/PostCommentsBlock/config'
import { PostContentBlock } from '../../blocks/PostContentBlock/config'
import { PostContentTitleBlock } from '../../blocks/PostContentTitleBlock/config'
import { PostFAQBlock } from '../../blocks/PostFAQBlock/config'
import { PostGalleryBlock } from '../../blocks/PostGalleryBlock/config'
import { PostPreviewBlock } from '../../blocks/PostPreviewBlock/config'
import { PostVideoBlock } from '../../blocks/PostVideoBlock/config'
import { hero } from '@/heros/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { ensurePrimaryCategoryInCategories } from './hooks/ensurePrimaryCategory'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
import { getCategorySlug } from '../../utilities/getContentUrls'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { hierarchicalCategoryRelationshipAdmin } from '@/fields/hierarchicalCategoryRelationship'
import { slugField } from 'payload'

export const Posts: CollectionConfig<'posts'> = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'posts'>
  defaultPopulate: {
    title: true,
    slug: true,
    categories: true,
    site_categories: true,
    primary_category: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: async ({ data, req }) => {
        const primary = data?.primary_category
        let categorySlug = getCategorySlug(primary)

        if (!categorySlug && (typeof primary === 'number' || typeof primary === 'string')) {
          const category = await req.payload.findByID({
            collection: 'categories',
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
          collection: 'posts',
          req,
        })
      },
    },
    preview: async (data, { req }) => {
      const primary = data?.primary_category
      let categorySlug = getCategorySlug(primary as Parameters<typeof getCategorySlug>[0])

      if (!categorySlug && (typeof primary === 'number' || typeof primary === 'string')) {
        const category = await req.payload.findByID({
          collection: 'categories',
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
        collection: 'posts',
        req,
      })
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'postLongTitle',
      type: 'text',
      label: 'Длинный заголовок (H1)',
      required: true,
      admin: {
        description: 'Длинный основной заголовок поста. Используется как H1.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              label: 'Layout',
              blocks: [
                PostPreviewBlock,
                PostContentBlock,
                PostContentTitleBlock,
                PostVideoBlock,
                PostGalleryBlock,
                PostCommentsBlock,
                PostFAQBlock,
                Code,
                CallToAction,
                MediaBlock,
                Archive,
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
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'primary_category',
              type: 'relationship',
              label: 'Primary Category',
              relationTo: 'categories',
              required: true,
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                allowCreate: false,
                position: 'sidebar',
                description:
                  'Used in the post URL: /blog/{primary-category-slug}/{post-slug}. Browse the tree and pick one category.',
              },
              validate: (value: unknown) => {
                if (value == null || value === '') {
                  return 'Primary Category is required'
                }
                return true
              },
            },
            {
              name: 'categories',
              type: 'relationship',
              label: 'Blog Categories',
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                allowCreate: false,
                position: 'sidebar',
                description:
                  'Blog topics for this article. Browse the tree and add one or more categories.',
              },
              hasMany: true,
              relationTo: 'categories',
            },
            {
              name: 'site_categories',
              type: 'relationship',
              label: 'Site Categories',
              admin: {
                ...hierarchicalCategoryRelationshipAdmin,
                position: 'sidebar',
                description:
                  'Site taxonomy nodes for this post (independent from Blog Categories). Browse the tree and add one or more.',
              },
              hasMany: true,
              relationTo: 'site-categories',
            },
          ],
          label: 'Meta',
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
              hasGenerateFn: true,
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
        date: {
          pickerAppearance: 'dayAndTime',
        },
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
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    slugField({
      required: true,
      useAsSlug: 'title',
    }),
  ],
  hooks: {
    beforeChange: [ensurePrimaryCategoryInCategories],
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
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
