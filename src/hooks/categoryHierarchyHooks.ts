import type {
  CollectionAfterOperationHook,
  CollectionAfterReadHook,
  CollectionBeforeOperationHook,
} from 'payload'

import {
  buildTreeOrder,
  formatHierarchicalLabel,
  getCategoryDepth,
  type CategoryTreeDoc,
} from '@/utilities/categoryHierarchy'

const isAdminMethodOverrideFetch = (req: { headers?: { get?: (name: string) => string | null } }): boolean =>
  req.headers?.get?.('x-payload-http-method-override')?.toLowerCase() === 'get'

/**
 * Reusable admin hooks for any nested-docs hierarchical category collection.
 * Attach the same trio to categories, site-categories, case-study-categories, etc.
 */
export const categoryHierarchyHooks = {
  prepareCategoryHierarchyQuery: (({ args, operation, req }) => {
    if (operation !== 'find' || !isAdminMethodOverrideFetch(req)) {
      return args
    }

    const select = args.select
    if (!select || typeof select !== 'object') {
      return args
    }

    const selectKeys = Object.keys(select)
    const isRelationshipOptions = select.title === true && selectKeys.length === 1

    if (isRelationshipOptions) {
      req.context.categoryHierarchyDisplay = 'relationship-options'
      req.context.reorderCategoryTree = true
      args.select = {
        title: true,
        breadcrumbs: true,
        parent: true,
      }
      return args
    }

    if (select.slug && select.updatedAt) {
      req.context.reorderCategoryTree = true
      if (!select.breadcrumbs) {
        args.select = {
          ...select,
          breadcrumbs: true,
          parent: true,
        }
      }
    }

    return args
  }) as CollectionBeforeOperationHook,

  decorateCategoryHierarchyRead: (({ doc, req }) => {
    if (req.context?.categoryHierarchyDisplay !== 'relationship-options') {
      return doc
    }

    const category = doc as CategoryTreeDoc
    const title = String(category.title ?? '')
    const depth = getCategoryDepth(category)

    return {
      ...doc,
      title: formatHierarchicalLabel(title, depth),
    }
  }) as CollectionAfterReadHook,

  reorderCategoryFindResults: (({ operation, result, req }) => {
    if (operation !== 'find' || !req.context?.reorderCategoryTree) {
      return result
    }

    if (!result?.docs?.length || result.totalDocs > result.docs.length) {
      return result
    }

    return {
      ...result,
      docs: buildTreeOrder(result.docs as CategoryTreeDoc[]),
    }
  }) as CollectionAfterOperationHook,
}

export const {
  prepareCategoryHierarchyQuery,
  decorateCategoryHierarchyRead,
  reorderCategoryFindResults,
} = categoryHierarchyHooks
