'use client'

import type { NodeViewProps } from '@tiptap/core'
import { NodeViewWrapper } from '@tiptap/react'
import React, { useCallback, useEffect, useRef } from 'react'

import {
  clampImageWidth,
  DEFAULT_IMAGE_WIDTH,
  FLOAT_IMAGE_WIDTH,
  getImageAlign,
  type ImageAlign,
  isFloatAlign,
} from '@/utilities/richText/imageTypes'

const ALIGN_OPTIONS: Array<{ value: ImageAlign; label: string; title: string }> = [
  { value: 'left', label: 'Left', title: 'Align left, no text wrap' },
  { value: 'center', label: 'Center', title: 'Align center, no text wrap' },
  { value: 'right', label: 'Right', title: 'Align right, no text wrap' },
  { value: 'full', label: 'Full', title: 'Full-width block, no text wrap' },
  { value: 'float-left', label: 'Wrap L', title: 'Float left with text wrap' },
  { value: 'float-right', label: 'Wrap R', title: 'Float right with text wrap' },
]

export const ImageNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
  deleteNode,
}) => {
  const align = getImageAlign(node.attrs.align)
  const width = clampImageWidth(node.attrs.width)
  const alt = typeof node.attrs.alt === 'string' ? node.attrs.alt : ''
  const caption = typeof node.attrs.caption === 'string' ? node.attrs.caption : ''
  const src = typeof node.attrs.src === 'string' ? node.attrs.src : ''
  const startXRef = useRef(0)
  const startWidthRef = useRef(width)
  const parentWidthRef = useRef(0)

  const setAlign = useCallback(
    (nextAlign: ImageAlign) => {
      const nextWidth =
        isFloatAlign(nextAlign) && width >= 90
          ? FLOAT_IMAGE_WIDTH
          : nextAlign === 'full'
            ? DEFAULT_IMAGE_WIDTH
            : width

      updateAttributes({
        align: nextAlign,
        width: nextWidth,
      })
    },
    [updateAttributes, width],
  )

  const onResizeMove = useCallback(
    (event: MouseEvent) => {
      if (!parentWidthRef.current) return
      const delta = event.clientX - startXRef.current
      const direction = align === 'right' || align === 'float-right' ? -1 : 1
      const next = clampImageWidth(
        ((startWidthRef.current + delta * direction) / parentWidthRef.current) * 100,
      )
      updateAttributes({ width: next })
    },
    [align, updateAttributes],
  )

  const stopResize = useCallback(() => {
    window.removeEventListener('mousemove', onResizeMove)
    window.removeEventListener('mouseup', stopResize)
  }, [onResizeMove])

  const startResize = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const figure = event.currentTarget.closest('figure.rich-image') as HTMLElement | null
      const parent = figure?.parentElement
      if (!parent) return

      startXRef.current = event.clientX
      startWidthRef.current = figure.getBoundingClientRect().width
      parentWidthRef.current = parent.clientWidth

      window.addEventListener('mousemove', onResizeMove)
      window.addEventListener('mouseup', stopResize)
    },
    [onResizeMove, stopResize],
  )

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', onResizeMove)
      window.removeEventListener('mouseup', stopResize)
    }
  }, [onResizeMove, stopResize])

  return (
    <NodeViewWrapper
      as="div"
      className={`rich-image__inner${selected ? ' rich-image__inner--selected' : ''}`}
      data-drag-handle
    >
      <div className="rich-image__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={alt} src={src} />
        {selected && (
          <button
            className="rich-image__resize"
            onMouseDown={startResize}
            title="Resize image"
            type="button"
          />
        )}
      </div>

      {selected && (
        <div className="rich-image__controls" contentEditable={false}>
          <div className="rich-image__align">
            {ALIGN_OPTIONS.map((option) => (
              <button
                className={`rich-editor-toolbar__button${align === option.value ? ' rich-editor-toolbar__button--active' : ''}`}
                key={option.value}
                onClick={() => setAlign(option.value)}
                title={option.title}
                type="button"
              >
                {option.label}
              </button>
            ))}
            <button
              className="rich-editor-toolbar__button"
              onClick={deleteNode}
              title="Remove image"
              type="button"
            >
              Delete
            </button>
          </div>

          <label className="rich-image__field">
            <span>Width {width}%</span>
            <input
              max={100}
              min={20}
              onChange={(event) => updateAttributes({ width: clampImageWidth(event.target.value) })}
              type="range"
              value={width}
            />
          </label>

          <label className="rich-image__field">
            <span>Alt text</span>
            <input
              onChange={(event) => updateAttributes({ alt: event.target.value })}
              placeholder="Describe the image"
              type="text"
              value={alt}
            />
          </label>

          <label className="rich-image__field">
            <span>Caption</span>
            <input
              onChange={(event) => updateAttributes({ caption: event.target.value || null })}
              placeholder="Optional caption"
              type="text"
              value={caption}
            />
          </label>
        </div>
      )}

      {!selected && caption ? <p className="rich-image__caption">{caption}</p> : null}
    </NodeViewWrapper>
  )
}
