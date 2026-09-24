'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CASE_STUDIES_ARCHIVE_PATH } from '@/utilities/getContentUrls'
import { useDebounce } from '@/utilities/useDebounce'
import { cn } from '@/utilities/ui'

type Props = {
  className?: string
  /** Current `?search=` value, so the input survives a server re-render. */
  initialValue?: string
}

/**
 * Drives the `?search=` query param for /case-study. Filtering happens in the
 * Payload query on the server; this only owns the URL.
 */
export const CaseStudySearch: React.FC<Props> = ({ className, initialValue = '' }) => {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 300)
  // The query currently reflected in the URL, so mounting does not re-push.
  const committedValue = useRef(initialValue)

  // The query changed without the user typing — the "Clear search" link, or
  // back/forward. Adopting it here also cancels any still-pending push below,
  // because that effect compares against this same ref.
  useEffect(() => {
    if (initialValue !== committedValue.current) {
      committedValue.current = initialValue
      setValue(initialValue)
    }
  }, [initialValue])

  useEffect(() => {
    const next = debouncedValue.trim()
    if (next === committedValue.current) return

    committedValue.current = next
    // Omitting `page` resets pagination whenever the query changes.
    router.push(
      next
        ? `${CASE_STUDIES_ARCHIVE_PATH}?search=${encodeURIComponent(next)}`
        : CASE_STUDIES_ARCHIVE_PATH,
    )
  }, [debouncedValue, router])

  return (
    <form
      className={cn('flex w-full max-w-xl items-center gap-2', className)}
      onSubmit={(event) => event.preventDefault()}
      role="search"
    >
      <Label className="sr-only" htmlFor="case-study-search">
        Search case studies
      </Label>
      <Input
        autoComplete="off"
        // Taller on small screens so the control stays a comfortable touch target.
        className="h-11 sm:h-9"
        id="case-study-search"
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search case studies"
        type="search"
        value={value}
      />
      {value ? (
        <button
          className="h-11 shrink-0 rounded-[2px] border border-border px-3 font-mono text-xs text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-9"
          onClick={() => setValue('')}
          type="button"
        >
          Clear
        </button>
      ) : null}
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  )
}
