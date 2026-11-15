export type IndustryCtaSlot = 'intro' | 'mid' | 'end'

type CtaCopy = {
  heading: string
  description: string
}

const topicPhrase = (title: string | null | undefined): string => {
  const cleaned = (title || 'manufacturing').replace(/\s+/g, ' ').trim()
  return cleaned || 'manufacturing'
}

/**
 * Contextual CTA wording for Industrial pages.
 * Slot varies the framing so three blocks on one page are not identical.
 */
export const getIndustryCtaCopy = (
  title: string | null | undefined,
  slot: IndustryCtaSlot,
): CtaCopy => {
  const topic = topicPhrase(title)

  switch (slot) {
    case 'intro':
      return {
        heading: `Planning a ${topic} project?`,
        description: `Looking for ways to improve how industrial buyers find and evaluate your ${topic.toLowerCase()} capabilities? Let's discuss your requirements.`,
      }
    case 'mid':
      return {
        heading: `Need more visibility in ${topic}?`,
        description: `Want to make your ${topic.toLowerCase()} offer easier for B2B buyers to discover through search, your website, and technical content? Let's talk.`,
      }
    case 'end':
      return {
        heading: 'Ready to discuss your manufacturing market?',
        description: `If this ${topic.toLowerCase()} page raises a question about your company, website, or lead generation, message us on WhatsApp or Telegram.`,
      }
    default:
      return {
        heading: "Let's discuss your manufacturing project",
        description: 'Tell us what you manufacture and what you want to improve. WhatsApp or Telegram is enough to start.',
      }
  }
}

export const getIndustrialLandingCtaCopy = (slot: IndustryCtaSlot): CtaCopy => {
  switch (slot) {
    case 'intro':
      return {
        heading: 'Working in a specific manufacturing industry?',
        description:
          'Tell us what you manufacture. We can map the buyers, search demand, and website structure that fit your sector.',
      }
    case 'mid':
      return {
        heading: 'Need industrial marketing that matches your products?',
        description:
          "From metalworking to process manufacturing, the buyer journey and content requirements differ. Let's discuss your market.",
      }
    case 'end':
      return {
        heading: 'Want to talk through an industry page?',
        description:
          'Pick WhatsApp or Telegram and tell us which manufacturing sector you serve. A short message is enough to start.',
      }
    default:
      return getIndustryCtaCopy('manufacturing', 'intro')
  }
}
