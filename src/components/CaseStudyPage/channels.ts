import type { CaseStudy } from '@/payload-types'

type PaidChannel = NonNullable<
  NonNullable<NonNullable<CaseStudy['marketingStrategy']>['paidAdvertising']>[number]['channel']
>

type SocialChannel = NonNullable<
  NonNullable<NonNullable<CaseStudy['marketingStrategy']>['socialMedia']>[number]['channel']
>

/** Mirrors PAID_AD_CHANNELS in collections/CaseStudies/fields/structuredCaseStudyFields.ts */
export const PAID_CHANNEL_LABELS: Record<PaidChannel, string> = {
  google_ads: 'Google Ads',
  microsoft_ads: 'Microsoft Ads',
  yandex_direct: 'Yandex Direct',
  meta_ads: 'Meta Ads',
  linkedin_ads: 'LinkedIn Ads',
  other: 'Other',
}

/** Mirrors SOCIAL_CHANNELS in collections/CaseStudies/fields/structuredCaseStudyFields.ts */
export const SOCIAL_CHANNEL_LABELS: Record<SocialChannel, string> = {
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  telegram: 'Telegram',
  other: 'Other',
}
