import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import {
  hierarchicalCategoryAdmin,
  hierarchicalCategoryCollectionHooks,
  hierarchicalCategoryForceSelect,
  hierarchicalCategoryTitleField,
} from '@/fields/hierarchicalCategoryAdmin'
import { hierarchicalCategoryListNavPaths } from '@/fields/hierarchicalCategoryRelationship'

/**
 * Unified site taxonomy tree (non-public, relationship-only).
 * Parent/child hierarchy mirrors Post Categories structure.
 */
export const SiteCategories: CollectionConfig = {
  slug: 'site-categories',
  labels: {
    singular: 'Site Category',
    plural: 'Site Categories',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Site',
    description:
      'Internal site structure tree (parent/child). Used for taxonomy and relationships — not public pages.',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    ...hierarchicalCategoryAdmin,
    components: {
      beforeListTable: [hierarchicalCategoryListNavPaths.site],
    },
  },
  forceSelect: hierarchicalCategoryForceSelect,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      ...hierarchicalCategoryTitleField,
    },
    slugField({
      position: undefined,
      required: true,
      useAsSlug: 'title',
    }),
  ],
  hooks: hierarchicalCategoryCollectionHooks,
}
