import Link from 'next/link'
import React from 'react'

import type { CaseStudy, Media, Post, Service } from '@/payload-types'

import { Accordion, type AccordionItem } from '@/components/Accordion'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { ContactStrip } from '@/components/ContactStrip'
import { Media as MediaImage } from '@/components/Media'
import { RichTextField } from '@/components/CaseStudyPage/RichTextField'
import { ServiceCard } from '@/components/ServiceCard'
import {
  getIndustryUrl,
  getPostUrl,
  INDUSTRIES_ARCHIVE_PATH,
} from '@/utilities/getContentUrls'
import { getCaseStudyListPreview } from '@/utilities/getCaseStudyListPreview'
import { getSecondaryIndustryPaths } from '@/utilities/industryPaths'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

const buttonClass =
  'inline-flex min-h-11 items-center rounded-[2px] bg-cta px-4 py-2 text-sm font-medium text-on-cta transition-colors hover:bg-cta-hover active:bg-cta-active focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring'

const RELEVANCE_LABELS: Record<string, string> = {
  direct: 'Direct Industry Experience',
  related_manufacturing: 'Related Manufacturing Experience',
  related_product: 'Related Product or Technology Experience',
}

type RichValue = unknown

export type PlannedSubindustry = {
  id?: string | null
  title?: string | null
  slug?: string | null
  previewDescription?: string | null
  previewImage?: Media | number | null
  displayOrder?: number | null
}

export type IndustryChild = {
  id?: number | string
  title?: string | null
  slug?: string | null
  industryLevel?: 'primary' | 'secondary' | null
  industryPreviewDescription?: string | null
  industryPreviewImage?: Media | number | null
  parentIndustry?: { slug?: string | null; title?: string | null } | number | null
  parentSlug?: string | null
  displayOrder?: number | null
}

export type IndustryRecord = IndustryChild & {
  industryLongTitle?: string | null
  industryOverview?: RichValue
  manufacturingProcesses?: RichValue
  productsAndApplications?: RichValue
  materialsAndTechnologies?: RichValue
  targetMarkets?: RichValue
  buyerTypes?: RichValue
  decisionMakers?: RichValue
  buyerRequirements?: RichValue
  purchasingFactors?: RichValue
  marketingChallenges?: RichValue
  digitalMarketSpecifics?: RichValue
  competitiveFactors?: RichValue
  leadGenerationChallenges?: RichValue
  searchBehavior?: RichValue
  seoStrategy?: RichValue
  aiSearchStrategy?: RichValue
  keywordAndTopicStructure?: RichValue
  authorityAndVisibility?: RichValue
  contentStrategy?: RichValue
  technicalContent?: RichValue
  productAndApplicationContent?: RichValue
  expertiseContent?: RichValue
  contentFormats?: RichValue
  buyerJourney?: RichValue
  salesCycleCharacteristics?: RichValue
  buyerQuestionsByStage?: RichValue
  trustAndConversionFactors?: RichValue
  leadNurturingApproach?: RichValue
  websiteAndCatalogStrategy?: RichValue
  paidAdvertisingStrategy?: RichValue
  conversionOptimization?: RichValue
  analyticsAndMeasurement?: RichValue
  industryExpertise?: RichValue
  relevantExperience?: RichValue
  industryProofPoints?: RichValue
  plannedSubindustries?: PlannedSubindustry[] | null
  recommendedServices?: (number | Service)[] | null
  relatedCaseStudies?:
    | {
        id?: string | null
        caseStudy?: number | CaseStudy | null
        relevance?: string | null
        relevanceNote?: string | null
      }[]
    | null
  relatedPosts?: (number | Post)[] | null
  faq?: { id?: string | null; question?: string | null; answer?: RichValue }[] | null
  ctaTitle?: string | null
  ctaDescription?: string | null
  ctaButtonLabel?: string | null
  ctaButtonUrl?: string | null
}

const filled = (items: { label: string; value: RichValue }[]) =>
  items.filter((item) => hasRichTextContent(item.value))

