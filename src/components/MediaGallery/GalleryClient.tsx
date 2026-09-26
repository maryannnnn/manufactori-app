'use client'

import dynamic from 'next/dynamic'
import React, { useCallback, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'

import { buildGallerySlides } from './slides'

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
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-4 lg:gap-5">
        {images.map((image, imageIndex) => {
          const alt = image.alt?.trim() || `Gallery image ${imageIndex + 1}`

          return (
            <li className="min-w-0" key={image.id ?? imageIndex}>
              <button
                aria-expanded={open && index === imageIndex}
                aria-haspopup="dialog"
                aria-label={`Open image ${imageIndex + 1} of ${images.length}: ${alt}`}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-border bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => openAt(imageIndex)}
                type="button"
              >
                <Media
                  fill
                  htmlElement={null}
                  imageSize={['medium', 'small']}
                  imgClassName="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  pictureClassName="relative block h-full w-full"
                  resource={image}
                  showWatermark={showWatermark}
                  size="(max-width: 767px) 50vw, 280px"
                />
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
