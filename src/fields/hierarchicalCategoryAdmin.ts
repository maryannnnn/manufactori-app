import type { CollectionConfig } from 'payload'

import {
  categoryHierarchyHooks,
} from '@/hooks/categoryHierarchyHooks'
import { hierarchicalCategoryTitleCellPath } from '@/fields/hierarchicalCategoryRelationship'

/** Shared admin list/table settings for nested category collections. */
export const hierarchicalCategoryAdmin = {
  enableListViewSelectAPI: true,
  pagination: {
    defaultLimit: 500,
    limits: [25, 50, 100, 250, 500],
  },
} satisfies Partial<CollectionConfig['admin']>

export const hierarchicalCategoryForceSelect = {
  breadcrumbs: true,
  parent: true,
} satisfies CollectionConfig['forceSelect']

export const hierarchicalCategoryTitleField = {
  admin: {
    components: {
      Cell: hierarchicalCategoryTitleCellPath,
    },
  },
}

export const hierarchicalCategoryCollectionHooks = {
  beforeOperation: [categoryHierarchyHooks.prepareCategoryHierarchyQuery],
  afterRead: [categoryHierarchyHooks.decorateCategoryHierarchyRead],
  afterOperation: [categoryHierarchyHooks.reorderCategoryFindResults],
} satisfies CollectionConfig['hooks']
