'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Banner, Button, toast } from '@payloadcms/ui'

import {
  CATEGORY_TYPE_OPTIONS,
  CATEGORY_TYPE_TO_COLLECTION,
  type CategoryType,
} from '@/utilities/categoryTypes'
import { parseCategoryList } from '@/utilities/parseCategoryList'

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
  const [listText, setListText] = useState('')
  const [singleTitle, setSingleTitle] = useState('')
  const [docs, setDocs] = useState<CategoryDoc[]>([])
  const [loadingTree, setLoadingTree] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [results, setResults] = useState<CreateResult[] | null>(null)
  const [summary, setSummary] = useState<ApiResponse['summary'] | null>(null)

  const collection = CATEGORY_TYPE_TO_COLLECTION[categoryType]
  const treeOptions = useMemo(() => buildTreeOptions(docs), [docs])
  const parsedPreviewCount = useMemo(() => parseCategoryList(listText).length, [listText])

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
    setListText('')
    setSingleTitle('')
  }

  const appendSingleToList = () => {
    const title = singleTitle.trim()
    if (!title) return

    setListText((prev) => {
      const next = prev.trimEnd()
      return next ? `${next}\n${title}` : title
    })
    setSingleTitle('')
  }

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const titles = parseCategoryList(listText)

    if (titles.length === 0) {
      toast.error('Paste or type at least one category (one per line)')
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
          // Coerce select value to number so Payload relationship validation accepts it.
          parentId: parentId ? Number(parentId) || parentId : null,
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
        setListText('')
        setSingleTitle('')
        await loadTree(categoryType)
      } else {
        toast.info('No new categories created')
      }

      if (skipped > 0 || failed > 0) {
        toast.info(`Already existed: ${skipped}, Errors: ${failed}`)
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
        Paste a list of categories (one per line), choose a parent, and create them in one step —
        similar to Drupal Taxonomy Manager.
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
          {loadingTree
            ? 'Loading tree…'
            : `${treeOptions.length} categories in this tree. Selected parent applies to every line.`}
        </span>
      </label>

      <label className={`${baseClass}__field`}>
        <span className={`${baseClass}__label`}>Categories</span>
        <span className={`${baseClass}__hint`}>
          One category per line. Paste from Excel, Google Sheets, or a text file. Empty lines are
          ignored. {longTitleHint}
        </span>
        <textarea
          className={`${baseClass}__textarea`}
          value={listText}
          onChange={(e) => setListText(e.target.value)}
          rows={12}
          placeholder={[
            'Manufacturing SEO',
            'Industrial SEO',
            'Technical SEO',
            'Local SEO',
            'SEO Audit',
            'SEO Content',
          ].join('\n')}
          spellCheck={false}
        />
        <span className={`${baseClass}__hint`}>
          {parsedPreviewCount > 0
            ? `${parsedPreviewCount} categor${parsedPreviewCount === 1 ? 'y' : 'ies'} ready to create`
            : 'No categories entered yet'}
        </span>
      </label>

      <div className={`${baseClass}__field ${baseClass}__field--secondary`}>
        <span className={`${baseClass}__label`}>Add one category</span>
        <span className={`${baseClass}__hint`}>Optional — appends a single line to the list above.</span>
        <div className={`${baseClass}__row`}>
          <input
            className={`${baseClass}__input`}
            value={singleTitle}
            onChange={(e) => setSingleTitle(e.target.value)}
            placeholder="Category title"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                appendSingleToList()
              }
            }}
          />
          <Button buttonStyle="secondary" type="button" onClick={appendSingleToList}>
            Add to list
          </Button>
        </div>
      </div>

      <div className={`${baseClass}__actions`}>
        <Button type="submit" disabled={submitting || loadingTree}>
          {submitting ? 'Creating…' : 'Create Categories'}
        </Button>
      </div>

      {summary && (
        <Banner type={summary.failed > 0 ? 'error' : 'success'} className={`${baseClass}__banner`}>
          Created: {summary.created}
          <br />
          Already existed: {summary.skipped}
          <br />
          Errors: {summary.failed}
        </Banner>
      )}

      {results && results.length > 0 && (
        <ul className={`${baseClass}__results`}>
          {results.map((result, index) => (
            <li key={`${result.title}-${index}`} data-status={result.status}>
              <strong>{result.title}</strong>
              {result.status === 'created' && <> — created ({result.slug})</>}
              {result.status === 'skipped' && <> — already existed: {result.reason}</>}
              {result.status === 'error' && <> — error: {result.reason}</>}
            </li>
          ))}
        </ul>
      )}
    </form>
  )
}
