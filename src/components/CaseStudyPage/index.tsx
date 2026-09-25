import React from 'react'

import type { CaseStudy, CaseStudyPreviewBlock } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { Media } from '@/components/Media'
import { hasRichTextContent } from '@/utilities/richText/hasContent'

import type { NicheItem } from './NicheSegmentation'
import type { StrategyItem } from './MarketingStrategy'
import type { CaseStudySectionId } from './sections'

import { CaseStudyArchitecture } from './DigitalArchitecture'
import { CaseStudyChallenge } from './BusinessChallenge'
import { CaseStudyHero } from './CaseStudyHero'
import { CaseStudyImplementation } from './Implementation'
import { CaseStudyInsight } from './ExpertInsight'
import { CaseStudyMetrics } from './MetricsBar'
import { CaseStudyNiches } from './NicheSegmentation'
import { CaseStudyProfile } from './ManufacturingProfile'
import { CaseStudyQuickNav } from './QuickNav'
import { CaseStudyResults } from './Results'
import { CaseStudySection } from './Section'
import { CaseStudyStrategy } from './MarketingStrategy'
import { CaseStudyTaxonomy } from './CaseStudyTaxonomy'
import { CaseStudyTestimonial } from './ClientTestimonial'
import { CaseStudyTopNav } from './CaseStudyTopNav'
import { PAID_CHANNEL_LABELS, SOCIAL_CHANNEL_LABELS } from './channels'
import { RichTextField, renderRichTextField } from './RichTextField'
import { CASE_STUDY_SECTION_ORDER } from './sections'

type Props = {
  /** Where "All case studies" points; defaults to the case study root. */
  archiveHref?: string
  caseStudy: CaseStudy
  /** Small mono mark in the top-right of the case nav. */
  mark?: string
}

/**
 * Reusable template for a single Case Study. Every section is driven by the
 * corresponding CMS field and omitted when that field is empty, so the same
 * template serves a fully-filled case study and a sparse one.
 */
