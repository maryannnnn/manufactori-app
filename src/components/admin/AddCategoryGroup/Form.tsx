'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Banner, Button, toast } from '@payloadcms/ui'

import {
  CATEGORY_TYPE_OPTIONS,
  CATEGORY_TYPE_TO_COLLECTION,
  type CategoryType,
} from '@/utilities/categoryTypes'

import './index.scss'

type CategoryDoc = {
  id: number | string
  title: string
  slug: string
  parent?: number | string | { id: number | string } | null
}

type TreeOption = {
  id: number | string
  label: string
  depth: number
}

type CreateResult = {
  title: string
  status: 'created' | 'skipped' | 'error'
  reason?: string
  slug?: string
  id?: number | string
}

type ApiResponse = {
  message?: string
  summary?: { created: number; skipped: number; failed: number; total: number }
  results?: CreateResult[]
}

const emptyRows = (): string[] => ['', '', '']

const parentIdOf = (doc: CategoryDoc): number | string | null => {
  if (doc.parent == null) return null
  if (typeof doc.parent === 'object') return doc.parent.id
  return doc.parent
}

const buildTreeOptions = (docs: CategoryDoc[]): TreeOption[] => {
  const byParent = new Map<string, CategoryDoc[]>()

  for (const doc of docs) {
    const key = String(parentIdOf(doc) ?? 'root')
    const list = byParent.get(key) || []
    list.push(doc)
    byParent.set(key, list)
  }

  for (const list of byParent.values()) {
    list.sort((a, b) => a.title.localeCompare(b.title))
  }

  const options: TreeOption[] = []

  const walk = (parentKey: string, depth: number) => {
    const children = byParent.get(parentKey) || []
    for (const child of children) {
      const indent = depth > 0 ? `${'— '.repeat(depth)}` : ''
      options.push({
        id: child.id,
        label: `${indent}${child.title}`,
        depth,
      })
      walk(String(child.id), depth + 1)
    }
  }

  walk('root', 0)
  return options
}

const baseClass = 'add-category-group'

