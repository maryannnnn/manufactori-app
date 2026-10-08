'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Media } from '@/components/Media'
import type { HomeTestimonial } from '@/utilities/getHomePageData'
import { cn } from '@/utilities/ui'

type Props = {
  items: HomeTestimonial[]
  labelledBy?: string
}

export const TestimonialCarousel: React.FC<Props> = ({ items, labelledBy }) => {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const showControls = items.length > 1

  const goTo = useCallback((next: number) => {
    const node = scrollerRef.current
    if (!node) return
    const bounded = (next + items.length) % items.length
    const child = node.children[bounded] as HTMLElement | undefined
    child?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    setIndex(bounded)
  }, [items.length])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return

    const onScroll = () => {
      const children = Array.from(node.children) as HTMLElement[]
      const nearest = children.reduce(
        (best, child, childIndex) => {
          const distance = Math.abs(child.offsetLeft - node.scrollLeft)
          return distance < best.distance ? { distance, index: childIndex } : best
        },
        { distance: Number.POSITIVE_INFINITY, index: 0 },
      )
      setIndex(nearest.index)
    }

    node.addEventListener('scroll', onScroll, { passive: true })
    return () => node.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      onKeyDown={(event) => {
        if (!showControls) return
        if (event.key === 'ArrowRight') {
          event.preventDefault()
          goTo(index + 1)
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(index - 1)
        }
      }}
    >
      <div
        aria-labelledby={labelledBy}
        aria-roledescription="carousel"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        ref={scrollerRef}
        role="region"
        tabIndex={showControls ? 0 : undefined}
      >
        {items.map((item, itemIndex) => (
          <article
            aria-label={`Testimonial ${itemIndex + 1} of ${items.length}`}
            aria-roledescription="slide"
            className="w-full shrink-0 snap-start border border-border bg-card p-6 md:p-8 lg:w-[calc(100%-4rem)]"
            key={item.id}
            role="group"
          >
            {item.photo ? (
              <div className="relative mb-6 size-14 overflow-hidden rounded-[2px] bg-accent">
                <Media fill imgClassName="h-full w-full object-cover" resource={item.photo} size="56px" />
              </div>
            ) : null}
            <blockquote className="max-w-3xl text-lg leading-8 text-foreground">
              {item.quote}
            </blockquote>
            {(item.author || item.position || item.company) && (
              <footer className="mt-6 text-sm text-muted-foreground">
                {item.author ? <div className="font-medium text-foreground">{item.author}</div> : null}
                <div>
                  {[item.position, item.company].filter(Boolean).join(', ')}
                </div>
              </footer>
            )}
          </article>
        ))}
      </div>

      {showControls ? (
        <div className="mt-6 flex items-center gap-3">
          <button
            aria-label="Previous testimonial"
            className="inline-flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => goTo(index - 1)}
            type="button"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            aria-label="Next testimonial"
            className="inline-flex size-11 items-center justify-center border border-border text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => goTo(index + 1)}
            type="button"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
          <div className="ml-2 flex gap-2" role="tablist">
            {items.map((item, itemIndex) => (
              <button
                aria-current={itemIndex === index ? 'true' : undefined}
                aria-label={`Go to testimonial ${itemIndex + 1}`}
                className={cn(
                  'size-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  itemIndex === index ? 'bg-foreground' : 'bg-border',
                )}
                key={item.id}
                onClick={() => goTo(itemIndex)}
                type="button"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
