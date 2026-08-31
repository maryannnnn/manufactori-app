'use client'

import type { RelationshipFieldClientComponent, RelationshipValue, Validate } from 'payload'

import { FieldDescription, FieldError, FieldLabel, useField, withCondition } from '@payloadcms/ui'
import React, { useCallback, useMemo } from 'react'

import type { CategoryCollectionSlug } from '@/utilities/categoryTypes'

import { CategoryHierarchyPicker } from './CategoryHierarchyPicker'

import './CategoryHierarchyNav.scss'

const baseClass = 'category-hierarchy-field'

const toIdList = (value: RelationshipValue | null | undefined, hasMany: boolean): Array<number | string> => {
  if (value == null || value === '') return []

  if (hasMany) {
    if (!Array.isArray(value)) return []
    return value.filter((item) => item != null && item !== '') as Array<number | string>
  }

  if (Array.isArray(value)) {
    const first = value[0]
    return first != null && first !== '' ? [first as number | string] : []
  }

  return [value as number | string]
}

const resolveRelationCollection = (relationTo: unknown): CategoryCollectionSlug | string => {
  if (typeof relationTo === 'string') return relationTo
  if (Array.isArray(relationTo) && typeof relationTo[0] === 'string') return relationTo[0]
  return 'categories'
}

const HierarchicalCategoryRelationshipFieldComponent: RelationshipFieldClientComponent = (props) => {
  const {
    field: {
      admin: { description } = {},
      hasMany,
      label,
      relationTo,
      required,
    },
    path: pathFromProps,
    readOnly,
    validate,
  } = props

  const isMulti = hasMany === true
  const collectionSlug = resolveRelationCollection(relationTo)

  const memoizedValidate = useCallback(
    (fieldValue: RelationshipValue | null | undefined, validationOptions: Record<string, unknown>) => {
      if (typeof validate === 'function') {
        return validate(fieldValue, {
          ...validationOptions,
          required,
        } as Parameters<NonNullable<typeof validate>>[1])
      }
      return true
    },
    [validate, required],
  )

  const {
    disabled,
    errorMessage,
    path,
    setValue,
    showError,
    value,
  } = useField<RelationshipValue | null | undefined>({
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate as Validate,
  })

  const selectedIds = useMemo(() => toIdList(value, isMulti), [isMulti, value])

  const handleChange = useCallback(
    (ids: Array<number | string>) => {
      if (isMulti) {
        setValue(ids.length ? ids : null)
        return
      }

      setValue(ids[0] ?? null)
    },
    [isMulti, setValue],
  )

  const pickerHints = useMemo(() => {
    if (collectionSlug === 'site-categories') {
      return {
        pickHintMultiple:
          'Click categories below to add site taxonomy nodes. You can select several from different branches.',
        pickHintSingle: 'Click a category below to select one site taxonomy node.',
        selectedLabel: isMulti ? 'Selected site categories' : 'Selected site category',
      }
    }

    if (collectionSlug === 'case-study-categories') {
      return {
        pickHintMultiple: 'Click categories below to add case study categories.',
        pickHintSingle: 'Click a category below to select one case study category.',
        selectedLabel: isMulti ? 'Selected case study categories' : 'Selected case study category',
      }
    }

    return {
      pickHintMultiple: 'Click categories below to add them to this post. You can select several.',
      pickHintSingle: 'Click a category below to set it as the primary category (one only).',
      selectedLabel: isMulti ? 'Selected categories' : 'Selected primary category',
    }
  }, [collectionSlug, isMulti])

  return (
    <div className={baseClass}>
      <FieldLabel label={label} path={path} required={required} />
      <FieldDescription description={description} path={path} />

      <CategoryHierarchyPicker
        collectionSlug={collectionSlug}
        mode={isMulti ? 'multiple' : 'single'}
        onChange={handleChange}
        pickHintMultiple={pickerHints.pickHintMultiple}
        pickHintSingle={pickerHints.pickHintSingle}
        readOnly={readOnly || disabled}
        selectedIds={selectedIds}
        selectedLabel={pickerHints.selectedLabel}
      />

      <FieldError message={errorMessage} showError={showError} />
    </div>
  )
}

export const HierarchicalCategoryRelationshipField = withCondition(
  HierarchicalCategoryRelationshipFieldComponent,
)
