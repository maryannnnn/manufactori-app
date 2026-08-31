'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import type { Where } from 'payload'
import { useListQuery } from '@payloadcms/ui'

import {
  buildHierarchyWhere,
  computeVisibleCategoryIds,
  mergeWhereClauses,
  stripHierarchyWhere,
} from '@/utilities/categoryHierarchy'
import type { CategoryCollectionSlug } from '@/utilities/categoryTypes'

import {
  CategoryHierarchyNav,
  useCategoryHierarchyFilterState,
} from './CategoryHierarchyNav'
import { useHierarchicalCategoryTree } from './useHierarchicalCategoryTree'

import './CategoryHierarchyNav.scss'

type HierarchicalCategoryListNavProps = {
  collectionSlug: CategoryCollectionSlug | string
}

export const HierarchicalCategoryListNav: React.FC<HierarchicalCategoryListNavProps> = ({
  collectionSlug,
}) => {
  const { categories, index, loading } = useHierarchicalCategoryTree(collectionSlug)
  const { branchPath, clearFilters, setBranchPath } = useCategoryHierarchyFilterState()
  const { query, refineListData } = useListQuery()

  const nonHierarchyWhereRef = useRef<Where | undefined>(undefined)
  const lastAppliedKeyRef = useRef<string>('')
  const queryWhereRef = useRef(query?.where)
  queryWhereRef.current = query?.where

  const applyHierarchyFilter = useCallback(() => {
    if (!categories.length) return

    const filterKey = JSON.stringify({ branchPath, collectionSlug, count: categories.length })
    if (filterKey === lastAppliedKeyRef.current) return
    lastAppliedKeyRef.current = filterKey

    const strippedWhere = stripHierarchyWhere(queryWhereRef.current as Where | undefined)
    if (strippedWhere && Object.keys(strippedWhere).length > 0) {
      nonHierarchyWhereRef.current = strippedWhere
    }

    const visibleIds = computeVisibleCategoryIds(categories, { branchPath })
    const hierarchyWhere = buildHierarchyWhere(visibleIds, categories.length)
    const mergedWhere = mergeWhereClauses(nonHierarchyWhereRef.current, hierarchyWhere)

    refineListData({
      page: 1,
      where: mergedWhere,
    })
  }, [branchPath, categories, collectionSlug, refineListData])

  useEffect(() => {
    applyHierarchyFilter()
  }, [applyHierarchyFilter])

  const handleClear = () => {
    clearFilters()
    lastAppliedKeyRef.current = ''
    refineListData({
      page: 1,
      where: nonHierarchyWhereRef.current,
    })
  }

  return (
    <CategoryHierarchyNav
      branchPath={branchPath}
      index={index}
      loading={loading}
      onBranchPathChange={setBranchPath}
      onClear={handleClear}
    />
  )
}

/** Post Categories list filter (Blog → Categories). */
export const CategoryHierarchyListNav: React.FC = () => (
  <HierarchicalCategoryListNav collectionSlug="categories" />
)

/** Site Categories list filter. */
export const SiteCategoryHierarchyListNav: React.FC = () => (
  <HierarchicalCategoryListNav collectionSlug="site-categories" />
)

/** Case Study Categories list filter. */
export const CaseStudyCategoryHierarchyListNav: React.FC = () => (
  <HierarchicalCategoryListNav collectionSlug="case-study-categories" />
)