const TextSection = ({
  id,
  industryPaths,
  title,
  items,
}: {
  id: string
  industryPaths?: Record<string, string>
  title: string
  items: { label: string; value: RichValue }[]
}) => {
  const blocks = filled(items)
  if (blocks.length === 0) return null
  return (
    <section aria-labelledby={id} className="scroll-mt-24 pb-16">
      <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight" id={id}>
        {title}
      </h2>
      <div className="max-w-[68ch] space-y-8">
        {blocks.map((item) => (
          <div key={item.label}>
            <h3 className="mb-3 text-base font-semibold tracking-tight">{item.label}</h3>
            <RichTextField industryPaths={industryPaths} value={item.value as never} />
          </div>
        ))}
      </div>
    </section>
  )
}

export const IndustryCard = ({ doc }: { doc: IndustryChild }) => {
  const href = getIndustryUrl(doc)
  const image = doc.industryPreviewImage && typeof doc.industryPreviewImage === 'object' ? doc.industryPreviewImage : null
  const title = doc.title
  if (!href || !title) return null
  return (
    <Link
      className="group flex h-full flex-col overflow-hidden rounded-[2px] border border-border bg-card transition-colors hover:border-cta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
      href={href}
    >
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-accent">
          <MediaImage
            className="h-full w-full"
            fill
            imgClassName="h-full w-full object-cover"
            resource={image}
            size="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <div className="font-semibold tracking-tight">{title}</div>
        {doc.industryPreviewDescription ? (
          <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{doc.industryPreviewDescription}</p>
        ) : null}
      </div>
    </Link>
  )
}

const PlannedCard = ({ item }: { item: PlannedSubindustry }) => {
  const image = item.previewImage && typeof item.previewImage === 'object' ? item.previewImage : null
  if (!item.title) return null
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2px] border border-border bg-card">
      {image ? (
        <div className="relative aspect-[4/3] overflow-hidden bg-accent">
          <MediaImage
            className="h-full w-full"
            fill
            imgClassName="h-full w-full object-cover"
            resource={image}
            size="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold tracking-tight">{item.title}</h3>
        {item.previewDescription ? (
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.previewDescription}</p>
        ) : null}
      </div>
    </article>
  )
}

