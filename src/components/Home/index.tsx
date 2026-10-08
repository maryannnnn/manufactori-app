import React from 'react'

import { PaletteSelector } from '@/components/Landing/ComingSoon/PaletteSelector'
import { HomeCaseStudies } from '@/components/Home/CaseStudies'
import { HomeFinalCta } from '@/components/Home/FinalCta'
import { HomeFit } from '@/components/Home/Fit'
import { HomeHero } from '@/components/Home/Hero'
import { HomeInsights } from '@/components/Home/Insights'
import { HomeProblems } from '@/components/Home/Problems'
import { HomeProcess } from '@/components/Home/Process'
import { HomeServices } from '@/components/Home/Services'
import { HomeTestimonials } from '@/components/Home/Testimonials'
import type { HomePageData } from '@/utilities/getHomePageData'

type Props = {
  data: HomePageData
}

export const HomePageContent: React.FC<Props> = ({ data }) => {
  return (
    <main>
      <PaletteSelector compact />
      <HomeHero />
      <HomeProblems />
      <HomeServices services={data.services} />
      <HomeProcess />
      <HomeCaseStudies docs={data.caseStudies} />
      <HomeFit />
      <HomeTestimonials items={data.testimonials} />
      <HomeInsights posts={data.posts} />
      <HomeFinalCta />
    </main>
  )
}
