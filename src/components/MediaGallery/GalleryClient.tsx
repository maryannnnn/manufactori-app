'use client'

import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

import { buildGallerySlides } from './slides'

import './gallery.css'

const GalleryLightbox = dynamic(
  () => import('./GalleryLightbox').then((mod) => mod.GalleryLightbox),
  { ssr: false },
)

type Props = {
  images: MediaType[]
  showWatermark?: boolean
}

export const MediaGalleryClient: React.FC<Props> = ({ images, showWatermark }) => {
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)

  const slides = buildGallerySlides(images)

  const openAt = useCallback((nextIndex: number) => {
    setIndex(nextIndex)
    setMounted(true)
    setOpen(true)
  }, [])

  return (
    <>
      <ul className="media-gallery__grid grid min-w-0 grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
        {images.map((image, imageIndex) => {
          const alt = image.alt?.trim() || `Gallery image ${imageIndex + 1}`

          return (
            <li className="media-gallery__item min-w-0" key={image.id ?? imageIndex}>
              <button
                aria-expanded={open && index === imageIndex}
                aria-haspopup="dialog"
                aria-label={`Open image ${imageIndex + 1} of ${images.length}: ${alt}`}
                className="media-gallery__thumb group w-full min-w-0 rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => openAt(imageIndex)}
                type="button"
              >
                <span className="media-gallery__frame overflow-hidden rounded-[2px] border border-border bg-accent">
                  <Media
                    fill
                    htmlElement={null}
                    imageSize={['medium', 'small']}
                    imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    pictureClassName="relative block h-full w-full overflow-hidden"
                    resource={image}
                    showWatermark={showWatermark}
                    size="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
                  />
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {mounted ? (
        <GalleryLightbox
          index={index}
          onClose={() => setOpen(false)}
          onIndexChange={setIndex}
          open={open}
          showWatermark={showWatermark}
          slides={slides}
        />
      ) : null}
    </>
  )
}
