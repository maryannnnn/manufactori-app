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

import './gallery.css'

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
      carousel={{ finite: false, imageFit: 'contain', padding: 8, spacing: 8 }}
      className="media-gallery-lightbox"
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

          const maxWidth = Math.max(1, rect.width)
          const maxHeight = Math.max(1, rect.height)
          const slideWidth = slide.width || maxWidth
          const slideHeight = slide.height || maxHeight
          const width = Math.round(Math.min(maxWidth, (maxHeight / slideHeight) * slideWidth))
          const height = Math.round(Math.min(maxHeight, (maxWidth / slideWidth) * slideHeight))

          return (
            <div className="relative overflow-hidden" style={{ width, height, maxWidth: '100%', maxHeight: '100%' }}>
              <Media
                fill
                htmlElement={null}
                imageSize={['xlarge', 'large', 'medium']}
                imgClassName="object-contain"
                pictureClassName="relative block h-full w-full overflow-hidden"
                resource={resource}
                showWatermark={showWatermark}
                size="(max-width: 768px) 100vw, 90vw"
              />
            </div>
          )
        },
      }}
      slides={slides}
      styles={{
        container: { backgroundColor: '#080808', maxWidth: '100%', width: '100%' },
        root: {
          backgroundColor: '#080808',
          height: '100svh',
          maxHeight: '100svh',
          maxWidth: '100%',
          width: '100%',
        },
        thumbnailsContainer: { backgroundColor: '#080808', maxWidth: '100%', zIndex: 3 },
      }}
      thumbnails={{
        border: 0,
        borderRadius: 2,
        gap: 8,
        height: 66,
        padding: 10,
        position: 'bottom',
        vignette: false,
        width: 88,
      }}
    />
  )
}
