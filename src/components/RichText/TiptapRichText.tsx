import { generateHTML } from '@tiptap/html'

import { getTiptapExtensions } from '@/utilities/richText/extensions'
import type { TiptapRichTextValue } from '@/utilities/richText/types'
import { rewriteMediaSrcsInHtml } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

import { RichTextLightbox } from './RichTextLightbox'

import '@/utilities/richText/image.css'

const FLAT_INDUSTRY_HREF = /href="\/industrial\/([a-z0-9-]+)"/g

const rewriteFlatIndustryHrefs = (html: string, paths?: Record<string, string>) => {
  if (!paths) return html
  return html.replace(FLAT_INDUSTRY_HREF, (match, slug: string) => {
    const nested = paths[slug]
    return nested ? `href="${nested}"` : match
  })
}

type TiptapRichTextProps = {
  className?: string
  data: TiptapRichTextValue
  enableGutter?: boolean
  enableProse?: boolean
  industryPaths?: Record<string, string>
}

export default function TiptapRichText({
  className,
  data,
  enableGutter = true,
  enableProse = true,
  industryPaths,
}: TiptapRichTextProps) {
  const html = rewriteFlatIndustryHrefs(
    rewriteMediaSrcsInHtml(generateHTML(data, getTiptapExtensions({ headingLevels: [1, 2, 3, 4, 5, 6] }))),
    industryPaths,
  )

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
