'use client'

import React, { useEffect, useRef, useState } from 'react'

type RichTextLightboxProps = {
  className?: string
  html: string
}

type LightboxState = {
  alt: string
  src: string
}

export const RichTextLightbox: React.FC<RichTextLightboxProps> = ({ className, html }) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [lightbox, setLightbox] = useState<LightboxState | null>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const images = root.querySelectorAll<HTMLImageElement>('figure.rich-image img, img.rich-editor-image')

    root.querySelectorAll<HTMLElement>('figure.rich-image[data-width]').forEach((figure) => {
      const width = Number(figure.getAttribute('data-width'))
      if (!Number.isFinite(width)) return
      figure.style.width = `${Math.min(100, Math.max(20, Math.round(width)))}%`
      figure.style.maxWidth = '100%'
    })

    images.forEach((img) => {
      img.setAttribute('tabindex', '0')
      img.setAttribute('role', 'button')
      const alt = img.getAttribute('alt') || ''
      img.setAttribute('aria-haspopup', 'dialog')
      img.setAttribute('aria-label', alt ? `View larger image: ${alt}` : 'View larger image')
    })

    const openFromImage = (img: HTMLImageElement) => {
      const figure = img.closest('figure.rich-image')
      const src = figure?.getAttribute('data-full-src') || img.currentSrc || img.src
      if (!src) return
      setLightbox({
        src,
        alt: img.getAttribute('alt') || '',
      })
    }

    const onClick = (event: MouseEvent) => {
      const img = (event.target as HTMLElement | null)?.closest('img')
      if (!img || !root.contains(img)) return
      event.preventDefault()
      openFromImage(img)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const img = event.target as HTMLElement
      if (img.tagName !== 'IMG' || !root.contains(img)) return
      event.preventDefault()
      openFromImage(img as HTMLImageElement)
    }

    root.addEventListener('click', onClick)
    root.addEventListener('keydown', onKeyDown)

    return () => {
      root.removeEventListener('click', onClick)
      root.removeEventListener('keydown', onKeyDown)
    }
  }, [html])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (lightbox) {
      if (!dialog.open) dialog.showModal()
      closeButtonRef.current?.focus()
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const onClose = () => setLightbox(null)
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Escape') return
        event.preventDefault()
        dialog.close()
        setLightbox(null)
      }

      dialog.addEventListener('close', onClose)
      document.addEventListener('keydown', onKeyDown)

      return () => {
        document.body.style.overflow = previousOverflow
        dialog.removeEventListener('close', onClose)
        document.removeEventListener('keydown', onKeyDown)
      }
    }

    if (dialog.open) dialog.close()
  }, [lightbox])

  const closeLightbox = () => {
    dialogRef.current?.close()
    setLightbox(null)
  }

  return (
    <>
      <div className={className} dangerouslySetInnerHTML={{ __html: html }} ref={rootRef} />
      <dialog
        aria-label={lightbox?.alt ? `Enlarged image: ${lightbox.alt}` : 'Enlarged image'}
        className="rich-image-lightbox"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeLightbox()
        }}
        ref={dialogRef}
      >
        {lightbox ? (
          <div className="rich-image-lightbox__inner">
            <button
              aria-label="Close image preview"
              className="rich-image-lightbox__close"
              onClick={closeLightbox}
              ref={closeButtonRef}
              type="button"
            >
              ×
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt={lightbox.alt} src={lightbox.src} />
          </div>
        ) : null}
      </dialog>
    </>
  )
}
