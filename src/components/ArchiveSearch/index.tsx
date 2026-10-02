'use client'

import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDebounce } from '@/utilities/useDebounce'
import { cn } from '@/utilities/ui'

type Props = {
  archivePath: string
  className?: string
  initialValue?: string
  inputId: string
  label: string
  placeholder: string
}

/**
 * Writes `?search=` for a collection archive. Filtering happens in the Payload
 * query on the server; this only owns the URL.
 */
export const ArchiveSearch: React.FC<Props> = ({
  archivePath,
  className,
  initialValue = '',
  inputId,
  label,
  placeholder,
}) => {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, 300)
  const committedValue = useRef(initialValue)

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
    router.push(next ? `${archivePath}?search=${encodeURIComponent(next)}` : archivePath)
  }, [archivePath, debouncedValue, router])

  return (
    <form
      className={cn('flex w-full max-w-xl items-center gap-2', className)}
      onSubmit={(event) => event.preventDefault()}
      role="search"
    >
      <Label className="sr-only" htmlFor={inputId}>
        {label}
      </Label>
      <Input
        autoComplete="off"
        className="h-11 sm:h-9"
        id={inputId}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
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
