export type ArticleCtaSlot = 'intro' | 'mid' | 'end'

type CtaCopy = {
  heading: string
  description: string
}

/**
 * Contextual WhatsApp / Telegram CTA wording for long Blog articles.
 */
export const getArticleCtaCopy = (
  title: string | null | undefined,
  slot: ArticleCtaSlot,
): CtaCopy => {
  const topic = (title || 'this manufacturing topic').replace(/\s+/g, ' ').trim()

  switch (slot) {
    case 'intro':
      return {
        heading: 'Have a question about this topic?',
        description: `If ${topic.toLowerCase()} raises a question about your manufacturing company, message us on WhatsApp or Telegram.`,
      }
    case 'mid':
      return {
        heading: 'Looking to improve industrial visibility?',
        description:
          'Want your manufacturing capabilities to be easier for buyers to find through search, your website, and technical content? Let us discuss your project.',
      }
    case 'end':
      return {
        heading: 'Need help with manufacturing marketing?',
        description:
          'Contact Maryan Polyak to discuss your industrial website, SEO, or content strategy. WhatsApp or Telegram is enough to start.',
      }
    default:
      return {
        heading: 'Have a question about your marketing?',
        description: 'If this raises a question about your own company, message us on WhatsApp or Telegram.',
      }
  }
}
