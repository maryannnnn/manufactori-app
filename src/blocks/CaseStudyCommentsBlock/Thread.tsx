'use client'

import React, { useEffect, useId, useState } from 'react'

import { countDescendants } from './buildCommentTree'
import { cn } from '@/utilities/ui'

export type ThreadNode = {
  key: string
  author: string
  role?: string | null
  date?: string | null
  isExpert?: boolean | null
  body: React.ReactNode
  children: ThreadNode[]
}

type Props = {
  nodes: ThreadNode[]
}

/** Visible indent levels, inclusive. Deeper replies go behind "Continue this thread". */
const DESKTOP_VISIBLE_DEPTH = 3
const MOBILE_VISIBLE_DEPTH = 2
const DESKTOP_QUERY = '(min-width: 640px)'

const controlClassName =
  'rounded-[2px] font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

/**
 * Renders a discussion tree: light text blocks, a thin thread line, and
 * collapse / continue controls. Visual depth is capped; the data tree is not.
 */
export const DiscussionThread: React.FC<Props> = ({ nodes }) => {
  const visibleCap = useVisibleDepthCap()

  if (nodes.length === 0) return null

  return (
    <ol className="max-w-[72ch]">
      {nodes.map((node, index) => (
        <ThreadItem
          isFirst={index === 0}
          key={node.key}
          node={node}
          visibleCap={visibleCap}
          visualDepth={0}
        />
      ))}
    </ol>
  )
}

const ThreadItem: React.FC<{
  connector?: boolean
  isFirst: boolean
  node: ThreadNode
  visibleCap: number
  visualDepth: number
}> = ({ connector, isFirst, node, visibleCap, visualDepth }) => {
  const hasReplies = node.children.length > 0
  const replyCount = hasReplies ? countDescendants(node) : 0
  const tooDeep = hasReplies && visualDepth >= visibleCap

  return (
    <li
      className={cn(
        connector && 'relative',
        !isFirst && visualDepth === 0 && 'mt-6 border-t border-border pt-6',
      )}
    >
      {connector ? (
        <span
          aria-hidden
          className="absolute top-2.5 -left-3 hidden h-px w-3 bg-border sm:-left-5 sm:block sm:w-5"
        />
      ) : null}
      <CommentBody node={node} />

      {hasReplies ? (
        tooDeep ? (
          <ContinueThread node={node} visibleCap={visibleCap} />
        ) : (
          <CollapsibleReplies node={node} replyCount={replyCount} visibleCap={visibleCap} visualDepth={visualDepth} />
        )
      ) : null}
    </li>
  )
}

const CommentBody: React.FC<{ node: ThreadNode }> = ({ node }) => {
  const posted = node.date ? formatDate(node.date) : ''

  return (
    <article>
      <header className="mb-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-semibold text-foreground">{node.author}</span>
        {node.isExpert ? (
          <span className="font-mono text-[10px] tracking-wide text-primary uppercase">Expert</span>
        ) : null}
        {node.role ? (
          <>
            <span aria-hidden className="font-mono text-[11px] text-muted-foreground">
              ·
            </span>
            <span className="font-mono text-[11px] text-muted-foreground">{node.role}</span>
          </>
        ) : null}
        {posted ? (
          <>
            <span aria-hidden className="font-mono text-[11px] text-muted-foreground">
              ·
            </span>
            <time className="font-mono text-[11px] text-muted-foreground" dateTime={node.date ?? undefined}>
              {posted}
            </time>
          </>
        ) : null}
      </header>

      <div className="[&_li]:text-sm [&_li]:text-muted-foreground [&_p]:text-sm [&_p]:text-muted-foreground [&_p+p]:mt-2">
        {node.body}
      </div>
    </article>
  )
}

const CollapsibleReplies: React.FC<{
  node: ThreadNode
  replyCount: number
  visibleCap: number
  visualDepth: number
}> = ({ node, replyCount, visibleCap, visualDepth }) => {
  const [open, setOpen] = useState(true)
  const panelId = useId()

  return (
    <div className="mt-2">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={controlClassName}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? 'Hide replies' : `Show ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}`}
      </button>

      <ReplyList
        hidden={!open}
        id={panelId}
        nodes={node.children}
        visibleCap={visibleCap}
        visualDepth={visualDepth + 1}
      />
    </div>
  )
}

const ContinueThread: React.FC<{
  node: ThreadNode
  visibleCap: number
}> = ({ node, visibleCap }) => {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div className="mt-2">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className={controlClassName}
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        {open ? 'Hide thread' : 'Continue this thread'}
      </button>

      <ReplyList
        hidden={!open}
        id={panelId}
        nodes={node.children}
        visibleCap={visibleCap}
        visualDepth={0}
      />
    </div>
  )
}

const ReplyList: React.FC<{
  hidden?: boolean
  id: string
  nodes: ThreadNode[]
  visibleCap: number
  visualDepth: number
}> = ({ hidden, id, nodes, visibleCap, visualDepth }) => (
  <ol
    className="relative mt-3 space-y-4 border-l border-border pl-3 sm:pl-5"
    hidden={hidden}
    id={id}
  >
    {nodes.map((child) => (
      <ThreadItem
        connector
        isFirst
        key={child.key}
        node={child}
        visibleCap={visibleCap}
        visualDepth={visualDepth}
      />
    ))}
  </ol>
)

const useVisibleDepthCap = (): number => {
  const [cap, setCap] = useState(DESKTOP_VISIBLE_DEPTH)

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const apply = () => setCap(media.matches ? DESKTOP_VISIBLE_DEPTH : MOBILE_VISIBLE_DEPTH)
    apply()
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [])

  return cap
}

const formatDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
