import React, { Fragment } from 'react'

import type { CaseStudy, CaseStudyCategory, Category, Page, Post } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CaseStudyCommentsBlock } from '@/blocks/CaseStudyCommentsBlock/Component'
import { CaseStudyContentTitleBlock } from '@/blocks/CaseStudyContentTitleBlock/Component'
import { CaseStudyFAQBlock } from '@/blocks/CaseStudyFAQBlock/Component'
import { CaseStudyGalleryBlock } from '@/blocks/CaseStudyGalleryBlock/Component'
import { CaseStudyPreviewBlock } from '@/blocks/CaseStudyPreviewBlock/Component'
import { CaseStudyVideoBlock } from '@/blocks/CaseStudyVideoBlock/Component'
import { CodeBlock } from '@/blocks/Code/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { PagePreviewBlock } from '@/blocks/PagePreviewBlock/Component'

const blockComponents = {
  archive: ArchiveBlock,
  code: CodeBlock,
  content: ContentBlock,
  postContentBlock: ContentBlock,
  caseStudyContentBlock: ContentBlock,
  csContent: ContentBlock,
  caseStudyPreviewBlock: CaseStudyPreviewBlock,
  csPreview: CaseStudyPreviewBlock,
  caseStudyContentTitleBlock: CaseStudyContentTitleBlock,
  csContentTitle: CaseStudyContentTitleBlock,
  caseStudyVideoBlock: CaseStudyVideoBlock,
  csVideo: CaseStudyVideoBlock,
  caseStudyGalleryBlock: CaseStudyGalleryBlock,
  csGallery: CaseStudyGalleryBlock,
  caseStudyCommentsBlock: CaseStudyCommentsBlock,
  csComments: CaseStudyCommentsBlock,
  caseStudyFAQBlock: CaseStudyFAQBlock,
  csFAQ: CaseStudyFAQBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  pagePreviewBlock: PagePreviewBlock,
}

type LayoutBlock =
  | NonNullable<Page['layout']>[number]
  | NonNullable<Category['layout']>[number]
  | NonNullable<CaseStudyCategory['layout']>[number]
  | NonNullable<Post['layout']>[number]
  | NonNullable<CaseStudy['layout']>[number]

export const RenderBlocks: React.FC<{
  blocks: LayoutBlock[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              return (
                <div className="my-16" key={index}>
                  {/* @ts-expect-error there may be some mismatch between the expected types here */}
                  <Block {...block} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
