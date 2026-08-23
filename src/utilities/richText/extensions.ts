import CodeBlock from '@tiptap/extension-code-block'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import StarterKit from '@tiptap/starter-kit'
import type { AnyExtension, Extensions } from '@tiptap/core'

import { ResizableImage } from './resizableImage'

type TiptapExtensionOptions = {
  headingLevels?: (1 | 2 | 3 | 4 | 5 | 6)[]
  placeholder?: string
  imageExtension?: AnyExtension
}

export const getTiptapExtensions = (options?: TiptapExtensionOptions): Extensions => {
  const headingLevels = options?.headingLevels ?? [2, 3, 4]

  return [
    StarterKit.configure({
      heading: {
        levels: headingLevels,
      },
      horizontalRule: false,
      strike: false,
      codeBlock: false,
    }),
    Underline,
    Strike,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        rel: 'noopener noreferrer',
      },
    }),
    CodeBlock.configure({
      HTMLAttributes: {
        class: 'rich-editor-code-block',
      },
    }),
    HorizontalRule,
    options?.imageExtension ?? ResizableImage,
    Placeholder.configure({
      placeholder: options?.placeholder || 'Start writing…',
    }),
  ]
}
