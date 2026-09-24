/**
 * Section registry for the Case Study template.
 *
 * The quick-nav rail and the section headings both read from here, so a section
 * can never appear in the nav without existing on the page.
 */
export const CASE_STUDY_SECTIONS = {
  overview: 'Overview',
  profile: 'Profile',
  challenge: 'Challenge',
  niches: 'Niches',
  architecture: 'Architecture',
  strategy: 'Strategy',
  implementation: 'Implementation',
  results: 'Results',
  insight: 'Insight',
} as const

export type CaseStudySectionId = keyof typeof CASE_STUDY_SECTIONS

/** Order used by the quick-nav rail; mirrors the order sections are rendered in. */
export const CASE_STUDY_SECTION_ORDER: readonly CaseStudySectionId[] = [
  'overview',
  'profile',
  'challenge',
  'niches',
  'architecture',
  'strategy',
  'implementation',
  'results',
  'insight',
]
