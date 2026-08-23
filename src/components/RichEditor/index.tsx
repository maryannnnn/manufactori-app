'use client'

import { useDocumentDrawer, useListDrawer } from '@payloadcms/ui'
import { EditorContent, useEditor } from '@tiptap/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Media } from '@/payload-types'
import { mediaToImageAttrs } from '@/utilities/richText/mediaToImageAttrs'
import { normalizeRichTextToTiptap } from '@/utilities/richText/normalizeValue'
import type { RichTextValue } from '@/utilities/richText/types'
import { getTiptapExtensions } from '@/utilities/richText/extensions'

import { AdminImage } from './image/adminImageExtension'
import { RichEditorToolbar } from './Toolbar'

import '@/utilities/richText/image.css'
import './styles.scss'

type RichEditorProps = {
  headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
  value?: RichTextValue
  onChange: (value: unknown) => void
  readOnly?: boolean
  placeholder?: string
}

export const RichEditor: React.FC<RichEditorProps> = ({
  headingLevels = [2, 3, 4],
  value,
  onChange,
  readOnly = false,
  placeholder,
}) => {
  const [mounted, setMounted] = useState(false)
  const [htmlMode, setHtmlMode] = useState(false)
  const [htmlSource, setHtmlSource] = useState('')
  const skipUpdateRef = useRef(false)
  const normalizedValue = normalizeRichTextToTiptap(value)

  const [ListDrawer, , { closeDrawer: closeLibraryDrawer, openDrawer: openLibraryDrawer }] =
    useListDrawer({
      collectionSlugs: ['media'],
      selectedCollection: 'media',
      uploads: true,
    })

  const [DocumentDrawer, , { closeDrawer: closeUploadDrawer, openDrawer: openUploadDrawer }] =
    useDocumentDrawer({
      collectionSlug: 'media',
    })

  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    extensions: getTiptapExtensions({
      headingLevels,
      placeholder,
      imageExtension: AdminImage,
    }),
    content: normalizedValue,
    onUpdate: ({ editor: currentEditor }) => {
      if (skipUpdateRef.current) return
      onChange(currentEditor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
      },
    },
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!editor) return

    editor.setEditable(!readOnly)
  }, [editor, readOnly])

  useEffect(() => {
    if (!editor) return

    const currentJson = JSON.stringify(editor.getJSON())
    const nextJson = JSON.stringify(normalizedValue)

    if (currentJson === nextJson) return

    skipUpdateRef.current = true
    editor.commands.setContent(normalizedValue, false)
    skipUpdateRef.current = false
  }, [editor, normalizedValue])

  const handleToggleHtml = useCallback(() => {
    if (!editor) return

    if (!htmlMode) {
      setHtmlSource(editor.getHTML())
      setHtmlMode(true)
      return
    }

    skipUpdateRef.current = true
    editor.commands.setContent(htmlSource, false)
    skipUpdateRef.current = false
    onChange(editor.getJSON())
    setHtmlMode(false)
  }, [editor, htmlMode, htmlSource, onChange])

  const handleHtmlChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHtmlSource(event.target.value)
  }, [])

  const handleApplyHtml = useCallback(() => {
    if (!editor) return

    skipUpdateRef.current = true
    editor.commands.setContent(htmlSource, false)
    skipUpdateRef.current = false
    onChange(editor.getJSON())
  }, [editor, htmlSource, onChange])

  const insertMedia = useCallback(
    (doc: Record<string, unknown>) => {
      if (!editor) return

      const attrs = mediaToImageAttrs(doc as unknown as Media)
      if (!attrs) return

      if (editor.isActive('image')) {
        const current = editor.getAttributes('image')
        editor.chain().focus().updateAttributes('image', {
          ...attrs,
          alt: attrs.alt || current.alt || '',
          align: current.align,
          width: current.width,
          caption: current.caption,
        }).run()
      } else {
        editor
          .chain()
          .focus()
          .insertContent({
            type: 'image',
            attrs,
          })
          .run()
      }
    },
    [editor],
  )

  const handleMediaSelect = useCallback(
    (args: { doc: Record<string, unknown> }) => {
      insertMedia(args.doc)
      closeLibraryDrawer()
    },
    [closeLibraryDrawer, insertMedia],
  )

  if (!mounted) {
    return <div className="rich-editor rich-editor--loading">Loading editor…</div>
  }

  return (
    <div className={`rich-editor${readOnly ? ' rich-editor--readonly' : ''}`}>
      {!readOnly && (
        <>
          <RichEditorToolbar
            editor={editor}
            headingLevels={headingLevels}
            htmlMode={htmlMode}
            onOpenImageLibrary={openLibraryDrawer}
            onOpenImageUpload={openUploadDrawer}
            onToggleHtml={handleToggleHtml}
          />
          <ListDrawer allowCreate onSelect={handleMediaSelect} />
          <DocumentDrawer
            onSave={({ doc, result }) => {
              const media = (result || doc) as Record<string, unknown>
              insertMedia(media)
              closeUploadDrawer()
            }}
            redirectAfterCreate={false}
            redirectAfterDelete={false}
            redirectAfterDuplicate={false}
          />
        </>
      )}

      {htmlMode ? (
        <div className="rich-editor-html">
          <textarea
            className="rich-editor-html__textarea"
            value={htmlSource}
            onChange={handleHtmlChange}
            onBlur={handleApplyHtml}
            spellCheck={false}
          />
        </div>
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}
