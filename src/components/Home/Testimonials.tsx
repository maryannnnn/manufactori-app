import dynamic from 'next/dynamic'
import React from 'react'

import type { HomeTestimonial } from '@/utilities/getHomePageData'

const TestimonialCarousel = dynamic(() =>
  import('@/components/Home/TestimonialCarousel').then((mod) => mod.TestimonialCarousel),
)

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
          Statements from the companies in the case studies above.
        </p>
        <div className="mt-10">
          <TestimonialCarousel items={items} labelledBy="home-testimonials-heading" />
        </div>
      </div>
    </section>
  )
}