export const AddCategoryGroupForm: React.FC = () => {
  const [categoryType, setCategoryType] = useState<CategoryType>('post')
  const [parentId, setParentId] = useState<string>('')
  const [rows, setRows] = useState<string[]>(emptyRows)
  const [docs, setDocs] = useState<CategoryDoc[]>([])
  const [loadingTree, setLoadingTree] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<CreateResult[] | null>(null)
  const [summary, setSummary] = useState<ApiResponse['summary'] | null>(null)

  const collection = CATEGORY_TYPE_TO_COLLECTION[categoryType]
  const treeOptions = useMemo(() => buildTreeOptions(docs), [docs])

  const longTitleHint =
    categoryType === 'post'
      ? 'Also sets category_long_title (same as title). Editable later.'
      : categoryType === 'case-study'
        ? 'Also sets case_study_long_title (same as title). Editable later.'
        : 'Site Categories have no Long Title — only title + slug + parent.'

  const loadTree = useCallback(async (type: CategoryType) => {
    const slug = CATEGORY_TYPE_TO_COLLECTION[type]
    setLoadingTree(true)
    setResults(null)
    setSummary(null)

    try {
      const res = await fetch(
        `/api/${slug}?limit=1000&depth=0&pagination=false&sort=title`,
        { credentials: 'include' },
      )

      if (!res.ok) {
        throw new Error(`Failed to load ${slug}`)
      }

      const json = (await res.json()) as { docs?: CategoryDoc[] }
      setDocs(json.docs || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load categories'
      toast.error(message)
      setDocs([])
    } finally {
      setLoadingTree(false)
    }
  }, [])

  useEffect(() => {
    void loadTree(categoryType)
  }, [categoryType, loadTree])

  const onTypeChange = (value: CategoryType) => {
    setCategoryType(value)
    setParentId('')
    setRows(emptyRows())
  }

  const updateRow = (index: number, value: string) => {
    setRows((prev) => prev.map((row, i) => (i === index ? value : row)))
  }

  const removeRow = (index: number) => {
    setRows((prev) => (prev.length <= 1 ? [''] : prev.filter((_, i) => i !== index)))
  }

  const addRow = () => {
    setRows((prev) => [...prev, ''])
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const titles = rows.map((row) => row.trim()).filter(Boolean)

    if (titles.length === 0) {
      toast.error('Enter at least one category title')
      return
    }

    setSubmitting(true)
    setResults(null)
    setSummary(null)

    try {
      const res = await fetch('/api/bulk-create-categories', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryType,
          parentId: parentId || null,
          titles,
        }),
      })

      const json = (await res.json()) as ApiResponse

      if (!res.ok) {
        throw new Error(json.message || 'Create failed')
      }

      setResults(json.results || [])
      setSummary(json.summary || null)

      const created = json.summary?.created ?? 0
      const skipped = json.summary?.skipped ?? 0
      const failed = json.summary?.failed ?? 0

      if (created > 0) {
        toast.success(`Created ${created} categor${created === 1 ? 'y' : 'ies'}`)
        setRows(emptyRows())
        await loadTree(categoryType)
      } else {
        toast.info('No new categories created')
      }

      if (skipped > 0 || failed > 0) {
        toast.info(`Skipped ${skipped}, failed ${failed}`)
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Create failed'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={baseClass} onSubmit={onSubmit}>
      <p className={`${baseClass}__intro`}>
        Bulk-create categories into an existing collection. Uses the real Parent/Child tree from
        nested docs — no new category systems.
      </p>

      <label className={`${baseClass}__field`}>
        <span className={`${baseClass}__label`}>Category Type</span>
        <select
          className={`${baseClass}__select`}
          value={categoryType}
          onChange={(e) => onTypeChange(e.target.value as CategoryType)}
        >
          {CATEGORY_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={`${baseClass}__hint`}>Collection: {collection}</span>
      </label>

      <label className={`${baseClass}__field`}>
        <span className={`${baseClass}__label`}>Parent Category</span>
        <select
          className={`${baseClass}__select`}
          value={parentId}
          onChange={(e) => setParentId(e.target.value)}
          disabled={loadingTree}
        >
          <option value="">— None (top level) —</option>
          {treeOptions.map((option) => (
            <option key={String(option.id)} value={String(option.id)}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={`${baseClass}__hint`}>
          {loadingTree ? 'Loading tree…' : `${treeOptions.length} categories in this tree`}
        </span>
      </label>

      <div className={`${baseClass}__field`}>
        <span className={`${baseClass}__label`}>Categories</span>
        <span className={`${baseClass}__hint`}>{longTitleHint}</span>
        <div className={`${baseClass}__rows`}>
          {rows.map((row, index) => (
            <div className={`${baseClass}__row`} key={index}>
              <input
                className={`${baseClass}__input`}
                value={row}
                onChange={(e) => updateRow(index, e.target.value)}
                placeholder={`Category ${index + 1}`}
                autoComplete="off"
              />
              <Button
                buttonStyle="secondary"
                type="button"
                onClick={() => removeRow(index)}
                disabled={rows.length <= 1}
              >
                −
              </Button>
            </div>
          ))}
        </div>
        <Button buttonStyle="secondary" type="button" onClick={addRow}>
          + Add another category
        </Button>
      </div>

      <div className={`${baseClass}__actions`}>
        <Button type="submit" disabled={submitting || loadingTree}>
          {submitting ? 'Creating…' : 'Create Categories'}
        </Button>
      </div>

      {summary && (
        <Banner type={summary.failed > 0 ? 'error' : 'success'} className={`${baseClass}__banner`}>
          Created {summary.created}, skipped {summary.skipped}, failed {summary.failed} (total{' '}
          {summary.total})
        </Banner>
      )}

      {results && results.length > 0 && (
        <ul className={`${baseClass}__results`}>
          {results.map((result, index) => (
            <li key={`${result.title}-${index}`} data-status={result.status}>
              <strong>{result.title}</strong>
              {result.status === 'created' && <> — created ({result.slug})</>}
              {result.status === 'skipped' && <> — skipped: {result.reason}</>}
              {result.status === 'error' && <> — error: {result.reason}</>}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
