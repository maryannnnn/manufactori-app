'use client'

import type { Editor } from '@tiptap/react'
import React, { useCallback } from 'react'

type RichEditorToolbarProps = {
  editor: Editor | null
  headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
  htmlMode: boolean
  onToggleHtml: () => void
  onOpenImageLibrary: () => void
  onOpenImageUpload: () => void
}

const ToolbarButton: React.FC<{
  active?: boolean
  disabled?: boolean
  onClick: () => void
  title: string
  children: React.ReactNode
}> = ({ active, disabled, onClick, title, children }) => (
  <button
    type="button"
    className={`rich-editor-toolbar__button${active ? ' rich-editor-toolbar__button--active' : ''}`}
    disabled={disabled}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
)

export const RichEditorToolbar: React.FC<RichEditorToolbarProps> = ({
  editor,
  headingLevels = [2, 3, 4],
  htmlMode,
  onToggleHtml,
  onOpenImageLibrary,
  onOpenImageUpload,
}) => {
  const [imageMenuOpen, setImageMenuOpen] = React.useState(false)
  const imageMenuRef = React.useRef<HTMLDivElement>(null)

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL', previousUrl || 'https://')

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  React.useEffect(() => {
    if (!imageMenuOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (!imageMenuRef.current?.contains(event.target as Node)) {
        setImageMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [imageMenuOpen])

  if (!editor) return null

  return (
    <div className="rich-editor-toolbar">
      <ToolbarButton
        title="Undo"
        disabled={!editor.can().chain().focus().undo().run()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        Undo
      </ToolbarButton>
      <ToolbarButton
        title="Redo"
        disabled={!editor.can().chain().focus().redo().run()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        Redo
      </ToolbarButton>

      <span className="rich-editor-toolbar__separator" />

      {headingLevels.includes(1) && (
        <ToolbarButton
          title="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </ToolbarButton>
      )}
      {headingLevels.includes(2) && (
        <ToolbarButton
          title="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </ToolbarButton>
      )}
      {headingLevels.includes(3) && (
        <ToolbarButton
          title="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </ToolbarButton>
      )}
      {headingLevels.includes(4) && (
        <ToolbarButton
          title="Heading 4"
          active={editor.isActive('heading', { level: 4 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          H4
        </ToolbarButton>
      )}
      <ToolbarButton
        title="Paragraph"
        active={editor.isActive('paragraph')}
        onClick={() => editor.chain().focus().setParagraph().run()}
      >
        P
      </ToolbarButton>

      <span className="rich-editor-toolbar__separator" />

      <ToolbarButton
        title="Bold"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        title="Italic"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        I
      </ToolbarButton>
      <ToolbarButton
        title="Underline"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        U
      </ToolbarButton>
      <ToolbarButton
        title="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        S
      </ToolbarButton>
      <ToolbarButton
        title="Inline code"
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        {'</>'}
      </ToolbarButton>

      <span className="rich-editor-toolbar__separator" />

      <ToolbarButton
        title="Bullet list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title="Ordered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        1. List
      </ToolbarButton>
      <ToolbarButton
        title="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        Quote
      </ToolbarButton>
      <ToolbarButton
        title="Code block"
        active={editor.isActive('codeBlock')}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        Code
      </ToolbarButton>
      <ToolbarButton
        title="Horizontal rule"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        HR
      </ToolbarButton>

      <span className="rich-editor-toolbar__separator" />

      <ToolbarButton title="Link" active={editor.isActive('link')} onClick={setLink}>
        Link
      </ToolbarButton>
      <div className="rich-editor-toolbar__menu" ref={imageMenuRef}>
        <ToolbarButton
          title="Insert image from Media"
          active={editor.isActive('image') || imageMenuOpen}
          onClick={() => setImageMenuOpen((open) => !open)}
        >
          Image
        </ToolbarButton>
        {imageMenuOpen && (
          <div className="rich-editor-toolbar__menu-list" role="menu">
            <button
              className="rich-editor-toolbar__menu-item"
              onClick={() => {
                setImageMenuOpen(false)
                onOpenImageLibrary()
              }}
              role="menuitem"
              type="button"
            >
              Select from Media
            </button>
            <button
              className="rich-editor-toolbar__menu-item"
              onClick={() => {
                setImageMenuOpen(false)
                onOpenImageUpload()
              }}
              role="menuitem"
              type="button"
            >
              Upload new
            </button>
          </div>
        )}
      </div>

      <span className="rich-editor-toolbar__separator" />

      <ToolbarButton
        title="Clear formatting"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
      >
        Clear
      </ToolbarButton>
      <ToolbarButton title="HTML mode" active={htmlMode} onClick={onToggleHtml}>
        HTML
      </ToolbarButton>
    </div>
  )
}
