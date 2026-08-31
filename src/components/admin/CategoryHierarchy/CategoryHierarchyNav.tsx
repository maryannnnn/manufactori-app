'use client'

import React, { useMemo } from 'react'
import { Button } from '@payloadcms/ui'

import {
  defaultCategoryHierarchyFilterState,
  getDrillDownColumnItems,
  isDrillDownColumnEnabled,
  type CategoryBranchItem,
  type CategoryHierarchyFilterState,
  type CategoryIndex,
} from '@/utilities/categoryHierarchy'

import './CategoryHierarchyNav.scss'

const baseClass = 'category-hierarchy-nav'

const COLUMN_META: Array<{ index: 0 | 1 | 2; title: string; placeholder: string }> = [
  { index: 0, title: 'Level 1 — Roots', placeholder: 'No root categories' },
  { index: 1, title: 'Level 2 — Groups', placeholder: 'Select a root category first' },
  { index: 2, title: 'Level 3 — Topics', placeholder: 'Select a group first' },
]

type CategoryHierarchyNavProps = {
  branchPath: CategoryBranchItem[]
  compact?: boolean
  index: CategoryIndex
  loading?: boolean
  onBranchPathChange: (path: CategoryBranchItem[]) => void
  onClear: () => void
}

export const CategoryHierarchyNav: React.FC<CategoryHierarchyNavProps> = ({
  branchPath,
  compact = false,
  index,
  loading = false,
  onBranchPathChange,
  onClear,
}) => {
  const columns = useMemo(
    () =>
      COLUMN_META.map((meta) => ({
        ...meta,
        enabled: isDrillDownColumnEnabled(branchPath, meta.index),
        items: getDrillDownColumnItems(index, branchPath, meta.index),
        selectedId: branchPath[meta.index]?.id ?? null,
      })),
    [branchPath, index],
  )

  const hasActiveFilters = branchPath.length > 0

  const handleItemClick = (columnIndex: 0 | 1 | 2, item: CategoryBranchItem) => {
    onBranchPathChange([...branchPath.slice(0, columnIndex), item])
  }

  const handleBreadcrumbClick = (indexToKeep: number) => {
    if (indexToKeep < 0) {
      onBranchPathChange([])
      return
    }
    onBranchPathChange(branchPath.slice(0, indexToKeep + 1))
  }

  const handleBack = () => {
    if (branchPath.length === 0) return
    onBranchPathChange(branchPath.slice(0, -1))
  }

  const tableHint =
    branchPath.length === 0
      ? 'Showing root categories (Level 1). Pick a root to browse its groups.'
      : branchPath.length === 1
        ? `Showing groups under “${branchPath[0].title}”. Pick a group to browse topics.`
        : branchPath.length === 2
          ? `Showing topics under “${branchPath[1].title}”.`
          : `Showing “${branchPath[branchPath.length - 1]?.title}”.`

  return (
    <div className={[baseClass, compact ? `${baseClass}--compact` : ''].filter(Boolean).join(' ')}>
      <div className={`${baseClass}__intro`}>
        <span className={`${baseClass}__intro-title`}>Browse categories</span>
        <span className={`${baseClass}__intro-hint`}>{tableHint}</span>
      </div>

      <div className={`${baseClass}__columns`}>
        {columns.map((column) => (
          <div
            key={column.index}
            className={[
              `${baseClass}__column`,
              column.enabled ? '' : `${baseClass}__column--disabled`,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={`${baseClass}__column-title`}>{column.title}</div>
            <ul className={`${baseClass}__column-list`} role="listbox">
              {!column.enabled || column.items.length === 0 ? (
                <li className={`${baseClass}__column-empty`}>{column.placeholder}</li>
              ) : (
                column.items.map((item) => {
                  const isSelected = column.selectedId === item.id
                  return (
                    <li key={item.id}>
                      <button
                        aria-selected={isSelected}
                        className={[
                          `${baseClass}__column-item`,
                          isSelected ? `${baseClass}__column-item--active` : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        disabled={loading || !column.enabled}
                        onClick={() => handleItemClick(column.index, item)}
                        role="option"
                        type="button"
                      >
                        {item.title}
                      </button>
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        ))}
      </div>

      <div className={`${baseClass}__row ${baseClass}__row--breadcrumbs`}>
        <span className={`${baseClass}__label`}>Path</span>
        <nav aria-label="Category hierarchy" className={`${baseClass}__breadcrumbs`}>
          <button
            className={`${baseClass}__crumb${branchPath.length === 0 ? ` ${baseClass}__crumb--active` : ''}`}
            onClick={() => handleBreadcrumbClick(-1)}
            type="button"
          >
            All roots
          </button>
          {branchPath.map((item, itemIndex) => (
            <React.Fragment key={item.id}>
              <span className={`${baseClass}__separator`}>/</span>
              <button
                className={[
                  `${baseClass}__crumb`,
                  itemIndex === branchPath.length - 1 ? `${baseClass}__crumb--active` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleBreadcrumbClick(itemIndex)}
                type="button"
              >
                {item.title}
              </button>
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className={`${baseClass}__actions`}>
        <Button buttonStyle="secondary" disabled={branchPath.length === 0 || loading} onClick={handleBack}>
          Back
        </Button>
        <Button buttonStyle="secondary" disabled={!hasActiveFilters || loading} onClick={onClear}>
          Reset browse
        </Button>
      </div>
    </div>
  )
}

export const useCategoryHierarchyFilterState = () => {
  const [filters, setFilters] = React.useState<CategoryHierarchyFilterState>(
    defaultCategoryHierarchyFilterState(),
  )

  const setBranchPath = (branchPath: CategoryBranchItem[]) => {
    setFilters({ branchPath })
  }

  const clearFilters = () => {
    setFilters(defaultCategoryHierarchyFilterState())
  }

  return {
    branchPath: filters.branchPath,
    clearFilters,
    filters,
    setBranchPath,
  }
}
