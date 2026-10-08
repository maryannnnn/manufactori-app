import React from 'react'

import { TestimonialCarousel } from '@/components/Home/TestimonialCarousel'
import type { HomeTestimonial } from '@/utilities/getHomePageData'

type Props = {
  items: HomeTestimonial[]
}

export const HomeTestimonials: React.FC<Props> = ({ items }) => {
  if (items.length === 0) return null

  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container">
        <h2
          className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
          id="home-testimonials-heading"
        >
          Client Perspective
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          Selected statements from published testimonials.
        </p>
        <div className="mt-10">
          <TestimonialCarousel items={items} labelledBy="home-testimonials-heading" />
        </div>
      </div>
    </section>
  )
}
