'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { buildCategoryIndex, type CategoryTreeDoc } from '@/utilities/categoryHierarchy'
import type { CategoryCollectionSlug } from '@/utilities/categoryTypes'

type CategoryTreeResponse = {
  docs?: CategoryTreeDoc[]
  totalDocs?: number
}

const TREE_FETCH_LIMIT = 5000

export const useHierarchicalCategoryTree = (collectionSlug: CategoryCollectionSlug | string) => {
  const [categories, setCategories] = useState<CategoryTreeDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        depth: '0',
        limit: String(TREE_FETCH_LIMIT),
        pagination: 'false',
        sort: 'title',
        'select[title]': 'true',
        'select[slug]': 'true',
        'select[parent]': 'true',
        'select[breadcrumbs]': 'true',
      })

      const response = await fetch(`/api/${collectionSlug}?${params.toString()}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`Failed to load ${collectionSlug}`)
      }

      const data = (await response.json()) as CategoryTreeResponse
      const docs = data.docs || []

      if (data.totalDocs && docs.length < data.totalDocs) {
        console.warn(
          `[CategoryHierarchy] Loaded ${docs.length}/${data.totalDocs} from ${collectionSlug}. Increase TREE_FETCH_LIMIT.`,
        )
      }

      setCategories(docs)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : `Failed to load ${collectionSlug}`)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [collectionSlug])

  useEffect(() => {
    void reload()
  }, [reload])

  const index = useMemo(() => buildCategoryIndex(categories), [categories])

  return {
    categories,
    collectionSlug,
    error,
    index,
    loading,
    reload,
  }
}

/** @deprecated Use useHierarchicalCategoryTree('categories') */
export const useCategoryTree = () => useHierarchicalCategoryTree('categories')
