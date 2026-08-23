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
    defaultColumns: ['title', 'slug', 'updatedAt'],
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
    },
    {
      name: 'category_long_title',
      type: 'text',
      label: 'Длинный заголовок (H1)',
      required: true,
      admin: {
        description: 'Длинный основной заголовок категории. Используется как H1.',
      },
    },
    {
      name: 'category_description',
      type: 'richText',
      label: 'Описание категории',
      editor: defaultTiptap,
    },
    {
      name: 'category_image',
      type: 'upload',
      label: 'Изображение категории',
      relationTo: 'media',
      admin: {
        description: 'Изображение для превью категории в карточках и списках.',
      },
    },
    {
      name: 'relatedPosts',
      type: 'join',
      label: 'Посты в этой категории',
      collection: 'posts',
      on: 'categories',
      admin: {
        allowCreate: false,
        defaultColumns: ['title', 'slug', 'updatedAt'],
        description: 'Посты, связанные с этой категорией через существующее поле Categories у Post.',
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
  hooks: {
    beforeChange: [rejectReservedCategorySlug],
    afterChange: [revalidateCategory],
    afterDelete: [revalidateCategoryDelete],
  },
}
