export type ElectricalSpecializationCopy = {
  slug: string
  title: string
  h1: string
  preview: string
  metaTitle: string
  metaDescription: string
  image: string
  alt: string
  displayOrder: number
  services: string[]
  posts: string[]
  cases: {
    slug: string
    relevance: 'direct' | 'related_manufacturing' | 'related_product'
    note: string
  }[]
  fields: Record<string, string>
  faq: { question: string; answer: string }[]
  ctaTitle: string
  ctaDescription: string
}

export const ELECTRICAL_FIELD_KEYS = [
  'industryOverview',
  'manufacturingProcesses',
  'productsAndApplications',
  'materialsAndTechnologies',
  'targetMarkets',
  'buyerTypes',
  'decisionMakers',
  'buyerRequirements',
  'purchasingFactors',
  'marketingChallenges',
  'digitalMarketSpecifics',
  'competitiveFactors',
  'leadGenerationChallenges',
  'searchBehavior',
  'seoStrategy',
  'aiSearchStrategy',
  'keywordAndTopicStructure',
  'authorityAndVisibility',
  'contentStrategy',
  'technicalContent',
  'productAndApplicationContent',
  'expertiseContent',
  'contentFormats',
  'buyerJourney',
  'salesCycleCharacteristics',
  'buyerQuestionsByStage',
  'trustAndConversionFactors',
  'leadNurturingApproach',
  'websiteAndCatalogStrategy',
  'paidAdvertisingStrategy',
  'conversionOptimization',
  'analyticsAndMeasurement',
  'industryExpertise',
  'relevantExperience',
  'industryProofPoints',
] as const

export const electricalCta = (subject: string) =>
  `Tell us what you manufacture in ${subject} and which buyers should be able to evaluate it. The first conversation is about product families, technical limits, and the enquiry path, not a promised ranking or a revenue figure.`