const SpecializationSection = ({
  children,
  planned,
}: {
  children: IndustryChild[]
  planned?: PlannedSubindustry[] | null
}) => {
  const publishedSlugs = new Set(children.map((child) => child.slug).filter(Boolean))
  const upcoming = (planned ?? [])
    .filter((item) => item?.title && (!item.slug || !publishedSlugs.has(item.slug)))
    .sort((a, b) => (a.displayOrder ?? 9999) - (b.displayOrder ?? 9999))
  if (children.length === 0 && upcoming.length === 0) return null
  return (
    <section aria-labelledby="specializations" className="scroll-mt-24 pb-16">
      <h2 className="mb-3 border-b border-border pb-3 text-2xl font-semibold tracking-tight" id="specializations">
        Specializations
      </h2>
      {upcoming.length > 0 ? (
        <p className="mb-6 max-w-[68ch] text-sm leading-6 text-muted-foreground">
          These directions belong to this industry. Separate pages are not published yet, so the cards are not links.
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {children.map((child) => (
          <IndustryCard doc={child} key={child.id ?? child.slug} />
        ))}
        {upcoming.map((item) => (
          <PlannedCard item={item} key={item.id || item.slug || item.title} />
        ))}
      </div>
    </section>
  )
}

export const IndustryPage = async ({
  industry,
  children = [],
}: {
  industry: IndustryRecord
  children?: IndustryChild[]
}) => {
  const industryPaths = await getSecondaryIndustryPaths()
  const heading = industry.industryLongTitle || industry.title || 'Industry'
  const parent = industry.parentIndustry && typeof industry.parentIndustry === 'object' ? industry.parentIndustry : null
  const parentHref = parent?.slug ? `${INDUSTRIES_ARCHIVE_PATH}/${parent.slug}` : null
  const parentTitle = parent?.title || null
  const previewImage =
    industry.industryPreviewImage && typeof industry.industryPreviewImage === 'object'
      ? industry.industryPreviewImage
      : null
  const services = (industry.recommendedServices ?? []).filter((item): item is Service => typeof item === 'object' && item !== null)
  const posts = (industry.relatedPosts ?? []).filter((item): item is Post => typeof item === 'object' && item !== null && Boolean(item.slug))
  const cases = (industry.relatedCaseStudies ?? []).flatMap((item) => {
    if (!item?.caseStudy || typeof item.caseStudy !== 'object') return []
    return [item]
  })
  const faqQuestions: AccordionItem[] = (industry.faq ?? []).flatMap((item, index) => {
    if (!item?.question || !hasRichTextContent(item.answer)) return []
    return [
      {
        key: item.id || `faq-${index}`,
        title: item.question,
        content: (
          <RichTextField
            className="[&_p]:text-sm [&_p:last-child]:mb-0"
            industryPaths={industryPaths}
            value={item.answer as never}
          />
        ),
      },
    ]
  })
  const ctaHref = industry.ctaButtonUrl || ''
  const showCta = Boolean(industry.ctaTitle || industry.ctaDescription || (industry.ctaButtonLabel && ctaHref))

  return (
    <article className="pb-16">
      <div className="container">
        <div className="py-5">
          <Breadcrumbs
            items={[
              { name: 'Home', href: '/' },
              { name: 'Industrial', href: INDUSTRIES_ARCHIVE_PATH },
              ...(parentHref && parentTitle ? [{ name: parentTitle, href: parentHref }] : []),
              { name: heading },
            ]}
          />
        </div>

        <section className="pt-2 pb-10">
          <h1 className="max-w-[34ch] text-[clamp(1.75rem,4.2vw,3rem)] leading-[1.08] font-semibold tracking-tight text-foreground">
            {heading}
          </h1>
          {industry.industryLevel === 'secondary' && parentHref && parentTitle ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Part of{' '}
              <Link className="text-link underline-offset-4 hover:underline" href={parentHref}>
                {parentTitle}
              </Link>
            </p>
          ) : null}
          {previewImage ? (
            <div className="mt-8 overflow-hidden rounded-[2px] border border-border">
              <MediaImage resource={previewImage} size="100vw" />
            </div>
          ) : null}
        </section>

        <TextSection
          industryPaths={industryPaths}
          id="overview"
          title="Industry overview"
          items={[
            { label: 'What this industry makes', value: industry.industryOverview },
            { label: 'Manufacturing processes', value: industry.manufacturingProcesses },
            { label: 'Products and applications', value: industry.productsAndApplications },
            { label: 'Materials and technologies', value: industry.materialsAndTechnologies },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="markets"
          title="Markets and buyers"
          items={[
            { label: 'Target markets', value: industry.targetMarkets },
            { label: 'Buyer types', value: industry.buyerTypes },
            { label: 'Decision makers', value: industry.decisionMakers },
            { label: 'Buyer requirements', value: industry.buyerRequirements },
            { label: 'Purchasing factors', value: industry.purchasingFactors },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="challenges"
          title="Marketing challenges"
          items={[
            { label: 'Marketing challenges', value: industry.marketingChallenges },
            { label: 'Digital market specifics', value: industry.digitalMarketSpecifics },
            { label: 'Competitive factors', value: industry.competitiveFactors },
            { label: 'Lead generation challenges', value: industry.leadGenerationChallenges },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="search"
          title="SEO and AI search"
          items={[
            { label: 'Search behavior', value: industry.searchBehavior },
            { label: 'SEO strategy', value: industry.seoStrategy },
            { label: 'AI search strategy', value: industry.aiSearchStrategy },
            { label: 'Keyword and topic structure', value: industry.keywordAndTopicStructure },
            { label: 'Authority and visibility', value: industry.authorityAndVisibility },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="content"
          title="Content strategy"
          items={[
            { label: 'Content strategy', value: industry.contentStrategy },
            { label: 'Technical content', value: industry.technicalContent },
            { label: 'Product and application content', value: industry.productAndApplicationContent },
            { label: 'Expertise content', value: industry.expertiseContent },
            { label: 'Content formats', value: industry.contentFormats },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="journey"
          title="Buyer journey and sales cycle"
          items={[
            { label: 'Buyer journey', value: industry.buyerJourney },
            { label: 'Sales cycle', value: industry.salesCycleCharacteristics },
            { label: 'Questions by stage', value: industry.buyerQuestionsByStage },
            { label: 'Trust and conversion', value: industry.trustAndConversionFactors },
            { label: 'Lead nurturing', value: industry.leadNurturingApproach },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="approach"
          title="Digital marketing approach"
          items={[
            { label: 'Website and catalog', value: industry.websiteAndCatalogStrategy },
            { label: 'Paid advertising', value: industry.paidAdvertisingStrategy },
            { label: 'Conversion', value: industry.conversionOptimization },
            { label: 'Measurement', value: industry.analyticsAndMeasurement },
          ]}
        />
        <TextSection
          industryPaths={industryPaths}
          id="expertise"
          title="Expertise and experience"
          items={[
            { label: 'Industry expertise', value: industry.industryExpertise },
            { label: 'Relevant experience', value: industry.relevantExperience },
            { label: 'Proof points', value: industry.industryProofPoints },
          ]}
        />

        <SpecializationSection children={children} planned={industry.plannedSubindustries} />

        {services.length > 0 ? (
          <section aria-labelledby="services" className="scroll-mt-24 pb-16">
            <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight" id="services">
              Related services
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((doc) => (
                <ServiceCard doc={doc} key={doc.id} />
              ))}
            </div>
          </section>
        ) : null}

        {cases.length > 0 ? (
          <section aria-labelledby="cases" className="scroll-mt-24 pb-16">
            <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight" id="cases">
              Related case studies
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((item) => {
                const doc = item.caseStudy as CaseStudy
                const label = item.relevance ? RELEVANCE_LABELS[item.relevance] : null
                return (
                  <div key={item.id || doc.id}>
                    <CaseStudyCard doc={{ ...doc, ...getCaseStudyListPreview(doc) }} />
                    {label ? <p className="mt-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">{label}</p> : null}
                    {item.relevanceNote ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.relevanceNote}</p> : null}
                  </div>
                )
              })}
            </div>
          </section>
        ) : null}

        {posts.length > 0 ? (
          <section aria-labelledby="articles" className="scroll-mt-24 pb-16">
            <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight" id="articles">
              Related articles
            </h2>
            <ul className="max-w-[68ch] divide-y divide-border border-y border-border">
              {posts.map((post) => {
                const href = getPostUrl(post)
                if (!href) return null
                return (
                  <li key={post.id}>
                    <Link className="block py-3 text-foreground underline-offset-4 hover:text-link hover:underline" href={href}>
                      {post.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ) : null}

        {faqQuestions.length > 0 ? (
          <section aria-labelledby="faq" className="scroll-mt-24 pb-16">
            <h2 className="mb-6 border-b border-border pb-3 text-2xl font-semibold tracking-tight" id="faq">
              Questions and answers
            </h2>
            <Accordion defaultOpenKey={null} items={faqQuestions} />
          </section>
        ) : null}

        {showCta ? (
          <section aria-labelledby="industry-cta" className="scroll-mt-24 border-t border-border pt-10 pb-6">
            {industry.ctaTitle ? (
              <h2 className="mb-3 text-2xl font-semibold tracking-tight" id="industry-cta">
                {industry.ctaTitle}
              </h2>
            ) : (
              <h2 className="sr-only" id="industry-cta">
                Contact
              </h2>
            )}
            {industry.ctaDescription ? (
              <p className="max-w-[62ch] text-base leading-7 text-muted-foreground">{industry.ctaDescription}</p>
            ) : null}
            {industry.ctaButtonLabel && ctaHref ? (
              <Link className={`${buttonClass} mt-6`} href={ctaHref}>
                {industry.ctaButtonLabel}
              </Link>
            ) : null}
          </section>
        ) : null}

        <ContactStrip className="mt-8" contained={false} variant="serviceLower" />
      </div>
    </article>
  )
}
