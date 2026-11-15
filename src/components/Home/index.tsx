import React, { Suspense } from 'react'

import { AggregatedDiscussionSection } from '@/components/AggregatedDiscussionSection'
import { AggregatedFaqSection } from '@/components/AggregatedFaqSection'
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
import { DISCUSSIONS_PATH, QUESTIONS_ANSWERS_PATH } from '@/utilities/getContentUrls'
import { getHomePageData } from '@/utilities/getHomePageData'
import { queryAggregatedDiscussions } from '@/utilities/queryAggregatedDiscussions'
import { queryAggregatedFaqs } from '@/utilities/queryAggregatedFaqs'

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

const HomeFeedsSlot = async () => {
  // Sequential: parallel Payload finds across Suspense slots were dropping the DB pool.
  let faqItems: Awaited<ReturnType<typeof queryAggregatedFaqs>> = []
  let discussionItems: Awaited<ReturnType<typeof queryAggregatedDiscussions>> = []
  try {
    faqItems = await queryAggregatedFaqs({
      limit: 5,
      quota: {
        services: 1,
        'case-studies': 1,
        industries: 1,
        posts: 2,
      },
    })
  } catch {
    faqItems = []
  }
  try {
    discussionItems = await queryAggregatedDiscussions({
      limit: 5,
      allow: ['posts', 'case-studies'],
    })
  } catch {
    discussionItems = []
  }

  return (
    <>
      <AggregatedFaqSection
        heading="Questions from across the site"
        headingId="home-faq"
        items={faqItems}
        viewAllHref={QUESTIONS_ANSWERS_PATH}
      />
      <AggregatedDiscussionSection
        heading="Recent discussions"
        headingId="home-discussions"
        items={discussionItems}
        viewAllHref={DISCUSSIONS_PATH}
      />
    </>
  )
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
      <Suspense fallback={null}>
        <HomeFeedsSlot />
      </Suspense>
      <ContactStrip variant="homeLower" />
      <HomeFinalCta />
    </main>
  )
}
