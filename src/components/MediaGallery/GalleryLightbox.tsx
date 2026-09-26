'use client'

import React from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

import { Media } from '@/components/Media'

import type { GallerySlide } from './slides'

type Props = {
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
  open: boolean
  showWatermark?: boolean
  slides: GallerySlide[]
}

export const GalleryLightbox: React.FC<Props> = ({
  index,
  onClose,
  onIndexChange,
  open,
  showWatermark,
  slides,
}) => {
  return (
    <Lightbox
      close={onClose}
      controller={{ closeOnBackdropClick: true, closeOnPullDown: true }}
      index={index}
      labels={{
        Close: 'Close gallery',
        Next: 'Next image',
        Previous: 'Previous image',
        'Enter Fullscreen': 'Enter fullscreen',
        'Exit Fullscreen': 'Exit fullscreen',
      }}
      on={{ view: ({ index: next }) => onIndexChange(next) }}
      open={open}
      plugins={[Thumbnails, Fullscreen, Counter, Captions]}
      render={{
        slide: ({ slide, rect }) => {
          const resource = 'resource' in slide ? (slide as GallerySlide).resource : null
          if (!resource) return undefined

          const slideWidth = slide.width || rect.width
          const slideHeight = slide.height || rect.height
          const width = Math.round(Math.min(rect.width, (rect.height / slideHeight) * slideWidth))
          const height = Math.round(Math.min(rect.height, (rect.width / slideWidth) * slideHeight))

          return (
            <div className="relative" style={{ width, height }}>
              <Media
                fill
                htmlElement={null}
                imageSize={['xlarge', 'large', 'medium']}
                imgClassName="object-contain"
                pictureClassName="relative block h-full w-full"
                resource={resource}
                showWatermark={showWatermark}
                size="100vw"
              />
            </div>
          )
        },
      }}
      slides={slides}
      styles={{
        container: { backgroundColor: 'rgba(8, 8, 8, 0.94)' },
      }}
      thumbnails={{
        border: 0,
        borderRadius: 2,
        gap: 8,
        padding: 16,
        position: 'bottom',
        vignette: false,
      }}
    />
  )
}
