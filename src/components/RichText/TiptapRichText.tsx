import { generateHTML } from '@tiptap/html'

import { getTiptapExtensions } from '@/utilities/richText/extensions'
import type { TiptapRichTextValue } from '@/utilities/richText/types'
import { cn } from '@/utilities/ui'

import { RichTextLightbox } from './RichTextLightbox'

import '@/utilities/richText/image.css'

type TiptapRichTextProps = {
  className?: string
  data: TiptapRichTextValue
  enableGutter?: boolean
  enableProse?: boolean
}

export default function TiptapRichText({
  className,
  data,
  enableGutter = true,
  enableProse = true,
}: TiptapRichTextProps) {
  const html = generateHTML(data, getTiptapExtensions({ headingLevels: [1, 2, 3, 4, 5, 6] }))

  return (
    <RichTextLightbox
      className={cn(
        'payload-richtext tiptap-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      html={html}
    />
  )
}
