import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { Archive } from '../blocks/ArchiveBlock/config'
import { CallToAction } from '../blocks/CallToAction/config'
import { Code } from '../blocks/Code/config'
import { Content } from '../blocks/Content/config'
import { FormBlock } from '../blocks/Form/config'
import { MediaBlock } from '../blocks/MediaBlock/config'
import { defaultTiptap } from '@/fields/defaultTiptap'
import { generatePreviewPath } from '../utilities/generatePreviewPath'
import {
  revalidateCaseStudyCategory,
  revalidateCaseStudyCategoryDelete,
} from '../hooks/revalidateCaseStudyCategory'
import { rejectReservedCaseStudyCategorySlug } from '../hooks/rejectReservedCaseStudyCategorySlug'
import {
  hierarchicalCategoryAdmin,
  hierarchicalCategoryCollectionHooks,
  hierarchicalCategoryForceSelect,
  hierarchicalCategoryTitleField,
} from '@/fields/hierarchicalCategoryAdmin'
import { hierarchicalCategoryListNavPaths } from '@/fields/hierarchicalCategoryRelationship'

/**
 * Case Study Categories — mirrors Blog Categories (`categories`) for case-study archives.
 */
export const CaseStudyCategories: CollectionConfig = {
  slug: 'case-study-categories',
  // Short DB name: Postgres identifier limit is 63 chars for nested block enums/tables.
  dbName: 'csc',
  labels: {
    singular: 'Case Study Category',
    plural: 'Case Study Categories',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Case Studies',
    description: 'Thematic categories for case studies. Separate from Blog Categories.',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    ...hierarchicalCategoryAdmin,
    components: {
      beforeListTable: [hierarchicalCategoryListNavPaths.caseStudy],
    },
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'case-study-categories',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'case-study-categories',
        req,
      }),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    title: true,
    slug: true,
    case_study_image: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      ...hierarchicalCategoryTitleField,
    },
    {
      name: 'case_study_long_title',
      type: 'text',
      label: 'Long title (H1)',
      required: true,
      admin: {
        description: 'Longer category heading used as the H1 on the category page.',
      },
    },
    {
      name: 'case_study_description',
      type: 'richText',
      label: 'Category description',
      editor: defaultTiptap,
    },
    {
      name: 'case_study_image',
      type: 'upload',
      label: 'Category image',
      relationTo: 'media',
      admin: {
        description: 'Image for category cards and archive pages.',
      },
    },
    {
      name: 'relatedCaseStudies',
      type: 'join',
      label: 'Case Studies in this category',
      collection: 'case-studies',
      on: 'case_study_categories',
      admin: {
        allowCreate: false,
        defaultColumns: ['title', 'slug', 'updatedAt'],
        description: 'Case studies linked through Case Study Categories.',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Layout',
      admin: {
        description: 'Additional content below the case study list for this category.',
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
    beforeChange: [rejectReservedCaseStudyCategorySlug],
    ...hierarchicalCategoryCollectionHooks,
    afterChange: [revalidateCaseStudyCategory],
    afterDelete: [revalidateCaseStudyCategoryDelete],
  },
  forceSelect: hierarchicalCategoryForceSelect,
}
