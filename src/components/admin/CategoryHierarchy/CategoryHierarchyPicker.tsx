'use client'

import React, { useMemo } from 'react'

import {
  computeVisibleCategoryIds,
  formatHierarchicalLabel,
  getCategoryDepthFromIndex,
} from '@/utilities/categoryHierarchy'
import type { CategoryCollectionSlug } from '@/utilities/categoryTypes'

import {
  CategoryHierarchyNav,
  useCategoryHierarchyFilterState,
} from './CategoryHierarchyNav'
import { useHierarchicalCategoryTree } from './useHierarchicalCategoryTree'

import './CategoryHierarchyNav.scss'

const baseClass = 'category-hierarchy-picker'

export type CategoryHierarchyPickerMode = 'single' | 'multiple'

type CategoryHierarchyPickerProps = {
  collectionSlug: CategoryCollectionSlug | string
  mode: CategoryHierarchyPickerMode
  onChange: (ids: Array<number | string>) => void
  readOnly?: boolean
  selectedIds: Array<number | string>
  selectedLabel?: string
  pickHintSingle?: string
  pickHintMultiple?: string
}

const normalizeSelected = (ids: Array<number | string>): string[] =>
  ids.map((id) => String(id))

export const CategoryHierarchyPicker: React.FC<CategoryHierarchyPickerProps> = ({
  collectionSlug,
  mode,
  onChange,
  pickHintMultiple = 'Click categories below to add them. You can select several.',
  pickHintSingle = 'Click a category below to select one.',
  readOnly = false,
  selectedIds,
  selectedLabel,
}) => {
  const { categories, index, loading } = useHierarchicalCategoryTree(collectionSlug)
  const { branchPath, clearFilters, setBranchPath } = useCategoryHierarchyFilterState()

  const selectedSet = useMemo(() => new Set(normalizeSelected(selectedIds)), [selectedIds])

  const visibleIds = useMemo(
    () => computeVisibleCategoryIds(categories, { branchPath }),
    [branchPath, categories],
  )

  const pickItems = useMemo(() => {
    return visibleIds
      .map((id) => {
        const doc = index.byId.get(String(id))
        if (!doc) return null
        const depth = getCategoryDepthFromIndex(doc, index)
        return {
          depth,
          id: String(id),
          label: formatHierarchicalLabel(String(doc.title ?? ''), depth),
          title: String(doc.title ?? ''),
        }
      })
      .filter((item): item is NonNullable<typeof item> => item != null)
  }, [index, visibleIds])

  const selectedItems = useMemo(() => {
    return selectedIds
      .map((id) => {
        const doc = index.byId.get(String(id))
        if (!doc) {
          return { depth: 0, id: String(id), label: `Category #${id}`, title: `Category #${id}` }
        }
        const depth = getCategoryDepthFromIndex(doc, index)
        return {
          depth,
          id: String(id),
          label: formatHierarchicalLabel(String(doc.title ?? ''), depth),
          title: String(doc.title ?? ''),
        }
      })
      .filter(Boolean)
  }, [index, selectedIds])

  const handlePick = (id: string) => {
    if (readOnly) return

    const rawId = Number(id)
    const normalizedId = Number.isNaN(rawId) ? id : rawId

    if (mode === 'single') {
      onChange([normalizedId])
      return
    }

    if (selectedSet.has(id)) return
    onChange([...selectedIds, normalizedId])
  }

  const handleRemove = (id: string) => {
    if (readOnly) return
    onChange(selectedIds.filter((itemId) => String(itemId) !== id))
  }

  const resolvedSelectedLabel =
    selectedLabel ?? (mode === 'single' ? 'Selected category' : 'Selected categories')

  const pickHint = mode === 'single' ? pickHintSingle : pickHintMultiple

  return (
    <div className={baseClass}>
      <CategoryHierarchyNav
        branchPath={branchPath}
        compact
        index={index}
        loading={loading}
        onBranchPathChange={setBranchPath}
        onClear={clearFilters}
      />

      <div className={`${baseClass}__selected`}>
        <div className={`${baseClass}__selected-label`}>{resolvedSelectedLabel}</div>
        {selectedItems.length === 0 ? (
          <div className={`${baseClass}__selected-empty`}>
            {mode === 'single' ? 'None selected yet' : 'No categories added yet'}
          </div>
        ) : (
          <ul className={`${baseClass}__chips`}>
            {selectedItems.map((item) => (
              <li key={item.id} className={`${baseClass}__chip`}>
                <span className={`${baseClass}__chip-label`}>{item.label}</span>
                {!readOnly && (
                  <button
                    aria-label={`Remove ${item.title}`}
                    className={`${baseClass}__chip-remove`}
                    onClick={() => handleRemove(item.id)}
                    type="button"
                  >
                    ×
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={`${baseClass}__pick`}>
        <div className={`${baseClass}__pick-header`}>
          <span className={`${baseClass}__pick-title`}>Choose from current view</span>
          <span className={`${baseClass}__pick-hint`}>{pickHint}</span>
        </div>

        {loading ? (
          <div className={`${baseClass}__pick-empty`}>Loading categories…</div>
        ) : pickItems.length === 0 ? (
          <div className={`${baseClass}__pick-empty`}>
            No categories at this step. Use the columns above to browse deeper.
          </div>
        ) : (
          <ul className={`${baseClass}__pick-list`}>
            {pickItems.map((item) => {
              const isSelected = selectedSet.has(item.id)
              const isSingleActive = mode === 'single' && isSelected

              return (
                <li key={item.id}>
                  <button
                    className={[
                      `${baseClass}__pick-item`,
                      isSingleActive ? `${baseClass}__pick-item--active` : '',
                      mode === 'multiple' && isSelected ? `${baseClass}__pick-item--added` : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    disabled={readOnly || (mode === 'multiple' && isSelected)}
                    onClick={() => handlePick(item.id)}
                    type="button"
                  >
                    <span className={`${baseClass}__pick-item-label`}>{item.label}</span>
                    <span className={`${baseClass}__pick-item-action`}>
                      {mode === 'single'
                        ? isSelected
                          ? 'Selected'
                          : 'Select'
                        : isSelected
                          ? 'Added'
                          : '+ Add'}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
