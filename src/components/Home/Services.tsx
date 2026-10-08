import React from 'react'

import { ServiceCard, type ServiceCardData } from '@/components/ServiceCard'

type Props = {
  services: ServiceCardData[]
}

export const HomeServices: React.FC<Props> = ({ services }) => {
  if (services.length === 0) return null

  return (
    <section className="border-b border-border py-16 md:py-20">
      <div className="container">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          What We Do
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          A connected marketing system for manufacturers and industrial companies.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {services.map((service) => (
            <ServiceCard
              ctaLabel="Learn more"
              doc={service}
              imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              key={service.slug ?? service.title}
              variant="compact"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
