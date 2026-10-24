import React, { Suspense } from 'react'

import { ContactStrip } from '@/components/ContactStrip'
import { PaletteSelector } from '@/components/Landing/ComingSoon/PaletteSelector'
import { SHOW_PALETTE_SELECTOR } from '@/design-system'
import { HomeCaseStudies } from '@/components/Home/CaseStudies'
import { HomeFinalCta } from '@/components/Home/FinalCta'
import { HomeFit } from '@/components/Home/Fit'
import { HomeHero } from '@/components/Home/Hero'
import { HomeInsights } from '@/components/Home/Insights'
import { HomeProblems } from '@/components/Home/Problems'
import { HomeProcess } from '@/components/Home/Process'
import { HomeServices } from '@/components/Home/Services'
import { HomeTestimonials } from '@/components/Home/Testimonials'
import { getHomePageData } from '@/utilities/getHomePageData'

const HomeServicesSlot = async () => {
  const data = await getHomePageData()
  return <HomeServices services={data.services} />
}

const HomeCaseStudiesSlot = async () => {
  const data = await getHomePageData()
  return <HomeCaseStudies docs={data.caseStudies} />
}

const HomeTestimonialsSlot = async () => {
  const data = await getHomePageData()
  return <HomeTestimonials items={data.testimonials} />
}

const HomeInsightsSlot = async () => {
  const data = await getHomePageData()
  return <HomeInsights posts={data.posts} />
}

export const HomePageContent: React.FC = () => {
  return (
    <main>
      {SHOW_PALETTE_SELECTOR ? <PaletteSelector compact /> : null}
      <HomeHero />
      <ContactStrip variant="homeAfterHero" />
      <HomeProblems />
      <Suspense fallback={null}>
        <HomeServicesSlot />
      </Suspense>
      <HomeProcess />
      <Suspense fallback={null}>
        <HomeCaseStudiesSlot />
      </Suspense>
      <HomeFit />
      <Suspense fallback={null}>
        <HomeTestimonialsSlot />
      </Suspense>
      <Suspense fallback={null}>
        <HomeInsightsSlot />
      </Suspense>
      <ContactStrip variant="homeLower" />
      <HomeFinalCta />
    </main>
  )
}
