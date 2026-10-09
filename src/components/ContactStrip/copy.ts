export const contactStripCopy = {
  default: {
    heading: "Let's Talk About Your Project",
    description: 'Have a question or an idea? Choose the messaging app that works best for you.',
  },
  homeAfterHero: {
    heading: "Let's Talk About Your Project",
    description: 'Tell us what you manufacture, or share your website. WhatsApp or Telegram is enough to start.',
  },
  homeLower: {
    heading: 'Prefer a Direct Message?',
    description: 'If a form is more friction than you need, reach us on WhatsApp or Telegram.',
  },
  blog: {
    heading: 'Have a Question About Your Marketing?',
    description: "Let's discuss how these ideas could work for your business.",
  },
  post: {
    heading: 'Have a Question About Your Marketing?',
    description: 'If this raises a question about your own company, message us on WhatsApp or Telegram.',
  },
  service: {
    heading: "Let's Discuss Your Project",
    description: 'Tell us what your company needs. Choose WhatsApp or Telegram to get in touch.',
  },
  serviceLower: {
    heading: 'Want to Talk This Through?',
    description: 'A short message is enough. Pick WhatsApp or Telegram and tell us what you manufacture.',
  },
  caseStudy: {
    heading: 'Working on a Similar Project?',
    description: "Tell us about your company and the challenge you're trying to solve.",
  },
  caseStudyLower: {
    heading: 'Have a Similar Manufacturing Challenge?',
    description: "Tell us about your company and the project you're planning.",
  },
} as const

export type ContactStripVariant = keyof typeof contactStripCopy
