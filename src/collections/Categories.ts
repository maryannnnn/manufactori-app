import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { Archive } from '../blocks/ArchiveBlock/config'
import { CallToAction } from '../blocks/CallToAction/config'
import { Code } from '../blocks/Code/config'
import { Content } from '../blocks/Content/config'
import { FormBlock } from '../blocks/Form/config'
import { MediaBlock } from '../blocks/MediaBlock/config'
import { defaultTiptap } from '@/fields/defaultTiptap'
import { slugField } from 'payload'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import {
  decorateCategoryHierarchyRead,
  prepareCategoryHierarchyQuery,
  reorderCategoryFindResults,
} from '../hooks/categoryHierarchyHooks'
import { hierarchicalCategoryListNavPaths } from '@/fields/hierarchicalCategoryRelationship'
import {
  hierarchicalCategoryAdmin,
  hierarchicalCategoryForceSelect,
  hierarchicalCategoryTitleField,
} from '@/fields/hierarchicalCategoryAdmin'
import { revalidateCategory, revalidateCategoryDelete } from '../hooks/revalidateCategory'
import { rejectReservedCategorySlug } from '../hooks/rejectReservedCategorySlug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Blog',
    description: 'Thematic categories for blog articles. Not a substitute for Services, Industries, or Solutions.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    enableListViewSelectAPI: true,
    components: {
      beforeListTable: [hierarchicalCategoryListNavPaths.post],
    },
    pagination: hierarchicalCategoryAdmin.pagination,
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'categories',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'categories',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    category_image: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      ...hierarchicalCategoryTitleField,
    },
    {
      name: 'category_long_title',
      type: 'text',
      label: 'Long title (H1)',
      required: true,
      admin: {
        description: 'Longer category heading used as the H1 on the category page.',
      },
    },
    {
      name: 'category_description',
      type: 'richText',
      label: 'Category description',
      editor: defaultTiptap,
    },
    {
      name: 'category_image',
      type: 'upload',
      label: 'Category image',
      relationTo: 'media',
      admin: {
        description: 'Image for category cards and archive pages.',
      },
    },
    {
      name: 'relatedPosts',
      type: 'join',
      label: 'Posts in this category',
      collection: 'posts',
      on: 'categories',
      admin: {
        allowCreate: false,
        defaultColumns: ['title', 'slug', 'updatedAt'],
        description: 'Posts linked through the existing Categories field on Post.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Layout',
      admin: {
        description: 'Дополнительный контент под списком постов категории.',
        initCollapsed: true,
      },
      blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, Code],
    },
    slugField({
      position: undefined,
      required: true,
      useAsSlug: 'title',
    }),
  ],
  forceSelect: hierarchicalCategoryForceSelect,
  hooks: {
    beforeChange: [rejectReservedCategorySlug],
    beforeOperation: [prepareCategoryHierarchyQuery],
    afterChange: [revalidateCategory],
    afterDelete: [revalidateCategoryDelete],
    afterRead: [decorateCategoryHierarchyRead],
    afterOperation: [reorderCategoryFindResults],
  },
}