export const CaseStudyPage: React.FC<Props> = ({
  archiveHref = '/case-study',
  caseStudy,
  mark,
}) => {
  const {
    businessChallenge,
    clientTestimonial,
    digitalEcosystem,
    duration,
    expertInsight,
    hero,
    implementationProcess,
    layout,
    manufacturingProfile,
    marketingStrategy,
    metrics,
    nicheSegmentation,
    projectsShowcase,
    resultsSummary,
    semanticArchitecture,
    timeline,
    websiteArchitecture,
  } = caseStudy

  const heading = caseStudy.case_study_long_title || caseStudy.title
  const preview = layout?.find(
    (block): block is CaseStudyPreviewBlock => block.blockType === 'csPreview',
  )
  // The preview block is surfaced as the Overview section above, so it is
  // excluded from the trailing layout render to avoid showing it twice.
  const trailingBlocks = layout?.filter((block) => block.blockType !== 'csPreview') ?? []

  const previewImage = preview?.case_study_preview_image
  const hasOverview = Boolean(
    preview?.case_study_preview_title ||
      hasRichTextContent(preview?.case_study_preview_text) ||
      (previewImage && typeof previewImage === 'object'),
  )

  const niches: NicheItem[] = (nicheSegmentation ?? []).map((niche) => ({
    name: niche.name,
    description: renderRichTextField(niche.description, 'Description'),
    marketingApproach: renderRichTextField(niche.marketingApproach, 'Marketing Approach'),
  }))

  const strategyItems = buildStrategyItems(marketingStrategy, caseStudy.aiSearchOptimization)

  const present: Record<CaseStudySectionId, boolean> = {
    overview: hasOverview,
    profile: hasAnyRichText([
      manufacturingProfile?.productionCapabilities,
      manufacturingProfile?.products,
      manufacturingProfile?.materials,
      manufacturingProfile?.applications,
    ]),
    challenge: hasAnyRichText([
      businessChallenge?.initialState,
      businessChallenge?.challenge,
      businessChallenge?.goals,
    ]),
    niches: niches.length > 0,
    architecture: hasAnyRichText([digitalEcosystem, websiteArchitecture, semanticArchitecture]),
    strategy: strategyItems.length > 0,
    implementation: hasRichTextContent(implementationProcess) || Boolean(timeline?.length),
    results: hasRichTextContent(resultsSummary) || Boolean(projectsShowcase?.length),
    insight: hasRichTextContent(expertInsight),
  }

  const navSections = CASE_STUDY_SECTION_ORDER.filter((id) => present[id])

  return (
    <article className="pb-16">
      <CaseStudyQuickNav sections={navSections} />

      <div className="container">
        <CaseStudyTopNav backHref={archiveHref} backLabel="All case studies" mark={mark} />

        <CaseStudyHero
          duration={duration}
          heading={heading}
          hero={hero}
          primaryCategory={caseStudy.primary_case_study_category}
        />

        {present.overview && (
          <CaseStudySection id="overview" title="Overview">
            {preview?.case_study_preview_title ? (
              <h3 className="mb-3 text-xl font-semibold tracking-tight text-foreground">
                {preview.case_study_preview_title}
              </h3>
            ) : null}
            <RichTextField className="max-w-[70ch]" value={preview?.case_study_preview_text} />
            {previewImage && typeof previewImage === 'object' ? (
              <div className="mt-6 overflow-hidden rounded-[2px] border border-border">
                <Media
                  resource={previewImage}
                  showWatermark
                  size="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            ) : null}
          </CaseStudySection>
        )}

        {metrics && metrics.length > 0 && <CaseStudyMetrics metrics={metrics} />}

        {present.profile && manufacturingProfile && (
          <CaseStudyProfile profile={manufacturingProfile} />
        )}

        {present.challenge && businessChallenge && (
          <CaseStudyChallenge challenge={businessChallenge} />
        )}

        {present.niches && (
          <CaseStudySection id="niches" title="Niche Segmentation">
            <CaseStudyNiches niches={niches} />
          </CaseStudySection>
        )}

        {present.architecture && (
          <CaseStudyArchitecture
            digitalEcosystem={digitalEcosystem}
            semanticArchitecture={semanticArchitecture}
            websiteArchitecture={websiteArchitecture}
          />
        )}

        {present.strategy && (
          <CaseStudySection id="strategy" title="Marketing Strategy">
            <CaseStudyStrategy items={strategyItems} />
          </CaseStudySection>
        )}

        {present.implementation && (
          <CaseStudyImplementation
            implementationProcess={implementationProcess}
            timeline={timeline}
          />
        )}

        {present.results && (
          <CaseStudyResults
            projectsShowcase={projectsShowcase}
            resultsSummary={resultsSummary}
          />
        )}

        {present.insight && <CaseStudyInsight insight={expertInsight} />}

        <CaseStudyTestimonial testimonial={clientTestimonial} />
      </div>

      {trailingBlocks.length > 0 && (
        <RenderBlocks blocks={trailingBlocks as Parameters<typeof RenderBlocks>[0]['blocks']} />
      )}

      <div className="container">
        <CaseStudyTaxonomy case_study_categories={caseStudy.case_study_categories} />
      </div>
    </article>
  )
}

const hasAnyRichText = (values: unknown[]): boolean => values.some(hasRichTextContent)

/**
 * Flattens the Marketing Strategy group, its per-channel arrays and the AI
 * Search Optimization group into a single accordion list, skipping any entry
 * that has no content.
 */
const buildStrategyItems = (
  strategy: CaseStudy['marketingStrategy'],
  aiSearch: CaseStudy['aiSearchOptimization'],
): StrategyItem[] => {
  const items: StrategyItem[] = []

  const add = (item: StrategyItem, sources: unknown[]) => {
    if (hasAnyRichText(sources)) items.push(item)
  }

  add(
    {
      key: 'seo',
      title: 'SEO & Content Strategy',
      content: renderRichTextField(strategy?.seoAndContentStrategy),
    },
    [strategy?.seoAndContentStrategy],
  )

  add(
    {
      key: 'leadgen',
      title: 'Lead Gen Mechanism',
      content: renderRichTextField(strategy?.leadGenMechanism),
    },
    [strategy?.leadGenMechanism],
  )

  strategy?.paidAdvertising?.forEach((channel, index) => {
    add(
      {
        key: `paid-${channel.id ?? index}`,
        title: 'Paid Advertising',
        tag: PAID_CHANNEL_LABELS[channel.channel],
        content: (
          <div className="space-y-4">
            {renderRichTextField(channel.strategy, 'Strategy')}
            {renderRichTextField(channel.campaignStructure, 'Campaign Structure')}
            {renderRichTextField(channel.results, 'Results')}
          </div>
        ),
      },
      [channel.strategy, channel.campaignStructure, channel.results],
    )
  })

  strategy?.socialMedia?.forEach((channel, index) => {
    add(
      {
        key: `social-${channel.id ?? index}`,
        title: 'Social Media',
        tag: SOCIAL_CHANNEL_LABELS[channel.channel],
        content: (
          <div className="space-y-4">
            {renderRichTextField(channel.strategy, 'Strategy')}
            {renderRichTextField(channel.content, 'Content')}
            {renderRichTextField(channel.results, 'Results')}
          </div>
        ),
      },
      [channel.strategy, channel.content, channel.results],
    )
  })

  add(
    {
      key: 'ai-authority',
      title: 'Brand Authority & Trust',
      tag: 'AI Search',
      content: renderRichTextField(aiSearch?.brandAuthorityAndTrust),
    },
    [aiSearch?.brandAuthorityAndTrust],
  )

  add(
    {
      key: 'ai-entity',
      title: 'Entity & GEO Structure',
      tag: 'AI Search',
      content: renderRichTextField(aiSearch?.entityAndGeoStructure),
    },
    [aiSearch?.entityAndGeoStructure],
  )

  return items
}
